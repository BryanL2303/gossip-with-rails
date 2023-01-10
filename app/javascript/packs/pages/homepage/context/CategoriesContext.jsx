import React, { createContext, useState } from 'react'

export const CategoriesContext = createContext([[], function(){}])

export const CategoriesProvider = props => {
	let stateOnRender = []
	if (sessionStorage.getItem('categoriesState') != null) {
		stateOnRender = JSON.parse(sessionStorage.getItem('categoriesState'))
	}
	
	const [categories, setCategories] = useState(stateOnRender)

	useEffect(() => {
		sessionStorage.setItem('categoriesState', JSON.stringify(categoriesState))
	}, [categoriesState])

	return(
		<CategoriesContext.Provider value={[categories, setCategories]}>
			{props.children}
		</CategoriesContext.Provider>
	)
}