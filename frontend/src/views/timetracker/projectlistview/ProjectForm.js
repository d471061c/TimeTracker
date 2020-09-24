import React, { useState } from 'react'
import { Form } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import projectReducer from '../../../reducers/projectReducer'
import projectService from '../../../services/projectService'

const ProjectForm = () => {
    const [projectName, setProjectName] = useState('')
    const dispatch = useDispatch()

    const handleProjectName = (event) => {
        setProjectName(event.target.value)
    }

    const handleProjectCreation = async () => {
        if (projectName.trim().length == 0) return
        const project = await projectService.createProject(projectName)
        if (!project) return
        dispatch(projectReducer.addProject(project))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        handleProjectCreation(projectName)
        setProjectName('')
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Input
                action={{
                    color: 'teal',
                    labelPosition: 'right',
                    icon: 'plus',
                    content: 'Create project',
                    onClick: () => handleSubmit
                }}
                value={projectName}
                onChange={handleProjectName}
            />
        </Form>
    )
}

export default ProjectForm