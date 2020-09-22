import React from 'react'
import { Table, Header, Button } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'

import projectService from '../../../services/projectService'
import taskService from '../../../services/taskService'

import projectReducer from '../../../reducers/projectReducer'

import { useDeleteItemModal, DeleteItemModal } from '../../../utils/DeleteItemModal'
import { RenameItemModal, useRenameItemModal } from '../../../utils/RenameItemModal'

const buttonStyle = {
    float: 'right'
}

const TaskRow = ({ 
    task, 
    onStart,
    onPause,
    onComplete,
    onReset,
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
            { task.time_spent }s
        </Table.Cell>
        <Table.Cell>
            { (task.status == 'started' || task.status == 'paused') && 
                <Button.Group style={{ width: '100%'}}> 
                    { task.status == 'started' && <Button onClick={onPause(task)} negative>Stop</Button> }
                    { task.status == 'paused' && <Button onClick={onStart(task)}>Start</Button> }
                    <Button.Or />
                    <Button onClick={onComplete(task)} positive>Done</Button>
                </Button.Group> 
            }
            { task.status == 'not_started' &&  <Button onClick={onStart(task)} fluid compact> Start </Button> }
            { task.status == 'completed' &&  <Button onClick={onReset(task)} fluid compact> Restart </Button> }
        </Table.Cell>
    </Table.Row>
)

const TaskTable = ({ projectId }) => {
    const project  = useSelector(state => state).filter(project => project.id == projectId)[0]
    const dispatch = useDispatch()

    const onDelete = async (task) => {
        const deletedTask = await projectService.removeTask(task.id)
        if (!deletedTask) return
        dispatch(projectReducer.removeTask(projectId, task.id))
    }

    const onRename = async (task) => {
        const renamedTask = await taskService.renameTask(task, task.name)
        if (!renamedTask) return
        dispatch(projectReducer.updateTask(projectId, renamedTask))
    }

    const deleteItemModal = useDeleteItemModal({ onDelete })
    const renameItemModal = useRenameItemModal({ onRename })

    const onStart = (task) => async () => {
        const startedTask = await taskService.startTask(task)
        if (!startedTask) return
        dispatch(projectReducer.updateTask(projectId, startedTask))
    }

    const onPause = (task) => async () => {
        const pausedTask = await taskService.pauseTask(task)
        if (!pausedTask) return
        dispatch(projectReducer.updateTask(projectId, pausedTask))
    }

    const onComplete = (task) => async () => {
        const completedTask = await taskService.completeTask(task)
        if (!completedTask) return
        dispatch(projectReducer.updateTask(projectId, completedTask))
    }

    const onReset = (task) => async () => {
        const restartedTask = await taskService.resetTask(task)
        if (!restartedTask) return
        dispatch(projectReducer.updateTask(projectId, restartedTask))
    }

    if (!project) {
        return <Table compact celled loading> </Table>
    }

    return (
        <>
            <Table compact celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Task</Table.HeaderCell>
                        <Table.HeaderCell width={"1"}>Time spent</Table.HeaderCell>
                        <Table.HeaderCell width={"3"}>Status</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        project.taskList.map(task => 
                            <TaskRow 
                                task={task}
                                onStart={onStart}
                                onPause={onPause}
                                onComplete={onComplete}
                                onReset={onReset}
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