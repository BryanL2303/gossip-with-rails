import React, {useState, useEffect, useContext} from 'react'
import Select from 'react-select'
import {useCookies} from 'react-cookie'
import axios from 'axios'
import {errorMessage} from '../functions/functions'
import {CategoryDictionaryContext} from '../context/CategoryDictionaryContext'

/*For the user who owns the topic to edit the topic name and description
    and the category tags
*/
const TopicEditor = ({topic, communityTag, toggleEditor, fetchTopic}) => {
  const [cookies, setCookie] = useCookies(['user'])
  const [categories, setCategories] = useContext(CategoryDictionaryContext)
  const [tags, setTags] = useState([])
  const [isCategory, setIsCategory] = useState(true)

  useEffect(() => {
    communityTag.map((community) => {
      setIsCategory(false)
    })
  }, [communityTag])

  function updateTags(e) {
    setTags(e)
  }

  function editTopic(e) {
    e.preventDefault()
    submitEditTopic(e.target)
  }

  function submitEditTopic(form) {
    axios.post('/api/topic/' + topic.data.data.attributes.id + '/edit_topic', {
      token: cookies.Token,
      topic_name: form[0].value,
      topic_description: form[1].value,
      categories: tags
    })
    .then(resp => {
      toggleEditor()
      fetchTopic(topic.data.data.attributes.id)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  return(
    <form className='editor' onSubmit={editTopic}>
      <input className='editor__field' defaultValue={topic.data.data.attributes.topic_name}></input>
      <input className='editor__field' defaultValue={topic.data.data.attributes.topic_description}></input>
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