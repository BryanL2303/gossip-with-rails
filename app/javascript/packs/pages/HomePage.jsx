import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import {TopBar} from './homepage/TopBar'
import {SideBar} from './homepage/SideBar'
import {Dashboard} from './homepage/Dashboard'
import {Categoryboard} from './homepage/Categoryboard'
import {Topicboard} from './homepage/Topicboard'
import {AccountStateContext} from './homepage/context/AccountStateContext'
import {HomePageStateContext} from './homepage/context/HomePageStateContext'
import {CurrentDisplayTopicContext} from './homepage/context/CurrentDisplayTopicContext'
import {CurrentDisplayCategoryContext} from './homepage/context/CurrentDisplayCategoryContext'
import {TopicListProvider} from './homepage/context/TopicListContext'
import {PinnedCategoriesProvider} from './homepage/context/PinnedCategoriesContext'
import {FavouriteTopicsProvider} from './homepage/context/FavouriteTopicsContext'

const HomePage = () => {
  //If there is no ongoing session go to login page
  if (sessionStorage.getItem('id') == null) {
    window.location.href = '/'
  }

  //Both states used to render components of main block
  const [currentDisplayTopicState, setCurrentDisplayTopicState] = useContext(CurrentDisplayTopicContext)
  const [currentDisplayCategoryState, setCurrentDisplayCategoryState] = useContext(CurrentDisplayCategoryContext)
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [homePageState, setHomePageState] = useContext(HomePageStateContext)

  //Renders the dashboard
  function showDashboard(e) {
    setHomePageState("dashboard")
  }

  //Starts the process to render the category board
  function showCategoryboard(e) {
    fetchCategory(e.target.id)
  }

  //Starts the process to render the topic board
  function showTopicboard(e) {
    fetchTopic(e.target.id)
  }

  //Gets the information of the topic to be rendered
  //from the database.
  function fetchCategory(category_id) {
    axios.get('/api/category/' + category_id)
    .then(resp => {
      setCurrentDisplayCategoryState(resp.data.data)
    })
    .catch(resp => console.log(resp))
  }

  //Waits for the category state to be set before rendering components
  useEffect(() => {
    if (currentDisplayCategoryState != null &&
     currentDisplayCategoryState != 'undefined') {
      setHomePageState("category")
    }
  }, [currentDisplayCategoryState])

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
    <FavouriteTopicsProvider>
    <div className='homepage-container'>
      <TopBar/>
      <SideBar showDashboard={showDashboard} showCategoryboard={showCategoryboard} showTopicboard={showTopicboard}/>
      {homePageState=="dashboard" && <Dashboard showTopicboard={showTopicboard} showCategoryboard={showCategoryboard}/>}
      {homePageState=="category" && <Categoryboard category={currentDisplayCategoryState} fetchTopic={fetchTopic} showCategoryboard={showCategoryboard} showTopicboard={showTopicboard}/>}
      {homePageState=="topic" && <Topicboard topic={currentDisplayTopicState} fetchTopic={fetchTopic} showCategoryboard={showCategoryboard}/>}
    </div>
    </FavouriteTopicsProvider>
    </PinnedCategoriesProvider>
    </TopicListProvider>
  )
}

export { HomePage }