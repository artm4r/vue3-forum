import {
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    EmailAuthProvider,
    onAuthStateChanged,
    updateEmail,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from "firebase/auth";
import {collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter, where} from "firebase/firestore";
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import db from "@/helpers/firebase-init.js";
import useNotifications from "@/composables/useNotification.js";

export default {
    namespaced: true,
    state: {
        authId: null,
        authUserUnsubscribe: null,
        authObserverUnsubscribe: null
    },
    getters: {
        authUser: (state, getters, rootState, rootGetters) => {
            return rootGetters['users/user'](state.authId)
        },
    },
    actions: {
        async updateUserEmail({state}, {email}) {
            const auth = getAuth()
            return updateEmail(auth.currentUser, email)
        },
        async reauthenticateUser({state}, {email, password}) {
            const auth = getAuth()
            const user = auth.currentUser
            const credential = EmailAuthProvider.credential(email, password)

            return await reauthenticateWithCredential(user, credential)
        },
        initAuthentication({ dispatch, commit, state }) {
            if (state.authObserverUnsubscribe) return
            return new Promise(resolve => {
                const auth = getAuth()
                const unsubscribe = onAuthStateChanged(auth, async (user) => {
                    dispatch('unsubscribeAuthUser')
                    if (user) {
                        await dispatch('fetchAuthUser')
                        resolve(user)
                    } else {
                        resolve(null)
                    }
                })
                commit('setAuthObserverUnsubscribe', unsubscribe)
            })
        },
        async createUserEmailPassword({ dispatch }, { avatar = null, email, name, username, password }) {
            const auth = getAuth()
            const result = await createUserWithEmailAndPassword(auth, email, password)
            if (avatar) {
                avatar = await dispatch('uploadAvatar', { authId: result.user.uid, file: avatar })
            }

            dispatch('users/createUser', { id: result.user.uid, email, name, username, avatar }, { root: true })
        },
        async signInWithEmailPassword({ commit }, { email, password}) {
            const auth = getAuth()
            return signInWithEmailAndPassword(auth, email, password)
        },
        async uploadAvatar({ state }, { authId, file, filename}) {
            if (!file) return null
            authId = authId || state.authId

            try {
                const storage = getStorage()
                const userImagesRef = ref(storage, `uploads/${authId}/images/${Date.now()}-${ file.name || filename }`)
                const avatarUploadResult = await uploadBytes(userImagesRef, file)

                return await getDownloadURL(avatarUploadResult.ref)
            } catch (err) {
                const { addNotification } = useNotifications()
                addNotification({ message: 'Error while uploading avatar', type: 'error', timeout: 5000 })
            }
        },
        async signInWithGoogle({ dispatch }) {
            const provider = new GoogleAuthProvider();
            const auth = getAuth()
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            const userRef = doc(db, 'users', user.uid)
            const userDoc = await getDoc(userRef)
            if(!userDoc.exists()) {
                return dispatch('users/createUser', { id: user.uid, name: user.displayName, email: user.email, username: user.email, avatar: user.photoURL}, { root: true })
            }
        },
        async userSignOut({ commit }) {
            const auth = getAuth();
            await signOut(auth)
            commit('setAuthId', null)
        },
        fetchAuthUser:  async ({ dispatch, commit }) => {
            const auth = getAuth()
            const userId = auth.currentUser?.uid
            if (!userId) return

            await dispatch('fetchItem', {
                resource: 'users',
                id: userId,
                handleUnsubscribe: (unsubscribe) => {
                    commit('setAuthUserUnsubscribe', unsubscribe)
                }
            }, { root: true })

            commit('setAuthId', userId)
        },
        async fetchAuthUserPosts({ commit, state }, { startAt = null }) {
            let postsQuery = null
            if (startAt) {
                const postRef = doc(db, 'posts', startAt.id)
                const lastPost = await getDoc(postRef)
                postsQuery = query(
                    collection(db, 'posts'),
                    where('userId', '==', state.authId),
                    orderBy('publishedAt', 'desc'),
                    startAfter(lastPost),
                    limit(5)
                )
            } else {
                postsQuery = query(
                    collection(db, 'posts'),
                    where('userId', '==', state.authId),
                    orderBy('publishedAt', 'desc'),
                    limit(5)
                )
            }

            const posts = await getDocs(postsQuery)
            posts.forEach(post => {
                commit('setItem', { resource: 'posts', item: post}, { root: true })
            })
        },
        async unsubscribeAuthUser({ state, commit }) {
            if(state.authUserUnsubscribe) {
                state.authUserUnsubscribe()
                commit('setAuthUserUnsubscribe', null)
            }
        }
    },
    mutations: {
        setAuthId(state, id) {
            state.authId = id
        },
        setAuthUserUnsubscribe(state, unsubscribe) {
            state.authUserUnsubscribe = unsubscribe
        },
        setAuthObserverUnsubscribe(state, unsubscribe) {
            state.authObserverUnsubscribe = unsubscribe
        },
    }
}