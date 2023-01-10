import React, {useState, useEffect, useContext} from 'react'
import Select from 'react-select'
import axios from 'axios'
import {AccountStateContext} from '../context/AccountStateContext'

const TopicEditor = ({topic, communityTag, toggleEditor, fetchTopic}) => {
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [isCategory, setIsCategory] = useState(true)

  useEffect(() => {
    communityTag.map((community) => {
      setIsCategory(false)
    })
    if (isCategory) {
      fetchCategories('updated_at')
    }
  }, [communityTag])

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

  function updateTags(e) {
    setTags(e)
  }

  function editTopic(e) {
    e.preventDefault()
    submitEditTopic(e.target)
  }

  function submitEditTopic(form) {
    axios.post('/api/topic/' + topic.attributes.id + '/edit_topic', {
      topic_name: form[0].value,
      topic_description: form[1].value,
      categories: tags
    })
    .then(resp => {
      toggleEditor()
      fetchTopic(topic.attributes.id)
    })
    .catch(resp => console.log(resp))
  }

  return(
    <form className='editor' onSubmit={editTopic}>
      <input className='editor__field' defaultValue={topic.attributes.topic_name}></input>
      <input className='editor__field' defaultValue={topic.attributes.topic_description}></input>
      {isCategory && <Select
        defaultValue={[categories[0]]}
        isMulti
        name="colors"
        options={categories}
        onChange={updateTags}
        className="topic-form__categories"
      />}
      <button className='save-topic__button'>Save Topic</button>
    </form>
  )
}

export {TopicEditor}