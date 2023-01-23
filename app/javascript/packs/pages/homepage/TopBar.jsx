import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie';

/*Topbar which is visible from the homepage at all times
  Allows the user to log out
  Other functions for the user to control the account should be placed here
*/
const TopBar = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user'])

  //On render hide the user menu
  useEffect(() => {
    if (cookies.Name != null) {
      let userMenu = document.getElementsByClassName('user-menu')[0]
      userMenu.style['visibility'] = 'hidden'
    }
  }, [cookies.Name])

  //Logout the user by removing the token issued to the user
  function logOut () {
    removeCookie('Name',{path:'/'});
    removeCookie('Token',{path:'/'});
    window.location.href = '/'
  }

  //Lets the user access the user menu
  function showUserMenu(e) {
    let userMenu = document.getElementsByClassName('user-menu')[0]
    if (userMenu.style['visibility'] == 'hidden') {
      userMenu.style['visibility'] = 'visible'
    }
    else {
      userMenu.style['visibility'] = 'hidden'
    }
  }

  //The functions within the usermenu
  const UserMenu = () => {
    return(
      <div className='user-menu'>
        <button className="log-out--button" onClick={logOut}>Log Out</button>
      </div>
    )
  }

  return(
    <nav id='topbar-container' className='topbar-container'>
      <label>Gossip With Rails</label>
      
      <div className='user-component'>
        <h1 className='account-name__label'>{cookies.Name}</h1>
        <button className='show-menu--button' onClick={showUserMenu}><img src="/packs/media/packs/pages/homepage/user-menu-icon-bc529dc1442054ce8a7db5ccc2846bb7.jpg"/></button>
        <UserMenu/>
      </div>
    </nav>
  )
}

export { TopBar }