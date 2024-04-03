import appReducer from './appReducer'

export const mainReducer = ({ app }, action) => {
	return {
		app: appReducer(app, action)
	}
}
