<template>
  <div v-if="dataLoadStatus_ready" class="col-full push-top">

    <h1>Create new thread in <i>{{ forum.name }}</i></h1>

    <ThreadEditor @save="saveThread" @cancel="cancel" @dirty="formIsDirty = true" @clean="formIsDirty = false"/>

  </div>
</template>

<script>
import ThreadEditor from "@/components/ThreadEditor.vue"
import { mapActions } from "vuex"
import dataLoadStatus from '@/mixins/dataLoadStatus.js'

export default {
  name: "PageThreadCreate",
  components: {ThreadEditor},
  mixins: [dataLoadStatus],
  props: {
    forumId: {
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
    forum() {
      return this.$store.state.forums.items.find(f => f.id === this.forumId)
    }
  },
  methods: {
    ...mapActions('forums', ['fetchForum']),
    ...mapActions('threads', ['createThread']),
    async saveThread({title, text}) {
      const thread = await this.createThread({
        forumId: this.forum.id,
        title,
        text
      })
      this.formIsDirty = false
      await this.$router.push({name: 'ThreadView', params: {id: thread.id}})
    },
    cancel(){
      this.$router.push({name:'PageForum', params:{id: this.forum.id}})
    }
  },
  async created() {
    await this.fetchForum({ id: this.forumId })
    this.dataLoadStatus_fetched()
  },
  beforeRouteLeave() {
    if (this.formIsDirty) {
      const confirmed = window.confirm('Unsaved changes will be lost if you leave this page. Are you sure?')
      if (!confirmed) return false
    }
  }
}
</script>