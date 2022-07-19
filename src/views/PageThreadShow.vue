<template>
  <div v-if="dataLoadStatus_ready" class="col-large push-top" >

    <h1>{{thread.title}}
    <router-link
        v-if="thread.userId === authUser?.id"
        :to="{name: 'ThreadEdit', params: { id } }"
        class="tn-green btn-small"
    >Edit thread</router-link>
    </h1>

    <p>
      By <a href="#" class="link-unstyled">{{ thread?.author?.name }}</a>, <AppDate v-if="thread.publishedAt" :timestamp="thread.publishedAt"/>.
      <span style="float:right; margin-top: 2px;"
            class="hide-mobile text-faded text-small">{{ thread.repliesCount }} replies by {{ threadContributorCountString }}</span>
    </p>

    <PostList :posts="threadPosts" />

    <PostEditor v-if="authUser" @postSaved="addPost" />
    <div v-else class="text-center" style="margin-bottom: 50px;">
      <router-link :to="{ name: 'Login', query: { redirectTo: $route.path } }">Sign In</router-link> or <router-link :to="{ name: 'Registration',  query: { redirectTo: $route.path } }">Register</router-link> to reply.
    </div>

  </div>
</template>

<script>

import PostList from "@/components/PostList.vue"
import PostEditor from "@/components/PostEditor.vue"
import AppDate from "@/components/AppDate.vue"
import { mapActions, mapGetters } from "vuex"
import dataLoadStatus from '@/mixins/dataLoadStatus.js'
import useNotifications from "@/composables/useNotification.js"
import {difference} from "lodash";

export default {
  components: {
    AppDate,
    PostList,
    PostEditor,
  },
  setup() {
    const { addNotification } = useNotifications()
    return { addNotification }
  },
  mixins: [dataLoadStatus],
  props: {
    id: String,
  },
  name: 'PageThreadShow',
  computed: {
    ...mapGetters('auth', ['authUser']),
    threads () {
      return this.$store.state.threads.items
    },
    posts() {
      return this.$store.state.posts.items
    },
    thread() {
      return this.$store.getters['threads/thread'](this.id)
    },
    threadPosts() {
      return this.posts.filter(p => p.threadId === this.id)
    },
    threadContributorCountString() {
      if (this.thread.contributorsCount) {
        return this.thread.contributorsCount === 1 ? '1 contributor' : `${this.thread.contributorsCount} contributors`
      } else {
        return 'no contributors'
      }
    },
  },
  methods: {
    ...mapActions('posts', ['createPost', 'fetchPosts']),
    ...mapActions('users', ['fetchUsers']),
    ...mapActions('threads', ['fetchThread']),
    addPost(eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id
      }
      this.createPost(post)
    },
    async fetchThreadPostsAndUsers(ids) {
      const posts = await this.fetchPosts({
        ids,
        snapshotHandler: ({isLocal, previousItem}) => {
          if (!this.dataLoadStatus_ready || isLocal || (previousItem?.edited && !previousItem?.edited?.at)) return
          this.addNotification({ message: 'Thread recently updated', timeout: 2000 })
        }
      })
      const users = posts.map(post => post.userId).concat(this.thread.userId)

      await this.fetchUsers({ ids: users })
    }
  },
  async created() {
    const thread = await this.fetchThread({
      id: this.id,
      snapshotHandler: ({ isLocal, item, previousItem }) => {
        if (!this.dataLoadStatus_ready || isLocal) return
        const newPostIds = difference(item.posts, previousItem.posts)
        if (newPostIds.length > 0) {
          this.fetchThreadPostsAndUsers(newPostIds)
        } else {
          this.addNotification({ message: 'Thread recently updated', timeout: 2000 })
        }
      }
    })
    await this.fetchThreadPostsAndUsers(thread.posts)
    this.dataLoadStatus_fetched()
  }
}
</script>
