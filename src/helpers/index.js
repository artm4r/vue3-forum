export const findById = (resources, id) => {
    if (!resources) return null
    return resources.find(resource => resource.id === id)
}
export const upsert = (resources, item) => {
    const index = resources.findIndex(r => r.id === item.id)

    if (item.id && index !== -1) {
        resources[index] = item
    } else {
        resources.push(item)
    }
}
export const docToResource = (doc) => {
    if (typeof doc?.data !== 'function') return doc
    return { ...doc.data(), id: doc.id }
}

export const makeAppendChildToParentMutation = ({ parent, child }) => {
    return (state, { childId, parentId }) => {
        const resource = findById(state.items, parentId)
        if (!resource) {
            console.warn(`Can't append ${child} ${childId} to ${parent} ${parentId}. Parent doesn't exist.`)
            return
        }
        resource[child] = resource[child] || []
        if (!resource[child].includes(childId)) {
            resource[child].push(childId)
        }
    }
}

export const makeFetchItemMutation = ({ resource }) => {
    return ({ dispatch }, payload) =>  dispatch('fetchItem', { resource, ...payload }, { root: true })
}

export const makeFetchItemsMutation = ({ resource }) => {
    return ({ dispatch }, payload) =>  dispatch('fetchItems', { resource, ...payload }, { root: true })
}

export const arrayRandomItem = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex]
}