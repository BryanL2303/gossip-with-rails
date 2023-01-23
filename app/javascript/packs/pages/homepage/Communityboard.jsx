import React, { useState, useEffect, useContext } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import Select from 'react-select'
import {errorMessage} from './functions/functions'
import {CommunityEditor} from './communityboard/CommunityEditor'
import {TopicTable} from './dashboard/TopicTable'
import { PinnedCommunitiesContext } from './context/PinnedCommunitiesContext'

/*The board which shows the community
  All topics under the community will be shown here for the users to access
*/
const Communityboard = ({community, showDashboard, showTopicboard, fetchCommunity}) => {
  const [cookies, setCookie] = useCookies(['user'])
  const [pinnedCommunities, setPinnedCommunities] = useContext(PinnedCommunitiesContext)
  const [topicListState, setTopicListState] = useState([])
  const [community_id, setCommunityId] = useState(community.data.data.attributes.id)
  const [communityName, setCommunityName] = useState(community.data.data.attributes.community_name)
  const [description, setDescription] = useState(community.data.data.attributes.community_description)
  const [upvote, setUpvote] = useState()
  const [downvote, setDownvote] = useState()
  const [currentSave, setCurrentSave] = useState(community.saved)
  const [currentVote, setCurrentVote] = useState(community.vote)
  const [topicCount, setTopicCount] = useState(0)
  const [topicLimit, setTopicLimit] = useState(community.data.data.relationships.topics.data.length)
  const [owner, setOwner] = useState(false)
  const [ownerName, setOwnerName] = useState()
  const [tag, setTag] = useState(community.data.data.relationships.categories.data)
  const [displayEditor, setDisplayEditor] = useState(false)
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])

  useEffect(() => {
    setCommunityId(community.data.data.attributes.id)
    setCommunityName(community.data.data.attributes.community_name)
    setTag(community.data.data.relationships.categories.data)
    setDescription(community.data.data.attributes.community_description)
    setUpvote(community.data.data.attributes.upvote)
    setDownvote(community.data.data.attributes.downvote)
    setTopicLimit(community.data.data.relationships.topics.data.length)
    setTopicCount(0)
    setTopicLimit(community.data.data.relationships.topics.data.length)
    setOwner(community.isOwner)
    setOwnerName(community.ownerName)
    setCurrentSave(community.saved)
    setCurrentVote(community.vote)
    fetchCategories('created_at')
  }, [community])

  function fetchCategories(sort_by) {
    axios.post('/api/category/0/fetch_categories', {
      sort_by: sort_by
    })
    .then(resp => {
      let data = []
      resp.data.data.map((category) => {
        data.push({value: category.attributes.id, label: category.attributes.category_name})
      })
      setCategories(data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  function updateTags(e) {
    setTags(e)
  }

  useEffect(() => {
    if (topicCount == 0) {
      fetchTopics('created_at')
    }
  }, [topicLimit])

  useEffect(() => {
    if (topicCount == 0) {
      showTopics()
    }
  }, [topicListState])  

  function showCommunitySettings(e) {
    let communitySettings = document.getElementsByClassName('community__settings')[0]
    if (communitySettings.style['visibility'] == 'hidden') {
      communitySettings.style['visibility'] = 'visible'
    }
    else {
      communitySettings.style['visibility'] = 'hidden'
    }
  }

  function toggleEditor(e) {
    if (displayEditor == true) {
      setDisplayEditor(false)
    }
    else {
      setDisplayEditor(true)
    }
  }

  function deleteCommunity() {
    if (confirm("This will permanently delete the community as well as all the topics within it from the website.")) {
      axios.post('/api/community/' + community_id + '/delete_community', {
        token: cookies.Token
      })
      .then(resp => {
        showDashboard()
      })
      .catch(resp => {
        errorMessage(resp.response.statusText)
      })
    }
  }

  function fetchTopics(sort_by) {
    axios.post('/api/community/'+ community_id +'/fetch_topics', {
      sort_by: sort_by
    })
    .then( resp => {
      setTopicListState(resp.data.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  function reRenderPage() {
    setTopicCount(topicCount + 1)
    community.data.data.relationships.topics.data.length = community.data.data.relationships.topics.data.length + 1
    fetchTopics('updated_at')
  }

  function showTopics() {
    if (topicLimit >= 5) {
      setTopicLimit(topicLimit - 5)
      setTopicCount(topicCount + 5)
    }
    else {
      setTopicCount(topicCount + topicLimit)
      setTopicLimit(0)
    }
  }

  const CategoryTag = ({category_id}) => {
    const [category, setCategory] = useState()
    axios.get('/api/category/' + category_id)
    .then(resp => {
      setCategory(resp.data.data.attributes.category_name)
    })
    .catch(resp => errorMessage(resp.response.statusText))
    return (
      <label className="category__tag">{category}</label>
    )
  }

  function pinCommunity(e) {
    axios.post('/api/pinned_community/0/save_community', {
        token: cookies.Token,
        community_id: community_id
    })
    .then(resp => {
      setPinnedCommunities(resp.data.data)
      if (currentSave == true) {
        setCurrentSave(false)
      } else {
        setCurrentSave(true)
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  function upvoteCommunity(e) {
    axios.post('/api/community/' + community_id + '/upvote', {
        token: cookies.Token
    })
    .then(resp => {
      setUpvote(resp.data.upvote)
      setDownvote(resp.data.downvote)
      if (currentVote == true) {
        setCurrentVote(null)
      }
      else {
        setCurrentVote(true)
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  function downvoteCommunity(e) {
    axios.post('/api/community/' + community_id + '/downvote', {
        token: cookies.Token
    })
    .then(resp => {
      setUpvote(resp.data.upvote)
      setDownvote(resp.data.downvote)
      if (currentVote == false) {
        setCurrentVote(null)
      }
      else {
        setCurrentVote(false)
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  return(
    <div className='communityboard-container'>
      {displayEditor == false &&
        <div>
          <br/>
          <label className="static__label">{ownerName}</label>
          <br/>
          <h1 className="static__label">{communityName}</h1>
          {tag.map((category) => {
            return(
              <CategoryTag key={"category" + category.id}  category_id={category.id}/>
            )
          })}
          <br/>
          <label className="static__label">{description}</label>
        </div>}
      {displayEditor == true && <CommunityEditor community={community} toggleEditor={toggleEditor} fetchCommunity={fetchCommunity}/>}
      
      <button id={community_id} className='community__save--button' onClick={pinCommunity}>
        {currentSave != true && <img id={community_id} className='pin-blank--img' src="/packs/media/packs/pages/homepage/blank-pin-bd3f3a74667f30e91af391147cc3a4d3.png"/>}
        {currentSave == true && <img id={community_id} className='pin-shaded--img' src="/packs/media/packs/pages/homepage/shaded-pin-e1f0e749cdfdc1e190e0f23dbf1ed3c3.png"/>}
      </button>
      <label>{upvote}</label>
      <button id={community_id} className='community__upvote--button' onClick={upvoteCommunity}>
        {currentVote != true && <img id={community_id} className='thumb-blank--img' src="/packs/media/packs/pages/homepage/thumbsup_blank-c78b476cd029c4245b8a33f0aa940f58.png"/>}
        {currentVote == true && <img id={community_id} className='thumb-shaded--img' src="/packs/media/packs/pages/homepage/thumbsup_shaded-d399f9eef4c8b50e9c3638fc638f8285.png"/>}
      </button>
      <label>{downvote}</label>
      <button id={community_id} className='community__downvote--button' onClick={downvoteCommunity}>
        {currentVote != false && <img id={community_id} className='thumb-blank--img' src="/packs/media/packs/pages/homepage/thumbsdown_blank-f7cd73be40b3007a5820448ea653998e.png"/>}
        {currentVote == false && <img id={community_id} className='thumb-shaded--img' src="/packs/media/packs/pages/homepage/thumbsdown_shaded-326c2afa75456f7a113e8d9ed52954bb.png"/>}
      </button>
      {owner == true &&
        <button className='community__show-settings--button' onClick={showCommunitySettings}><img src="/packs/media/packs/pages/homepage/topicboard/topic-settings-icon-888be188c27c65a4af51589ffef5291d.jpg"/></button>}
      <div className='community__settings'>
        <button className="community__edit--button" onClick={toggleEditor}>Edit Community</button>
        <button className="community__delete--button" onClick={deleteCommunity}>Delete Community</button>
      </div>

      <TopicTable showTopicboard={showTopicboard} community_id={community_id}/>
    </div>
  )
}

export {Communityboard}