import { upsert, docToResource } from "@/helpers";

export default {
    setItem (state, { resource, item }) {
        upsert(state[resource].items, docToResource(item))
    },
    clearItems(state, { modules = [] }) {
        modules.forEach(module => {
            state[module].items = []
        })
    },
    updateSnapshotSubscribesList(state, { unsubscribe }) {
        state.snapshotListeners.push(unsubscribe)
    },
    clearAllSnapshotListeners(state) {
        state.snapshotListeners = []
    },
}