import React, { useState, useEffect, useContext } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { errorMessage } from '../functions/functions'

const CommunityButton = ({community_id, showCommunityboard, fetchCommunity}) => {
  const [cookies, setCookie] = useCookies(['user'])
  const [community, setCommunity] = useState()

  useEffect(() => {
    fetchCommunity()
  }, [])

  function fetchCommunity() {
    axios.get('/api/community/' + community_id,{
      headers: {token: cookies.Token}
    })
    .then( resp => {
      if (resp.data.data == null) {
        errorMessage("")
      }
      else {
        setCommunity(resp.data.data.data.attributes.community_name)
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  return(
    <button id={community_id} className='community__show--button' onClick={showCommunityboard}>
      <label id={community_id} className='community__name'>{community}</label>
    </button>
  )
}

export {CommunityButton}