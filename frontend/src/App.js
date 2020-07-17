import React from 'react'

import { 
  BrowserRouter as Router,
  Switch, 
  Route 
} from 'react-router-dom'

import LoginView from './views/authentication/LoginView'
import RegisterView from './views/authentication/RegisterView'

const App = () => (
  <Router>
    <Switch>
      <Route component={LoginView} path="/login"/>
      <Route component={RegisterView} path="/register"/>
    </Switch>
  </Router>
)

export default App;
