import {collection, onSnapshot, query} from "firebase/firestore";
import db from "@/helpers/firebase-init.js";
import {makeFetchItemMutation, makeFetchItemsMutation} from "@/helpers";

export default {
    namespaced: true,
    state: {
        items: []
    },
    getters: {

    },
    actions: {
        fetchCategory: makeFetchItemMutation({ resource: 'categories'}),
        fetchCategories: makeFetchItemsMutation({ resource: 'categories'}),
        fetchAllCategories({ commit }) {
            return new Promise(resolve => {

                const q = query(collection(db, 'categories'))

                onSnapshot(q, (querySnapshot) => {
                    const categories = querySnapshot.docs.map(doc => {
                        const item =  {...doc.data(), id: doc.id}
                        commit('setItem', {resource: 'categories', item}, { root: true })
                        return item
                    })
                    resolve(categories)
                })
            })
        },
    },
    mutations: {

    }
}