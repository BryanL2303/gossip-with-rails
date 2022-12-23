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
    fetchCategories('updated_at')
  }, [])

  useEffect(() => {
    setCategoryLimit(categoryListState.length)
  }, [categoryListState])

  useEffect(() => {
    if (categoryCount == 0) {
      showCategories()
    }
  }, [categoryLimit])

  function fetchCategories(sort_by) {
    axios.post('/api/category/0/fetch_categories', {
      sort_by: sort_by
    })
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

  function showSortOptions(e) {
    let sortOptions = document.getElementsByClassName('sort__options')[0]
    if (sortOptions.style['visibility'] == 'hidden') {
      sortOptions.style['visibility'] = 'visible'
    }
    else {
      sortOptions.style['visibility'] = 'hidden'
    }
  }

  function sortCategories(e) {
    fetchCategories(e.target.id)
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
        <button className='categories__show-sort--button' onClick={showSortOptions}><img src="/packs/media/packs/pages/homepage/sort-6adf140c7b527d54d87dc57645c571f9.png"/> <label>Sort</label></button>
        <div className='sort__options' style={{visibility: 'hidden'}}>
          <button id='updated_at' className="sort-option--button" onClick={sortCategories}>Most Recent</button> 
          <button id='upvote' className="sort-option--button" onClick={sortCategories}>Most Upvoted</button>
          <button id='downvote' className="sort-option--button" onClick={sortCategories}>Most Downvoted</button>
        </div>

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