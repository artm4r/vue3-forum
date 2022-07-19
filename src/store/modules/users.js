import {
    docToResource,
    findById,
    makeAppendChildToParentMutation,
    makeFetchItemMutation,
    makeFetchItemsMutation
} from "@/helpers";
import {doc, getDoc, serverTimestamp, setDoc, updateDoc} from "firebase/firestore";
import db from "@/helpers/firebase-init.js";

export default {
    namespaced: true,
    state: {
        items: []
    },
    getters: {
        user: (state, getters, rootState) => {
            return (id) => {
                const user = findById(state.items, id)
                if (!user) return null
                return {
                    ...user,
                    get posts () {
                        return rootState.posts.items.filter(post => post.userId === user.id)
                    },
                    get postsCount () {
                        return user.postsCount || 0
                    },
                    get threads () {
                        return rootState.threads.items.filter(post => post.userId === user.id)
                    },
                    get threadIds () {
                        return user.threads
                    },
                    get threadsCount () {
                        return user.threads?.length || 0
                    }
                }
            }
        },
    },
    actions: {
        async updateUser ({ commit }, user) {
            const updates = {
                avatar: user.avatar || null,
                username: user.username || null,
                name: user.name || null,
                bio: user.bio || null,
                website: user.website || null,
                email: user.email || null,
                location: user.location || null
            }
            const userRef = doc(db, 'users', user.id)
            await updateDoc(userRef, updates)
            commit('setItem', { resource: 'users', item: user }, { root: true })
        },
        async createUser({ commit }, { id, email, name, username, avatar = null }) {
            const registeredAt = serverTimestamp()
            const usernameLower = username.toLowerCase()
            email = email.toLowerCase()
            const user = { name, username, usernameLower, registeredAt, email, avatar }
            const userRef = doc(db, 'users', id)

            await setDoc(userRef, user)
            const newUser =  await getDoc(userRef)
            commit('setItem', { resource: 'users', item: newUser }, { root: true })
            return docToResource(newUser)
        },
        fetchUser: makeFetchItemMutation({ resource: 'users'}),
        fetchUsers: makeFetchItemsMutation({ resource: 'users'}),
    },
    mutations: {
        appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' }),
    }
}