import React from 'react'
import { Link } from 'react-router-dom'
import {
    Grid, Header, Message
} from 'semantic-ui-react'

import RegisterForm from './RegisterForm'

const RegisterView = () => (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='teal' textAlign='center'>
                    Create account
            </Header>
            <RegisterForm />
            <Message>
                Already have account? <Link to='/login'>Login</Link>
            </Message>  
        </Grid.Column>
    </Grid>
)


export default RegisterView