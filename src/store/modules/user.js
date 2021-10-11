import {
    login,
    getInfo
} from '@/api/user'
import {
    getToken,
    setToken,
    removeToken
} from '@/utils/auth'

const user = {
    state: {
        token: getToken(),
        roles: [],
        userData: {}
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_USERDATA: (state, userData) => {
            state.userData = userData
        }
    },
    actions: {
        Login({
            commit
        }, formData) {
            return new Promise((resolve, reject) => {
                login(formData).then(response => {
                    const token = response.data['diss-token']
                    console.log(token)
                    setToken(token)
                    commit('SET_TOKEN', token)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetInfo({
            commit,
            state
        }) {
            return new Promise(async (resolve, reject) => {
                try {
                    let {
                        data: userData
                    } = await getInfo()
                    console.log(userData, 'GetInfo')
                    const userType = userData.userType
                    commit('SET_ROLES', [userType])
                    commit('SET_USERDATA', userData)
                    resolve(userData)
                } catch (err) {
                    reject(err)
                }

            })
        },
        LogOut({
            commit
        }) {
            return new Promise((resolve, reject) => {
                commit('SET_TOKEN', '')
                commit('SET_ROLES', [])
                removeToken()
                resolve()
            })
        }
    }
}

export default user