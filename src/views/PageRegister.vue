<template>
  <div class="flex-grid justify-center">
    <div class="col-2">

      <VeeForm @submit="registerUser" class="card card-form">
        <h1 class="text-center">Register</h1>

        <AppFormField v-model="form.name" name="name" label="Name" rules="required" />
        <AppFormField v-model="form.username" name="username" label="Username" rules="required|unique:users,username" />
        <AppFormField v-model="form.email" name="email" label="Email" rules="required|email|unique:users,email" type="email" />
        <AppFormField v-model="form.password" name="password" label="Password" rules="required|min:8" type="password" />

        <div class="form-group">
          <label for="avatar">
            Avatar
            <div v-if="previewAvatar">
              <img :src="previewAvatar" class="avatar-xlarge" alt="UploadedAvatar">
            </div>
          </label>
          <VeeField name="avatar"
              v-show="!previewAvatar"
              id="avatar"
              type="file"
              class="form-input"
              @change="handleImageUpload"
              accept="image/*"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>

      </VeeForm>
      <div class="text-center push-top">
        <button @click="registerWithGoogle"  class="btn-red btn-xsmall"><i class="fa fa-google fa-btn"></i>Sign up with Google</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageRegister",
  data() {
    return {
      form: {
        name: '',
        username: '',
        email: '',
        password: '',
        avatar: ''
      },
      previewAvatar: null
    }
  },
  methods: {
    async registerUser() {
      await this.$store.dispatch('auth/createUserEmailPassword', this.form)
      this.successRedirect()
    },
    async registerWithGoogle() {
      await this.$store.dispatch('auth/signInWithGoogle')
      this.successRedirect()
    },
    successRedirect() {
      const redirectTo = this.$route.query.redirectTo || { name: 'Home' }
      this.$router.push(redirectTo)
    },
    handleImageUpload(e) {
      this.form.avatar = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        this.previewAvatar = event.target.result
      }
      reader.readAsDataURL(this.form.avatar)
    },
  },
  created() {
    this.$emit('fetched')
  }
}
</script>
<style scoped>
  .form-group label {
    width: 100%;
  }
  .avatar-xlarge {
    display: block;
    cursor: pointer;
    margin: 0 auto;
  }
</style>