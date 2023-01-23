import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import {Category} from './Category'
import {errorMessage} from '../functions/functions'
import {CategoryDictionaryContext} from '../context/CategoryDictionaryContext'

/*The bar which contains the categories which the users
    can use to filter the community and topic tables
*/
const CategoryBar = ({filterCategory, category_id}) => {
  const [categories, setCategories] = useContext(CategoryDictionaryContext)
  const [categoriesState, setCategoriesState] = useState([])
  const [categoryCount, setCategoryCount] = useState(0)
  const [categoryLimit, setCategoryLimit] = useState(0)

  useEffect(() => {
    fetchCategories('updated_at')
  }, [])

  useEffect(() => {
    setCategoryLimit(categoriesState.length)
    let data = []
    categoriesState.map((category) => {
      sessionStorage.setItem(`category${category.attributes.id}`, JSON.stringify(category))
      data.push({value: category.attributes.id, label: category.attributes.category_name})
    })
    setCategories(data)
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
      sessionStorage.setItem('categoriesState', JSON.stringify(resp.data.data))
      setCategoriesState(resp.data.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
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
        {category_id == null &&
          <label id={null} className='current-selected-category'>All</label>}

        {categoriesState.map((category, count) => {
          if (count < categoryCount) {
            if (category.attributes.id == category_id) {
              return(
                <label key={"categoryfilter" + category.id} className='current-selected-category'>{category.attributes.category_name}</label>
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
}

export {CategoryBar}