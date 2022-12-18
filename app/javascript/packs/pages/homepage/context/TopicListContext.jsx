import React, { createContext, useState } from 'react'

export const TopicListContext = createContext([[], function(){}])

export const TopicListProvider = props => {
	const [topics, setTopics] = useState([])

	return(
		<TopicListContext.Provider value={[topics, setTopics]}>
			{props.children}
		</TopicListContext.Provider>
	)
}