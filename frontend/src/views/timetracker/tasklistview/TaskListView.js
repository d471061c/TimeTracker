import React, { useEffect, useState } from 'react'
import { Segment, Header } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'

import TaskTable from './TaskTable'
import TaskForm from './TaskForm'

import projectService from '../../../services/projectService'
import projectReducer from '../../../reducers/projectReducer'

const TaskListView = ({ match }) => {
    const projectId = match.params.projectId
    const dispatch = useDispatch()
    const [project, setProject] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const data = await projectService.getProjectById(projectId)
            dispatch(projectReducer.updateProject(data))
            setProject(data)
        }
        fetchData()
    }, [dispatch])
    
    if (!project) {
        return (
            <Segment basic loading/>
        )
    }
    return (
        <Segment basic>
            <Header> Tasks of {project.name} </Header>
            <TaskForm projectId={projectId}/>
            <TaskTable projectId={projectId}/>
        </Segment>
    )
}

export default TaskListView