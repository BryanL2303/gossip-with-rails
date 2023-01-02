import React, {createContext, useState, useEffect} from 'react'

export const CurrentDisplayCommunityContext = createContext([[], function(){}])

export const CurrentDisplayCommunityProvider = props => {
	
	let stateOnRender
	if (sessionStorage.getItem('homePageState') == 'community') {
		stateOnRender = JSON.parse(sessionStorage.getItem('currentDisplayCommunityState'))
	}
	
	const [currentDisplayCommunityState, setCurrentDisplayCommunityState] = useState(stateOnRender)
	
	useEffect(() => {
		sessionStorage.setItem('currentDisplayCommunityState', JSON.stringify(currentDisplayCommunityState))
	}, [currentDisplayCommunityState])

	return(
		<CurrentDisplayCommunityContext.Provider value={[currentDisplayCommunityState, setCurrentDisplayCommunityState]}>
			{props.children}
		</CurrentDisplayCommunityContext.Provider>
	)
}