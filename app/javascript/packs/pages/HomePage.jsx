import React, { useState, useEffect, useContext } from 'react'
import { useCookies } from 'react-cookie';
import axios from 'axios'
import {errorMessage} from './homepage/functions/functions'
import { TopBar } from './homepage/TopBar'
import { SideBar } from './homepage/SideBar'
import { Dashboard } from './homepage/Dashboard'
import { Communityboard } from './homepage/Communityboard'
import { Topicboard } from './homepage/Topicboard'
import { HomePageStateContext } from './homepage/context/HomePageStateContext'
import { CurrentDisplayTopicContext } from './homepage/context/CurrentDisplayTopicContext'
import { CurrentDisplayCommunityContext } from './homepage/context/CurrentDisplayCommunityContext'

/*HomePage only accessible after logging in, users will always be on the HomePage
  There will always be a SideBar and TopBar
  Only the component Dashboard, Communityboard and Topicboard will be switched around
  Contains all the function to switch between the boards and load the community or topic from
    the backend
*/
const HomePage = () => {
  const [cookies, setCookies] = useCookies(['user'])

  //If there is no ongoing session go to login page
  if (cookies.Token == null) {
    window.location.href = '/'
  }

  const [currentDisplayTopicState, setCurrentDisplayTopicState] = useContext(CurrentDisplayTopicContext)
  const [currentDisplayCommunityState, setCurrentDisplayCommunityState] = useContext(CurrentDisplayCommunityContext)
  const [homePageState, setHomePageState] = useContext(HomePageStateContext)
  const [category_id, setCategoryID] = useState()

  //Renders the dashboard
  function showDashboard(e) {
    setHomePageState("dashboard")
  }

  //Filter all the communities and topics on the dashboard
  //Only display communities and topics within the category
  function filterCategory(e) {
    setCategoryID(e.target.id)
  }

  //Starts the process to render the community board
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
    axios.get('/api/community/' + community_id, {
      headers: {token: cookies.Token}
    })
    .then(resp => {
      setCurrentDisplayCommunityState(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  //Waits for the community state to be set before rendering components
  useEffect(() => {
    if (currentDisplayCommunityState != null &&
     currentDisplayCommunityState != 'undefined') {
      setHomePageState("community")
    }
  }, [currentDisplayCommunityState])

  //Gets the information of the topic to be rendered
  //from the database.
  function fetchTopic(topic_id) {
    axios.get('/api/topic/' + topic_id, {headers: {token: cookies.Token}})
    .then(resp => {
      setCurrentDisplayTopicState(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }
  
  //Waits for the topic state to be set before rendering components
  useEffect(() => {
    if (currentDisplayTopicState != null &&
     currentDisplayTopicState != 'undefined') {
      setHomePageState("topic")
    }
  }, [currentDisplayTopicState])

  return(
    <div className='homepage-container'>
      <TopBar/>
      <SideBar showDashboard={showDashboard} filterCategory={filterCategory} showCommunityboard={showCommunityboard} showTopicboard={showTopicboard}/>
      {homePageState=="dashboard" && 
        <Dashboard showTopicboard={showTopicboard} filterCategory={filterCategory} showCommunityboard={showCommunityboard} category_id={category_id}/>}
      {homePageState=="community" && 
        <Communityboard community={currentDisplayCommunityState} showDashboard={showDashboard} showTopicboard={showTopicboard} fetchCommunity={fetchCommunity}/>}
      {homePageState=="topic" && 
        <Topicboard topic={currentDisplayTopicState} showDashboard={showDashboard} fetchTopic={fetchTopic} showCommunityboard={showCommunityboard}/>}
    </div>
  )
}

export { HomePage }