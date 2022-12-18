import React, { createContext, useState } from 'react'

export const PinnedCategoriesContext = createContext([[], function(){}])

export const PinnedCategoriesProvider = props => {
	const [pinnedCategories, setPinnedCategories] = useState([])

	return(
		<PinnedCategoriesContext.Provider value={[pinnedCategories, setPinnedCategories]}>
			{props.children}
		</PinnedCategoriesContext.Provider>
	)
}