import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Form, Segment } from 'semantic-ui-react'

import { login } from '../../services/authenticationService'

const AuthenticationForm = () => {
    const history = useHistory()
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleUsername = (event) => {
        setUsername(event.target.value)
    }

    const handlePassword = (event) => {
        setPassword(event.target.value)
    }

    const authenticate = async (event) => {
        event.preventDefault()
        
        setLoading(true)
        const success = await login(username, password)
        setLoading(false)

        if (!success) {
            setError(true)
            setTimeout(() => {
                setError(false)
            }, 3000)
        } else {
            history.push("/")
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
                    error={error}
                />
                <Form.Input
                    fluid
                    icon='lock'
                    iconPosition='left'
                    placeholder='Password'
                    type='password'
                    onChange={handlePassword}
                    value={password}
                    error={error}
                />

                <Button loading={loading} onClick={authenticate} color='teal' fluid size='large'>
                    Login
                </Button>
            </Segment>
        </Form>
    )
}

export default AuthenticationForm