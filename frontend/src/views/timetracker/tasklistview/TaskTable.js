import React from 'react'
import { Table, Header, Button } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import projectService from '../../../services/projectService'
import projectReducer from '../../../reducers/projectReducer'
import { useDeleteItemModal, DeleteItemModal } from '../../../utils/DeleteItemModal'
import { RenameItemModal, useRenameItemModal } from '../../../utils/RenameItemModal'

const buttonStyle = {
    float: 'right'
}

const TaskRow = ({ 
    task, 
    onCompletionToggle,
    onDelete,
    onEdit
}) => (
    <Table.Row>
        <Table.Cell>
           <Header style={{display: 'inline'}} as='h4'>
                { task.name }
            </Header> 
            <div style={{display:'inline'}}>
                <Button circular negative icon='trash' style={buttonStyle} onClick={onDelete(task)} />
                <Button circular positive icon='pencil' style={buttonStyle} onClick={onEdit(task)}/>
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
        const data = await projectService.toggleTaskCompletion(task)
        dispatch(projectReducer.updateTask(projectId, data))
    }

    const onDelete = async (task) => {
        const deletedTask = await projectService.deleteTask(task.id)
        if (!deletedTask) return
        dispatch(projectReducer.removeTask(projectId, task.id))
    }

    const onRename = async (task) => {
        const renamedTask = await projectService.renameTask(task, task.name)
        if (!renamedTask) return
        dispatch(projectReducer.updateTask(projectId, renamedTask))
    }

    const deleteItemModal = useDeleteItemModal({ onDelete })
    const renameItemModal = useRenameItemModal({ onRename })

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
                                onEdit={renameItemModal.invoke}
                            />
                        )
                    }
                </Table.Body>
            </Table>
            <DeleteItemModal 
                header={"Delete task"} 
                {...deleteItemModal}
            />
            <RenameItemModal
                header={"Edit task"}
                {...renameItemModal}
            />
        </>
    )
}

export default TaskTable