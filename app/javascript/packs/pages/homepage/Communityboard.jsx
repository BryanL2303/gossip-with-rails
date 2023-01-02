import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import {TopicTable} from './dashboard/TopicTable'
import {AccountStateContext} from './context/AccountStateContext'

const Communityboard = ({community, showTopicboard}) => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [topicListState, setTopicListState] = useState([])
  const [communityName, setCommunityName] = useState(community.attributes.community_name)
  const [description, setDescription] = useState(community.attributes.community_description)
  const [topicCount, setTopicCount] = useState(0)
  const [topicLimit, setTopicLimit] = useState(community.relationships.topics.data.length)
  const [owner, setOwner] = useState(accountState.id == community.attributes.gossip_account_id)
  const [ownerName, setOwnerName] = useState()

  useEffect(() => {
    checkOwner(community.attributes.gossip_account_id)
    setCommunityName(community.attributes.community_name)
    setDescription(community.attributes.community_description)
    setTopicLimit(community.relationships.topics.data.length)
    setOwner(accountState.id == community.attributes.gossip_account_id)
    setTopicCount(0)
    setTopicLimit(community.relationships.topics.data.length)
  }, [community])

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
    axios.post('/api/community/'+ community.id +'/fetch_topics', {
      sort_by: sort_by
    })
    .then( resp => {
      setTopicListState(resp.data.data)
    })
    .catch(resp => console.log(resp))
  }

  function reRenderPage() {
    setTopicCount(topicCount + 1)
    community.relationships.topics.data.length = community.relationships.topics.data.length + 1
    fetchTopics('updated_at')
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
    <div className='communityboard-container'>
      <br/>
      <label className="static__label">{ownerName}</label>
      <br/>
      <h1 className="static__label">{communityName}</h1>
      

      <label className="static__label">{description}</label>

      <TopicTable showTopicboard={showTopicboard} community_id={community.id}/>
    </div>
  )
}

export {Communityboard}