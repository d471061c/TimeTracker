import axios from 'axios'
import { generateConfig } from './authenticationService'

const startTask = async (task) => {
    console.log(generateConfig())
    const response = await axios.post(`/api/task/${task.id}/start`, {}, generateConfig())
    return response.data
}

const stopTask = async (task) => {
    const response = await axios.post(`/api/task/${task.id}/stop`, {}, generateConfig())
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
    stopTask,
    resetTask,
    renameTask,
    toggleCompletion
}