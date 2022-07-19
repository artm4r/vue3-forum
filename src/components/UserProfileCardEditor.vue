<template>
  <div class="profile-card">
    <VeeForm @submit="save">
      <p class="text-center avatar-edit">
        <label for="avatar" style="cursor: pointer">
          <AppAvatarImage
              :src="currentUser.avatar"
              class="avatar-xlarge img-update"
          />
      <div class="avatar-upload-overlay">
        <AppSpinner v-if="uploadingImage" color="white"/>
        <fa v-else icon="camera" size="3x" :style="{ color: 'white', opacity: 0.8 }"/>
      </div>
      <input v-show="false" id="avatar" type="file" accept="image/*" @change="handleAvatarUpload"/>
      </label>
      </p>

      <UserProfileCardEditorRandomAvatar @hit="currentUser.avatar = $event"/>

      <AppFormField v-model="currentUser.username" placeholder="Username" name="username" label="Username"
                    :rules="`required|unique:users,username,${user.username}`" />
      <AppFormField v-model="currentUser.name" placeholder="Full name" name="name" label="Full name" />
      <AppFormField v-model="currentUser.bio" placeholder="Write a few words about yourself." name="bio" as="textarea" label="Bio" />

      <div class="stats">
        <span>{{ user.postsCount }} posts</span>
        <span>{{ user.threadsCount }} threads</span>
      </div>

      <hr>

      <AppFormField v-model="currentUser.website" autocomplete="off" placeholder="Your website" name="site" label="Website" rules="url" />
      <AppFormField v-model="currentUser.email" autocomplete="off" placeholder="Your email" name="email" label="Email"
                    :rules="`email|unique:users,email,${user.email}`"/>

      <AppFormField @click="loadLocationOptions" v-model="currentUser.location" autocomplete="off" placeholder="Your location" name="location" label="Location" list="locations" />
      <datalist id="locations">
        <option v-for="location in locationOptions" :value="location.name.common" :key="location.name.common" />
      </datalist>

        <div class="btn-group space-between">
          <button :disabled="processing" class="btn-ghost" @click.prevent="cancel">
            Cancel
          </button>
          <button :disabled="processing" type="submit" class="btn-blue">
            Save
          </button>
        </div>


    </VeeForm>
    <ReauthPopup v-model="showModal" @success="onReauth" @fail="onReauthFail" />
  </div>
</template>

<script>
import {mapActions} from "vuex";
import UserProfileCardEditorRandomAvatar from "@/components/UserProfileCardEditorRandomAvatar.vue";
import ReauthPopup from "@/components/ReauthPopup.vue";
import useNotifications from "@/composables/useNotification.js";

export default {
  name: "UserProfileCardEditor",
  components: {UserProfileCardEditorRandomAvatar, ReauthPopup},
  props: {
    user: {
      type: Object,
      required: true
    },
  },
  setup() {
    const { addNotification } = useNotifications()
    return { addNotification }
  },
  data() {
    return {
      currentUser: {...this.user},
      uploadingImage: false,
      processing: false,
      locationOptions: [],
      showModal: false
    }
  },
  methods: {
    ...mapActions('auth', ['uploadAvatar']),
    async loadLocationOptions() {
      if (this.locationOptions.length) return
      const res = await fetch('https://restcountries.com/v3.1/all')
      this.locationOptions = await res.json()
    },
    async onReauth() {
      await this.$store.dispatch('auth/updateUserEmail', { email: this.currentUser.email })
      this.saveUserProfileData()
      this.processing = false
    },
    async onReauthFail() {
      this.addNotification({ message: 'Reauthentication failed', type: 'error', timeout: 4000 })
      this.$router.push({name: 'PageProfile'})
    },
    async saveUserProfileData() {
      await this.$store.dispatch('users/updateUser', { ...this.currentUser, threads: this.currentUser.threadIds })
      this.processing = false
      this.$router.push({name: 'PageProfile'})
      this.addNotification({ message: 'User profile updated', type: 'info', timeout: 4000 })
    },
    async save() {
      this.processing = true
      await this.handleRandomAvatarUpload()
      const emailChanged = this.currentUser.email !== this.user.email
      if (emailChanged) {
        this.showModal = true
      } else {
        this.saveUserProfileData()
      }
    },
    cancel() {
      this.currentUser = {...this.user}
      this.$router.push({name: 'PageProfile'})
    },
    async handleAvatarUpload(event) {
      this.uploadingImage = true
      const newAvatarUrl = await this.uploadAvatar({file: event.target.files[0]})
      this.currentUser.avatar = newAvatarUrl || this.currentUser.avatar
      this.uploadingImage = false
    },
    async handleRandomAvatarUpload() {
      const randomAvatarGenerated = this.currentUser.avatar.startsWith('https://pixabay')
      if (randomAvatarGenerated) {
        const image = await fetch(this.currentUser.avatar)
        const blob = await image.blob()
        this.currentUser.avatar = await this.uploadAvatar({file: blob, filename: 'randomAvatar'})
      }
    },
  },
}
</script>

<style scoped>

</style>