import React, {useState, useEffect, useContext} from 'react'
import Select from 'react-select'
import axios from 'axios'
import {AccountStateContext} from '../context/AccountStateContext'

const CommunityEditor = ({community, categoryTag, toggleEditor, fetchCommunity}) => {
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])

  useEffect(() => {
    fetchCategories('updated_at')
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

  function updateTags(e) {
    setTags(e)
  }

  function editCommunity(e) {
      e.preventDefault()
      submitEditCommunity(e.target)
  }

  function submitEditCommunity(form) {
      axios.post('/api/community/' + community.attributes.id + '/edit_community', {
        community_name: form[0].value,
        community_description: form[1].value,
        categories: tags
      })
      .then(resp => {
        toggleEditor()
        fetchCommunity(community.attributes.id)
      })
      .catch(resp => console.log(resp))
    }

  return(
    <form className='editor' onSubmit={editCommunity}>
      <input className='editor__field' defaultValue={community.attributes.community_name}></input>
      <input className='editor__field' defaultValue={community.attributes.community_description}></input>
      <Select
        defaultValue={[categories[0]]}
        isMulti
        name="colors"
        options={categories}
        onChange={updateTags}
        className="community-form__categories"
      />
      <button className='save-community__button'>Save Community</button>
    </form>
  )
}

export {CommunityEditor}