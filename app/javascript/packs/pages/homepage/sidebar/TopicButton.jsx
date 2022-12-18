import React, { useRef, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AccountStateContext } from '../context/AccountStateContext'
import { FavouriteTopicsContext } from '../context/FavouriteTopicsContext'

const TopicButton = ({topic_id, showTopicboard}) => {
  const [topic, setTopic] = useState()
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [favourites, setFavourites] = useContext(FavouriteTopicsContext)

  useEffect(() => {
    fetchTopic()
  }, [])

  function fetchTopic() {
    axios.get('/api/topic/' + topic_id)
    .then( resp => {
      if (resp.data.data == null) {
        console.log("This topic was deleted, add function to remove from favourites")
      }
      else {
        setTopic(resp.data.data.attributes.topic_name)
        sessionStorage.setItem(`topic${topic_id}`, JSON.stringify(resp.data.data.attributes))
      }
    })
    .catch(resp => console.log(resp))
  }

  return(
    <button id={topic_id} className='topic__show--button' onClick={showTopicboard}>
      <label id={topic_id} className='topic__name'>{topic}</label>
    </button>
  )
}

export {TopicButton}