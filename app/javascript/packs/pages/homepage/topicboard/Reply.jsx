import React, { useRef, useState, useEffect, useContext } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import {errorMessage} from '../functions/functions'

const Reply = ({reply_id, fetchComment, notification}) => {
  const [cookies, setCookie] = useCookies(['user'])
  const [reply, setReply] = useState()
  const [upvote, setUpvote] = useState()
  const [downvote, setDownvote] = useState()
  const [edited, setEdited] = useState()
  const [displayEditor, setDisplayEditor] = useState(false)
  const [currentVote, setCurrentVote] = useState()
  const [owner, setOwner] = useState(false)
  const [ownerName, setOwnerName] = useState()
  
  useEffect(() => {
    fetchReply()
  }, [])

  function fetchReply() {
    axios.get('/api/reply/' + reply_id, {
      headers: {token: cookies.Token}
    })
    .then( resp => {
      setReply(resp.data.data.data.attributes.reply)
      setUpvote(resp.data.data.data.attributes.upvote)
      setDownvote(resp.data.data.data.attributes.downvote)
      setEdited(resp.data.data.data.attributes.edited)
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

  function deleteReply(e) {
    axios.delete('/api/reply/' + reply_id)
    .then(resp => {
      fetchComment()
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
    function editReply(e) {
      e.preventDefault()
      if (e.target[0].value != reply) {
        submitEditReply(e.target[0].value)
      }
      else {
        toggleEditor()
        alert("Nothing was changed")
      }
    }

    function submitEditReply(newReply) {
      axios.post('/api/reply/' + reply_id + '/edit_reply', {
        token: cookies.Token,
        reply: newReply
      })
      .then(resp => {
        toggleEditor()
        fetchReply()
      })
      .catch(resp => errorMessage(resp.response.statusText))
    }

    return(
      <form className='editor' onSubmit={editReply}>
        <input className='editor__reply' placeholder={reply}></input>
        <button className='save-reply__button'>Save Reply</button>
      </form>
    )
  }

  function upvoteReply(e) {
    axios.post('/api/reply/' + reply_id + '/upvote', {
      token: cookies.Token
    })
    .then(resp => {
      fetchReply()
      if (currentVote == true) {
        setCurrentVote(null)
      }
      else {
        setCurrentVote(true)
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  function downvoteReply(e) {
    axios.post('/api/reply/' + reply_id + '/downvote', {
      token: cookies.Token
    })
    .then(resp => {
      fetchReply()
      if (currentVote == false) {
        setCurrentVote(null)
      }
      else {
        setCurrentVote(false)
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  return(
    <div id={`reply${reply_id}`} className='reply__container'>
      <label>{ownerName}</label>
      <br/>
      {displayEditor == false && <label>{reply}</label>}
      {displayEditor == true && <Editor/>}
      {edited == true && owner == true &&
          <label className='edited__tag'>(edited)</label>}

      {notification == null && <div>
        <br/>
        <br/>
        <label>{upvote}</label>
        <button id={reply_id} className='reply__upvote--button' onClick={upvoteReply}>
          {currentVote != true && <img id={reply_id} className='thumb-blank--img' src="/packs/media/packs/pages/homepage/thumbsup_blank-c78b476cd029c4245b8a33f0aa940f58.png"/>}
          {currentVote == true && <img id={reply_id} className='thumb-shaded--img' src="/packs/media/packs/pages/homepage/thumbsup_shaded-d399f9eef4c8b50e9c3638fc638f8285.png"/>}
        </button>
        <label>{downvote}</label>
        <button id={reply_id} className='reply__downvote--button' onClick={downvoteReply}>
          {currentVote != false && <img id={reply_id} className='thumb-blank--img' src="/packs/media/packs/pages/homepage/thumbsdown_blank-f7cd73be40b3007a5820448ea653998e.png"/>}
          {currentVote == false && <img id={reply_id} className='thumb-shaded--img' src="/packs/media/packs/pages/homepage/thumbsdown_shaded-326c2afa75456f7a113e8d9ed52954bb.png"/>}
        </button>

        {owner == true &&
          <button className="show-edit__button" onClick={toggleEditor}>edit</button>}
        {owner == true &&
          <button className="delete-reply__button" onClick={deleteReply}>delete</button>}
        <br/>
      </div>}
    </div>
  )
}

export {Reply}