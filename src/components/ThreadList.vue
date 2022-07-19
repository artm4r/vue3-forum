<template>
  <div class="col-full">

    <div class="thread-list">

      <h2 class="list-title">Threads</h2>

      <div v-if="threads.length">
        <div v-if="threads" v-for="thread in threads"
             :key="thread.id"
             class="thread">
          <div>
            <p>
              <router-link v-if="thread.id" :to="{name: 'ThreadView', params: {id: thread.id}}">{{ thread.title }}</router-link>
            </p>
            <p class="text-faded text-xsmall">
              By <a href="profile.html">{{ userById(thread.userId).name }}</a>, <AppDate v-if="thread.publishedAt" :timestamp="thread.publishedAt"/>.
            </p>
          </div>

          <div class="activity">
            <p class="replies-count">
              {{ thread.repliesCount }} replies
            </p>

            <AppAvatarImage class="avatar-medium" :src="userById(thread.userId).avatar" />

            <div>
              <p class="text-xsmall">
                <a href="profile.html">{{ userById(thread.userId).name }}</a>
              </p>
              <p class="text-xsmall text-faded">
                <AppDate v-if="thread.publishedAt" :timestamp="thread.publishedAt"/>
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div v-if="!threads.length" style="padding: 10px; text-align:center;">
      <em>No threads available</em>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    threads: {
      type: Array,
      required: true
    }
  },
  name: "ThreadList",
  computed: {
    posts() {
      return this.$store.state.posts.items
    },
    users() {
      return this.$store.state.users.items
    },
  },
  methods: {
    userById(userId) {
      return this.users.find(p=>p.id === userId) || {}
    },
  },
}
</script>

<style scoped>

</style>