<template>
  <div class="post-list">

    <div class="post"
         v-for="post in posts"
         :key="post.id"
    >

      <div v-if="userById(post.userId)" class="user-info">
        <a href="#" class="user-name">{{ userById(post.userId).name }}</a>

        <a href="#">
          <AppAvatarImage class="avatar-large" :src="userById(post.userId).avatar" />
        </a>

        <p class="desktop-only text-small">{{ userById(post.userId).postsCount }} posts</p>

        <p class="desktop-only text-small">{{ userById(post.userId).threadsCount }} threads</p>

      </div>

      <div class="post-content">
        <div class="col-full">
          <PostEditor
              :post="post"
              v-if="editing === post.id"
              @postSaved="handleUpdate($event.post)"
          />
          <p v-else>{{ post.text }}</p>
        </div>
        <a
            v-if="post.userId === authUser()?.id"
            @click.prevent="toggleEditMode(post.id)"
            href="#"
            style="margin-left: auto; padding-left: 10px;"
            class="link-unstyled"
            title="Make a change"
        >
          <fa icon="pencil" />
        </a>
      </div>



      <div class="post-date text-faded">
        <div v-if="post.edited?.at" class="edition-info">edited</div>
        <AppDate :timestamp="post.edited?.at ||post.publishedAt" />
      </div>

    </div>
  </div>
</template>

<script>
import PostEditor from "@/components/PostEditor.vue"
import { mapActions, mapGetters } from "vuex"

export default {
  name: "PostList",
  components: {PostEditor},
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      editing: null,
    }
  },
  methods: {
    ...mapActions('posts', ['updatePost']),
    ...mapGetters('auth', ['authUser']),
    userById(userId) {
      return this.$store.getters['users/user'](userId)
    },
    toggleEditMode(id) {
      this.editing = this.editing === id ? null : id

    },
    handleUpdate(post) {
      this.updatePost(post)
      this.editing = null
    },
  },
}
</script>

<style scoped>

</style>