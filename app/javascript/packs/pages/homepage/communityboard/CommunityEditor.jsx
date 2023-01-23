import React, {useState, useEffect, useContext} from 'react'
import Select from 'react-select'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import {errorMessage} from '../functions/functions'
import {CategoryDictionaryContext} from '../context/CategoryDictionaryContext'

/*For the user who owns the community to edit the community name and description
    and the category tags
*/
const CommunityEditor = ({community, categoryTag, toggleEditor, fetchCommunity}) => {
  const [cookies, setCookie] = useCookies(['user'])
  const [categories, setCategories] = useContext(CategoryDictionaryContext)
  const [tags, setTags] = useState([])

  function updateTags(e) {
    setTags(e)
  }

  function editCommunity(e) {
      e.preventDefault()
      submitEditCommunity(e.target)
  }

  function submitEditCommunity(form) {
      axios.post('/api/community/' + community.data.data.attributes.id + '/edit_community', {
        token: cookies.Token,
        community_name: form[0].value,
        community_description: form[1].value,
        categories: tags
      })
      .then(resp => {
        toggleEditor()
        fetchCommunity(community.data.data.attributes.id)
      })
      .catch(resp => errorMessage(resp.response.statusText))
    }

  return(
    <form className='editor' onSubmit={editCommunity}>
      <input className='editor__field' defaultValue={community.data.data.attributes.community_name}></input>
      <input className='editor__field' defaultValue={community.data.data.attributes.community_description}></input>
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