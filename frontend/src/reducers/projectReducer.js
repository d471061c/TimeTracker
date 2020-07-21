import { createStore } from 'redux'

const projectReducer = (state = [], action) => {
    switch(action.type) {
        case 'ADD':
            return [...state, action.project]
        case 'UPDATE':
            return state.map(project => project.id === action.project ? action.project : project)
        case 'REMOVE':
            return state.filter(project => project.id !== action.projectId)
        case 'SETUP':
            return action.projects
        default:
            return state
    }
}

const projectStore = createStore(projectReducer)

const clearCache = () => ({
    type: 'SETUP',
    projects: []
})

const updateProject = (project) => ({
    type: 'UPDATE',
    project
})

const addProject = (project) => ({
    type: 'ADD',
    project
})

const removeProject = (projectId) => ({
    type: 'REMOVE',
    projectId
})

const loadProjects = (projects) => ({
    type: 'SETUP',
    projects
})

export {
    projectStore, clearCache, addProject, removeProject, updateProject, loadProjects
}