import React from 'react'
import { useCookies } from 'react-cookie'
import { TopBar } from './homepage/TopBar'
import { SideBar } from './homepage/SideBar'
import { NewCategoryForm } from './adminpage/NewCategoryForm'

/*Only accessable by the Administrator
  Currently only allows the Administrator to create categories

  Functions can be added here to allow Administrator to delete categories
    or access information from the database
*/
const AdminPage = () => {
  const [cookies, setCookie] = useCookies(['user'])

  //If the user is not the Administrator go to login page
  if (cookies.Name != "Administrator") {
    window.location.href = '/'
  }

  //Renders the dashboard
  function showDashboard(e) {
    window.location.href = '/home'
  }

  return(
    <div className='adminpage-container'>
      <TopBar/>
      <SideBar showDashboard={showDashboard}/>
      <NewCategoryForm/>
    </div>
  )
}

export {AdminPage}