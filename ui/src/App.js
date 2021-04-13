import React, { useContext } from 'react'
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { Box, Grommet } from 'grommet'

import GlobalStyles from './GlobalStyles'
import Nav from './components/Nav'
import Loading from './components/Loading'
import LoginForm from './components/LoginForm'
import { AuthContext, AuthProvider } from './contexts/auth'

const Rides = React.lazy(() => import('./components/Rides'))
const Battle = React.lazy(() => import('./components/Battle'))
const Results = React.lazy(() => import('./components/Results'))

const theme = {
  global: {
    colors: {
      brand: 'hsl(218,99%,66%)'
    }
  },
};

const LoadingFallback = () => (
  <Box align='center'>
    <Loading />
  </Box>
);

const UnauthenticatedRoutes = () => {
  return (
    <Switch>
      <Route path='/login'>
        <LoginForm />
      </Route>
      <Route render={() => <h1>404</h1>} />
    </Switch>
  )
}
const AuthenticatedRoute = ({ children, ...rest }) => {
  const { authState } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        authState.isAuthenticated ? (
          children
        ) : (
          <Redirect to={{
            pathname: '/login',
            state: { from: location }
          }} />
        )
      }
    />
  );
};

function AppRoutes() {
  const { authState } = useContext(AuthContext);
  if (!authState.userInfo) {
    return (
      <Box align='center'>
        <Loading />
      </Box>
    )
  }

  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <Switch>
        <AuthenticatedRoute exact path='/'>
          <Rides />
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path='/battle/:rideId'>
          <Battle />
        </AuthenticatedRoute>
        <AuthenticatedRoute path='/battle/:rideId/results'>
          <Results />
        </AuthenticatedRoute>
        <UnauthenticatedRoutes />
      </Switch>
    </React.Suspense>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Grommet css="min-height: 100vh" theme={theme}>
          <div className="container">
            <Nav />
            <AppRoutes />
          </div>
          <GlobalStyles />
        </Grommet>
      </AuthProvider>
    </Router>
  );
}

export default App;
