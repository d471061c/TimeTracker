import React from 'react'
import { Icon, Menu, Sidebar, Container } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import { useHistory, Switch } from 'react-router-dom'

import { clearProjects } from '../../reducers/projectReducer'
import { logout } from '../../services/authenticationService'
import ProjectListView from './projectlistview/ProjectListView'
import ProtectedRoute from '../../utils/Protectedroute'
import TaskListView from './tasklistview/TaskListView'

const TimeTracker = () => {
    const history = useHistory()
    const dispatch = useDispatch()

    const leave = () => {
        dispatch(clearProjects())
        logout()
        history.push("/login")
    } 

    const navigateToProjects = () => {
        history.push("/projects")
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

                <Menu.Item onClick={navigateToProjects} as='a'>
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
                    <ProtectedRoute component={TaskListView} path="/projects/:projectId" />
                    <ProtectedRoute component={ProjectListView} path="/projects"/>
                </Switch>
            </Container>
        </Container>
    )
}

export default TimeTracker