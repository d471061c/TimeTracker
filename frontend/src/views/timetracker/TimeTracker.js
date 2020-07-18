import React from 'react'
import { Icon, Menu, Sidebar, Container } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import { useHistory, Switch } from 'react-router-dom'

import { clearCache } from '../../reducers/projectReducer'
import { logout } from '../../services/authenticationService'
import ProjectView from './projectview/ProjectView'
import ProtectedRoute from '../../utils/Protectedroute'

const TimeTracker = () => {
    const history = useHistory()
    const dispatch = useDispatch()

    const leave = () => {
        dispatch(clearCache())
        logout()
        history.push("/login")
    } 

    return (
        <Container fluid>
            <Sidebar 
                as={Menu}
                visible
                direction='left'
                width='thin'
                icon='labeled'
                inverted
                vertical>

                <Menu.Item as='a'>
                    <Icon name='cogs' />
                    Projects
                </Menu.Item>

                <Menu.Item onClick={leave} as='a'>
                    <Icon name='log out' />
                    Logout
                </Menu.Item>
            </Sidebar>
            
            <Sidebar.Pusher>
                <Switch>
                    <ProtectedRoute component={ProjectView} path="/"/>
                </Switch>
            </Sidebar.Pusher>
        
        </Container>
    )
}

export default TimeTracker