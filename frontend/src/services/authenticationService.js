import axios from 'axios'

const isLoggedIn = () => {
    return Boolean(window.localStorage.getItem('token'))
}

const getToken = () => {
    return window.localStorage.getItem('token')
}

const register = async (name, username, password) => {
    try {
        const response = await axios.post(`/api/register`, {
            name,
            username,
            password
        })

        if (response.data.error) return false
    } catch {
        return false
    }

    return true
}

const login = async (username, password) => {
    try {
        const response = await axios.post(`/api/login`, {
            username,
            password
        })

        if (response.data.error) return false
        window.localStorage.setItem('token', response.data["access_token"])
    } catch {
        return false
    }

    return true
}

const logout = () => {
    window.localStorage.clear()
}

export { register, login, logout, isLoggedIn, getToken }