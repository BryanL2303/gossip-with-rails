import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import {NewCommunityForm} from './NewCommunityForm'
import {Community} from './Community'
import {AccountStateContext} from '../context/AccountStateContext'

const CommunityTable = ({showCommunityboard, category_id}) => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [communitiesState, setCommunitiesState] = useState([])
  const [sortBy, setSortBy] = useState('updated_at')
  const [communityCount, setCommunityCount] = useState(0)
  const [offset, setOffset] = useState(0)
  const [communityLimit, setCommunityLimit] = useState(0)

  useEffect(() => {
    setCommunityCount(0)
    setCommunitiesState([])
    checkCommunityLimit()
  }, [category_id])

  useEffect(() => {
    if (communityCount != 0) {
      fetchCommunities()
    }
  }, [communityCount])

  useEffect(() => {
    if (communityCount == 0) {
      showCommunities()
    }
  }, [communityLimit])

  function checkCommunityLimit() {
    axios.post('/api/community/0/check_community_limit', {
      category_id: category_id
    })
    .then( resp => {
      setCommunityLimit(resp.data)
    })
    .catch(resp => console.log(resp))
  }

  function fetchCommunities() {
    axios.post('/api/community/0/fetch_communities', {
      sort_by: sortBy,
      category_id: category_id,
      offset: offset,
      count: (communityCount - offset)
    })
    .then( resp => {
      let data = communitiesState.slice()
      resp.data.data.map((community) => {
        data.push(community)
      })
      setCommunitiesState(data)
    })
    .catch(resp => console.log(resp))
  }

  function reRenderCommunities() {
    setCommunityCount(0)
    setCommunitiesState([])
    checkCommunityLimit()
  }

  function showSortOptions(e) {
    let sortOptions = document.getElementsByClassName('community_sort__options')[0]
    if (sortOptions.style['visibility'] == 'hidden') {
      sortOptions.style['visibility'] = 'visible'
    }
    else {
      sortOptions.style['visibility'] = 'hidden'
    }
  }

  function sortCommunities(e) {
    setSortBy(e.target.id)
    setCommunitiesState([])
    setCommunityCount(0)
  }

  function showCommunities() {
    setOffset(communityCount)
    if ((communityLimit - communityCount) >= 5) {
      setCommunityCount(communityCount + 5)
    }
    else {
      setCommunityCount(communityLimit)
    }
  }

  return(
    <div className="community-table">
      <h1>COMMUNITIES</h1>

      <NewCommunityForm reRenderCommunities={reRenderCommunities}/>
      <br/>
      <label className="community-count">{communityLimit} Community(ies)</label>
      <button className='show-sort--button' onClick={showSortOptions}><img src="/packs/media/packs/pages/homepage/sort-6adf140c7b527d54d87dc57645c571f9.png"/> <label>Sort</label></button>
      <div className='community_sort__options' style={{visibility: 'hidden'}}>
        <button id='updated_at' className="sort-option--button" onClick={sortCommunities}>Most Recent</button> 
        <button id='upvote' className="sort-option--button" onClick={sortCommunities}>Most Upvoted</button>
        <button id='downvote' className="sort-option--button" onClick={sortCommunities}>Most Downvoted</button>
      </div>
      <br/>
  
      <div className= 'communities-container'>
        {communitiesState.map((community) => {
          return(
            <Community key={community.id} community_id={community.id} showCommunityboard={showCommunityboard}/>
          )
        })}
        {communityLimit != communityCount &&
          <button className='show-communities--button' onClick={showCommunities}>Load More Communities</button>}
      </div>
    </div>
  )
}

export {CommunityTable}