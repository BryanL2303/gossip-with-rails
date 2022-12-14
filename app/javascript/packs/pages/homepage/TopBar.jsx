import React, { useState, useEffect, useContext } from 'react'
import { AccountStateContext } from './context/AccountStateContext'
import { HomePageStateContext } from './context/HomePageStateContext'
import {image} from './sidebar-icon.jpg'

const TopBar = () => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [homePageState, setHomePageState] = useContext(HomePageStateContext)
  const [accountName, setAccountName] = useState("loading")

  useEffect(() => {
    if (accountState != null) {
      setAccountName(accountState.name)
    }
  }, [accountState])

  useEffect(() => {
    let userMenu = document.getElementsByClassName('user-menu')[0]
    userMenu.style['visibility'] = 'hidden'
  }, [accountName])

  function logOut () {
    sessionStorage.clear()
    window.location.href = '/'
  }

  const UserMenu = () => {
    return(
      <div className='user-menu'>
        <button className="log-out--button" onClick={logOut}>Log Out</button>
      </div>
    )
  }

  function showUserMenu(e) {
    let userMenu = document.getElementsByClassName('user-menu')[0]
    if (userMenu.style['visibility'] == 'hidden') {
      userMenu.style['visibility'] = 'visible'
    }
    else {
      userMenu.style['visibility'] = 'hidden'
    }
  }
//<button className='sidebar--button' onClick={toggleSideBar}><img src="/packs/media/packs/pages/homepage/sidebar-icon-d04f396ba76b9667ee34744d3127b961.jpg"/></button>
  return(
    <nav id='topbar-container' className='topbar-container'>
      <label>Gossip With Rails</label>
      
      <div className='user-component'>
        <h1 className='account-name__label'>{accountName}</h1>
        <button className='show-menu--button' onClick={showUserMenu}><img src="/packs/media/packs/pages/homepage/user-menu-icon-bc529dc1442054ce8a7db5ccc2846bb7.jpg"/></button>
        <UserMenu/>
      </div>
    </nav>
  )
}

export { TopBar }