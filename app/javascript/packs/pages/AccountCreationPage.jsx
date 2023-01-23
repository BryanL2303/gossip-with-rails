import React from 'react'
import { useCookies } from 'react-cookie';
import axios from 'axios'
import { errorMessage } from './homepage/functions/functions'

/*Accessible from the LogInPage and users can create accounts here
  Once users are logged in they will be brought to the HomePage
*/
const AccountCreationPage = () => {
  const [cookies, setCookie] = useCookies(['user'])

  //If there is an ongoing session go to home page
  if (cookies.Token != null) {
    window.location.href = '/home'
  }

  //Sends the information from the form to the backend to try and create an account
  //If the username is not unique returns an alert back to the user
  function submitForm(e) {
    e.preventDefault()
    axios.post('/api/gossip_account/0/create_account', {
      name: e.target[0].value,
      password: e.target[1].value,
    })
    .then(resp => {
      if (resp.data != false) {
        setCookie('Name', resp.data.name, { path: '/' });
        setCookie('Token', resp.data.token, { path: '/' });
        window.location.href = '/home'        
      }
      else{
        alert("Username has been taken, please try another name.")
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  return(
    <div className='create-account-page'>
      <form className='create-account-form' onSubmit={ submitForm }>
        <label>Gossip With Rails</label>
        <input className='create-account-form__name' placeholder='username'></input>
        <input className='create-account-form__password' placeholder='password'></input>
        <button>Create Account</button>
      </form>
      <a href='/'>Already have an account? Click here to log in</a>
    </div>
  )
}

export { AccountCreationPage }