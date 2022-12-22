import React, { useRef, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AccountStateContext } from '../context/AccountStateContext'
import { PinnedCategoriesContext } from '../context/PinnedCategoriesContext'

const Category = ({category_id, reRenderPage, showCategoryboard}) => {
  const [category, setCategory] = useState()
  const [description, setDescription] = useState()
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [pinnedCategories, setPinnedCategories] = useContext(PinnedCategoriesContext)
  const [currentSave, setCurrentSave] = useState()
  
  useEffect(() => {
    fetchCategory()
    checkSave()
    if (sessionStorage.getItem(`category${category_id}`) == null) {
        
    }
    else{
      /*let topic = JSON.parse(sessionStorage.getItem(`topic${topic_id}`))
      setName(topic.topic_name)
      setDescription(topic.description)*/
    }
  }, [])

  useEffect(() => {
    //let descriptionBox = document.getElementsByClassName(`topic__description ${topic_id}`)[0]
    //descriptionBox.style['height'] = '0px'
    //descriptionBox.style['height'] = `${descriptionBox.scrollHeight}px`
  }, [description])

  function fetchCategory() {
    axios.get('/api/category/' + category_id)
    .then( resp => {
      if (resp.data.data == null) {
        reRenderPage()
      }
      else {
        setCategory(resp.data.data.attributes.category)
        setDescription(resp.data.data.attributes.description)
        sessionStorage.setItem(`category${category_id}`, JSON.stringify(resp.data.data.attributes))
      }
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

  return(
    <div id={category_id} className="category">
      <div className='category__label'>
        <button id={category_id} className='category__show--button' onClick={showCategoryboard}>
          <label id={category_id} className='category__name'>{category}</label>
          <br/>
          <br/>
          <label id={category_id} className='category__description'>{description}</label>
        </button>
        <button id={category_id} className='category__save--button' onClick={saveCategory}>
          {currentSave != true && <img id={category_id} src="/packs/media/packs/pages/homepage/pin_blank-7afa001d80f1a72e309b9e85e64b9d65.png"/>}
        {currentSave == true && <img id={category_id} src="/packs/media/packs/pages/homepage/pin_shaded-36106135ca2b44d70ec97d1574b53da2.jpg"/>}
        </button>
      </div>
    </div>
  )
}

  export {Category}