import {makeAppendChildToParentMutation, makeFetchItemMutation, makeFetchItemsMutation} from "@/helpers";

export default {
    namespaced: true,
    state: {
        items: []
    },
    getters: {

    },
    actions: {
        fetchForum: makeFetchItemMutation({ resource: 'forums'}),
        fetchForums: makeFetchItemsMutation({ resource: 'forums'}),
    },
    mutations: {
        appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' }),
    }
}