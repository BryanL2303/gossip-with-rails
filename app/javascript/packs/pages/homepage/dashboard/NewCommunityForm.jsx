import React, { useState, useEffect, useContext } from 'react'
import Popup from 'reactjs-popup';
import Select from 'react-select'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import {errorMessage} from '../functions/functions'
import {CategoryDictionaryContext} from '../context/CategoryDictionaryContext'

/*Form to create a new community
  Used in communitytable
*/
const NewCommunityForm = ({reRenderCommunities}) => {
  const [cookies, setCookie] = useCookies(['user'])
  const [categories, setCategories] = useContext(CategoryDictionaryContext)
  const [tags, setTags] = useState([{'value': 1}])

  function submitForm(e) {
    e.preventDefault()
    postCreateCommunity(e.target)
  }

  function updateTags(e) {
    setTags(e)
  }

  function postCreateCommunity(form) {
    axios.post('/api/community/0/create_community', {
      community_name: form[0].value,
      community_description: form[1].value,
      categories: tags,
      gossip_account_id: accountState.id,
      token: cookies.Token
    })
    .then(resp => {
      reRenderCommunities()
      document.getElementsByClassName('community-form__community')[0].value = ''
      document.getElementsByClassName('community-form__description')[0].value = ""
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  return(
    <Popup trigger={<button>Create Your Own Community Here!</button>} position="right center">
      <form className='community-form' onSubmit={submitForm}>
        <input className='community-form__community' placeholder='Add a new community...'></input>
        <br/>
        <input className='community-form__description' placeholder='Add a short description...'></input>
        <label>Related Categories(This community will be classified under these categories):</label>
        <Select
          defaultValue={[categories[0]]}
          isMulti
          name="colors"
          options={categories}
          onChange={updateTags}
          className="community-form__categories"
        />
        <button>Create New Community</button>
      </form>
    </Popup>
  )
}

export {NewCommunityForm}