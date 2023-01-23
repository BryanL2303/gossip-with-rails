import React from 'react'
import axios from 'axios'

/*Form for Administrator to create new categories on the Admin page
*/
const NewCategoryForm = () => {
  function submitForm(e) {
    e.preventDefault()
    postCreateCategory(e.target)
  }

  function postCreateCategory(form) {
    axios.post('/api/category/0/create_category', {
      category_name: form[0].value,
      category_description: form[1].value
    })
    .then(resp => {
      document.getElementsByClassName('category-form__category')[0].value = ''
    })
    .catch(resp => console.log(resp))
  }

  return(
    <form className='category-form' onSubmit={submitForm}>
      <label>Create New Category</label>
      <br/>
      <input className='category-form__category' placeholder='Add a new category...'></input>
      <input className='category-form__description' placeholder='Add a short description...'></input>
      <button>Create New Category</button>
    </form>
  )
}

export {NewCategoryForm}