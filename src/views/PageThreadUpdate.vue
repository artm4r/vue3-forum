<template>
  <div v-if="dataLoadStatus_ready" class="col-full push-top">

    <h1>Editing <i>{{ thread.title }}</i></h1>

    <ThreadEditor :text="text" :title="thread.title" @save="saveThread" @cancel="cancel" @clear="formIsDirty = false" @dirty="formIsDirty = true"/>

  </div>
</template>

<script>
import ThreadEditor from "@/components/ThreadEditor.vue"
import { mapActions } from "vuex"
import dataLoadStatus from '@/mixins/dataLoadStatus.js'

export default {
  name: "PageThreadUpdate",
  components: {ThreadEditor},
  mixins: [dataLoadStatus],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      formIsDirty: false
    }
  },
  computed: {
    thread() {
      return this.$store.state.threads.items.find(thread => thread.id === this.id)
    },
    text() {
      const post = this.$store.state.posts.items.find(post => post.id === this.thread.posts[0])
      return post ? post.text : ''
    }
  },
  methods: {
    ...mapActions('threads', ['updateThread', 'fetchThread']),
    ...mapActions('posts', ['fetchPost']),
    async saveThread({title, text}) {
      const thread = await this.updateThread({
        id: this.id,
        title,
        text,
      })
      this.formIsDirty = false
      await this.$router.push({name: 'ThreadView', params: {id: thread.id}})
    },
    cancel(){
      this.$router.push({name:'ThreadView', params:{id: this.id}})
    }
  },
  async created() {
    const thread = await this.fetchThread({ id: this.id })
    await this.fetchPost({ id: thread.posts[0]})
    this.dataLoadStatus_fetched()
  },
  beforeRouteLeave() {
    if (this.formIsDirty) {
      const confirmed = window.confirm('Unsaved changes will be lost if you leave this page. Are you sure?')
      if (!confirmed) return false
    }
  },
}
</script>