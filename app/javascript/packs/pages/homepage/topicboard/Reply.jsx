import React, { useRef, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AccountStateContext } from '../context/AccountStateContext'

const Reply = ({reply_id, fetchComment, active}) => {
  const [reply, setReply] = useState()
  const [upvote, setUpvote] = useState()
  const [downvote, setDownvote] = useState()
  const [edited, setEdited] = useState()
  const [displayEditor, setDisplayEditor] = useState(false)
  const [owner, setOwner] = useState(false)
  const [accountState, setAccountState] = useContext(AccountStateContext)
  
  useEffect(() => {
    if (sessionStorage.getItem(`reply${reply_id}`) == null) {
      fetchReply()
    }
    else{
      let reply = JSON.parse(sessionStorage.getItem(`reply${reply_id}`))
      setReply(reply.reply)
      setUpvote(reply.upvote)
      setDownvote(reply.downvote)
      setEdited(reply.edited)
    }
  }, [])

  function fetchReply() {
    axios.get('/api/reply/' + reply_id)
    .then( resp => {
      if (resp.data.data == null) {
        fetchComment()
      }
      else {
        setReply(resp.data.data.attributes.reply)
        setUpvote(resp.data.data.attributes.upvote)
        setDownvote(resp.data.data.attributes.downvote)
        setEdited(resp.data.data.attributes.edited)
        if (resp.data.data.attributes.account_id == accountState.id) {
          setOwner(true)
        }
        sessionStorage.setItem(`reply${reply_id}`, JSON.stringify(resp.data.data.attributes))
      }
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

  function deleteReply(e) {
    axios.delete('/api/reply/' + reply_id)
    .then(resp => {
      sessionStorage.removeItem(`reply${reply_id}`)
      fetchComment()
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
        reply: newReply
      })
      .then(resp => {
        toggleEditor()
        fetchReply()
      })
      .catch(resp => console.log(resp))
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
        account_id: accountState.id
    })
    .then(resp => {
      fetchReply()
    })
    .catch(resp => console.log(resp))
  }

  function downvoteReply(e) {
    axios.post('/api/reply/' + reply_id + '/downvote', {
        account_id: accountState.id
    })
    .then(resp => {
      fetchReply()
    })
    .catch(resp => console.log(resp))
  }

  return(
    <div id={`reply${reply_id}`} className='reply__container'>
      {displayEditor == false && <label>{reply}</label>}
      {displayEditor == true && <Editor/>}
      {edited == true && owner == true &&
          <label className='edited__tag'>(edited)</label>}

      <br/>
      <br/>

      {active == true && owner == true &&
       <button className="show-edit__button" onClick={toggleEditor}>edit</button>}
      {owner == true &&
       <button className="delete-reply__button" onClick={deleteReply}>delete</button>}

      <label>{upvote}</label>
      <button id={reply_id} className='reply__upvote--button' onClick={upvoteReply}>
        <p>upvote</p>
      </button>
      <label>{downvote}</label>
      <button id={reply_id} className='reply__downvote--button' onClick={downvoteReply}>
        <p>downvote</p>
      </button>
      <br/>
    </div>
  )
}

export {Reply}