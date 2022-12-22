import React, { useRef, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import {Reply} from './Reply'
import {ReplyForm} from './ReplyForm'
import { AccountStateContext } from '../context/AccountStateContext'

const Comment = ({comment_id, fetchComments, active}) => {
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
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [ownerName, setOwnerName] = useState()

  useEffect(() => {
    fetchComment()
    checkVote()
  }, [])

  function fetchComment() {
    axios.get('/api/comment/' + comment_id)
    .then( resp => {
      if (resp.data.data == null) {
        fetchComments()
      }
      else {
        setComment(resp.data.data.attributes.comment)
        setUpvote(resp.data.data.attributes.upvote)
        setDownvote(resp.data.data.attributes.downvote)
        setEdited(resp.data.data.attributes.edited)
        setReplies(resp.data.data.relationships.replys.data)
        setReplyLimit(resp.data.data.relationships.replys.data.length)
        checkOwner(resp.data.data.attributes.gossip_account_id)
        if (resp.data.data.attributes.gossip_account_id == accountState.id) {
          setOwner(true)
        }
      }
    })
    .catch(resp => console.log(resp))
  }

  function checkOwner(gossip_account_id) {
    axios.get('/api/gossip_account/' + gossip_account_id)
    .then(resp => {
      setOwnerName(resp.data.data.attributes.account_name)
    })
    .catch(resp => console.log(resp))
  }

  function checkVote() {
    axios.post('/api/comment_vote/0/check_vote', {
      account_id: accountState.id,
      comment_id: comment_id
    })
    .then(resp => {
      setCurrentVote(resp.data)
    })
    .catch(resp => console.log(resp))
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
      .catch(resp => console.log(resp))
    }
  }

  function deleteComment(e) {
    axios.delete('/api/comment/' + comment_id)
    .then(resp => {
      sessionStorage.removeItem(`comment${comment_id}`)
      fetchComments()
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
        comment: newComment
      })
      .then(resp => {
        toggleEditor()
        fetchComment()
      })
      .catch(resp => console.log(resp))
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
        account_id: accountState.id
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
    .catch(resp => console.log(resp))
  }

  function downvoteComment(e) {
    axios.post('/api/comment/' + comment_id + '/downvote', {
        account_id: accountState.id
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
    .catch(resp => console.log(resp))
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
      {displayEditor == true && <Editor/>}
      {edited == true && owner == true &&
          <label className='edited__tag'>(edited)</label>}

      <br/>
      <br/>
      
      {active == true && owner == true &&
       <button className="show-edit__button" onClick={toggleEditor}>edit</button>}
      {owner == true &&
       <button className="delete-comment__button" onClick={deleteComment}>delete</button>}

      <label>{upvote}</label>
      <button id={comment_id} className='comment__upvote--button' onClick={upvoteComment}>
        {currentVote != true && <img id={comment_id} src="/packs/media/packs/pages/homepage/thumbsup_blank-c78b476cd029c4245b8a33f0aa940f58.png"/>}
        {currentVote == true && <img id={comment_id} src="/packs/media/packs/pages/homepage/thumbsup_shaded-d399f9eef4c8b50e9c3638fc638f8285.png"/>}
      </button>
      <label>{downvote}</label>
      <button id={comment_id} className='comment__downvote--button' onClick={downvoteComment}>
        {currentVote != false && <img id={comment_id} src="/packs/media/packs/pages/homepage/thumbsdown_blank-f7cd73be40b3007a5820448ea653998e.png"/>}
        {currentVote == false && <img id={comment_id} src="/packs/media/packs/pages/homepage/thumbsdown_shaded-326c2afa75456f7a113e8d9ed52954bb.png"/>}
      </button>
      {active == true && <ReplyForm comment_id={comment_id} fetchComment={fetchComment}/>}

      <div className='replies__container'>
        {replies.map((reply, count) => {
          if (count < replyCount) {
            return(
              <Reply key={reply.id} reply_id={reply.id} fetchComment={fetchComment} active={active}/>
            )
          }
        })}
        {replyLimit > 0 &&
          <button className='show-replies--button' onClick={showReplies}>Show {replyLimit} Replies</button>}
      </div>
      <br/>
    </div>
  )
}

export {Comment}