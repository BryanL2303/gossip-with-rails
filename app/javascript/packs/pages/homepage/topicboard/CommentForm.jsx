import React, { useState,useEffect, useContext } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import {errorMessage} from '../functions/functions'

/*Form to create a comment in a topic
*/
const CommentForm = ({topic_id, reRenderComments}) => {
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
	  	postCreateComment(e.target)
	  }
	  else {
	  	alert("You cannot leave an empty comment")
	  }
	}

	function postCreateComment(form){
		axios.post('/api/comment/0/create_comment', {
	    	comment: form[0].value,
	    	topic_id: topic_id,
	    	token: cookies.Token
	  	})
	  	.then(resp => {
	    	reRenderComments()
	    	document.getElementsByClassName('form__comment')[0].focus()
	    	document.getElementsByClassName('form__comment')[0].value = ''
	  	})
	  	.catch(resp => errorMessage(resp.response.statusText))
	}

	return(
	  	<form className='form' onSubmit={ submitForm }>
		  	<input className='form__comment' placeholder='Leave comment here'></input>
		  	<button>Comment</button>
		</form>
	)
}

export {CommentForm}