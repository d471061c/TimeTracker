import React, { useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'

import { login } from '../../services/authenticationService'

const AuthenticationForm = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleUsername = (event) => {
        setUsername(event.target.value)
    }

    const handlePassword = (event) => {
        setPassword(event.target.value)
    }

    const authenticate = async (event) => {
        event.preventDefault()
        const success = await login(username, password)
        
        // TODO: update this
        if (!success) {
            console.log("Failed to login")
        } else {
            console.log("Login succesfull")
        }
    }

    return (
        <Form size='large'>
            <Segment stacked>
                <Form.Input 
                    fluid 
                    icon='user' 
                    iconPosition='left' 
                    placeholder='Username'
                    onChange={handleUsername}
                    value={username}
                />
                <Form.Input
                    fluid
                    icon='lock'
                    iconPosition='left'
                    placeholder='Password'
                    type='password'
                    onChange={handlePassword}
                    value={password}
                />

                <Button onClick={authenticate} color='teal' fluid size='large'>
                    Login
                </Button>
            </Segment>
        </Form>
    )
}

export default AuthenticationForm