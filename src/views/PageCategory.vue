<template>
  <div v-if="dataLoadStatus_ready" class="container col-full">
    <h1>{{ category.name }}</h1>
    <ForumList
        :forums="getForumsForCategory(category)"
        :title="category.name"
    />
  </div>
</template>

<script>
import ForumList from "@/components/ForumList.vue";
import { mapActions } from "vuex"
import dataLoadStatus from '@/mixins/dataLoadStatus.js'

export default {
  name: "PageCategory",
  components: {ForumList},
  mixins: [dataLoadStatus],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    category() {
      return this.$store.state.categories.items.find(cat => cat.id === this.id) || {}
    }
  },
  methods: {
    ...mapActions('categories', ['fetchCategory']),
    ...mapActions('forums', ['fetchForums']),
    getForumsForCategory(category) {
      return this.$store.state.forums.items.filter(forum => forum.categoryId === category.id)
    },
  },
  async created() {
    const category = await this.fetchCategory({ id: this.id })
    await this.fetchForums({ ids: category.forums })
    this.dataLoadStatus_fetched()
  }
}
</script>
