import React, { useState,useEffect, useContext } from 'react'
import axios from 'axios'
import {AccountStateContext} from '../context/AccountStateContext'

const CommentForm = ({topic_id, fetchComments}) => {
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
	  	postCreateComment(e.target)
	  }
	  else {
	  	alert("You cannot leave an empty comment")
	  }
	}

	function postCreateComment(form){
		axios.post('/api/comment/' + accountState.id + '/create_comment', {
	    	comment: form[0].value,
	    	topic_id: topic_id,
	    	account_id: accountState.id
	  	})
	  	.then(resp => {
	    	fetchComments()
	    	document.getElementsByClassName('form__comment')[0].focus()
	    	document.getElementsByClassName('form__comment')[0].value = ''
	  	})
	  	.catch(resp => console.log(resp))
	}

	return(
	  	<form className='form' onSubmit={ submitForm }>
		  	<input className='form__comment' placeholder='Leave comment here'></input>
		  	<button>Comment</button>
		</form>
	)
}

export {CommentForm}