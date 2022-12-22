import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import {NewCategoryForm} from './dashboard/NewCategoryForm'
import {Category} from './dashboard/Category'
import { AccountStateContext } from './context/AccountStateContext'

const Dashboard = ({showTopicboard, showCategoryboard}) => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [categoryListState, setCategoryListState] = useState([])
  const [categoryCount, setCategoryCount] = useState(0)
  const [categoryLimit, setCategoryLimit] = useState(categoryListState.length)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    setCategoryLimit(categoryListState.length)
  }, [categoryListState])

  useEffect(() => {
    if (categoryCount == 0) {
      showCategories()
    }
  }, [categoryLimit])

  function fetchCategories() {
    axios.get('/api/category/0/fetch_categories')
    .then( resp => {
      setCategoryListState(resp.data.data)
    })
    .catch(resp => console.log(resp))
  }

  //In the event that something is wrong with the page
  //For example when categories gets deleted and the user cannot load the page
  function reRenderPage() {
    fetchCategories()
  }

  function showCategories() {
    if (categoryLimit >= 5) {
      setCategoryLimit(categoryLimit - 5)
      setCategoryCount(categoryCount + 5)
    }
    else {
      setCategoryCount(categoryCount + categoryLimit)
      setCategoryLimit(0)
    }
  }

  return(
    <div className='dashboard-container'>
      <NewCategoryForm reRenderCategories={fetchCategories}/>

      <div className= 'categories-container'>
        <label className="category-count">{categoryListState.length} Category(ies)</label>
        <br/>
        <br/>
        {categoryListState.map((category, count) => {
          if (count < categoryCount) {
            return(
              <Category key={category.id} category_id={category.id} reRenderPage={reRenderPage} showCategoryboard={showCategoryboard}/>
            )
          }
        })}
        {categoryLimit > 0 &&
          <button className='show-categories--button' onClick={showCategories}>Load More Categories</button>}
      </div>
    </div>
  )
}

export {Dashboard}