import React, { useEffect, useState } from 'react'
import { Table, Header, Button } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'

import projectService from '../../../services/projectService'
import taskService from '../../../services/taskService'

import projectReducer from '../../../reducers/projectReducer'

import { useDeleteItemModal, DeleteItemModal } from '../../../utils/DeleteItemModal'
import { RenameItemModal, useRenameItemModal } from '../../../utils/RenameItemModal'
import { seconds_to_text } from '../../../libs/time'

const buttonStyle = {
    float: 'right'
}

const Timer = ({task}) => {
    const [elapsedTime, setElapsedTime] = useState(task.time_spent)
    const active = task.status == 'started'
    if (task.status == 'not_started' && elapsedTime > 0) {
        setElapsedTime(0)
    }
    const duration = () => {
        let diff = Date.now() - Date.parse(task.time_stamp)
        return Math.floor(task.time_spent + diff / 1000)
    }

    useEffect(() => {
        let interval = null
        if (active) {
            interval = setInterval(() => {
                setElapsedTime(duration())
            }, 1000)
        } else {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [active, elapsedTime])

    return (
        <div style={{ color: active ? 'red': 'black'}}>
            { seconds_to_text(active ? elapsedTime : task.time_spent) }
        </div>
    )
}

const TaskRow = ({ 
    task, 
    onStart,
    onPause,
    onComplete,
    onResume,
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
            <Timer task={task}/>
        </Table.Cell>
        <Table.Cell>
            { (task.status == 'started' || task.status == 'paused') && 
                <Button.Group style={{ width: '100%' }}> 
                    { task.status == 'started' && <Button onClick={onPause(task)} negative>Stop</Button> }
                    { task.status == 'paused' && <Button onClick={onStart(task)}>Start</Button> }
                    <Button.Or />
                    <Button onClick={onComplete(task)} positive>Done</Button>
                </Button.Group> 
            }
            { task.status == 'not_started' &&  <Button onClick={onStart(task)} fluid compact> Start </Button> }
            { task.status == 'completed' &&  <Button onClick={onResume(task)} fluid compact positive> Complete </Button> }
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
        dispatch(projectReducer.renameTask(projectId, task.id, renamedTask.name))
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

    const onResume = (task) => async () => {
        const resumedTask = await taskService.resumeTask(task)
        if (!resumedTask) return
        dispatch(projectReducer.updateTask(projectId, resumedTask))
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
                        <Table.HeaderCell width={"2"}>Time spent</Table.HeaderCell>
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
                                onResume={onResume}
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