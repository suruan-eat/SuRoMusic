import VueRouter from "vue-router";
import SearchPage from '../page/SearchPage'
import HomePage from '../page/HomePage'
import PlaylistDetails from '../page/PlaylistDetails'

const router = new VueRouter({
    routes: [
        //默认打开路径，根路径会重定向到login上
        {
            path: '/',
            redirect: 'home'
        },
        {
            path: '/search',
            component: SearchPage,
            /* props($route) {
                console.log($route);
                // songList: $route.query.songList
            } */
        },
        {
            path: '/home',
            component: HomePage
        },
        {
            path: '/playlist',
            component: PlaylistDetails
        }
    ]
})
// 解决 Vue 重复点击相同路由，出现 Uncaught (in promise) NavigationDuplicated: Avoided redundant navigation 问题
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch(err => err)
}

export default router