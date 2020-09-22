import axios from 'axios'
import { generateConfig } from './authenticationService'

const startTask = async (task) => {
    const response = await axios.post(`/api/task/${task.id}/start`, {}, generateConfig())
    return response.data
}

const completeTask = async (task) => {
    const response = await axios.post(`/api/task/${task.id}/complete`, {}, generateConfig())
    return response.data
}

const pauseTask = async (task) => {
    const response = await axios.post(`/api/task/${task.id}/pause`, {}, generateConfig())
    return response.data
}

const resetTask = async (task) => {
    const response = await axios.post(`/api/task/${task.id}/reset`, {}, generateConfig())
    return response.data
}

const renameTask = async (task, name) => {
    const response = await axios.put(`/api/task/${task.id}`, { 
        ...task,
        name 
    }, generateConfig())
    return response.data
}    

const toggleCompletion = async (task) => {
    const response = await axios.put(`/api/task/${task.id}`, {
        ...task,
        completed: !task.completed
    }, generateConfig())
    return response.data
}

export default {
    startTask,
    completeTask,
    pauseTask,
    resetTask,
    renameTask,
    toggleCompletion
}