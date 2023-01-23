import React, { createContext, useState, useEffect } from 'react'

export const CategoryDictionaryContext = createContext([[], function(){}])

/*Context to store the categories for the Select components within the forms
	First set by homepage/dashboard/CategoryBar set once only
  Used by homepage/dashboard/NewCommunityForm read only
  Used by homepage/dashboard/NewTopicForm read only
  Used by homepage/communityboard/CommunityEditor read only
  Used by homepage/topicboard/TopicEditor read only
*/
export const CategoryDictionaryProvider = props => {
	let stateOnRender = []
	if (sessionStorage.getItem('categoryDictionary') != null) {
		stateOnRender = JSON.parse(sessionStorage.getItem('categoryDictionary'))
	}
	
	const [categories, setCategories] = useState(stateOnRender)

	useEffect(() => {
		sessionStorage.setItem('categoriesState', JSON.stringify(categories))
	}, [categories])

	return(
		<CategoryDictionaryContext.Provider value={[categories, setCategories]}>
			{props.children}
		</CategoryDictionaryContext.Provider>
	)
}