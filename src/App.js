import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Rides from './components/Rides'
import Ride from './components/Ride'
import Results from './components/Results'

function App() {
  return (
    <Router>
      <div className="container">
        <Switch>
          <Route exact path='/' component={Rides} />
          <Route path='/ride/:rideId' component={Ride} />
          <Route path='/battle/:rideId' component={Results} />
          <Route render={() => <h1>404</h1>} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
