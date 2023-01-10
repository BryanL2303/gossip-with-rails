import React, { useRef, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AccountStateContext } from '../context/AccountStateContext'
import { PinnedCommunitiesContext } from '../context/PinnedCommunitiesContext'

const Community = ({community_id, reRenderPage, showCommunityboard}) => {
  const [community, setCommunity] = useState()
  const [description, setDescription] = useState()
  const [currentVote, setCurrentVote] = useState()
  const [upvote, setUpvote] = useState()
  const [downvote, setDownvote] = useState()
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [pinnedCommunities, setPinnedCommunities] = useContext(PinnedCommunitiesContext)
  const [currentSave, setCurrentSave] = useState()
  const [tag, setTag] = useState([])
  const [ownerName, setOwnerName] = useState()
  
  useEffect(() => {
    fetchCommunity()
    checkVote()
    checkSave()
  }, [])

  function fetchCommunity() {
    axios.get('/api/community/' + community_id)
    .then( resp => {
      if (resp.data.data == null) {
        reRenderPage()
      }
      else {
        setCommunity(resp.data.data.attributes.community_name)
        setDescription(resp.data.data.attributes.community_description)
        setUpvote(resp.data.data.attributes.upvote)
        setDownvote(resp.data.data.attributes.downvote)
        setTag(resp.data.data.relationships.categories.data)
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
    axios.post('/api/community_vote/0/check_vote', {
      account_id: accountState.id,
      community_id: community_id
    })
    .then(resp => {
      setCurrentVote(resp.data)
    })
    .catch(resp => console.log(resp))
  }

  function checkSave() {
    axios.post('/api/pinned_community/' + accountState.id + '/check_save', {
      community_id: community_id
    })
    .then(resp => {
      setCurrentSave(resp.data)
    })
    .catch(resp => console.log(resp))
  }

  function pinCommunity(e) {
    axios.post('/api/pinned_community/' + accountState.id + '/save_community', {
        community_id: community_id
    })
    .then(resp => {
      setPinnedCommunities(resp.data.data)
      checkSave()
    })
    .catch(resp => console.log(resp))
  }

  function upvoteCommunity(e) {
    axios.post('/api/community/' + community_id + '/upvote', {
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

  function downvoteCommunity(e) {
    axios.post('/api/community/' + community_id + '/downvote', {
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

  return(
    <div id={community_id} className="community">
      <button id={community_id} className='community__show--button' onClick={showCommunityboard}>
        <label id={community_id}>{ownerName}</label>
        <br/>
        <label id={community_id} className='community__name'>{community}</label>
        {tag.map((category) => {
          return(
            <CategoryTag key={"category" + category.id}  category_id={category.id}/>
          )
        })}
        <br/>
        <br/>
        <label id={community_id} className='community__description'>{description}</label>
      </button>
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
    </div>
  )
}

  export {Community}