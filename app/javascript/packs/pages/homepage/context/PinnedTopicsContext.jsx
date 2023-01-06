import React, { createContext, useState } from 'react'

export const PinnedTopicsContext = createContext([[], function(){}])

export const PinnedTopicsProvider = props => {
	const [pinnedTopics, setPinnedTopics] = useState([])

	return(
		<PinnedTopicsContext.Provider value={[pinnedTopics, setPinnedTopics]}>
			{props.children}
		</PinnedTopicsContext.Provider>
	)
}