import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import {TopBar} from './homepage/TopBar'
import {SideBar} from './homepage/SideBar'
import {Dashboard} from './homepage/Dashboard'
import {Communityboard} from './homepage/Communityboard'
import {Topicboard} from './homepage/Topicboard'
import {AccountStateContext} from './homepage/context/AccountStateContext'
import {HomePageStateContext} from './homepage/context/HomePageStateContext'
import {CurrentDisplayTopicContext} from './homepage/context/CurrentDisplayTopicContext'
import {CurrentDisplayCommunityContext} from './homepage/context/CurrentDisplayCommunityContext'
import {TopicListProvider} from './homepage/context/TopicListContext'
import {PinnedCategoriesProvider} from './homepage/context/PinnedCategoriesContext'
import {PinnedCommunitiesProvider} from './homepage/context/PinnedCommunitiesContext'
import {FavouriteTopicsProvider} from './homepage/context/FavouriteTopicsContext'

const HomePage = () => {
  //If there is no ongoing session go to login page
  if (sessionStorage.getItem('id') == null) {
    window.location.href = '/'
  }

  //Both states used to render components of main block
  const [currentDisplayTopicState, setCurrentDisplayTopicState] = useContext(CurrentDisplayTopicContext)
  const [currentDisplayCommunityState, setCurrentDisplayCommunityState] = useContext(CurrentDisplayCommunityContext)
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [homePageState, setHomePageState] = useContext(HomePageStateContext)
  const [category_id, setCategoryID] = useState()

  //Renders the dashboard
  function showDashboard(e) {
    setHomePageState("dashboard")
  }

  function filterCategory(e) {
    setCategoryID(e.target.id)
  }

  //Starts the process to render the category board
  function showCommunityboard(e) {
    fetchCommunity(e.target.id)
  }

  //Starts the process to render the topic board
  function showTopicboard(e) {
    fetchTopic(e.target.id)
  }

  //Gets the information of the community to be rendered
  //from the database.
  function fetchCommunity(community_id) {
    axios.get('/api/community/' + community_id)
    .then(resp => {
      setCurrentDisplayCommunityState(resp.data.data)
    })
    .catch(resp => console.log(resp))
  }

  //Waits for the category state to be set before rendering components
  useEffect(() => {
    if (currentDisplayCommunityState != null &&
     currentDisplayCommunityState != 'undefined') {
      setHomePageState("community")
    }
  }, [currentDisplayCommunityState])

  //Gets the information of the topic to be rendered
  //from the database.
  function fetchTopic(topic_id) {
    axios.get('/api/topic/' + topic_id)
    .then(resp => {
      setCurrentDisplayTopicState(resp.data.data)
    })
    .catch(resp => console.log(resp))
  }
  
  //Waits for the topic state to be set before rendering components
  useEffect(() => {
    if (currentDisplayTopicState != null &&
     currentDisplayTopicState != 'undefined') {
      setHomePageState("topic")
    }
  }, [currentDisplayTopicState])

  return(
    <TopicListProvider>
    <PinnedCategoriesProvider>
    <PinnedCommunitiesProvider>
    <FavouriteTopicsProvider>
    <div className='homepage-container'>
      <TopBar/>
      <SideBar showDashboard={showDashboard} filterCategory={filterCategory} showCommunityboard={showCommunityboard} showTopicboard={showTopicboard}/>
      {homePageState=="dashboard" && <Dashboard showTopicboard={showTopicboard} filterCategory={filterCategory} showCommunityboard={showCommunityboard} category_id={category_id}/>}
      {homePageState=="community" && <Communityboard community={currentDisplayCommunityState} fetchTopic={fetchTopic} showCommunityboard={showCommunityboard} showTopicboard={showTopicboard}/>}
      {homePageState=="topic" && <Topicboard topic={currentDisplayTopicState} fetchTopic={fetchTopic} showCommunityboard={showCommunityboard}/>}
    </div>
    </FavouriteTopicsProvider>
    </PinnedCommunitiesProvider>
    </PinnedCategoriesProvider>
    </TopicListProvider>
  )
}

export { HomePage }