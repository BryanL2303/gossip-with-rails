import React, { useRef, useState, useEffect, useContext } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import {Reply} from './Reply'
import {ReplyForm} from './ReplyForm'
import {errorMessage} from '../functions/functions'

const Comment = ({comment_id, fetchComments, notification}) => {
  const [cookies, setCookie] = useCookies(['user'])
  const [comment, setComment] = useState()
  const [upvote, setUpvote] = useState()
  const [downvote, setDownvote] = useState()
  const [replies, setReplies] = useState([])
  const [replyCount, setReplyCount] = useState(0)
  const [replyLimit, setReplyLimit] = useState(0)
  const [edited, setEdited] = useState()
  const [currentVote, setCurrentVote] = useState()
  const [displayEditor, setDisplayEditor] = useState(false)
  const [owner, setOwner] = useState(false)
  const [ownerName, setOwnerName] = useState()

  useEffect(() => {
    fetchComment()
  }, [])

  function fetchComment() {
    axios.get('/api/comment/' + comment_id, {
      headers: {token: cookies.Token}
    })
    .then( resp => {
      setComment(resp.data.data.data.attributes.comment)
      setUpvote(resp.data.data.data.attributes.upvote)
      setDownvote(resp.data.data.data.attributes.downvote)
      setEdited(resp.data.data.data.attributes.edited)
      setReplies(resp.data.data.data.relationships.replys.data)
      setReplyLimit(resp.data.data.data.relationships.replys.data.length)
      setOwner(resp.data.isOwner)
      setOwnerName(resp.data.ownerName)
      setCurrentVote(resp.data.vote)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  //Change this to update comment only if comment belongs to user
  function updateName(e) {
    if (name != e.target.value) {
      axios.post('/api/task/' + task_id + '/update_task', {
        task_name: e.target.value
      })
      .then(resp => {
        fetchTask()
      })
      .catch(resp => errorMessage(resp.response.statusText))
    }
  }

  function deleteComment(e) {
    axios.delete('/api/comment/' + comment_id)
    .then(resp => {
      sessionStorage.removeItem(`comment${comment_id}`)
      fetchComments()
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  function toggleEditor(e) {
    if (displayEditor == true) {
      setDisplayEditor(false)
    }
    else {
      setDisplayEditor(true)
    }
  }

  const Editor = () => {
    function editComment(e) {
      e.preventDefault()
      if (e.target[0].value != comment) {
        submitEditComment(e.target[0].value)
      }
      else {
        toggleEditor()
        alert("Nothing was changed")
      }
    }

    function submitEditComment(newComment) {
      axios.post('/api/comment/' + comment_id + '/edit_comment', {
        token: cookies.Token,
        comment: newComment
      })
      .then(resp => {
        toggleEditor()
        fetchComment()
      })
      .catch(resp => errorMessage(resp.response.statusText))
    }

    return(
      <form className='editor' onSubmit={editComment}>
        <input className='editor__comment' placeholder={comment}></input>
        <button className='save-comment__button'>Save Comment</button>
      </form>
    )
  }

  function upvoteComment(e) {
    axios.post('/api/comment/' + comment_id + '/upvote', {
      token: cookies.Token
    })
    .then(resp => {
      fetchComment()
      if (currentVote == true) {
        setCurrentVote(null)
      }
      else {
        setCurrentVote(true)
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  function downvoteComment(e) {
    axios.post('/api/comment/' + comment_id + '/downvote', {
      token: cookies.Token
    })
    .then(resp => {
      fetchComment()
      if (currentVote == false) {
        setCurrentVote(null)
      }
      else {
        setCurrentVote(false)
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  function showReplies() {
    if (replyLimit >= 5) {
      setReplyLimit(replyLimit - 5)
      setReplyCount(replyCount + 5)
    }
    else {
      setReplyCount(replyCount + replyLimit)
      setReplyLimit(0)
    }
  }

  return(
    <div className='comment__container'>
      <label>{ownerName}</label>
      <br/>
      {displayEditor == false && <label>{comment}</label>}
      
      {notification == null && <div>
        {displayEditor == true && <Editor/>}
        {edited == true && owner == true &&
          <label className='edited__tag'>(edited)</label>}

        <br/>
        <br/>

        <label>{upvote}</label>
        <button id={comment_id} className='comment__upvote--button' onClick={upvoteComment}>
          {currentVote != true && <img id={comment_id} className='thumb-blank--img' src="/packs/media/packs/pages/homepage/thumbsup_blank-c78b476cd029c4245b8a33f0aa940f58.png"/>}
          {currentVote == true && <img id={comment_id} className='thumb-shaded--img' src="/packs/media/packs/pages/homepage/thumbsup_shaded-d399f9eef4c8b50e9c3638fc638f8285.png"/>}
        </button>
        <label>{downvote}</label>
        <button id={comment_id} className='comment__downvote--button' onClick={downvoteComment}>
          {currentVote != false && <img id={comment_id} className='thumb-blank--img' src="/packs/media/packs/pages/homepage/thumbsdown_blank-f7cd73be40b3007a5820448ea653998e.png"/>}
          {currentVote == false && <img id={comment_id} className='thumb-shaded--img' src="/packs/media/packs/pages/homepage/thumbsdown_shaded-326c2afa75456f7a113e8d9ed52954bb.png"/>}
        </button>

        {owner == true &&
          <button className="show-edit__button" onClick={toggleEditor}>edit</button>}
        {owner == true &&
          <button className="delete-comment__button" onClick={deleteComment}>delete</button>}

        <ReplyForm comment_id={comment_id} fetchComment={fetchComment}/>

        <div className='replies__container'>
          {replies.map((reply, count) => {
            if (count < replyCount) {
              return(
                <Reply key={reply.id} reply_id={reply.id} fetchComment={fetchComment}/>
              )
            }
          })}
          {replyLimit > 0 &&
            <button className='show-replies--button' onClick={showReplies}>Show {replyLimit} Replies</button>}
        </div>
        <br/>
      </div>}
    </div>
  )
}

export {Comment}