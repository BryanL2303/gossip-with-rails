import React, { useRef, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AccountStateContext } from '../context/AccountStateContext'
import { FavouriteTopicsContext } from '../context/FavouriteTopicsContext'

const Topic = ({topic_id, reRenderPage, showTopicboard}) => {
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const [upvote, setUpvote] = useState()
  const [downvote, setDownvote] = useState()
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [favourites, setFavourites] = useContext(FavouriteTopicsContext)
  const [currentVote, setCurrentVote] = useState()
  const [currentSave, setCurrentSave] = useState()
  const [ownerName, setOwnerName] = useState()
  const [categoryTag, setCategoryTag] = useState([])
  const [communityTag, setCommunityTag] = useState([])

  useEffect(() => {
    fetchTopic()
    checkVote()
    checkSave()
  }, [])

  function fetchTopic() {
    axios.get('/api/topic/' + topic_id)
    .then( resp => {
      if (resp.data.data == null) {
        reRenderPage()
      }
      else {
        setName(resp.data.data.attributes.topic_name)
        setDescription(resp.data.data.attributes.topic_description)
        setUpvote(resp.data.data.attributes.upvote)
        setDownvote(resp.data.data.attributes.downvote)
        setCategoryTag(resp.data.data.relationships.categories.data)
        setCommunityTag(resp.data.data.relationships.communities.data)
        checkOwner(resp.data.data.attributes.gossip_account_id)
      }
    })
    .catch(resp => console.log(resp))
  }

  function checkOwner(gossip_account_id) {
    axios.get('/api/gossip_account/' + gossip_account_id)
    .then(resp => {
      setOwnerName(resp.data.data.attributes.account_name)
    })
    .catch(resp => console.log(resp))
  }

  function checkVote() {
    axios.post('/api/topic_vote/0/check_vote', {
      account_id: accountState.id,
      topic_id: topic_id
    })
    .then(resp => {
      setCurrentVote(resp.data)
    })
    .catch(resp => console.log(resp))
  }

  function checkSave() {
    axios.post('/api/pinned_topic/' + accountState.id + '/check_save', {
      topic_id: topic_id
    })
    .then(resp => {
      setCurrentSave(resp.data)
    })
    .catch(resp => console.log(resp))
  }

  function saveTopic(e) {
    axios.post('/api/pinned_topic/' + accountState.id + '/save_topic', {
        topic_id: topic_id
    })
    .then(resp => {
      setFavourites(resp.data.data)
      checkSave()
    })
    .catch(resp => console.log(resp))
  }

  function upvoteTopic(e) {
    axios.post('/api/topic/' + topic_id + '/upvote', {
        account_id: accountState.id
    })
    .then(resp => {
      setUpvote(resp.data.data.attributes.upvote)
      setDownvote(resp.data.data.attributes.downvote)
      if (currentVote == true) {
        setCurrentVote(null)
      }
      else {
        setCurrentVote(true)
      }
    })
    .catch(resp => console.log(resp))
  }

  function downvoteTopic(e) {
    axios.post('/api/topic/' + topic_id + '/downvote', {
        account_id: accountState.id
    })
    .then(resp => {
      setUpvote(resp.data.data.attributes.upvote)
      setDownvote(resp.data.data.attributes.downvote)
      if (currentVote == false) {
        setCurrentVote(null)
      }
      else {
        setCurrentVote(false)
      }
    })
    .catch(resp => console.log(resp))
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

  const CommunityTag = ({community_id}) => {
    const [community, setCommunity] = useState()
    axios.get('/api/community/' + community_id)
    .then(resp => {
      setCommunity(resp.data.data.attributes.community_name)
    })
    .catch(resp => console.log(resp))
    return (
      <label className="community__tag">{community}</label>
    )
  }

  return(
    <div id={topic_id} className="topic">
      <button id={topic_id} className='topic__show--button' onClick={showTopicboard}>
        <label id={topic_id}>{ownerName}</label>
        <br/>
        <label id={topic_id} className='topic__name'>{name}</label>
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
        <label id={topic_id} className='topic__description'>{description}</label>
      </button>
      <button id={topic_id} className='topic__save--button' onClick={saveTopic}>
        {currentSave != true && <img id={topic_id} className='pin-blank--img' src="/packs/media/packs/pages/homepage/pin_blank-7afa001d80f1a72e309b9e85e64b9d65.png"/>}
        {currentSave == true && <img id={topic_id} className='pin-shaded--img' src="/packs/media/packs/pages/homepage/pin_shaded-36106135ca2b44d70ec97d1574b53da2.jpg"/>}
      </button>
      <label>{upvote}</label>
      <button id={topic_id} className='topic__upvote--button' onClick={upvoteTopic}>
        {currentVote != true && <img id={topic_id} className='thumb-blank--img' src="/packs/media/packs/pages/homepage/thumbsup_blank-c78b476cd029c4245b8a33f0aa940f58.png"/>}
        {currentVote == true && <img id={topic_id} className='thumb-shaded--img' src="/packs/media/packs/pages/homepage/thumbsup_shaded-d399f9eef4c8b50e9c3638fc638f8285.png"/>}
      </button>
      <label>{downvote}</label>
      <button id={topic_id} className='topic__downvote--button' onClick={downvoteTopic}>
        {currentVote != false && <img id={topic_id} className='thumb-blank--img' src="/packs/media/packs/pages/homepage/thumbsdown_blank-f7cd73be40b3007a5820448ea653998e.png"/>}
        {currentVote == false && <img id={topic_id} className='thumb-shaded--img' src="/packs/media/packs/pages/homepage/thumbsdown_shaded-326c2afa75456f7a113e8d9ed52954bb.png"/>}
      </button>
    </div>
  )
}

export {Topic}