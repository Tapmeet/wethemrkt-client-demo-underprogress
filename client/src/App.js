
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { QueryClient, QueryClientProvider } from 'react-query'

import { Switch, BrowserRouter as Router } from "react-router-dom"


// Import Routes all
import { userRoutes, authRoutes, landingSymbolRoutes } from "./routes/allRoutes"

// // Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware"

// // layouts Format
//import VerticalLayout from "./components/VerticalLayout/"
import HorizontalLayout from "./components/HorizontalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"
import LandingSymboleLayout from "./components/LandingSymboleLayout"



// // Import scss
import "./assets/scss/theme.scss"
import { GlobalStateProvider } from './context/index'
import { mainReducer } from './store/reducers'
import { initialState } from './store/initialState'
import { GoogleOAuthProvider } from '@react-oauth/google';


const queryClient = new QueryClient()

function App() {

  return (
    <React.Fragment>
      <GoogleOAuthProvider clientId="473997529194-lhbtq731o7biblpobth0av0qgnsf07ia.apps.googleusercontent.com">
        <QueryClientProvider client={queryClient}>
          <GlobalStateProvider initialState={initialState} reducer={mainReducer}>
            <Router>
              <Switch>
                {authRoutes.map((route, idx) => (
                  <Authmiddleware
                    path={route.path}
                    layout={NonAuthLayout}
                    component={route.component}
                    key={idx}
                    isAuthProtected={true}
                    exact
                  />
                ))}

                {userRoutes.map((route, idx) => (
                  <Authmiddleware
                    path={route.path}
                    layout={HorizontalLayout}
                    component={route.component}
                    key={idx}
                    isAuthProtected={true}
                    exact
                  />
                ))}

                {landingSymbolRoutes.map((route, idx) => (
                  <Authmiddleware
                    path={route.path}
                    layout={LandingSymboleLayout}
                    component={route.component}
                    key={idx}
                    isAuthProtected={false}
                    exact
                  />
                ))}
              </Switch>
            </Router>
          </GlobalStateProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </React.Fragment>

  )
}

export default App