import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import {NewTopicForm} from './NewTopicForm'
import {Topic} from './Topic'
import {AccountStateContext} from '../context/AccountStateContext'

const TopicTable = ({showTopicboard, category_id, community_id}) => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [topicsState, setTopicsState] = useState([])
  const [sortBy, setSortBy] = useState('updated_at')
  const [topicCount, setTopicCount] = useState(0)
  const [offset, setOffset] = useState(0)
  const [topicLimit, setTopicLimit] = useState(0)

  useEffect(() => {
    setTopicCount(0)
    setTopicsState([])
    checkTopicLimit()
  }, [category_id])

  useEffect(() => {
    setTopicCount(0)
    setTopicsState([])
    checkTopicLimit()
  }, [community_id])

  useEffect(() => {
    if (topicCount != 0) {
      fetchTopics()
    }
  }, [topicCount])

  useEffect(() => {
    if (topicCount == 0) {
      showTopics()
    }
  }, [topicLimit])

  function checkTopicLimit() {
    axios.post('/api/topic/0/check_topic_limit', {
      category_id: category_id,
      community_id: community_id
    })
    .then( resp => {
      setTopicLimit(resp.data)
    })
    .catch(resp => console.log(resp))
  }

  function fetchTopics() {
    axios.post('/api/topic/0/fetch_topics', {
      sort_by: sortBy,
      category_id: category_id,
      community_id: community_id,
      offset: offset,
      count: (topicCount - offset)
    })
    .then( resp => {
      let data = topicsState.slice()
      resp.data.data.map((topic) => {
        data.push(topic)
      })
      setTopicsState(data)
    })
    .catch(resp => console.log(resp))
  }

  function reRenderTopics() {
    setTopicCount(0)
    setTopicsState([])
    checkTopicLimit()
  }

  function showSortOptions(e) {
    let sortOptions = document.getElementsByClassName('topic_sort__options')[0]
    if (sortOptions.style['visibility'] == 'hidden') {
      sortOptions.style['visibility'] = 'visible'
    }
    else {
      sortOptions.style['visibility'] = 'hidden'
    }
  }

  function sortTopics(e) {
    setSortBy(e.target.id)
    setTopicsState([])
    setTopicCount(0)
  }

  function showTopics() {
    setOffset(topicCount)
    if ((topicLimit - topicCount) >= 5) {
      setTopicCount(topicCount + 5)
    }
    else {
      setTopicCount(topicLimit)
    }
  }

  return(
    <div className='topic-table'>
      <h1>TOPICS</h1>

      <NewTopicForm reRenderTopics={reRenderTopics} category_id={category_id} community_id={community_id}/>
      <br/>
      <label className="topic-count">{topicLimit} Topic(s)</label>
      <button className='show-sort--button' onClick={showSortOptions}><img src="/packs/media/packs/pages/homepage/sort-6adf140c7b527d54d87dc57645c571f9.png"/> <label>Sort</label></button>
      <div className='topic_sort__options' style={{visibility: 'hidden'}}>
        <button id='updated_at' className="sort-option--button" onClick={sortTopics}>Most Recent</button> 
        <button id='upvote' className="sort-option--button" onClick={sortTopics}>Most Upvoted</button>
        <button id='downvote' className="sort-option--button" onClick={sortTopics}>Most Downvoted</button>
      </div>
      <br/>

      <div className= 'topics-container'>
        {topicsState.map((topic) => {
          return(
            <Topic key={topic.id} topic={topic} showTopicboard={showTopicboard}/>
          )
        })}
        {topicLimit != topicCount &&
          <button className='show-topics--button' onClick={showTopics}>Load More Topics</button>}
      </div>
    </div>
  )
}

export {TopicTable}