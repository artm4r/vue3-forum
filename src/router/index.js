import {createRouter, createWebHistory} from 'vue-router'
import store from "@/store";

import PageHome from '@/views/PageHome.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: PageHome
    },
    {
        path: '/me',
        name: 'PageProfile',
        meta: { requiresAuth: true },
        component: () => import('@/views/PageProfile.vue'),
    },
    {
        path: '/me/edit',
        name: 'PageProfileEdit',
        component: () => import('@/views/PageProfile.vue'),
        props: { edit: true },
        meta: { requiresAuth: true }
    },
    {
        path: '/category/:id',
        name: 'PageCategory',
        component: ()=> import('@/views/PageCategory.vue'),
        props: true,
        async beforeEnter(to) {
            await store.dispatch('categories/fetchCategory', { id: to.params.id, once: true })
            const exist = store.state.categories.items.find(category => category.id === to.params.id)
            if (!exist) return {
                name: 'NotFound',
                // allows keeping the URL while rendering a different page
                params: { pathMatch: to.path.split('/').slice(1) },
                query: to.query,
                hash: to.hash,
            }
        },
    },
    {
        path: '/forum/:id',
        name: 'PageForum',
        component: ()=> import('@/views/PageForum.vue'),
        props: true,
        async beforeEnter(to) {
            await store.dispatch('forums/fetchForum', { id: to.params.id, once: true })
            const exist = store.state.forums.items.find(forum=> forum.id === to.params.id)
            if (!exist) return {
                name: 'NotFound',
                // allows keeping the URL while rendering a different page
                params: { pathMatch: to.path.split('/').slice(1) },
                query: to.query,
                hash: to.hash,
            }
        },
    },
    {
        path: '/thread/:id',
        name: 'ThreadView',
        component: ()=> import('@/views/PageThreadShow.vue'),
        props: true,
        async beforeEnter(to) {
            await store.dispatch('threads/fetchThread', { id: to.params.id, once: true })
            const exist = store.state.threads.items.find(thread => thread.id === to.params.id)

            if (!exist) return {
                name: 'NotFound',
                // allows keeping the URL while rendering a different page
                params: { pathMatch: to.path.split('/').slice(1) },
                query: to.query,
                hash: to.hash,
            }
        },
    },
    {
        path: '/forum/:forumId/thread/create/',
        name: 'ThreadCreate',
        component: ()=> import('@/views/PageThreadCreate.vue'),
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/thread/:id/edit',
        name: 'ThreadEdit',
        component: () => import('@/views/PageThreadUpdate.vue'),
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/register',
        name: 'Registration',
        component: () => import('@/views/PageRegister.vue'),
        meta: { guestOnly: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/PageSignIn.vue'),
        meta: { guestOnly: true }
    },
    {
        path: '/logout',
        name: 'Logout',
        async beforeEnter() {
            await store.dispatch('auth/userSignOut')
            return { name: 'Home' }
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior (to, from, savedPosition) {
        return savedPosition || new Promise((resolve)=>{
            setTimeout(()=> resolve({ top:0 }), 300)
        })
    },
    routes
})
router.afterEach(() => {
    store.dispatch('clearItems', { modules: ['categories', 'posts', 'threads', 'forums'] })
})
router.beforeEach(async (to, from) => {
    await store.dispatch('auth/initAuthentication')
    store.dispatch('unsubscribeFromAllSnapshots')
    if (to.meta.requiresAuth && !store.state.auth.authId) {
        return { name: 'Login', query: { redirectTo: to.path } }
    }
    if (to.meta.guestOnly && store.state.auth.authId) {
        return { name: 'Home' }
    }
})

export default router