import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AccountStateContext } from '../context/AccountStateContext'

const NewTopicForm = ({reRenderTopics}) => {
  const [accountState, setAccountState] = useContext(AccountStateContext)

  function submitForm(e) {
    e.preventDefault()
    postCreateTopic(e.target)
  }

  function postCreateTopic(form) {
    axios.post('/api/topic/0/create_topic', {
      topic_name: form[0].value,
      description: form[1].value,
      account_id: accountState.id
    })
    .then(resp => {
      reRenderTopics()
      document.getElementsByClassName('topic-form__topic')[0].value = ''
      document.getElementsByClassName('topic-form__description')[0].value = ""
    })
    .catch(resp => console.log(resp))
  }

  return(
    <form className='topic-form' onSubmit={submitForm}>
      <label>Create Your Own Topic Here!</label>
      <input className='topic-form__topic' placeholder='topic_name'></input>
      <textarea className='topic-form__description' placeholder='topic_description'></textarea>
      <button>Create New Topic</button>
    </form>
  )
}

export {NewTopicForm}