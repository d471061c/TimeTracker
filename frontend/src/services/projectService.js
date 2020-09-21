import axios from 'axios'
import { generateConfig } from './authenticationService'

const getProjectById = async (projectId) => {
    const response = await axios.get(`/api/project/${projectId}`, generateConfig())
    if (response.data.error) {
        return []
    }
    return response.data
}

const getProjects = async () => {
    const response = await axios.get(`/api/projects`, generateConfig())
    if (response.data.error) {
        return []
    }
    return response.data
}

const createProject = async (name) => {
    const response = await axios.post(`/api/project`, {
        name
    }, generateConfig())
    return response.data
    
}

const deleteProject = async (projectId) => {
    const response = await axios.delete(`/api/project/${projectId}`, generateConfig())
    return response.data
}

const renameProject = async (projectId, name) => {
    const response = await axios.put(`/api/project/${projectId}`, { 
        name 
    }, generateConfig())
    return response.data
}

const addTask = async (projectId, name) => {
    const response = await axios.post(`/api/project/${projectId}/task`, {
        name
    }, generateConfig())
    return response.data
}

const removeTask = async (taskId) => {
    const response = await axios.delete(`/api/task/${taskId}`, generateConfig())
    return response.data
}


export default {
    getProjects,
    getProjectById,
    createProject, 
    deleteProject, 
    renameProject,
    addTask,
    removeTask
}