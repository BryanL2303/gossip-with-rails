import React, { useState,useEffect, useContext } from 'react'
import axios from 'axios'
import {AccountStateContext} from '../context/AccountStateContext'

const ReplyForm = ({comment_id, fetchComment}) => {
	const [displayForm, setDisplayForm] = useState(false)
	const [accountState, setAccountState] = useContext(AccountStateContext)

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
		axios.post('/api/reply/' + accountState.id + '/create_reply', {
	    	reply: form[0].value,
	    	comment_id: comment_id,
	    	account_id: accountState.id
	  	})
	  	.then(resp => {
	    	fetchComment()
	    	document.getElementsByClassName('reply-form__reply')[0].focus()
	    	document.getElementsByClassName('reply-form__reply')[0].value = ''
	  	})
	  	.catch(resp => console.log(resp))
	}

	

	if (displayForm == true) {
		return(
	 	 	<form className='reply-form' onSubmit={submitForm} onBlur={hideForm}>
			  	<input className='reply-form__reply' placeholder='Reply to the comment here'></input>
		  		<button>Reply</button>
			</form>
		)
  	}
  	else {
    	return(
      		<div onClick={ showForm }>
          		Click to add a reply
      		</div>
    	)
  	}
}

export {ReplyForm}