import React from 'react'
import {CategoryBar} from './dashboard/CategoryBar'
import {CommunityTable} from './dashboard/CommunityTable'
import {TopicTable} from './dashboard/TopicTable'

/*Dashboard which is the default display on the HomePage
  Shows the categories on the website for user to filter
  The communities on the website for the user to click on
  The topics on the website for the user to click on
*/
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