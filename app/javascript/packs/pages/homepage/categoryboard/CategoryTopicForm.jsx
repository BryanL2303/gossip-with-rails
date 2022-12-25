import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AccountStateContext } from '../context/AccountStateContext'

const CategoryTopicForm = ({category_id, reRenderPage}) => {
  const [accountState, setAccountState] = useContext(AccountStateContext)

  function submitForm(e) {
    e.preventDefault()
    postCategoryTopic(e.target)
  }

  function postCategoryTopic(form) {
    axios.post('/api/category/' + category_id + '/create_topic', {
      topic_name: form[0].value,
      description: form[1].value,
      account_id: accountState.id
    })
    .then(resp => {
      reRenderPage()
      document.getElementsByClassName('category-topic-form__topic')[0].value = ''
      document.getElementsByClassName('category-topic-form__description')[0].value = ""
    })
    .catch(resp => console.log(resp))
  }

  return(
    <form className='category-topic-form' onSubmit={submitForm}>
      <label>Create Your Own Topic Here!</label>
      <input className='category-topic-form__topic' placeholder='Add a new topic...'></input>
      <input className='category-topic-form__description' placeholder='Add a short description...'></input>
      <button>Create New Topic</button>
    </form>
  )
}

export {CategoryTopicForm}