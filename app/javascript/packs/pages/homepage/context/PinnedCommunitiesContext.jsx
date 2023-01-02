import React, { createContext, useState } from 'react'

export const PinnedCommunitiesContext = createContext([[], function(){}])

export const PinnedCommunitiesProvider = props => {
	const [pinnedCommunities, setPinnedCommunities] = useState([])

	return(
		<PinnedCommunitiesContext.Provider value={[pinnedCommunities, setPinnedCommunities]}>
			{props.children}
		</PinnedCommunitiesContext.Provider>
	)
}