import React, { useState, useEffect, useContext } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { errorMessage } from '../functions/functions'

const TopicButton = ({topic_id, showTopicboard}) => {
  const [cookies, setCookie] = useCookies(['user'])
  const [topic, setTopic] = useState()

  useEffect(() => {
    fetchTopic()
  }, [])

  function fetchTopic() {
    axios.get('/api/topic/' + topic_id, {
      headers: {token: cookies.Token}
    })
    .then( resp => {
      if (resp.data.data == null) {
        console.log("This topic was deleted, add function to remove from favourites")
      }
      else {
        setTopic(resp.data.data.data.attributes.topic_name)
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  return(
    <button id={topic_id} className='topic__show--button' onClick={showTopicboard}>
      <label id={topic_id} className='topic__name'>{topic}</label>
    </button>
  )
}

export {TopicButton}