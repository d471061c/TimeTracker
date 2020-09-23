import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import projectReducer from '../../../reducers/projectReducer'
import projectService from '../../../services/projectService'
import { Form } from 'semantic-ui-react'

const TaskForm = ({ projectId }) => {
    const [taskName, setTaskName] = useState('')
    const dispatch = useDispatch()

    const handleTaskCreation = async () => {
        if (taskName.trim().length == 0) return
        const task = await projectService.addTask(projectId, taskName)
        if (!task) return
        dispatch(projectReducer.addTask(projectId, task))
    }

    const handleTaskName = (event) => {
        setTaskName(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        handleTaskCreation()
        setTaskName('')
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Input
                action={{
                    color: 'teal',
                    labelPosition: 'right',
                    icon: 'plus',
                    content: 'Add task',
                    onClick: () => handleSubmit
                }}
                value={taskName}
                onChange={handleTaskName}
            />
        </Form>
    )
}

export default TaskForm