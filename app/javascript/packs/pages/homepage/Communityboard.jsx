import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import Select from 'react-select'
import {CommunityEditor} from './communityboard/CommunityEditor'
import {TopicTable} from './dashboard/TopicTable'
import {AccountStateContext} from './context/AccountStateContext'

const Communityboard = ({community, showDashboard, showTopicboard, fetchCommunity}) => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [topicListState, setTopicListState] = useState([])
  const [communityName, setCommunityName] = useState(community.attributes.community_name)
  const [description, setDescription] = useState(community.attributes.community_description)
  const [topicCount, setTopicCount] = useState(0)
  const [topicLimit, setTopicLimit] = useState(community.relationships.topics.data.length)
  const [owner, setOwner] = useState(accountState.id == community.attributes.gossip_account_id)
  const [ownerName, setOwnerName] = useState()
  const [tag, setTag] = useState(community.relationships.categories.data)
  const [displayEditor, setDisplayEditor] = useState(false)
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])

  useEffect(() => {
    fetchCommunity(community.attributes.id)
  }, [])

  useEffect(() => {
    checkOwner(community.attributes.gossip_account_id)
    setCommunityName(community.attributes.community_name)
    setDescription(community.attributes.community_description)
    setTopicLimit(community.relationships.topics.data.length)
    setOwner(accountState.id == community.attributes.gossip_account_id)
    setTopicCount(0)
    setTopicLimit(community.relationships.topics.data.length)
    fetchCategories('updated_at')
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
    .catch(resp => console.log(resp))
  }

  function updateTags(e) {
    setTags(e)
  }

  useEffect(() => {
    if (topicCount == 0) {
      fetchTopics('updated_at')
    }
  }, [topicLimit])

  useEffect(() => {
    if (topicCount == 0) {
      showTopics()
    }
  }, [topicListState])  

  function checkOwner(gossip_account_id) {
    axios.get('/api/gossip_account/' + gossip_account_id)
    .then(resp => {
      setOwnerName(resp.data.data.attributes.account_name)
    })
    .catch(resp => console.log(resp))
  }

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
      axios.post('/api/community/' + community.id + '/delete_community')
      .then(resp => {
        showDashboard()
      })
      .catch(resp => console.log(resp))
    }
  }

  function fetchTopics(sort_by) {
    axios.post('/api/community/'+ community.id +'/fetch_topics', {
      sort_by: sort_by
    })
    .then( resp => {
      setTopicListState(resp.data.data)
    })
    .catch(resp => console.log(resp))
  }

  function reRenderPage() {
    setTopicCount(topicCount + 1)
    community.relationships.topics.data.length = community.relationships.topics.data.length + 1
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
    .catch(resp => console.log(resp))
    return (
      <label className="category__tag">{category}</label>
    )
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
      
      {owner == true &&
        <button className='community__show-settings--button' onClick={showCommunitySettings}><img src="/packs/media/packs/pages/homepage/topicboard/topic-settings-icon-888be188c27c65a4af51589ffef5291d.jpg"/></button>}
      <div className='community__settings'>
        <button className="community__edit--button" onClick={toggleEditor}>Edit Community</button>
        <button className="community__delete--button" onClick={deleteCommunity}>Delete Community</button>
      </div>

      <TopicTable showTopicboard={showTopicboard} community_id={community.id}/>
    </div>
  )
}

export {Communityboard}