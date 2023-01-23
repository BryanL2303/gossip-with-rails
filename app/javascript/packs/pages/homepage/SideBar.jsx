import React, { useState, useEffect, useContext } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { errorMessage } from './functions/functions'
import { PinnedCommunitiesContext } from './context/PinnedCommunitiesContext'
import { PinnedTopicsContext } from './context/PinnedTopicsContext'
import { Notification } from './sidebar/Notification'
import { CommunityButton } from './sidebar/CommunityButton'
import { TopicButton } from './sidebar/TopicButton'

/*Sidebar which is visible on the HomePage at all times
  Contains notifications for the user
  Contains the communities pinned by the user
  Contains the topics pinned by the user
*/
const SideBar = ({showDashboard, filterCategory, showCommunityboard, showTopicboard}) => {
  const [notifications, setNotifications] = useState([])
  const [cookies, setCookie] = useCookies(["user"])
  const [pinnedCommunities, setPinnedCommunities] = useContext(PinnedCommunitiesContext)
  const [pinnedTopics, setPinnedTopics] = useContext(PinnedTopicsContext)

  //On render fetch the notifications and pinned items
  useEffect(() => {
    fetchNotifications()
    fetchPinnedCommunities()
    fetchPinnedTopics()
  }, [])

  function fetchNotifications() {
    axios.post('/api/notification/0/fetch_notifications', {
      token: cookies.Token
    })
    .then(resp => {
      setNotifications(resp.data.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  function fetchPinnedCommunities() {
    axios.post('/api/pinned_community/0/fetch_communities', {
      token: cookies.Token
    })
    .then(resp => {
      setPinnedCommunities(resp.data.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  function fetchPinnedTopics() {
    axios.post('/api/pinned_topic/0/fetch_topics', {
      token: cookies.Token
    })
    .then(resp => {
      setPinnedTopics(resp.data.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  return(
    <div className='sidebar-container'>
        <button className='home--button' onClick={showDashboard}>Home</button>

        <h4>Notifications</h4>
        {notifications.length == 0 &&
          <p>No new notifications</p>}
        {notifications.map((notification) => {
          return(
            <Notification key={"notification" + notification.id} notification={notification} showTopicboard={showTopicboard} fetchNotifications={fetchNotifications}/>
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

export { SideBar }