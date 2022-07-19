import { createStore } from "vuex"
import actions from "@/store/actions.js"
import mutations from "@/store/mutations.js"
import getters from "@/store/getters.js"
//modules
import auth from './modules/auth.js'
import categories from './modules/categories.js'
import forums from './modules/forums.js'
import posts from './modules/posts.js'
import threads from './modules/threads.js'
import users from './modules/users.js'


export default createStore({
    modules: {
        auth,
        categories,
        forums,
        posts,
        threads,
        users
    },
    state: {
        snapshotListeners: []
    },
    getters,
    actions,
    mutations,
})

