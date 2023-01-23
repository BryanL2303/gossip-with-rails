import React from 'react'
import { useCookies } from 'react-cookie';
import axios from 'axios'
import { errorMessage } from './homepage/functions/functions'

//Log in page, the default page displayed to all users who are not logged in
//Users can log in or access the AccountCreationPage
const LogInPage = () => {
  const [cookies, setCookie] = useCookies(['user'])

  //If there is an ongoing session go to home page
  if (cookies.Token != null) {
    window.location.href = '/home'
  }

  //Handle submit form event to authenticate account with backend
  function submitForm(e) {
    e.preventDefault()
    axios.post('/api/gossip_account/0/authenticate_account', {
      name: e.target[0].value,
      password: e.target[1].value,
    })
    .then(resp => {
      if (resp.data != false) {
        //If account is authenticated save JWT in cookies
        setCookie('Name', resp.data.name, { path: '/' });
        setCookie('Token', resp.data.token, { path: '/' });
        window.location.href = '/home'
      }
      else {
        alert("Username or password is wrong, please double check input.")
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  return(
    <div className='log-in-page'>
      <form className='log-in-form' onSubmit={ submitForm }>
        <label>Gossip With Rails</label>
        <input className='log-in-form__name' placeholder='username'></input>
        <input className='log-in-form__password' type='password' placeholder='password'></input>
        <button>Log In</button>
      </form>
      <a href='/create_account'>Don't have an account? Click here to create account</a>
    </div>
  )
}

export { LogInPage }