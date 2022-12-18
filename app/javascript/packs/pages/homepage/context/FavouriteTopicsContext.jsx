import React, { createContext, useState } from 'react'

export const FavouriteTopicsContext = createContext([[], function(){}])

export const FavouriteTopicsProvider = props => {
	const [favouriteTopics, setFavouriteTopics] = useState([])

	return(
		<FavouriteTopicsContext.Provider value={[favouriteTopics, setFavouriteTopics]}>
			{props.children}
		</FavouriteTopicsContext.Provider>
	)
}