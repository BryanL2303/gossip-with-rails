import React, { useState, useEffect, useContext } from 'react'
import Popup from 'reactjs-popup';
import Select from 'react-select'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import {errorMessage} from '../functions/functions'
import {CategoryDictionaryContext} from '../context/CategoryDictionaryContext'

/*Form to create a new topic
  Used in topictable as well as the communityboard
*/
const NewTopicForm = ({reRenderTopics, category_id, community_id}) => {
  const [cookies, useCookie] = useCookies(['user'])
  const [community_name, setCommunityName] = useState()
  const [categories, setCategories] = useContext(CategoryDictionaryContext)
  const [categoryTags, setCategoryTags] = useState([{'value': 1}])

  useEffect(() =>{
    if (community_id != null) {
      fetchCommunity()
    }
  }, [])

  function fetchCommunity() {
    axios.get('/api/community/' + community_id, {
      headers: {token: cookies.Token}
    })
    .then(resp => {
      setCommunityName(resp.data.data.data.attributes.community_name)
    })
    .catch(resp => errorMessage(resp.response.statusText))
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
      token: cookies.Token,
      categories: categoryTags,
      community_id: community_id
    })
    .then(resp => {
      reRenderTopics()
      document.getElementsByClassName('topic-form__topic')[0].value = ''
      document.getElementsByClassName('topic-form__description')[0].value = ""
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  return(
    <Popup trigger={<button> Create Your Own Topic Here!</button>} position="right center">
      <form className='topic-form' onSubmit={submitForm}>
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
    </Popup>
  )
}

export {NewTopicForm}