import React, { useRef, useState, useEffect, useContext } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { PinnedTopicsContext } from '../context/PinnedTopicsContext'
import {errorMessage} from '../functions/functions'

/*Button within the TopicTable
*/
const Topic = ({topic, reRenderPage, showTopicboard}) => {
  const [cookies, setCookie] = useCookies(['user'])
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const [upvote, setUpvote] = useState()
  const [downvote, setDownvote] = useState()
  const [pinnedTopics, setPinnedTopics] = useContext(PinnedTopicsContext)
  const [currentVote, setCurrentVote] = useState()
  const [currentSave, setCurrentSave] = useState()
  const [ownerName, setOwnerName] = useState()
  const [categoryTag, setCategoryTag] = useState([])
  const [communityTag, setCommunityTag] = useState([])

  useEffect(() => {
    setName(topic.attributes.topic_name)
    setDescription(topic.attributes.topic_description)
    setUpvote(topic.attributes.upvote)
    setDownvote(topic.attributes.downvote)
    setCategoryTag(topic.relationships.categories.data)
    setCommunityTag(topic.relationships.communities.data)
    fetchTopic(topic.attributes.id)
  }, [])

  function fetchTopic(id) {
    axios.get('/api/topic/' + id, {
      headers: {token: cookies.Token}
    })
    .then(resp => {
      setOwnerName(resp.data.ownerName)
      setCurrentVote(resp.data.vote)
      setCurrentSave(resp.data.saved)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  function saveTopic(e) {
    axios.post('/api/pinned_topic/0/save_topic', {
        token: cookies.Token,
        topic_id: topic.attributes.id
    })
    .then(resp => {
      setPinnedTopics(resp.data.data)
      if (currentSave == true) {
        setCurrentSave(false)
      } else {
        setCurrentSave(true)
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  function upvoteTopic(e) {
    axios.post('/api/topic/' + topic.attributes.id + '/upvote', {
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

  function downvoteTopic(e) {
    axios.post('/api/topic/' + topic.attributes.id + '/downvote', {
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

  const CategoryTag = ({category_id}) => {
    let category = JSON.parse(sessionStorage.getItem(`category${category_id}`))
    return (
      <label className="category__tag">{category.attributes.category_name}</label>
    )
  }

  const CommunityTag = ({community_id}) => {
    const [community, setCommunity] = useState()
    axios.get('/api/community/' + community_id, {
      headers: {token: cookies.Token}
    })
    .then(resp => {
      setCommunity(resp.data.data.data.attributes.community_name)
    })
    .catch(resp => errorMessage(resp.response.statusText))
    return (
      <label className="community__tag">{community}</label>
    )
  }

  return(
    <div id={topic.attributes.id} className="topic">
      <button id={topic.attributes.id} className='topic__show--button' onClick={showTopicboard}>
        <label id={topic.attributes.id}>{ownerName}</label>
        <br/>
        <label id={topic.attributes.id} className='topic__name'>{name}</label>
        {categoryTag.map((category) => {
          return(
            <CategoryTag key={"category" + category.id}  category_id={category.id}/>
          )
        })}
        {communityTag.map((community) => {
          return(
            <CommunityTag key={"community" + community.id}  community_id={community.id}/>
          )
        })}
        <br/>
        <br/>
        <label id={topic.attributes.id} className='topic__description'>{description}</label>
      </button>
      <button id={topic.attributes.id} className='topic__save--button' onClick={saveTopic}>
        {currentSave != true && <img id={topic.attributes.id} className='pin-blank--img' src="/packs/media/packs/pages/homepage/blank-pin-bd3f3a74667f30e91af391147cc3a4d3.png"/>}
        {currentSave == true && <img id={topic.attributes.id} className='pin-shaded--img' src="/packs/media/packs/pages/homepage/shaded-pin-e1f0e749cdfdc1e190e0f23dbf1ed3c3.png"/>}
      </button>
      <label>{upvote}</label>
      <button id={topic.attributes.id} className='topic__upvote--button' onClick={upvoteTopic}>
        {currentVote != true && <img id={topic.attributes.id} className='thumb-blank--img' src="/packs/media/packs/pages/homepage/thumbsup_blank-c78b476cd029c4245b8a33f0aa940f58.png"/>}
        {currentVote == true && <img id={topic.attributes.id} className='thumb-shaded--img' src="/packs/media/packs/pages/homepage/thumbsup_shaded-d399f9eef4c8b50e9c3638fc638f8285.png"/>}
      </button>
      <label>{downvote}</label>
      <button id={topic.attributes.id} className='topic__downvote--button' onClick={downvoteTopic}>
        {currentVote != false && <img id={topic.attributes.id} className='thumb-blank--img' src="/packs/media/packs/pages/homepage/thumbsdown_blank-f7cd73be40b3007a5820448ea653998e.png"/>}
        {currentVote == false && <img id={topic.attributes.id} className='thumb-shaded--img' src="/packs/media/packs/pages/homepage/thumbsdown_shaded-326c2afa75456f7a113e8d9ed52954bb.png"/>}
      </button>
    </div>
  )
}

export {Topic}