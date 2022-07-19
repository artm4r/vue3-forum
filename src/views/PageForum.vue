<template>
  <div v-if="dataLoadStatus_ready" class="container col-full">
    <div class="col-full push-top">
      <div class="forum-header">
        <div class="forum-details">
          <h1>{{ forum.name }}</h1>
          <p class="text-lead">{{ forum.description }}</p>
        </div>
        <router-link :to="{name: 'ThreadCreate', params: { forumId: forum.id }}" class="btn-green btn-small">Start a thread</router-link>
      </div>
    </div>

    <div class="col-full push-top">
      <ThreadList :threads="threads" />
      <v-pagination
          v-model="page"
          :pages="pagesCount"
          active-color="#57ad8d"
      />
    </div>
  </div>
</template>

<script>
import ThreadList from "@/components/ThreadList.vue"
import { mapActions } from "vuex"
import dataLoadStatus from '@/mixins/dataLoadStatus.js'

export default {
  name: "PageForum",
  components: { ThreadList },
  mixins: [dataLoadStatus],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data(){
    return {
      page: parseInt(this.$route.query.page) || 1,
      perPage: 5
    }
  },
  computed: {
    forum() {
      return this.$store.state.forums.items.find(forum => forum.id === this.id)
    },
    threads() {
      if (!this.forum) return []
      return this.$store.state.threads.items
          .filter(thread => thread.forumId === this.forum.id)
          .map(thread => this.$store.getters['threads/thread'](thread.id))
    },
    threadsCount() {
      return this.forum.threads?.length || 0
    },
    pagesCount() {
      if (!this.threadsCount) return 0
      return Math.ceil(this.threadsCount / this.perPage)
    },
  },
  methods: {
    ...mapActions('forums',['fetchForum']),
    ...mapActions('threads',['fetchPagedThreads']),
    ...mapActions('users',['fetchUsers'])
  },
  async created() {
    if (this.$route.query.page && (parseInt(this.$route.query.page) > this.pagesCount)) {
      this.page = this.pagesCount
    }
    const forum = await this.fetchForum({ id: this.id })
    const threads = await this.fetchPagedThreads({ ids: forum.threads, page: this.page, perPage: this.perPage })
    await this.fetchUsers({ ids: threads.map(thread => thread.userId) })
    this.dataLoadStatus_fetched()
  },
  watch: {
    page () {
      this.$router.push({ query: { page: this.page } })
    }
  }
}
</script>

<style scoped>

</style>