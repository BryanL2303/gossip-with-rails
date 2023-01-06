import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import {Category} from './Category'
import {AccountStateContext} from '../context/AccountStateContext'

const CategoryBar = ({filterCategory, category_id}) => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [categoriesState, setCategoriesState] = useState([])
  const [categoryCount, setCategoryCount] = useState(0)
  const [categoryLimit, setCategoryLimit] = useState(0)

  useEffect(() => {
    fetchCategories('updated_at')
  }, [])

  useEffect(() => {
    setCategoryLimit(categoriesState.length)
    categoriesState.map((category) => {
      sessionStorage.setItem(`category${category.attributes.id}`, category)
    })
  }, [categoriesState])

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
      setCategoriesState(resp.data.data)
    })
    .catch(resp => console.log(resp))
  }

  function showSortOptions(e) {
    let sortOptions = document.getElementsByClassName('category_sort__options')[0]
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
    <div>
      <br/>
      <label className="category-count">{categoriesState.length} Categories</label>
      <div className= 'categories-container'>
        {category_id != null && <div id={null} className="category">
          <button id={null} className='category__show--button' onClick={filterCategory}>All</button>
        </div>}
        {category_id == null && <div id={null} className="category">
          <label id={null} className='category__name'>All</label>
        </div>}

        {categoriesState.map((category, count) => {
          if (count < categoryCount) {
            if (category.attributes.id == category_id) {
              return(
                <label key={"categoryfilter" + category.id}>{category.attributes.category_name}</label>
              )
            } else {
              return(
                <Category key={"categoryfilter" + category.id} category_id={category.attributes.id} filterCategory={filterCategory}/>
              )
            }
          }
        })}
        {categoryLimit > 0 &&
          <button className='show-categories--button' onClick={showCategories}>Load More Categories</button>}
      </div>
    </div>
  )
  /*
  Add in to allow sorting of categories
      <button className='categories__show-sort--button' onClick={showSortOptions}><img src="/packs/media/packs/pages/homepage/sort-6adf140c7b527d54d87dc57645c571f9.png"/> <label>Sort</label></button>
        <div className='category_sort__options' style={{visibility: 'hidden'}}>
          <button id='updated_at' className="sort-option--button" onClick={sortCategories}>Most Recent</button> 
          <button id='upvote' className="sort-option--button" onClick={sortCategories}>Most Upvoted</button>
          <button id='downvote' className="sort-option--button" onClick={sortCategories}>Most Downvoted</button>
        </div>
  */
}

export {CategoryBar}