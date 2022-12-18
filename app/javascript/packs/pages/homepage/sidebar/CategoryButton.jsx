import React, { useRef, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AccountStateContext } from '../context/AccountStateContext'

const CategoryButton = ({category_id, showCategoryboard}) => {
  const [category, setCategory] = useState()
  const [accountState, setAccountState] = useContext(AccountStateContext)

  useEffect(() => {
    fetchCategory()
  }, [])

  function fetchCategory() {
    axios.get('/api/category/' + category_id)
    .then( resp => {
      if (resp.data.data == null) {
        console.log("This category was deleted, add function to remove from pinned")
      }
      else {
        setCategory(resp.data.data.attributes.category)
        sessionStorage.setItem(`category${category_id}`, JSON.stringify(resp.data.data.attributes))
      }
    })
    .catch(resp => console.log(resp))
  }

  return(
    <button id={category_id} className='category__show--button' onClick={showCategoryboard}>
      <label id={category_id} className='category__name'>{category}</label>
    </button>
  )
}

export {CategoryButton}