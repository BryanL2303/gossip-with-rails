import React, { createContext, useState, useEffect } from 'react'

export const CurrentDisplayTopicContext = createContext([[], function(){}])

export const CurrentDisplayTopicProvider = props => {
	let stateOnRender
	if (sessionStorage.getItem('homePageState') == 'topic') {
		stateOnRender = JSON.parse(sessionStorage.getItem('currentDisplayTopicState'))
	}
	const [currentDisplayTopicState, setCurrentDisplayTopicState] = useState(stateOnRender)

	useEffect(() => {
		sessionStorage.setItem('currentDisplayTopicState', JSON.stringify(currentDisplayTopicState))
	}, [currentDisplayTopicState])

	return(
		<CurrentDisplayTopicContext.Provider value={[currentDisplayTopicState, setCurrentDisplayTopicState]}>
			{props.children}
		</CurrentDisplayTopicContext.Provider>
	)
}