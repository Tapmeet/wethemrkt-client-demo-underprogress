const appReducer = (app, action) => {
  switch (action.type) {
    case 'WATCHLOAD':
      return {
        ...app,
        watchload: !app.watchload,
      }
    case 'POSTRELOAD':
      return {
        ...app,
        postReload: !app.postReload,
      }
    case 'SYMBOLNAME':
      return {
        ...app,
        symbolname: action.payload,
      }
    case 'SYMBOLFULLNAME':
      return {
        ...app,
        symbolfullname: action.payload,
      }
    default:
      return app
  }
}

export default appReducer


