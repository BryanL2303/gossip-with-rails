import React, { useState,useEffect, useContext } from 'react'
import {useCookies} from 'react-cookie'
import axios from 'axios'
import {errorMessage} from '../functions/functions'

/*Form to create a reply to a comment
*/
const ReplyForm = ({comment_id, fetchComment}) => {
	const [cookies, setCookie] = useCookies(['user'])
	const [displayForm, setDisplayForm] = useState(false)

	function showForm(e) {
		setDisplayForm(true)
	}

	function hideForm(e) {
		if ((e.relatedTarget == null || !("form" in e.relatedTarget)) 
			&& e.target.innerHTML != "Add New Task") {
		  setDisplayForm(false)  
		}
	}

	function submitForm(e) {
	  e.preventDefault()
	  if (e.target[0].value != "") {
	  	postCreateReply(e.target)
	  }
	  else {
	  	alert("You cannot leave an empty reply")
	  }
	}

	function postCreateReply(form){
		axios.post('/api/reply/0/create_reply', {
	    	reply: form[0].value,
	    	comment_id: comment_id,
	    	token: cookies.Token
	  	})
	  	.then(resp => {
	    	fetchComment()
	    	document.getElementsByClassName('reply-form__reply')[0].focus()
	    	document.getElementsByClassName('reply-form__reply')[0].value = ''
	  	})
	  	.catch(resp => errorMessage(resp.response.statusText))
	}

	if (displayForm == true) {
		return(
	 	 	<form className='reply-form' onSubmit={submitForm} onBlur={hideForm}>
			  <input className='reply-form__reply' placeholder='Reply to the comment here'></input>
		  	<button>Reply</button>
			</form>
		)
  } else {
    return(
      <div onClick={ showForm }>
         Click to add a reply
      </div>
    )
  }
}

export {ReplyForm}