import router from './router'
import store from './store'
import {
    Message
} from 'element-ui'
import NProgress from 'nprogress'
import {
    getToken
} from '@/utils/auth'

NProgress.configure({
    showSpinner: false
})

const whiteList = ['/login', '/auth-redirect']
const userTypePath = {
    1: '/competition/student',
    2: '/competition/teacher',
    1001: '/competition/reviewer'
}
router.beforeEach(async (to, from, next) => {
    NProgress.start()
    const hasToken = getToken()
    if (hasToken) {
        if (to.path === '/login') {
            next({
                path: '/'
            })
            NProgress.done()
        } else {
            const hasRoles = store.getters.roles && store.getters.roles.length > 0
            console.log(store.getters.roles)

            if (hasRoles) {
                console.log(to.path)

                next()
                NProgress.done()
            } else {
                try {
                    const {
                        userType
                    } = await store.dispatch('GetInfo')
                    store.dispatch('GenerateRoutes', {
                        roles: [userType]
                    }).then(() => { // 根据roles权限生成可访问的路由表

                        router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                        if (to.path === '/competition') {
                            next({
                                path: userTypePath[userType],
                                replace: true
                            })
                        } else {
                            next({
                                ...to,
                                replace: true
                            }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                        }

                        NProgress.done()
                    }).catch(err => {
                        console.log(2)
                        NProgress.done()
                    })
                } catch (err) {
                    console.log(err)
                }
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
            NProgress.done()
        } else {
            // next(`/login?redirect=${to.path}`)
            next(`/login`)
            NProgress.done()
        }
    }
})