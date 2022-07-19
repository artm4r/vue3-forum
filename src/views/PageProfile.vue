<template>
  <div class="flex-grid">
    <div class="col-3 push-top">

      <UserProfileCard v-if="!edit" :user="authUser" />
      <UserProfileCardEditor v-else :user="authUser" />

    </div>

    <div class="col-7 push-top">

      <div class="profile-header">
                <span class="text-lead">
                    {{ authUser?.username }}'s recent activity
                </span>
      </div>

      <hr>

      <PostList :posts="authUser.posts" />

      <app-infinite-scroll @load="loadPosts" :done="authUser.posts.length === authUser.postsCount" />

    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import PostList from "@/components/PostList.vue"
import UserProfileCard from "@/components/UserProfileCard.vue"
import UserProfileCardEditor from "@/components/UserProfileCardEditor.vue"
import dataLoadStatus from '@/mixins/dataLoadStatus.js'

export default {
  name: "PageProfile",
  mixins: [ dataLoadStatus ],
  components: { UserProfileCardEditor, UserProfileCard, PostList},
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters('auth', ["authUser"]),
    lastPost() {
      if (this.authUser.posts.length === 0) return null
      return this.authUser.posts[this.authUser.posts.length - 1]
    },
  },
  methods: {
    loadPosts() {
      return this.$store.dispatch('auth/fetchAuthUserPosts', { startAt: this.lastPost })
    },
  },
  async created() {
    await this.loadPosts()
    this.dataLoadStatus_fetched()
  }
}
</script>
