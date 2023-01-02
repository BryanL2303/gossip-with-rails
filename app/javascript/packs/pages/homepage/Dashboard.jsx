import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import {CategoryBar} from './dashboard/CategoryBar'
import {CommunityTable} from './dashboard/CommunityTable'
import {TopicTable} from './dashboard/TopicTable'

const Dashboard = ({filterCategory, showCommunityboard, showTopicboard, category_id}) => {
  return(
    <div className='dashboard-container'>
      <CategoryBar filterCategory={filterCategory} category_id={category_id}/>

      <CommunityTable showCommunityboard={showCommunityboard} category_id={category_id}/>

      <TopicTable showTopicboard={showTopicboard} category_id={category_id}/>
    </div>
  )
}

export {Dashboard}