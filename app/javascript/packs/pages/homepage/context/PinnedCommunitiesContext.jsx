import React, { createContext, useState } from 'react'

export const PinnedCommunitiesContext = createContext([[], function(){}])

/*Context to store the communities pinned by the user
	Updates when the user pins/unpins a community
  Used by homepage/SideBar read only
  Used by homepage/dashboard/Community read and write
  Used by homepage/Communityboard read and write
*/
export const PinnedCommunitiesProvider = props => {
	const [pinnedCommunities, setPinnedCommunities] = useState([])

	return(
		<PinnedCommunitiesContext.Provider value={[pinnedCommunities, setPinnedCommunities]}>
			{props.children}
		</PinnedCommunitiesContext.Provider>
	)
}