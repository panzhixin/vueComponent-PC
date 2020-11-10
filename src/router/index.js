import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const constRouter = [{
    path: "/",
    name: "任务大厅",
    redirect: "/dashboard",
}, {
    path: "/dashboard",
    component: resolve => require(['@/views/dashboard'], resolve),
    name: "dashboard",
    meta: {
        title: "主页",
        keepAlive: true,
    }
}, ];

const router = new Router({
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constRouter
})


router.beforeEach((to, from, next) => {
    next();
})

export default router