import React, { useState } from 'react'
import { Form } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import { addProject } from '../../../reducers/projectReducer'
import {
    createProject
} from '../../../services/projectService'

const ProjectForm = () => {
    const [projectName, setProjectName] = useState('')
    const dispatch = useDispatch()

    const handleProjectName = (event) => {
        setProjectName(event.target.value)
    }

    const handleProjectCreation = async (name) => {
        const project = await createProject(name)
        // TODO: Dispatch error here
        if (!project) return
        dispatch(addProject(project))
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