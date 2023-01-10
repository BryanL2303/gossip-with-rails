import React, { useState, useEffect, useContext } from 'react'
import Popup from 'reactjs-popup';
import Select from 'react-select'
import axios from 'axios'
import { AccountStateContext } from '../context/AccountStateContext'

const NewCommunityForm = ({reRenderCommunities}) => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])

  useEffect(() =>{
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
      gossip_account_id: accountState.id
    })
    .then(resp => {
      reRenderCommunities()
      document.getElementsByClassName('community-form__community')[0].value = ''
      document.getElementsByClassName('community-form__description')[0].value = ""
    })
    .catch(resp => console.log(resp))
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