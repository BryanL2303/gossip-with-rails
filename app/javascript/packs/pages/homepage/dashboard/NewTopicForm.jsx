import React, { useState, useEffect, useContext } from 'react'
import Select from 'react-select'
import axios from 'axios'
import { AccountStateContext } from '../context/AccountStateContext'

const NewTopicForm = ({reRenderTopics, category_id, community_id}) => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [community_name, setCommunityName] = useState()
  const [categories, setCategories] = useState([])
  const [categoryTags, setCategoryTags] = useState([])

  useEffect(() =>{
    fetchCategories('updated_at')
    if (community_id != null) {
      fetchCommunity()
    }
  }, [])

  function fetchCategories(sort_by) {
    axios.post('/api/category/0/fetch_categories', {
      sort_by: sort_by
    })
    .then(resp => {
      let data = []
      resp.data.data.map((category) => {
        data.push({value: category.attributes.id, label: category.attributes.category_name})
      })
      setCategories(data)
    })
    .catch(resp => console.log(resp))
  }

  function fetchCommunity() {
    axios.get('/api/community/' + community_id)
    .then(resp => {
      setCommunityName(resp.data.data.attributes.community_name)
    })
    .catch(resp => console.log(resp))
  }

  function submitForm(e) {
    e.preventDefault()
    postCreateTopic(e.target)
  }

  function updateCategoryTags(e) {
    setCategoryTags(e)
  }

  function postCreateTopic(form) {
    axios.post('/api/topic/0/create_topic', {
      topic_name: form[0].value,
      topic_description: form[1].value,
      account_id: accountState.id,
      categories: categoryTags,
      communities: community_id
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
      <br/>
      <input className='topic-form__topic' placeholder='topic_name'></input>
      <br/>
      <input className='topic-form__description' placeholder='topic_description'></input>
      <br/>
      {community_id == null && <label>Related Categories(This topic will be classified under these categories):</label>}
      {community_id == null && <Select
        defaultValue={[categories[0]]}
        isMulti
        name="colors"
        options={categories}
        onChange={updateCategoryTags}
        className="topic-form__categories"
      />}
      {community_id != null && <label>Community: {community_name}</label>}
      {community_id != null && <br/>}
      <button>Create New Topic</button>
    </form>
  )
}

export {NewTopicForm}