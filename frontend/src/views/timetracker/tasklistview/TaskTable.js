import React from 'react'
import { Table, Header, Button } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTaskCompletion, deleteTask } from '../../../services/projectService'
import { updateTask, removeTask } from '../../../reducers/projectReducer'
import { useDeleteItemModal, DeleteItemModal } from '../../../utils/DeleteItemModal'

const buttonStyle = {
    float: 'right'
}

const TaskRow = ({ 
    task, 
    onCompletionToggle,
    onDelete
}) => (
    <Table.Row>
        <Table.Cell>
           <Header style={{display: 'inline'}} as='h4'>
                { task.name }
            </Header> 
            <div style={{display:'inline'}}>
                <Button circular negative icon='trash' style={buttonStyle} onClick={onDelete(task)} />
                <Button circular positive icon='pencil' style={buttonStyle}/>
            </div>
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

    const onDelete = async (task) => {
        const deletedTask = await deleteTask(projectId, task.id)
        if (!deletedTask) return
        dispatch(removeTask(projectId, task.id))
    }

    const deleteItemModal = useDeleteItemModal({ onDelete })

    if (!project) {
        return <Table compact celled loading> </Table>
    }

    return (
        <>
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
                                onDelete={deleteItemModal.invoke}
                            />
                        )
                    }
                </Table.Body>
            </Table>
            <DeleteItemModal 
                header={"Delete task"} 
                {...deleteItemModal}
            />
        </>
    )
}

export default TaskTable