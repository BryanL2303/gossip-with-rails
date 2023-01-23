import React, { useRef, useState, useEffect, useContext } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import {errorMessage} from '../functions/functions'

/*Button within the CategoryBar
*/
const Category = ({category_id, reRenderPage, filterCategory}) => {
  const [cookies, useCookie] = useCookies(['user'])
  const [category, setCategory] = useState()

  useEffect(() => {
    fetchCategory()
  }, [])

  function fetchCategory() {
    axios.get('/api/category/' + category_id)
    .then( resp => {
      if (resp.data.data == null) {
        reRenderPage()
      }
      else {
        setCategory(resp.data.data.attributes.category_name)
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  return(
    <div id={category_id} className="category">
      <button id={category_id} className='category__show--button' onClick={filterCategory}>
        <label id={category_id} className='category__name'>{category}</label>
      </button>
    </div>
  )
}

export {Category}