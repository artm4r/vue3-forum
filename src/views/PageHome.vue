<template>
  <div v-if="dataLoadStatus_ready" class="container col-full">
    <h1 class="push-top">Welcome to the forum</h1>
    <CategoryList :categories="categories" />
  </div>
</template>

<script>
import CategoryList from "@/components/CategoryList.vue"
import { mapActions } from 'vuex'
import dataLoadStatus from '@/mixins/dataLoadStatus.js'

export default {
  components:{
    CategoryList,
  },
  mixins: [dataLoadStatus],
  name: 'PageHome',
  computed: {
    categories() {
      return this.$store.state.categories.items
    }
  },
  methods: {
    ...mapActions('categories', ['fetchAllCategories']),
    ...mapActions('forums', ['fetchForums']),
  },
  async created() {
    const categories = await this.fetchAllCategories()
    const forumIds = categories.map(cat => cat.forums).flat()
    await this.fetchForums({ ids: forumIds })
    this.dataLoadStatus_fetched()
  }
}
</script>

<style scoped>

</style>