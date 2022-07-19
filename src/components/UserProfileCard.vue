<template>
  <div>
    <div class="profile-card">

      <p class="text-center">
        <AppAvatarImage :src="user.avatar"
             class="avatar-xlarge" />
      </p>

      <h1 class="title">{{ user.username }}</h1>

      <p class="text-lead">{{ user.name }}</p>

      <p class="text-justify">
        {{ user.bio || 'No bio specified.' }}
      </p>

      <span class="online"><fa icon="earth-europe" />{{ user.username }} is online</span>


      <div class="stats">
        <span>{{ user.postsCount }} posts</span>
        <span>{{ user.threadsCount }} threads</span>
      </div>

      <p v-if="user.website" class="text-large text-center"><i class="fa fa-globe"></i> <a :href="user.website">{{ user.website }}</a></p>

    </div>

    <div class="text-center">
      <hr>
      <router-link :to="{name: 'PageProfileEdit'}" class="btn-green btn-small">Edit Profile</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserProfileCard",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
}
</script>

<style scoped>

</style>