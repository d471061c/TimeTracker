import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTask } from '../../../reducers/projectReducer'
import {
    createTask
} from '../../../services/projectService'
import { Form } from 'semantic-ui-react'

const TaskForm = ({ projectId }) => {
    const [taskName, setTaskName] = useState('')
    const dispatch = useDispatch()

    const handleTaskCreation = async () => {
        const task = await createTask(projectId, taskName)
        if (!task) return
        dispatch(addTask(projectId, task))
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