<template>
  <div class="forum-list col-full push-top">

    <h2 class="list-title">
      <router-link
          v-if="categoryId"
          :to="{name: 'PageCategory', params: {id: categoryId}}"
      >
        {{ title }}
      </router-link>
      <span v-else>{{ title }}</span>
    </h2>

    <div class="forum-listing" v-for="forum in forums" :key="forum.id">
      <div class="forum-details">
        <router-link class="text-xlarge" :to="{name: 'PageForum', params: {id: forum.id}}">{{ forum.name }}</router-link>
        <p>{{ forum.description }}</p>
      </div>

      <div class="threads-count">
        <p>
          <span class="count">{{ forum.threads?.length || '0' }}</span>
          {{ forum.threads?.length === 1 ? 'thread' : 'threads' }}
        </p>
      </div>

      <div class="last-thread"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ForumList",
  props: {
    forums: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: 'Forums'
    },
    categoryId: {
      type: String,
      required: false,
    },
  }
}
</script>

<style scoped>

</style>