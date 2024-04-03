export const appWatchloadSwitch = dispatch => dispatch({ type: 'WATCHLOAD' })
export const postReloadSwitch = dispatch => dispatch({ type: 'POSTRELOAD' })
export const setSymbolName = (data, dispatch) => dispatch({ type: 'SYMBOLNAME', payload: data })
export const setSymbolFullName = (data, dispatch) => dispatch({ type: 'SYMBOLFULLNAME', payload: data })