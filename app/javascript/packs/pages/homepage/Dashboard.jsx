import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import {NewCategoryForm} from './dashboard/NewCategoryForm'
import {Category} from './dashboard/Category'
import {NewTopicForm} from './dashboard/NewTopicForm'
import {Topic} from './dashboard/Topic'
import { AccountStateContext } from './context/AccountStateContext'
import { TopicListContext } from './context/TopicListContext'

const Dashboard = ({showTopicboard, showCategoryboard}) => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [topicListState, setTopicListState] = useContext(TopicListContext)
  const [categoryListState, setCategoryListState] = useState([])

  useEffect(() => {
    fetchCategories()
  }, [])

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

  return(
    <div className='dashboard-container'>
      <NewCategoryForm reRenderCategories={fetchCategories}/>

      <div className= 'categories-container'>
        {categoryListState.map((category)=> {
          return(
            <Category key={category.id} category_id={category.id} reRenderPage={reRenderPage} showCategoryboard={showCategoryboard}/>
          )
        })}
      </div>
    </div>
  )
}

export {Dashboard}