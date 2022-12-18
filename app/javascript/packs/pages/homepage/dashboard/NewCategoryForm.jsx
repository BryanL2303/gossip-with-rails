import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AccountStateContext } from '../context/AccountStateContext'

const NewCategoryForm = ({reRenderCategories}) => {
  const [accountState, setAccountState] = useContext(AccountStateContext)

  function submitForm(e) {
    e.preventDefault()
    postCreateCategory(e.target)
  }

  function postCreateCategory(form) {
    axios.post('/api/category/0/create_category', {
      category: form[0].value,
      description: form[1].value,
      account_id: accountState.id
    })
    .then(resp => {
      reRenderCategories()
      document.getElementsByClassName('form__category')[0].value = ''
      document.getElementsByClassName('form__description')[0].value = ""
    })
    .catch(resp => console.log(resp))
  }

  return(
    <form className='category-form' onSubmit={submitForm}>
      <label>Create Your Own Category Here!</label>
      <input className='category-form__category' placeholder='Add a new category...'></input>
      <input className='category-form__description' placeholder='Add a short description...'></input>
      <button>Create New Category</button>
    </form>
  )
}

export {NewCategoryForm}