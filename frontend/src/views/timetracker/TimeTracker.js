import React from 'react'
import { Icon, Menu, Sidebar, Container } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import { useHistory, Switch } from 'react-router-dom'

import { clearCache } from '../../reducers/projectReducer'
import { logout } from '../../services/authenticationService'
import ProjectListView from './projectlistview/ProjectListView'
import ProtectedRoute from '../../utils/Protectedroute'

const TimeTracker = () => {
    const history = useHistory()
    const dispatch = useDispatch()

    const leave = () => {
        dispatch(clearCache())
        logout()
        history.push("/login")
    } 

    // TODO: fix sidebar to be visible with flexbox
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
            
            <Container>
                <Switch>
                    <ProtectedRoute component={ProjectListView} path="/"/>
                </Switch>
            </Container>
        </Container>
    )
}

export default TimeTracker