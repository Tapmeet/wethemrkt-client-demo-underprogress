import React, { createContext, useReducer } from 'react'
import PropTypes from 'prop-types'

export const StateContext = createContext()

export const GlobalStateProvider = ({ initialState, reducer, children }) => (
	<StateContext.Provider value={useReducer(reducer, initialState)}>{children}</StateContext.Provider>
)

export const withContext = (stateAndDispatchToProps, Component) => {
	return props => {
		return (
			<StateContext.Consumer>
				{context => {
					const contextProps = stateAndDispatchToProps(context)
					return <Component {...props} {...contextProps} />
				}}
			</StateContext.Consumer>
		)
	}
}

GlobalStateProvider.propTypes = {
	reducer: PropTypes.func.isRequired,
	initialState: PropTypes.shape().isRequired,
	children: PropTypes.shape().isRequired,
}
