import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Grommet } from 'grommet'

import GlobalStyles from './GlobalStyles'
import Nav from './components/Nav'
import Rides from './components/Rides'
import Battle from './components/Battle'
import Results from './components/Results'

const theme = {
  global: {
    colors: {
      brand: 'hsl(218,99%,66%)'
    }
  },
};

function App() {
  return (
    <Router>
      <Grommet css="min-height: 100vh" theme={theme}>
        <div className="container">
          <Nav />
          <Switch>
            <Route exact path='/' component={Rides} />
            <Route exact path='/battle/:rideId' component={Battle} />
            <Route path='/battle/:rideId/results' component={Results} />
            <Route render={() => <h1>404</h1>} />
          </Switch>
        </div>
        <GlobalStyles />
      </Grommet>
    </Router>
  );
}

export default App;
