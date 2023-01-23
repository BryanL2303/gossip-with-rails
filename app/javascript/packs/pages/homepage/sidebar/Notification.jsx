import React, { useState, useEffect, useContext } from 'react'
import Popup from 'reactjs-popup';
import axios from 'axios'
import { TopicButton } from './TopicButton'
import { Comment } from '../topicboard/Comment'
import { Reply } from '../topicboard/Reply'

const Notification = ({notification, showTopicboard, fetchNotifications}) => {
  function deleteNotification(e) {
    axios.delete('api/notification/' + notification.id)
    fetchNotifications()
  }

  return(
    <div className='notification'>
      <label>{notification.attributes.message}</label>  
      <button id={notification.attributes.id} className='notification__delete--button' onClick={deleteNotification}>X</button>
      {notification.attributes.tag == "topic" && <Popup trigger={<button className='popup--button'>See the topic here!</button>} position="right center">
        <div className='popup'>
        <TopicButton topic_id={notification.attributes.topic_id} showTopicboard={showTopicboard}/>
        </div>
      </Popup>}
      {notification.attributes.tag == "comment" && <Popup trigger={<button className='popup--button'>See the comment here!</button>} position="right center">
        <div className='popup'>
        <TopicButton topic_id={notification.attributes.topic_id} showTopicboard={showTopicboard}/>
        <Comment comment_id={notification.attributes.comment_id} notification={true}/>
        </div>
      </Popup>}
      {notification.attributes.tag == "reply" && <Popup trigger={<button className='popup--button'>See the reply here!</button>} position="right center">
        <div className='popup'>
        <TopicButton topic_id={notification.attributes.topic_id} showTopicboard={showTopicboard}/>
        <Reply reply_id={notification.attributes.reply_id} notification={true}/>
        </div>
      </Popup>}
    </div>
  )
}

export {Notification}