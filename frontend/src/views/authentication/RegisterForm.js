import React, { useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'

import { register } from '../../services/authenticationService'

const RegistrationForm = () => {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
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
        const success = await register(name, username, password)
        
        // TODO: update this
        if (!success) {
            console.log("Failed to register")
        } else {
            console.log("Register succesfull")
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
                />
                <Form.Input 
                    fluid 
                    placeholder='Username'
                    onChange={handleUsername}
                    value={username}
                />
                <Form.Input
                    fluid
                    placeholder='Password'
                    type='password'
                    onChange={handlePassword}
                    value={password}
                />
                <Button onClick={createAccount} color='teal' fluid size='large'>
                    Sign-up
                </Button>
            </Segment>
        </Form>
    )
}

export default RegistrationForm