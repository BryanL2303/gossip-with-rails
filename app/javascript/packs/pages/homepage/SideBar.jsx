import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AccountStateContext } from './context/AccountStateContext'
import { PinnedCategoriesContext } from './context/PinnedCategoriesContext'
import { FavouriteTopicsContext } from './context/FavouriteTopicsContext'
import {TopicButton} from './sidebar/TopicButton'
import {CategoryButton} from './sidebar/CategoryButton'

const SideBar = ({ showDashboard, showCategoryboard, showTopicboard }) => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [pinnedCategories, setPinnedCategories] = useContext(PinnedCategoriesContext)
  const [favouriteTopics, setFavouriteTopics] = useContext(FavouriteTopicsContext)

  useEffect(() => {
    fetchPinnedCategories()
    fetchFavouriteTopics()
  }, [])

  function fetchPinnedCategories() {
    axios.post('/api/pinned_category/' + accountState.id + '/fetch_categories')
    .then(resp => {
      setPinnedCategories(resp.data.data)
    })
    .catch(resp => console.log(resp))
  }

  function fetchFavouriteTopics() {
    axios.post('/api/favourite/' + accountState.id + '/fetch_topics')
    .then(resp => {
      setFavouriteTopics(resp.data.data)
    })
    .catch(resp => console.log(resp))
  }

  return(
    <div className='sidebar-container'>
      <div className='saved-container'>
        <button onClick={showDashboard}>Home</button>
        
        <label>Pinned Categories</label>
        {pinnedCategories.map((category) => {
          return(
            <CategoryButton key={category.id} category_id={category.attributes.category_id} showCategoryboard={showCategoryboard}/>
          )
        })}

        <br/>
        <br/>

        <label>Pinned Topics</label>
        {favouriteTopics.map((topic) => {
          return(
            <TopicButton key={topic.id} topic_id={topic.attributes.topic_id} showTopicboard={showTopicboard}/>
          )
        })}
      </div>
    </div>
  )
}

export { SideBar }