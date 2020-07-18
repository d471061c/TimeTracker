import React, { useEffect } from 'react'
import { Table, Header } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { getProjects } from '../../../services/projectService'


const ProjectRow = ({ project, onDelete, OnEdit }) => {
    return (
        <Table.Row key={project.id}>
            <Table.Cell>
                <Header as='h4'>
                    <Header.Content>
                        { project.name }
                    </Header.Content>
                </Header>
            </Table.Cell>
        </Table.Row>
    )
}

const ProjectTable = () => {
    const projects  = useSelector(state => state)
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchData = async () => {
            const data = await getProjects()
            dispatch({
                type: 'SETUP',
                projects: data
            })
        }
        fetchData()
    }, [dispatch])

    return (
        <Table 
            celled
            style={{
                width: "90%", 
                overflow: 'scroll'
            }}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Project</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                { 
                    projects.map(project => <ProjectRow project={project}/>) 
                }
            </Table.Body>
        </Table>
        
    )
}

export default ProjectTable