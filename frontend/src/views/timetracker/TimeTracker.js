import React from 'react'
import { Icon, Menu, Container } from 'semantic-ui-react'
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

    return (
        <Container fluid>
            <Menu
                inverted
                attached
                fixed
                >

                <Menu.Item onClick={navigateToProjects} as='a'>
                    <Icon name='cogs' />
                    Projects
                </Menu.Item>

                <Menu.Item onClick={leave} as='a' position="right">
                    <Icon name='log out' />
                    Logout
                </Menu.Item>
            </Menu>
            
            <Container fluid>
                <Switch>
                    <ProtectedRoute component={TaskListView} path="/projects/:projectId" />
                    <ProtectedRoute component={ProjectListView} path="/projects"/>
                </Switch>
            </Container>
        </Container>
    )
}

export default TimeTracker