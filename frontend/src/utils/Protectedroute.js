import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { isLoggedIn } from '../services/authenticationService'

const ProtectedRoute = ({component: Component, ...rest}) => {
    const loggedIn = isLoggedIn()

    return (
        <Route
            {...rest}
            render={props =>
                loggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ 
                        pathname: '/login', 
                        state: { from: props.location } }} 
                    />
                )
            }
        />
    )
    
}

export default ProtectedRoute