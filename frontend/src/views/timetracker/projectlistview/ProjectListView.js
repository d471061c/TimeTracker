import React from 'react'
import { Segment, Header } from 'semantic-ui-react'
import ProjectTable from './ProjectTable'
import ProjectForm from './ProjectForm'

const ProjectListView = () => {
    return (
        <Segment basic>
            <Header as='h3'> Projects </Header>
            <ProjectForm/>
            <ProjectTable/>
        </Segment>
    )
}

export default ProjectListView