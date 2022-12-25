import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import {CategoryTopicForm} from './categoryboard/CategoryTopicForm'
import {Topic} from './dashboard/Topic'
import { AccountStateContext } from './context/AccountStateContext'

const Categoryboard = ({category, showTopicboard, showCategoryboard}) => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [topicListState, setTopicListState] = useState([])
  const [categoryName, setCategoryName] = useState(category.attributes.category)
  const [description, setDescription] = useState(category.attributes.description)
  const [topicCount, setTopicCount] = useState(0)
  const [topicLimit, setTopicLimit] = useState(category.relationships.topics.data.length)
  const [active, setActive] = useState()
  const [owner, setOwner] = useState(accountState.id == category.attributes.gossip_account_id)
  const [ownerName, setOwnerName] = useState()

  useEffect(() => {
    checkOwner(category.attributes.gossip_account_id)
    setCategoryName(category.attributes.category)
    setDescription(category.attributes.description)
    setTopicLimit(category.relationships.topics.data.length)
    setActive(category.attributes.active)
    setOwner(accountState.id == category.attributes.gossip_account_id)
    setTopicCount(0)
    setTopicLimit(category.relationships.topics.data.length)
  }, [category])

  useEffect(() => {
    if (topicCount == 0) {
      fetchTopics('updated_at')
    }
  }, [topicLimit])

  useEffect(() => {
    if (topicCount == 0) {
      showTopics()
    }
  }, [topicListState])  

  function checkOwner(gossip_account_id) {
    axios.get('/api/gossip_account/' + gossip_account_id)
    .then(resp => {
      setOwnerName(resp.data.data.attributes.account_name)
    })
    .catch(resp => console.log(resp))
  }

  function fetchTopics(sort_by) {
    axios.post('/api/category/'+ category.id +'/fetch_topics', {
      sort_by: sort_by
    })
    .then( resp => {
      setTopicListState(resp.data.data)
    })
    .catch(resp => console.log(resp))
  }

  function reRenderPage() {
    setTopicCount(topicCount + 1)
    category.relationships.topics.data.length = category.relationships.topics.data.length + 1
    fetchTopics('updated_at')
  }

  function showCategorySettings(e) {
    let categorySettings = document.getElementsByClassName('category__settings')[0]
    if (categorySettings.style['visibility'] == 'hidden') {
      categorySettings.style['visibility'] = 'visible'
    }
    else {
      categorySettings.style['visibility'] = 'hidden'
    }
  }

  function closeCategory() {
    if (confirm("This will prevent anyone else from creating any new topics and will also close all existing topics within this category. Users will still be able to read all existing topics and comments.")) {
      axios.post('/api/category/' + category.id + '/close_category')
      .then(resp => {
        setCategory(resp.data.data)
      })
      .catch(resp => console.log(resp))
    }
  }

  function openCategory() {
    if (confirm("This will allow other users to create new topics and reopen their older topics under this category again.")) {
      axios.post('/api/category/' + category.id + '/open_category')
      .then(resp => {
        setCategory(resp.data.data)
      })
      .catch(resp => console.log(resp))
    }
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
  /*
  Put this under (CLOSED) to enable users to close categories
  {owner == true &&
          <button className='category__show-settings--button' onClick={showCategorySettings}><img src="/packs/media/packs/pages/homepage/topicboard/topic-settings-icon-888be188c27c65a4af51589ffef5291d.jpg"/></button>}
      <div className='category__settings' style={{visibility: 'hidden'}}>
        {active == true && 
          <button className="category__close--button" onClick={closeCategory}>Close Category</button>}
        {active != true && 
          <button className="category__open--button" onClick={openCategory}>Open Category</button>}
      </div>
  */

  return(
    <div className='categoryboard-container'>
      <br/>
      <label className="static__label">{ownerName}</label>
      <br/>
      <h1 className="static__label">{categoryName} {active != true &&
          <label>(CLOSED)</label>}</h1>
      

      <label className="static__label">{description}</label>

      <CategoryTopicForm category_id={category.id} reRenderPage={reRenderPage}/>

      <div className= 'topics-container'>
        <label className="static__label">{category.relationships.topics.data.length} Topic(s)</label>
        <button className='topics__show-sort--button' onClick={showSortOptions}><img src="/packs/media/packs/pages/homepage/sort-6adf140c7b527d54d87dc57645c571f9.png"/> <label>Sort</label></button>
        <div className='sort__options' style={{visibility: 'hidden'}}>
          <button id='updated_at' className="sort-option--button" onClick={sortTopics}>Most Recent</button> 
          <button id='upvote' className="sort-option--button" onClick={sortTopics}>Most Upvoted</button>
          <button id='downvote' className="sort-option--button" onClick={sortTopics}>Most Downvoted</button>
        </div>

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