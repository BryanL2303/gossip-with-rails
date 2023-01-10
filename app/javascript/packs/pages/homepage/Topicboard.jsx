import React, {useState, useEffect, useContext} from 'react'
import Select from 'react-select'
import axios from 'axios'
import {TopicEditor} from './topicboard/TopicEditor'
import {Comment} from './topicboard/Comment'
import {CommentForm} from './topicboard/CommentForm'
import {AccountStateContext} from './context/AccountStateContext'
import {PinnedTopicsContext} from './context/PinnedTopicsContext'

const Topicboard = ({topic, showDashboard, fetchTopic}) => {
	const [description, setDescription] = useState(topic.attributes.topic_description)
  const [upvote, setUpvote] = useState(topic.attributes.upvote)
  const [downvote, setDownvote] = useState(topic.attributes.downvote)
  const [topic_id, setTopic_Id] = useState(topic.attributes.id)
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [pinnedTopics, setPinnedTopics] = useContext(PinnedTopicsContext)
  const [comments, setComments] = useState([])
  const [commentCount, setCommentCount] = useState(0)
  const [commentLimit, setCommentLimit] = useState(topic.relationships.comments.data.length)
  const [owner, setOwner] = useState(accountState.id == topic.attributes.gossip_account_id)
  const [ownerName, setOwnerName] = useState()
  const [displayEditor, setDisplayEditor] = useState(false)
  const [categoryTag, setCategoryTag] = useState([])
  const [communityTag, setCommunityTag] = useState([])
  const [currentVote, setCurrentVote] = useState()
  const [currentSave, setCurrentSave] = useState()

  useEffect(() => {
    fetchTopic(topic.attributes.id)
    checkVote()
    checkSave()
  }, [])

  useEffect(()=> {
  	checkOwner(topic.attributes.gossip_account_id)
		setDescription(topic.attributes.topic_description)
    setUpvote(topic.attributes.upvote)
    setDownvote(topic.attributes.downvote)
		setTopic_Id(topic.attributes.id)
		setOwner(accountState.id == topic.attributes.gossip_account_id)
		setCommentCount(0)
		setCommentLimit(topic.relationships.comments.data.length)
		setCategoryTag(topic.relationships.categories.data)
    setCommunityTag(topic.relationships.communities.data)
    checkOwner(topic.attributes.gossip_account_id)
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

	function toggleEditor(e) {
    if (displayEditor == true) {
      setDisplayEditor(false)
    }
    else {
      setDisplayEditor(true)
    }
  }

	function deleteTopic() {
		if (confirm("This will permanently delete the topic as well as all the comments within it from the website.")) {
			axios.post('/api/topic/' + topic_id + '/delete_topic')
		  .then(resp => {
		  	showDashboard()
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

  const CategoryTag = ({category_id}) => {
    const [category, setCategory] = useState()
    axios.get('/api/category/' + category_id)
    .then(resp => {
      setCategory(resp.data.data.attributes.category_name)
    })
    .catch(resp => console.log(resp))
    return (
      <label className="category__tag">{category}</label>
    )
  }

  const CommunityTag = ({community_id}) => {
    const [community, setCommunity] = useState()
    axios.get('/api/community/' + community_id)
    .then(resp => {
      setCommunity(resp.data.data.attributes.community_name)
    })
    .catch(resp => console.log(resp))
    return (
      <label className="community__tag">{community}</label>
    )
  }

  function checkVote() {
    axios.post('/api/topic_vote/0/check_vote', {
      account_id: accountState.id,
      topic_id: topic.attributes.id
    })
    .then(resp => {
      setCurrentVote(resp.data)
    })
    .catch(resp => console.log(resp))
  }

  function checkSave() {
    axios.post('/api/pinned_topic/' + accountState.id + '/check_save', {
      topic_id: topic.attributes.id
    })
    .then(resp => {
      setCurrentSave(resp.data)
    })
    .catch(resp => console.log(resp))
  }

  function saveTopic(e) {
    axios.post('/api/pinned_topic/' + accountState.id + '/save_topic', {
        topic_id: topic.attributes.id
    })
    .then(resp => {
      setPinnedTopics(resp.data.data)
      checkSave()
    })
    .catch(resp => console.log(resp))
  }

  function upvoteTopic(e) {
    axios.post('/api/topic/' + topic.attributes.id + '/upvote', {
        account_id: accountState.id
    })
    .then(resp => {
      setUpvote(resp.data.data.attributes.upvote)
      setDownvote(resp.data.data.attributes.downvote)
      if (currentVote == true) {
        setCurrentVote(null)
      }
      else {
        setCurrentVote(true)
      }
    })
    .catch(resp => console.log(resp))
  }

  function downvoteTopic(e) {
    axios.post('/api/topic/' + topic.attributes.id + '/downvote', {
        account_id: accountState.id
    })
    .then(resp => {
      setUpvote(resp.data.data.attributes.upvote)
      setDownvote(resp.data.data.attributes.downvote)
      if (currentVote == false) {
        setCurrentVote(null)
      }
      else {
        setCurrentVote(false)
      }
    })
    .catch(resp => console.log(resp))
  }

	return(
		<div className="topic__container">
			<div className="topic__header">
				{displayEditor == false &&
          <div>
            <label className="static__label">{ownerName}</label>
            <br/>
            <h1 className="static__label">{topic.attributes.topic_name}</h1>
            {categoryTag.map((category) => {
          	 return(
            	<CategoryTag key={"category" + category.id}  category_id={category.id}/>
          	 )
        	 })}
        	 {communityTag.map((community) => {
         	 	  return(
            	 <CommunityTag key={"community" + community.id} community_id={community.id}/>
          	 )
        	 })}
        	 <br/>
        	 <label className="topic__description">{description}</label>
          </div>}
      	{displayEditor == true && <TopicEditor topic={topic} communityTag={communityTag} toggleEditor={toggleEditor} fetchTopic={fetchTopic}/>}
				<button id={topic.attributes.id} className='topic__save--button' onClick={saveTopic}>
          {currentSave != true && <img id={topic.attributes.id} className='pin-blank--img' src="/packs/media/packs/pages/homepage/blank-pin-bd3f3a74667f30e91af391147cc3a4d3.png"/>}
          {currentSave == true && <img id={topic.attributes.id} className='pin-shaded--img' src="/packs/media/packs/pages/homepage/shaded-pin-e1f0e749cdfdc1e190e0f23dbf1ed3c3.png"/>}
        </button>
        <label>{upvote}</label>
        <button id={topic.attributes.id} className='topic__upvote--button' onClick={upvoteTopic}>
          {currentVote != true && <img id={topic.attributes.id} className='thumb-blank--img' src="/packs/media/packs/pages/homepage/thumbsup_blank-c78b476cd029c4245b8a33f0aa940f58.png"/>}
          {currentVote == true && <img id={topic.attributes.id} className='thumb-shaded--img' src="/packs/media/packs/pages/homepage/thumbsup_shaded-d399f9eef4c8b50e9c3638fc638f8285.png"/>}
        </button>
        <label>{downvote}</label>
        <button id={topic.attributes.id} className='topic__downvote--button' onClick={downvoteTopic}>
          {currentVote != false && <img id={topic.attributes.id} className='thumb-blank--img' src="/packs/media/packs/pages/homepage/thumbsdown_blank-f7cd73be40b3007a5820448ea653998e.png"/>}
          {currentVote == false && <img id={topic.attributes.id} className='thumb-shaded--img' src="/packs/media/packs/pages/homepage/thumbsdown_shaded-326c2afa75456f7a113e8d9ed52954bb.png"/>}
        </button>
        {owner == true &&
				  <button className='topic__show-settings--button' onClick={showTopicSettings}><img src="/packs/media/packs/pages/homepage/topicboard/topic-settings-icon-888be188c27c65a4af51589ffef5291d.jpg"/></button>}
				<div className='topic__settings'>
					<button className="topic__edit--button" onClick={toggleEditor}>Edit Topic</button>
					<button className="topic__delete--button" onClick={deleteTopic}>Delete Topic</button>
				</div>
			</div>
			
			<div className="topic__comment-container">
				<CommentForm topic_id={topic_id} reRenderComments={reRenderComments}/>
				
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
              	<Comment key={`comment${comment.id}`} comment_id={comment.id} fetchComments={fetchComments}/>
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