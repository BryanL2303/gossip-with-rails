import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import {CategoryTopicForm} from './categoryboard/CategoryTopicForm'
import {Topic} from './dashboard/Topic'
import { AccountStateContext } from './context/AccountStateContext'

const Categoryboard = ({category, showTopicboard, showCategoryboard}) => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [topicListState, setTopicListState] = useState([])
  const [categoryName, setCategoryName] = useState()
  const [description, setDescription] = useState()
  const [topicCount, setTopicCount] = useState(0)
  const [topicLimit, setTopicLimit] = useState(0)
  const [owner, setOwner] = useState(false)
  const [ownerName, setOwnerName] = useState()

  useEffect(() => {
    checkOwner(category.attributes.gossip_account_id)
    fetchTopics()
    setCategory(category.attributes.category)
    setDescription(category.attributes.description)
    setTopicLimit(category.relationships.topics.data.length)
    setOwner(accountState.id == category.attributes.gossip_account_id)
  }, [category])

  useEffect(() => {
    showTopics()
  }, [topicListState])  

  function checkOwner(gossip_account_id) {
    axios.get('/api/gossip_account/' + gossip_account_id)
    .then(resp => {
      setOwnerName(resp.data.data.attributes.account_name)
    })
    .catch(resp => console.log(resp))
  }

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

  function showTopics() {
    if (topicLimit >= 5) {
      setTopicLimit(topicLimit - 5)
      setTopicCount(topicCount + 5)
    }
    else {
      setTopicCount(topicCount + topicLimit)
      setTopicLimit(0)
    }
  }

  return(
    <div className='categoryboard-container'>
      <br/>
      <label className="static__label">{ownerName}</label>
      <br/>
      <h1 className="static__label">{categoryName}</h1>
      <br/>
      <label className="static__label">{description}</label>

      <CategoryTopicForm category_id={category.id} reRenderTopics={fetchTopics}/>

      <div className= 'topics-container'>
        <label className="static__label">{category.relationships.topics.data.length} Topic(s)</label>
        <br/>
        <br/>
        {topicListState.map((topic, count) => {
          if (count < topicCount) {
            return(
              <Topic key={topic.id} topic_id={topic.id} reRenderPage={reRenderPage} showTopicboard={showTopicboard}/>
            )
          }
        })}
        {topicLimit > 0 &&
          <button className='show-topics--button' onClick={showTopics}>Load More Topics</button>}
      </div>
    </div>
  )
}

export {Categoryboard}