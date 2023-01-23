import React, {useState, useEffect, useContext} from 'react'
import Select from 'react-select'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { errorMessage } from './functions/functions'
import { TopicEditor } from './topicboard/TopicEditor'
import { Comment } from './topicboard/Comment'
import { CommentForm } from './topicboard/CommentForm'
import { PinnedTopicsContext } from './context/PinnedTopicsContext'

/*The page which displays a topic
  All comments and replies related to the topic will be shown here
  The user who created the topic can edit or delete the topic from here
*/
const Topicboard = ({topic, showDashboard, fetchTopic}) => {
  const [cookies, setCookie] = useCookies(['user'])
	const [pinnedTopics, setPinnedTopics] = useContext(PinnedTopicsContext)
  const [description, setDescription] = useState(topic.data.data.attributes.topic_description)
  const [upvote, setUpvote] = useState(topic.data.data.attributes.upvote)
  const [downvote, setDownvote] = useState(topic.data.data.attributes.downvote)
  const [topic_id, setTopic_Id] = useState(topic.data.data.attributes.id)
  const [comments, setComments] = useState([])
  const [commentCount, setCommentCount] = useState(0)
  const [commentLimit, setCommentLimit] = useState(topic.data.data.relationships.comments.data.length)
  const [owner, setOwner] = useState(topic.isOwner)
  const [ownerName, setOwnerName] = useState(topic.ownerName)
  const [displayEditor, setDisplayEditor] = useState(false)
  const [categoryTag, setCategoryTag] = useState([])
  const [communityTag, setCommunityTag] = useState([])
  const [currentVote, setCurrentVote] = useState()
  const [currentSave, setCurrentSave] = useState()

  //When user clicks on another topic on the sidebar update state
  // to rerender all the components
  useEffect(()=> {
		setDescription(topic.data.data.attributes.topic_description)
    setUpvote(topic.data.data.attributes.upvote)
    setDownvote(topic.data.data.attributes.downvote)
		setTopic_Id(topic.data.data.attributes.id)
		setOwner(topic.isOwner)
		setCommentCount(0)
		setCommentLimit(topic.data.data.relationships.comments.data.length)
		setCategoryTag(topic.data.data.relationships.categories.data)
    setCommunityTag(topic.data.data.relationships.communities.data)
    setOwnerName(topic.ownerName)
    setCurrentVote(topic.vote)
    setCurrentSave(topic.saved)
	}, [topic])

  //The following series of useEffects are to show comments in groups
  // of 5 so as not to overload too many components at once
	useEffect(() =>{
		if (commentCount == 0) {
			fetchComments('created_at')
		}
	}, [commentLimit])

	useEffect(()=> {
		if (commentCount == 0) {
			showComments()
		}
	}, [comments])

  //For the user who owns the topic to open the editor to edit the topic
  // name and description
	function toggleEditor(e) {
    if (displayEditor == true) {
      setDisplayEditor(false)
    } else {
      setDisplayEditor(true)
    }
  }

  //For the user who owns the topic to delete the topic
  //  when the user deletes the topic all comments and replies within
  //  it are all deleted.
	function deleteTopic() {
		if (confirm("This will permanently delete the topic as well as all the comments within it from the website.")) {
			axios.post('/api/topic/' + topic_id + '/delete_topic', {
        token: cookies.Token
      })
		  .then(resp => {
		  	showDashboard()
		  })
		  .catch(resp => errorMessage(resp.response.statusText))
		}
	}

  //Gets the comments in this topic from the backend
  //  requests for 5 comments each time
	function fetchComments(sort_by) {
    axios.post('/api/comment/' + topic_id + '/fetch_comments', {
    	sort_by: sort_by
    })
    .then(resp => {
      setComments(resp.data.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  //When user creates new comments reload the comments
  function reRenderComments() {
  	setCommentCount(commentCount + 1)
  	topic.data.data.relationships.comments.data.length = topic.data.data.relationships.comments.data.length + 1
  	fetchComments('created_at')
  }

  //For the user who owns the topic to access the buttons to edit or delete the topic
  function showTopicSettings(e) {
    let topicSettings = document.getElementsByClassName('topic__settings')[0]
    if (topicSettings.style['visibility'] == 'hidden') {
      topicSettings.style['visibility'] = 'visible'
    }
    else {
      topicSettings.style['visibility'] = 'hidden'
    }
  }

  //For users to access buttons to sort the comments
  function showSortOptions(e) {
    let sortOptions = document.getElementsByClassName('sort__options')[0]
    if (sortOptions.style['visibility'] == 'hidden') {
      sortOptions.style['visibility'] = 'visible'
    }
    else {
      sortOptions.style['visibility'] = 'hidden'
    }
  }

  //When user clicks on sort refetch the comments
  function sortComments(e) {
		fetchComments(e.target.id)
	}

  //Function to help show more comments
  //  each time showing 5 more comments
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

  //If the topic belongs to a category display the tag
  const CategoryTag = ({category_id}) => {
    const [category, setCategory] = useState()
    axios.get('/api/category/' + category_id)
    .then(resp => {
      setCategory(resp.data.data.attributes.category_name)
    })
    .catch(resp => errorMessage(resp.response.statusText))
    return (
      <label className="category__tag">{category}</label>
    )
  }

  //If the topic belongs to a community display the tag
  const CommunityTag = ({community_id}) => {
    const [community, setCommunity] = useState()
    axios.get('/api/community/' + community_id, {
      headers: {token: cookies.Token}
    })
    .then(resp => {
      setCommunity(resp.data.data.data.attributes.community_name)
    })
    .catch(resp => errorMessage(resp.response.statusText))
    return (
      <label className="community__tag">{community}</label>
    )
  }

  //Pins the topic to the sidebar of the user
  function saveTopic(e) {
    axios.post('/api/pinned_topic/0/save_topic', {
      token: cookies.Token,
      topic_id: topic_id
    })
    .then(resp => {
      setPinnedTopics(resp.data.data)
      if (currentSave == true) {
        setCurrentSave(false)
      } else {
        setCurrentSave(true)
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  //Upvotes the topic for the user
  function upvoteTopic(e) {
    axios.post('/api/topic/' + topic_id + '/upvote', {
      token: cookies.Token
    })
    .then(resp => {
      setUpvote(resp.data.upvote)
      setDownvote(resp.data.downvote)
      if (currentVote == true) {
        setCurrentVote(null)
      } else {
        setCurrentVote(true)
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  //Downvotes the topic for the user
  function downvoteTopic(e) {
    axios.post('/api/topic/' + topic_id + '/downvote', {
        token: cookies.Token
    })
    .then(resp => {
      setUpvote(resp.data.upvote)
      setDownvote(resp.data.downvote)
      if (currentVote == false) {
        setCurrentVote(null)
      } else {
        setCurrentVote(false)
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

	return(
		<div className="topic__container">
			<div className="topic__header">
				{displayEditor == false &&
          <div>
            <label className="static__label">{ownerName}</label>
            <br/>
            <h1 className="static__label">{topic.data.data.attributes.topic_name}</h1>
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
				<button id={topic_id} className='topic__save--button' onClick={saveTopic}>
          {currentSave != true && <img id={topic_id} className='pin-blank--img' src="/packs/media/packs/pages/homepage/blank-pin-bd3f3a74667f30e91af391147cc3a4d3.png"/>}
          {currentSave == true && <img id={topic_id} className='pin-shaded--img' src="/packs/media/packs/pages/homepage/shaded-pin-e1f0e749cdfdc1e190e0f23dbf1ed3c3.png"/>}
        </button>
        <label>{upvote}</label>
        <button id={topic_id} className='topic__upvote--button' onClick={upvoteTopic}>
          {currentVote != true && <img id={topic_id} className='thumb-blank--img' src="/packs/media/packs/pages/homepage/thumbsup_blank-c78b476cd029c4245b8a33f0aa940f58.png"/>}
          {currentVote == true && <img id={topic_id} className='thumb-shaded--img' src="/packs/media/packs/pages/homepage/thumbsup_shaded-d399f9eef4c8b50e9c3638fc638f8285.png"/>}
        </button>
        <label>{downvote}</label>
        <button id={topic_id} className='topic__downvote--button' onClick={downvoteTopic}>
          {currentVote != false && <img id={topic_id} className='thumb-blank--img' src="/packs/media/packs/pages/homepage/thumbsdown_blank-f7cd73be40b3007a5820448ea653998e.png"/>}
          {currentVote == false && <img id={topic_id} className='thumb-shaded--img' src="/packs/media/packs/pages/homepage/thumbsdown_shaded-326c2afa75456f7a113e8d9ed52954bb.png"/>}
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
					<label>{topic.data.data.relationships.comments.data.length} Comment(s)</label>
					<button className='comments__show-sort--button' onClick={showSortOptions}><img src="/packs/media/packs/pages/homepage/sort-6adf140c7b527d54d87dc57645c571f9.png"/> <label>Sort</label></button>
					<div className='sort__options' style={{visibility: 'hidden'}}>
						<button id='created_at' className="sort-option--button" onClick={sortComments}>Most Recent</button> 
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