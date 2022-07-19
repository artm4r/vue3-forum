import {doc, onSnapshot} from "firebase/firestore"
import db from "@/helpers/firebase-init.js"
import {findById} from "@/helpers";

export default {
    //Helpers
    fetchItem({ state, commit }, { id, resource, handleUnsubscribe = null, once = false, snapshotHandler = false }) {
        return new Promise(resolve => {
            const unsubscribe = onSnapshot(doc(db, resource, id), (doc)=> {
                if (once) {
                    unsubscribe()
                }
                if (doc.exists()) {
                    const item = {...doc.data(), id: doc.id}
                    let previousItem = findById(state[resource].items, id)
                    previousItem = previousItem ? { ...previousItem } : null
                    commit('setItem', { resource, item })
                    if (typeof(snapshotHandler) === 'function') {
                        const isLocal = doc.metadata.hasPendingWrites
                        snapshotHandler({ item: {...item}, previousItem ,isLocal })
                    }
                    resolve(item)
                } else {
                    resolve(null)
                }
            })
            if (handleUnsubscribe) {
                handleUnsubscribe(unsubscribe)
            } else {
                commit('updateSnapshotSubscribesList', { unsubscribe })
            }
        })
    },
    fetchItems({ dispatch }, { ids = [], resource, snapshotHandler = null }) {
        return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource, snapshotHandler })))
    },
    unsubscribeFromAllSnapshots({ state, commit }) {
        state.snapshotListeners.forEach(item => { item() })
        commit('clearAllSnapshotListeners')
    },
    clearItems({ commit }, { modules = [] }) {
        commit('clearItems', { modules })
    },
}