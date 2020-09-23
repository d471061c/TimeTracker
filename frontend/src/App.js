import React from 'react'
import { 
  BrowserRouter as Router,
  Switch, 
  Route 
} from 'react-router-dom'
import './App.css'

import LoginView from './views/authentication/LoginView'
import RegisterView from './views/authentication/RegisterView'
import TimeTracker from './views/timetracker/TimeTracker'
import ProtectedRoute from './utils/Protectedroute'

const App = () => (
  <Router>
    <Switch>
      <Route component={LoginView} path="/login"/>
      <Route component={RegisterView} path="/register"/>
      <ProtectedRoute component={TimeTracker} path="/"/>
    </Switch>
  </Router>
)

export default App;
