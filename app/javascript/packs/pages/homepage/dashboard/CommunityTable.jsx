import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import {NewCommunityForm} from './NewCommunityForm'
import {Community} from './Community'
import {AccountStateContext} from '../context/AccountStateContext'

const CommunityTable = ({showCommunityboard, category_id}) => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [communitiesState, setCommunitiesState] = useState([])
  const [communityCount, setCommunityCount] = useState(0)
  const [communityLimit, setCommunityLimit] = useState(0)

  useEffect(() => {
    fetchCommunities('updated_at')
  }, [category_id])

  useEffect(() => {
    setCommunityLimit(communitiesState.length)
  }, [communitiesState])

  useEffect(() => {
    if (communityCount == 0) {
      showCommunities()
    }
  }, [communityLimit])

  function fetchCommunities(sort_by) {
    axios.post('/api/community/0/fetch_communities', {
      sort_by: sort_by,
      category_id: category_id
    })
    .then( resp => {
      setCommunitiesState(resp.data.data)
    })
    .catch(resp => console.log(resp))
  }

  function reRenderCommunities() {
    setCommunityCount(0)
    fetchCommunities('updated_at')
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
    fetchCommunities(e.target.id)
  }

  function showCommunities() {
    if (communityLimit >= 5) {
      setCommunityLimit(communityLimit - 5)
      setCommunityCount(communityCount + 5)
    }
    else {
      setCommunityCount(communityCount + communityLimit)
      setCommunityLimit(0)
    }
  }

  return(
    <div className="community-table">
      <h1>COMMUNITIES</h1>

      <NewCommunityForm reRenderCommunities={reRenderCommunities}/>

      <label className="community-count">{communitiesState.length} Community(ies)</label>
      <button className='show-sort--button' onClick={showSortOptions}><img src="/packs/media/packs/pages/homepage/sort-6adf140c7b527d54d87dc57645c571f9.png"/> <label>Sort</label></button>
      <div className='community_sort__options' style={{visibility: 'hidden'}}>
        <button id='updated_at' className="sort-option--button" onClick={sortCommunities}>Most Recent</button> 
        <button id='upvote' className="sort-option--button" onClick={sortCommunities}>Most Upvoted</button>
        <button id='downvote' className="sort-option--button" onClick={sortCommunities}>Most Downvoted</button>
      </div>
      <br/>
  
      <div className= 'communities-container'>
        {communitiesState.map((community, count) => {
          if (count < communityCount) {
            return(
              <Community key={community.id} community_id={community.id} showCommunityboard={showCommunityboard}/>
            )
          }
        })}
        {communityLimit > 0 &&
          <button className='show-communities--button' onClick={showCommunities}>Load More Communities</button>}
      </div>
    </div>
  )
}

export {CommunityTable}