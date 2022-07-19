import {docToResource, findById, makeAppendChildToParentMutation, makeFetchItemMutation, makeFetchItemsMutation} from "@/helpers";
import {arrayUnion, collection, doc, getDoc, serverTimestamp, writeBatch} from "firebase/firestore";
import db from "@/helpers/firebase-init.js";
import { chunk } from "lodash";

export default {
    namespaced: true,
    state: {
        items: []
    },
    getters: {
        thread: (state, getters, rootState) => {
            return (id) => {
                const thread = findById(state.items, id)
                if (!thread) return {}
                return {
                    ...thread,
                    get author() {
                        return findById(rootState.users.items, thread.userId)
                    },
                    get repliesCount() {
                        return thread.posts.length - 1
                    },
                    get contributorsCount() {
                        return thread.contributors?.length || 0
                    }
                }
            }
        },
    },
    actions: {
        async createThread ({ commit, state, dispatch, rootState }, { text, title, forumId }) {
            const userId = rootState.auth.authId
            const publishedAt = serverTimestamp()

            //Firebase
            const batch = writeBatch(db)

            const threadRef = doc(collection(db, 'threads'))
            const userRef = doc(db, 'users', userId)
            const forumRef = doc(db, 'forums', forumId)
            const thread = { forumId, title, publishedAt, userId, id: threadRef.id }

            batch.set(threadRef, thread)
            batch.update(userRef, { threads: arrayUnion(threadRef.id) })
            batch.update(forumRef, { threads: arrayUnion(threadRef.id) })
            await batch.commit()

            const newThread = await getDoc(threadRef)

            commit('setItem', { resource: 'threads', item: newThread }, { root: true })
            commit('users/appendThreadToUser', { parentId: userId, childId: newThread.id }, { root: true })
            commit('forums/appendThreadToForum', { parentId: forumId, childId: newThread.id }, { root: true })
            await dispatch('posts/createPost', { text, threadId: newThread.id, firstInThread: true }, { root: true })
            return findById(state.items, newThread.id)
        },
        async updateThread ({ commit, state }, { title, text, id }) {
            const thread = findById(state.items, id)

            //Firebase
            const batch = writeBatch(db)
            const threadRef =  doc(db, 'threads', id)
            const postRef = doc(db, 'posts', thread.posts[0])

            batch.update(threadRef, {
                title
            })
            batch.update(postRef, {
                text
            })
            await batch.commit()

            const newThread =  await getDoc(threadRef)
            const newPost = await getDoc(postRef)

            commit('setItem', { resource: 'threads', item: newThread }, { root: true })
            commit('setItem', { resource: 'posts', item: newPost }, { root: true })

            return docToResource(newThread)
        },
        fetchThread: makeFetchItemMutation({ resource: 'threads' }),
        fetchThreads: makeFetchItemsMutation({ resource: 'threads' }),
        fetchPagedThreads: ({ dispatch, commit }, { ids, page, perPage = 5 }) => {
            commit('clearThreads')
            const chunks = chunk(ids, perPage)
            const limitedIds = chunks[page - 1]
            return dispatch('fetchThreads', { ids: limitedIds })
        }
    },
    mutations: {
        appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),
        appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' }),
        clearThreads(state) {
            state.items = []
        }
    }
}