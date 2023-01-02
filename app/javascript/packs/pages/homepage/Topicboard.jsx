import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import {Comment} from './topicboard/Comment'
import {CommentForm} from './topicboard/CommentForm'
import {AccountStateContext} from './context/AccountStateContext'
import {TopicListContext} from './context/TopicListContext'

const Topicboard = ({topic, showDashboard, fetchTopic}) => {
	const [description, setDescription] = useState(topic.attributes.topic_description)
  const [topic_id, setTopic_Id] = useState(topic.attributes.id)
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [comments, setComments] = useState([])
  const [commentCount, setCommentCount] = useState(0)
  const [commentLimit, setCommentLimit] = useState(topic.relationships.comments.data.length)
  const [active, setActive] = useState(topic.attributes.active)
  const [owner, setOwner] = useState(accountState.id == topic.attributes.gossip_account_id)
  const [ownerName, setOwnerName] = useState()

  useEffect(()=> {
  	checkOwner(topic.attributes.gossip_account_id)
		setDescription(topic.attributes.topic_description)
		setTopic_Id(topic.attributes.id)
		setActive(topic.attributes.active)
		setOwner(accountState.id == topic.attributes.gossip_account_id)
		setCommentCount(0)
		setCommentLimit(topic.relationships.comments.data.length)
	}, [topic])

	useEffect(() =>{
		if (commentCount == 0) {
			fetchComments('updated_at')
		}
	}, [commentLimit])

	useEffect(()=> {
		if (commentCount == 0) {
			showComments()
		}
	}, [comments])

	function checkOwner(gossip_account_id) {
    axios.get('/api/gossip_account/' + gossip_account_id)
    .then(resp => {
      setOwnerName(resp.data.data.attributes.account_name)
    })
    .catch(resp => console.log(resp))
  }

	function closeTopic() {
		if (confirm("This will prevent anyone else from leaving any more comments or replies under this topic, but users will still be able to read existing comments.")) {
			axios.post('/api/topic/' + topic_id + '/close_topic')
		  .then(resp => {
		  	fetchTopic(topic_id)
		  })
		  .catch(resp => console.log(resp))
		}
	}

	function openTopic() {
		if (confirm("This will allow other users to leave comments and replies under this topic again.")) {
			axios.post('/api/topic/' + topic_id + '/open_topic')
		  .then(resp => {
		  	fetchTopic(topic_id)
		  })
		  .catch(resp => console.log(resp))
		}
	}

	function fetchComments(sort_by) {
    axios.post('/api/comment/' + topic_id + '/fetch_comments', {
    	sort_by: sort_by
    })
    .then(resp => {
      setComments(resp.data.data)
    })
    .catch(resp => console.log(resp))
  }

  function reRenderComments() {
  	setCommentCount(commentCount + 1)
  	topic.relationships.comments.data.length = topic.relationships.comments.data.length + 1
  	fetchComments('updated_at')
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

  function showSortOptions(e) {
    let sortOptions = document.getElementsByClassName('sort__options')[0]
    if (sortOptions.style['visibility'] == 'hidden') {
      sortOptions.style['visibility'] = 'visible'
    }
    else {
      sortOptions.style['visibility'] = 'hidden'
    }
  }

  function sortComments(e) {
		fetchComments(e.target.id)
	}

  function showComments() {
    if (commentLimit >= 5) {
      setCommentLimit(commentLimit - 5)
      setCommentCount(commentCount + 5)
    }
    else {
      setCommentCount(commentCount + commentLimit)
      setCommentLimit(0)
    }
  }

	return(
		<div className="topic__container">
			<div className="topic__header">
				<label className="static__label">{ownerName}</label>
      	<br/>
				<h1 className="static__label">{topic.attributes.topic_name} {active != true &&
					<label>(CLOSED)</label>}</h1>			
				{owner == true &&
					<button className='topic__show-settings--button' onClick={showTopicSettings}><img src="/packs/media/packs/pages/homepage/topicboard/topic-settings-icon-888be188c27c65a4af51589ffef5291d.jpg"/></button>}
				<div className='topic__settings'>
					{active == true && 
						<button className="topic__close--button" onClick={closeTopic}>Close Topic</button>}
					{active != true && 
						<button className="topic__open--button" onClick={openTopic}>Open Topic</button>}
				</div>
			</div>

			<label className="topic__description">{description}</label>
			
			<div className="topic__comment-container">
				{active == true && 
					<CommentForm topic_id={topic_id} reRenderComments={reRenderComments}/>}
				{active != true && 
					<label>This topic has been closed by the owner, you can no longer leave any more comments on this topic.</label>}
				
				<div className='comments__container'>
					<label>{topic.relationships.comments.data.length} Comment(s)</label>
					<button className='comments__show-sort--button' onClick={showSortOptions}><img src="/packs/media/packs/pages/homepage/sort-6adf140c7b527d54d87dc57645c571f9.png"/> <label>Sort</label></button>
					<div className='sort__options' style={{visibility: 'hidden'}}>
						<button id='updated_at' className="sort-option--button" onClick={sortComments}>Most Recent</button> 
						<button id='upvote' className="sort-option--button" onClick={sortComments}>Most Upvoted</button>
						<button id='downvote' className="sort-option--button" onClick={sortComments}>Most Downvoted</button>
					</div>
					
					<br/>
					<br/>
	  			{comments.map((comment, count) => {
          	if (count < commentCount) {
            	return(
              	<Comment key={`comment${comment.id}`} comment_id={comment.id} fetchComments={fetchComments} active={active}/>
            	)
          	}
        	})}
        	{commentLimit > 0 &&
          	<button className='show-comments--button' onClick={showComments}>Load More Comments</button>}
  			</div>
			</div>
		</div>
	)
}

export {Topicboard}