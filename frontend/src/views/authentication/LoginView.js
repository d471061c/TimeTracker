import React from 'react'
import { Link } from 'react-router-dom'
import {
    Grid, Header, Message
} from 'semantic-ui-react'

import LoginForm from './LoginForm'

const LoginView = () => (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='teal' textAlign='center'>
                    Log-in to your account
            </Header>
            <LoginForm />
            <Message>
                Don't have account? <Link to='/register'>Sign Up</Link>
            </Message> 
        </Grid.Column>
    </Grid>
)


export default LoginView