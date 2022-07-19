import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import AppDate from '@/components/AppDate.vue'
import AppSpinner from '@/components/AppSpinner.vue'
import AppInfiniteScroll from "@/components/AppInfiniteScroll.vue"
import AppNotifications from "@/components/AppNotifications.vue"
import AppAvatarImage from "@/components/AppAvatarImage.vue";
import AppFormField from "@/components/AppFormField.vue";
import FontAwesome from "@/plugins/FontAwesome.js"
import clickOutsideDirective from "@/plugins/ClickOutsideDirective.js"
import PageScrollDirective from "@/plugins/PageScrollDirective.js"
import Vue3Pagination from "@/plugins/Vue3Pagination.js"
import VeeValidatePlugin from "@/plugins/VeeValidatePlugin.js"



createApp(App)
    .use(router)
    .use(store)
    .use(FontAwesome)
    .use(clickOutsideDirective)
    .use(PageScrollDirective)
    .use(Vue3Pagination)
    .use(VeeValidatePlugin)
    .component('AppDate', AppDate)
    .component('AppSpinner', AppSpinner)
    .component('AppInfiniteScroll', AppInfiniteScroll)
    .component('AppNotifications', AppNotifications)
    .component('AppAvatarImage', AppAvatarImage)
    .component('AppFormField', AppFormField)
    .mount('#app')

