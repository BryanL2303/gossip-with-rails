import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import {CategoryTopicForm} from './categoryboard/CategoryTopicForm'
import {Topic} from './dashboard/Topic'
import { AccountStateContext } from './context/AccountStateContext'

const Categoryboard = ({category, showTopicboard, showCategoryboard}) => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [topicListState, setTopicListState] = useState([])

  useEffect(() => {
    fetchTopics()
  }, [category])

  function fetchTopics() {
    axios.get('/api/category/'+ category.id +'/fetch_topics')
    .then( resp => {
      setTopicListState(resp.data.data)
    })
    .catch(resp => console.log(resp))
  }

  function reRenderPage() {
    fetchTopics()
  }

  return(
    <div className='categoryboard-container'>
      <CategoryTopicForm category_id={category.id} reRenderTopics={fetchTopics}/>

      <div className= 'topics-container'>
        {topicListState.map((topic)=> {
          return(
            <Topic key={topic.id} topic_id={topic.id} reRenderPage={reRenderPage} showTopicboard={showTopicboard}/>
          )
        })}
      </div>
    </div>
  )
}

export {Categoryboard}