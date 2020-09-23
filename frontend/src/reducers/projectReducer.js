import { createStore } from 'redux'

const projectReducer = (state = [], action) => {
    switch(action.type) {
        case 'ADD_PROJECT':
            return [...state, action.project]
        case 'UPDATE_PROJECT':
            if (!state.find(project => project.id == action.project.id)) {
                return [...state, action.project]
            }
            return state.map(project => project.id === action.project.id ? action.project : project)
        case 'RENAME_PROJECT':
            if (!state.find(project => project.id == action.projectId)) {
                return [...state, action.project]
            }
            return state.map(project => project.id === action.projectId ? {
                ...project,
                name: action.name
            } : project)
        case 'REMOVE_PROJECT':
            return state.filter(project => project.id !== action.projectId)
        case 'SETUP_PROJECTS':
            return action.projects
        case 'ADD_TASK':
            return state.map(project => project.id == action.projectId ? 
                {
                    ...project, 
                    taskList: [...project.taskList, action.task]
                } : project
            )
        case 'REMOVE_TASK':
            return state.map(project => project.id == action.projectId ? 
                {
                    ...project, 
                    taskList: project.taskList.filter(task => task.id !== action.taskId)
                } : project
            )
        case 'RENAME_TASK':
            return state.map(project => project.id == action.projectId ?
                {
                    ...project,
                    taskList:  project.taskList.map(task => task.id == action.taskId ? 
                        {
                            ...task,
                            name: action.name
                        }
                     : task)
                } : project
            )
        case 'UPDATE_TASK':
            return state.map(project => project.id == action.projectId ? 
                {
                    ...project, 
                    taskList: project.taskList.map(task => task.id == action.task.id ? action.task : task)
                } : project
            )
        default:
            return state
    }
}

const projectStore = createStore(projectReducer)

const addTask = (projectId, task) => ({
    type: 'ADD_TASK',
    projectId,
    task
})

const removeTask = (projectId, taskId) => ({
    type: 'REMOVE_TASK',
    projectId,
    taskId
})

const updateTask = (projectId, task) => ({
    type: 'UPDATE_TASK',
    projectId,
    task
})

const renameTask = (projectId, taskId, name) => ({
    type: 'RENAME_TASK',
    projectId,
    taskId,
    name
})

const clearProjects = () => ({
    type: 'SETUP_PROJECTS',
    projects: []
})

const renameProject = (projectId, name) => ({
    type: 'RENAME_PROJECT',
    projectId,
    name
})

const updateProject = (project) => ({
    type: 'UPDATE_PROJECT',
    project
})

const addProject = (project) => ({
    type: 'ADD_PROJECT',
    project
})

const removeProject = (projectId) => ({
    type: 'REMOVE_PROJECT',
    projectId
})

const loadProjects = (projects) => ({
    type: 'SETUP_PROJECTS',
    projects
})

export default {
    projectStore, 
    clearProjects, 
    addProject, 
    removeProject, 
    updateProject, 
    renameProject,
    renameTask,
    loadProjects,
    addTask,
    removeTask,
    updateTask
}