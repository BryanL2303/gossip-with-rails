import React, { useRef, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import {AccountStateContext} from '../context/AccountStateContext'

const CommunityButton = ({community_id, showCommunityboard, fetchCommunity}) => {
  const [community, setCommunity] = useState()
  const [accountState, setAccountState] = useContext(AccountStateContext)

  useEffect(() => {
    fetchCommunity()
  }, [])

  function fetchCommunity() {
    axios.get('/api/community/' + community_id)
    .then( resp => {
      if (resp.data.data == null) {
        console.log("This community was deleted, add function to remove from pinned")
      }
      else {
        setCommunity(resp.data.data.attributes.community_name)
      }
    })
    .catch(resp => console.log(resp))
  }

  return(
    <button id={community_id} className='community__show--button' onClick={showCommunityboard}>
      <label id={community_id} className='community__name'>{community}</label>
    </button>
  )
}

export {CommunityButton}