import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import {Comment} from './topicboard/Comment'
import {CommentForm} from './topicboard/CommentForm'
import {AccountStateContext} from './context/AccountStateContext'
import {TopicListContext} from './context/TopicListContext'

const Topicboard = ({topic, showDashboard, fetchTopic}) => {
	const [description, setDescription] = useState(topic.attributes.description)
  const [topic_id, setTopic_Id] = useState(topic.attributes.id)
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [comments, setComments] = useState([])
  const [active, setActive] = useState(topic.attributes.active)
  const [owner, setOwner] = useState(false)
  
  useEffect(()=> {
		fetchComments()
	}, [])

  //Eventually when the function to jump from topic to topic use this to upload state
	useEffect(()=> {
	}, [topic])

	function closeTopic() {
		if (confirm("This will prevent anyone else from leaving any more comments or replies under this topic, but users will still be able to read existing comments.")) {
			axios.post('/api/topic/' + topic_id + '/close_topic')
		  .then(resp => {
		  	fetchTopic(topic_id)
		  })
		  .catch(resp => console.log(resp))
		}
	}

	function fetchComments() {
    axios.get('/api/comment/' + topic_id + '/fetch_comments')
    .then(resp => {
      setComments(resp.data.data)
    })
    .catch(resp => console.log(resp))
  }

  function showTopicSettings(e) {
    let topicSettings = document.getElementsByClassName('topic__settings')[0]
    if (topicSettings.style['visibility'] == 'hidden') {
      topicSettings.style['visibility'] = 'visible'
    }
    else {
      topicSettings.style['visibility'] = 'hidden'
    }
  }

	return(
		<div className="topic__container">
			<div className="topic__header">
				<h1>{topic.attributes.topic_name}</h1>
				{owner == true &&
					<button className='topic__show-settings--button' onClick={showTopicSettings}><img src="/packs/media/packs/pages/homepage/topicboard/topic-settings-icon-888be188c27c65a4af51589ffef5291d.jpg"/></button>}
				<div className='topic__settings'>
					<button className="topic__close--button" onClick={closeTopic}>Close Topic</button>
				</div>
			</div>

			<label className="topic__description">{description}</label>
			
			<div className="topic__comment-container">
				{active == true && 
					<CommentForm topic_id={topic_id} fetchComments={fetchComments}/>}
				
				<div className='comments__container'>
	  			{comments.map((comment) => {
  					return(
    	        <Comment key={`comment${comment.id}`} comment_id={comment.id} fetchComments={fetchComments} active={active}/>
      	    )
  				})}
  			</div>
			</div>
		</div>
	)
}

export {Topicboard}