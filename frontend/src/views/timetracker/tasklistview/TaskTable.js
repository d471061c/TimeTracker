import React from 'react'
import { Table, Header, Button } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTaskCompletion } from '../../../services/projectService'
import { updateTask } from '../../../reducers/projectReducer'
const TaskRow = ({ task, onCompletionToggle }) => (
    <Table.Row>
        <Table.Cell>
           <Header as="h4">
                { task.name }
            </Header> 
        </Table.Cell>
        <Table.Cell>
            { 
                task.completed ? 
                    <Button fluid compact onClick={onCompletionToggle(task)} positive> Completed </Button> : 
                    <Button fluid compact onClick={onCompletionToggle(task)}> Not completed </Button>
            }
        </Table.Cell>
    </Table.Row>
)

const TaskTable = ({ projectId }) => {
    const project  = useSelector(state => state).filter(project => project.id == projectId)[0]
    const dispatch = useDispatch()

    const toggleCompletion = (task) => async () => {
        const data = await toggleTaskCompletion(projectId, task)
        dispatch(updateTask(projectId, data))
    }

    if (!project) {
        return <Table compact celled loading> </Table>
    }

    return (
        <Table compact celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Task</Table.HeaderCell>
                    <Table.HeaderCell width={"3"}>Status</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {
                    project.tasks.map(task => 
                        <TaskRow 
                            task={task}
                            onCompletionToggle={toggleCompletion}
                        />
                    )
                }
            </Table.Body>
        </Table>
    )
}

export default TaskTable