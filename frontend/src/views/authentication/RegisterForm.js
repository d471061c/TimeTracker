import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Form, Segment } from 'semantic-ui-react'

import { register } from '../../services/authenticationService'

const RegistrationForm = () => {
    const history = useHistory()

    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleName = (event) => {
        setName(event.target.value)
    }

    const handleUsername = (event) => {
        setUsername(event.target.value)
    }

    const handlePassword = (event) => {
        setPassword(event.target.value)
    }


    const createAccount = async (event) => {
        event.preventDefault()

        setLoading(true)
        const success = await register(name, username, password)
        setLoading(false)
        
        if (!success) {
            setError(true)
            setTimeout(() => {
                setError(false)
            }, 3000)
        } else {
            history.push("/login")
        }
    }

    return (
        <Form size='large'>
            <Segment stacked>
                <Form.Input 
                    fluid 
                    placeholder='Name'
                    onChange={handleName}
                    value={name}
                    error={error}
                />
                <Form.Input 
                    fluid 
                    placeholder='Username'
                    onChange={handleUsername}
                    value={username}
                    error={error}
                />
                <Form.Input
                    fluid
                    placeholder='Password'
                    type='password'
                    onChange={handlePassword}
                    value={password}
                    error={error}
                />
                <Button loading={loading} onClick={createAccount} color='teal' fluid size='large'>
                    Sign-up
                </Button>
            </Segment>
        </Form>
    )
}

export default RegistrationForm