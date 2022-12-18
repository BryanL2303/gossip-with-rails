import React, { createContext, useState, useEffect } from 'react'

export const CurrentDisplayCategoryContext = createContext([[], function(){}])

export const CurrentDisplayCategoryProvider = props => {
	let stateOnRender
	if (sessionStorage.getItem('homePageState') == 'category') {
		stateOnRender = JSON.parse(sessionStorage.getItem('currentDisplayCategoryState'))
	}
	const [currentDisplayCategoryState, setCurrentDisplayCategoryState] = useState(stateOnRender)

	useEffect(() => {
		sessionStorage.setItem('currentDisplayCategoryState', JSON.stringify(currentDisplayCategoryState))
	}, [currentDisplayCategoryState])

	return(
		<CurrentDisplayCategoryContext.Provider value={[currentDisplayCategoryState, setCurrentDisplayCategoryState]}>
			{props.children}
		</CurrentDisplayCategoryContext.Provider>
	)
}