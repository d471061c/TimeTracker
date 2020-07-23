import axios from 'axios'
import { getToken } from './authenticationService'

// TODO: update API_URL
const API_URL = "http://localhost:8000/api"

// TODO: fix token problem
const generateConfig = () => ({
    headers: {
        'Authorization' : `bearer ${getToken()}`
    }
})


const getProjectById = async (projectId) => {
    const response = await axios.get(`${API_URL}/project/${projectId}`, generateConfig())
    if (response.data.error) {
        return []
    }
    return response.data
}

const getProjects = async () => {
    const response = await axios.get(`${API_URL}/projects`, generateConfig())
    if (response.data.error) {
        return []
    }
    return response.data
}

const createProject = async (name) => {
    const response = await axios.post(`${API_URL}/project`, {
        name
    }, generateConfig())
    return response.data
    
}

const deleteProject = async (projectId) => {
    const response = await axios.delete(`${API_URL}/project/${projectId}`, generateConfig())
    return response.data
}

const renameProject = async (projectId, name) => {
    const response = await axios.put(`${API_URL}/project/${projectId}`, { 
        name 
    }, generateConfig())
    return response.data
}

const renameTask = async (projectId, task, name) => {
    console.log(name)
    const response = await axios.put(`${API_URL}/project/${projectId}/task/${task.id}`, { 
        ...task,
        name 
    }, generateConfig())
    return response.data
}

const createTask = async (projectId, name) => {
    const response = await axios.post(`${API_URL}/project/${projectId}/task`, {
        name
    }, generateConfig())
    return response.data
}

const deleteTask = async (projectId, taskId) => {
    const response = await axios.delete(`${API_URL}/project/${projectId}/task/${taskId}`, generateConfig())
    return response.data
}

const toggleTaskCompletion = async (projectId, task) => {
    const response = await axios.put(`${API_URL}/project/${projectId}/task/${task.id}`, {
        ...task,
        completed: !task.completed
    }, generateConfig())
    return response.data
}

export {
    getProjects,
    getProjectById,
    createProject, 
    deleteProject, 
    renameProject,
    createTask,
    deleteTask,
    renameTask,
    toggleTaskCompletion
}