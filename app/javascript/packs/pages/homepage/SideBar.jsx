import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import {AccountStateContext} from './context/AccountStateContext'
import {PinnedCategoriesContext} from './context/PinnedCategoriesContext'
import {PinnedCommunitiesContext} from './context/PinnedCommunitiesContext'
import {PinnedTopicsContext} from './context/PinnedTopicsContext'
import {Notification} from './sidebar/Notification'
import {CategoryButton} from './sidebar/CategoryButton'
import {CommunityButton} from './sidebar/CommunityButton'
import {TopicButton} from './sidebar/TopicButton'

const SideBar = ({showDashboard, filterCategory, showCommunityboard, showTopicboard}) => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [notifications, setNotifications] = useState([])
  const [pinnedCategories, setPinnedCategories] = useContext(PinnedCategoriesContext)
  const [pinnedCommunities, setPinnedCommunities] = useContext(PinnedCommunitiesContext)
  const [pinnedTopics, setPinnedTopics] = useContext(PinnedTopicsContext)

  useEffect(() => {
    fetchNotifications()
    fetchPinnedCategories()
    fetchPinnedCommunities()
    fetchPinnedTopics()
  }, [])

  function fetchNotifications() {
    axios.post('/api/notification/' + accountState.id + '/fetch_notifications')
    .then(resp => {
      setNotifications(resp.data.data)
    })
    .catch(resp => console.log(resp))
  }

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
        <button className='home--button' onClick={showDashboard}>Home</button>

        <h4>Notifications</h4>
        {notifications.length == 0 &&
          <p>No new notifications</p>}
        {notifications.map((notification) => {
          return(
            <Notification key={"notification" + notification.attributes.id} notification={notification} showTopicboard={showTopicboard}/>
          )
        })}

        <br/>
      <div className='saved-container'>
        <h4>Pinned Communities</h4>
        {pinnedCommunities.length == 0 &&
          <p>There Are No Pinned Communities</p>}
        {pinnedCommunities.map((community) => {
          return(
            <CommunityButton key={community.id} community_id={community.attributes.community_id} showCommunityboard={showCommunityboard}/>
          )
        })}

        <br/>
        <br/>

        <h4>Pinned Topics</h4>
        {pinnedTopics.length == 0 &&
          <p>There Are No Pinned Topics</p>}
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