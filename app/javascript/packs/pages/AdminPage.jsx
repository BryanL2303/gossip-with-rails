import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import {TopBar} from './homepage/TopBar'
import {SideBar} from './homepage/SideBar'
import {NewCategoryForm} from './adminpage/NewCategoryForm'
import {AccountStateContext} from './homepage/context/AccountStateContext'

const AdminPage = () => {
  //If there is no ongoing session go to login page
  if (sessionStorage.getItem('id') == null) {
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