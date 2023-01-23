import React, { createContext, useState } from 'react'

export const PinnedTopicsContext = createContext([[], function(){}])

/*Context to store the topics pinned by the user
	Updates when the user pins/unpins a topic
  Used by homepage/SideBar read only
  Used by homepage/dashboard/Topic read and write
  Used by homepage/Topicboard read and write
*/
export const PinnedTopicsProvider = props => {
	const [pinnedTopics, setPinnedTopics] = useState([])

	return(
		<PinnedTopicsContext.Provider value={[pinnedTopics, setPinnedTopics]}>
			{props.children}
		</PinnedTopicsContext.Provider>
	)
}