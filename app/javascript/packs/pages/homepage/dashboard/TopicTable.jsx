import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import {NewTopicForm} from './NewTopicForm'
import {Topic} from './Topic'
import {AccountStateContext} from '../context/AccountStateContext'

const TopicTable = ({showTopicboard, category_id, community_id}) => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [topicsState, setTopicsState] = useState([])
  const [topicCount, setTopicCount] = useState(0)
  const [topicLimit, setTopicLimit] = useState(0)

  useEffect(() => {
    fetchTopics('updated_at')
  }, [category_id])

  useEffect(() => {
    fetchTopics('updated_at')
  }, [community_id])

  useEffect(() => {
    setTopicLimit(topicsState.length)
  }, [topicsState])

  useEffect(() => {
    if (topicCount == 0) {
      showTopics()
    }
  }, [topicLimit])

  function fetchTopics(sort_by) {
    axios.post('/api/topic/0/fetch_topics', {
      sort_by: sort_by,
      category_id: category_id,
      community_id: community_id
    })
    .then( resp => {
      setTopicsState(resp.data.data)
    })
    .catch(resp => console.log(resp))
  }

  function reRenderTopics() {
    setTopicCount(0)
    fetchTopics('updated_at')
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
    fetchTopics(e.target.id)
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
    <div className='topic-table'>
      <h1>TOPICS</h1>

      <NewTopicForm reRenderTopics={reRenderTopics} category_id={category_id} community_id={community_id}/>

      <label className="topic-count">{topicsState.length} Topic(s)</label>
      <button className='show-sort--button' onClick={showSortOptions}><img src="/packs/media/packs/pages/homepage/sort-6adf140c7b527d54d87dc57645c571f9.png"/> <label>Sort</label></button>
      <div className='topic_sort__options' style={{visibility: 'hidden'}}>
        <button id='updated_at' className="sort-option--button" onClick={sortTopics}>Most Recent</button> 
        <button id='upvote' className="sort-option--button" onClick={sortTopics}>Most Upvoted</button>
        <button id='downvote' className="sort-option--button" onClick={sortTopics}>Most Downvoted</button>
      </div>
      <br/>

      <div className= 'topics-container'>
        {topicsState.map((topic, count) => {
          if (count < topicCount) {
            return(
              <Topic key={topic.id} topic_id={topic.id} showTopicboard={showTopicboard}/>
            )
          }
        })}
        {topicLimit > 0 &&
          <button className='show-topics--button' onClick={showTopics}>Load More Topics</button>}
      </div>
    </div>
  )
}

export {TopicTable}