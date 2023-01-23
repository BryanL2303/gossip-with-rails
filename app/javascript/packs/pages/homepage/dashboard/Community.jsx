import React, { useRef, useState, useEffect, useContext } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { PinnedCommunitiesContext } from '../context/PinnedCommunitiesContext'
import {errorMessage} from '../functions/functions'

/*Button within the CommunityTable
*/
const Community = ({community_id, reRenderPage, showCommunityboard}) => {
  const [cookies, useCookie] = useCookies(['user'])
  const [community, setCommunity] = useState()
  const [description, setDescription] = useState()
  const [currentVote, setCurrentVote] = useState()
  const [upvote, setUpvote] = useState()
  const [downvote, setDownvote] = useState()
  const [pinnedCommunities, setPinnedCommunities] = useContext(PinnedCommunitiesContext)
  const [currentSave, setCurrentSave] = useState()
  const [tag, setTag] = useState([])
  const [ownerName, setOwnerName] = useState()
  
  useEffect(() => {
    fetchCommunity()
  }, [])

  function fetchCommunity() {
    axios.get('/api/community/' + community_id, {
      headers: {token: cookies.Token}
    })
    .then( resp => {
      if (resp.data.data == null) {
        reRenderPage()
      }
      else {
        setCommunity(resp.data.data.data.attributes.community_name)
        setDescription(resp.data.data.data.attributes.community_description)
        setUpvote(resp.data.data.data.attributes.upvote)
        setDownvote(resp.data.data.data.attributes.downvote)
        setTag(resp.data.data.data.relationships.categories.data)
        setOwnerName(resp.data.ownerName)
        setCurrentVote(resp.data.vote)
        setCurrentSave(resp.data.saved)
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
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