import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import {AccountStateContext} from './context/AccountStateContext'
import {PinnedCategoriesContext} from './context/PinnedCategoriesContext'
import {PinnedCommunitiesContext} from './context/PinnedCommunitiesContext'
import {PinnedTopicsContext} from './context/PinnedTopicsContext'
import {CategoryButton} from './sidebar/CategoryButton'
import {CommunityButton} from './sidebar/CommunityButton'
import {TopicButton} from './sidebar/TopicButton'

const SideBar = ({showDashboard, filterCategory, showCommunityboard, showTopicboard}) => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [pinnedCategories, setPinnedCategories] = useContext(PinnedCategoriesContext)
  const [pinnedCommunities, setPinnedCommunities] = useContext(PinnedCommunitiesContext)
  const [pinnedTopics, setPinnedTopics] = useContext(PinnedTopicsContext)

  useEffect(() => {
    fetchPinnedCategories()
    fetchPinnedCommunities()
    fetchPinnedTopics()
  }, [])

  function fetchPinnedCategories() {
    axios.post('/api/pinned_category/' + accountState.id + '/fetch_categories')
    .then(resp => {
      setPinnedCategories(resp.data.data)
    })
    .catch(resp => console.log(resp))
  }

  function fetchPinnedCommunities() {
    axios.post('/api/pinned_community/' + accountState.id + '/fetch_communities')
    .then(resp => {
      setPinnedCommunities(resp.data.data)
    })
    .catch(resp => console.log(resp))
  }

  function fetchPinnedTopics() {
    axios.post('/api/pinned_topic/' + accountState.id + '/fetch_topics')
    .then(resp => {
      setPinnedTopics(resp.data.data)
    })
    .catch(resp => console.log(resp))
  }

  return(
    <div className='sidebar-container'>
      <div className='saved-container'>
        <button onClick={showDashboard}>Home</button>

        <label>Pinned Communities</label>
        {pinnedCommunities.map((community) => {
          return(
            <CommunityButton key={community.id} community_id={community.attributes.community_id} showCommunityboard={showCommunityboard}/>
          )
        })}

        <br/>
        <br/>

        <label>Pinned Topics</label>
        {pinnedTopics.map((topic) => {
          return(
            <TopicButton key={topic.id} topic_id={topic.attributes.topic_id} showTopicboard={showTopicboard}/>
          )
        })}
      </div>
    </div>
  )
}

/*
  Pinning of categories are disabled, when enabled add this chunk back
      <label>Pinned Categories</label>
        {pinnedCategories.map((category) => {
          return(
            <CategoryButton key={category.id} category_id={category.attributes.category_id} filterCategory={filterCategory}/>
          )
        })}

        <br/>
        <br/>
*/

export { SideBar }