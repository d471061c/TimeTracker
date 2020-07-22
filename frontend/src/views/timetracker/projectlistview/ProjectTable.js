import React, { useEffect } from 'react'
import { Table, Header, Progress, Button } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { getProjects, deleteProject } from '../../../services/projectService'
import { removeProject, loadProjects } from '../../../reducers/projectReducer'
import { useHistory } from 'react-router-dom'


const projectRowHeaderStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden', 
    textOverflow: 'ellipsis',
    maxWidth: '30ch',
    cursor: 'pointer'
}

const buttonStyle = {
    float: 'right'
}

const ProjectRow = ({ project, history, onDelete }) => {

    const getStatistics = () => {
        if (project.tasks.length == 0) {
            return (
                <Progress>
                    No tasks available
                </Progress>
            )
        } 
        const tasks = project.tasks.length
        const completedTasks = project.tasks.filter(task => task.completed).length
        const success = tasks === completedTasks
        const progressStatus = tasks === completedTasks ? "Completed" : `${completedTasks}/${tasks}`
        
        return (
            <Progress 
                success={success}
                value={completedTasks} 
                total={tasks}
                >
                { progressStatus }
            </Progress>
        )
    }

    const navigateToTaskList = () => {
        history.push(`/projects/${project.id}`)
    }

    return (
        <Table.Row key={project.id}>
            <Table.Cell>
                <Header onClick={navigateToTaskList} style={{display: 'inline'}} as='h4'>
                    <Header.Content style={projectRowHeaderStyle}>
                        { project.name }
                    </Header.Content>
                </Header>
                <div style={{display:'inline'}}>
                    <Button circular negative icon='trash' style={buttonStyle} onClick={onDelete(project.id)}/>
                    <Button circular positive icon='pencil' style={buttonStyle}/>
                </div>
            </Table.Cell>
            <Table.Cell>
                { getStatistics() }
            </Table.Cell>
        </Table.Row>
    )
}

const ProjectTable = () => {
    const projects  = useSelector(state => state)
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        const fetchData = async () => {
            const data = await getProjects()
            dispatch(loadProjects(data))
        }
        fetchData()
    }, [dispatch])

    const onDelete = (projectId) => async () => {
        const deletedProject = await deleteProject(projectId)
        if (!deleteProject) return
        dispatch(removeProject(deletedProject.id))
    }

    return (
        <Table 
            compact
            celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Project</Table.HeaderCell>
                    <Table.HeaderCell width={"4"}>Progress</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                { 
                    projects.map(project => 
                        <ProjectRow 
                            onDelete={onDelete} 
                            project={project} 
                            history={history}
                        />
                    ) 
                }
            </Table.Body>
        </Table>
        
    )
}

export default ProjectTable