import React, { useRef, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AccountStateContext } from '../context/AccountStateContext'
import { PinnedCategoriesContext } from '../context/PinnedCategoriesContext'

const Category = ({category_id, reRenderPage, showCategoryboard}) => {
  const [category, setCategory] = useState()
  const [description, setDescription] = useState()
  const [currentVote, setCurrentVote] = useState()
  const [upvote, setUpvote] = useState()
  const [downvote, setDownvote] = useState()
  const [active, setActive] = useState()
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [pinnedCategories, setPinnedCategories] = useContext(PinnedCategoriesContext)
  const [currentSave, setCurrentSave] = useState()
  const [ownerName, setOwnerName] = useState()
  
  useEffect(() => {
    fetchCategory()
    checkVote()
    checkSave()
  }, [])

  function fetchCategory() {
    axios.get('/api/category/' + category_id)
    .then( resp => {
      if (resp.data.data == null) {
        reRenderPage()
      }
      else {
        setCategory(resp.data.data.attributes.category)
        setDescription(resp.data.data.attributes.description)
        setUpvote(resp.data.data.attributes.upvote)
        setDownvote(resp.data.data.attributes.downvote)
        setActive(resp.data.data.attributes.active)
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
    axios.post('/api/category_vote/0/check_vote', {
      account_id: accountState.id,
      category_id: category_id
    })
    .then(resp => {
      setCurrentVote(resp.data)
    })
    .catch(resp => console.log(resp))
  }

  function checkSave() {
    axios.post('/api/pinned_category/' + accountState.id + '/check_save', {
      category_id: category_id
    })
    .then(resp => {
      setCurrentSave(resp.data)
    })
    .catch(resp => console.log(resp))
  }

  function saveCategory(e) {
    axios.post('/api/pinned_category/' + accountState.id + '/save_category', {
        category_id: category_id
    })
    .then(resp => {
      setPinnedCategories(resp.data.data)
      checkSave()
    })
    .catch(resp => console.log(resp))
  }

  function upvoteCategory(e) {
    axios.post('/api/category/' + category_id + '/upvote', {
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

  function downvoteCategory(e) {
    axios.post('/api/category/' + category_id + '/downvote', {
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

  return(
    <div id={category_id} className="category">
      <button id={category_id} className='category__show--button' onClick={showCategoryboard}>
        {active != true && <h4>(CLOSED)</h4>}
        <label id={category_id}>{ownerName}</label>
        <br/>
        <label id={category_id} className='category__name'>{category}</label>
        <br/>
        <br/>
        <label id={category_id} className='category__description'>{description}</label>
      </button>
      <button id={category_id} className='category__save--button' onClick={saveCategory}>
        {currentSave != true && <img id={category_id} className='pin-blank--img' src="/packs/media/packs/pages/homepage/pin_blank-7afa001d80f1a72e309b9e85e64b9d65.png"/>}
        {currentSave == true && <img id={category_id} className='pin-shaded--img' src="/packs/media/packs/pages/homepage/pin_shaded-36106135ca2b44d70ec97d1574b53da2.jpg"/>}
      </button>
      <label>{upvote}</label>
      <button id={category_id} className='category__upvote--button' onClick={upvoteCategory}>
        {currentVote != true && <img id={category_id} className='thumb-blank--img' src="/packs/media/packs/pages/homepage/thumbsup_blank-c78b476cd029c4245b8a33f0aa940f58.png"/>}
        {currentVote == true && <img id={category_id} className='thumb-shaded--img' src="/packs/media/packs/pages/homepage/thumbsup_shaded-d399f9eef4c8b50e9c3638fc638f8285.png"/>}
      </button>
      <label>{downvote}</label>
      <button id={category_id} className='category__downvote--button' onClick={downvoteCategory}>
        {currentVote != false && <img id={category_id} className='thumb-blank--img' src="/packs/media/packs/pages/homepage/thumbsdown_blank-f7cd73be40b3007a5820448ea653998e.png"/>}
        {currentVote == false && <img id={category_id} className='thumb-shaded--img' src="/packs/media/packs/pages/homepage/thumbsdown_shaded-326c2afa75456f7a113e8d9ed52954bb.png"/>}
      </button>
    </div>
  )
}

  export {Category}