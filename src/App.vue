<template>
  <TheNavbar />
  <div class="container">
    <router-view v-show="showPage" @fetched="onPageReady" :key="`${$route.path}${JSON.stringify($route.query)}`" />
    <AppSpinner v-show="!showPage" />
  </div>
  <AppNotifications />
</template>

<script>
import PageHome from '@/views/PageHome.vue'
import TheNavbar from "@/components/TheNavbar.vue"
import NProgress from 'nprogress'
import { mapActions } from "vuex";

export default {
  name: "App",
  components: {
    TheNavbar,
    PageHome
  },
  data() {
    return {
      showPage: false
    }
  },
  methods: {
    ...mapActions('auth', ['fetchAuthUser']),
    onPageReady() {
      this.showPage = true
      NProgress.done()
    },
  },
  created() {
    this.fetchAuthUser()
    NProgress.configure({ speed: 200, showSpinner: false })
    this.$router.beforeEach(() => {
      this.showPage = false
      NProgress.start()
    })
  }
}
</script>

<style>
  @import "../node_modules/nprogress/nprogress.css";
  #nprogress .bar {
    background-color: #57ad8d !important;
  }
</style>
