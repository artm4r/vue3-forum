<template>
  <div class="flex-grid justify-center">
    <div class="col-2">

      <VeeForm @submit="login" class="card card-form">
        <h1 class="text-center">Login</h1>

        <AppFormField v-model="form.email" name="email" label="Email" rules="required|email" type="email" />
        <AppFormField v-model="form.password" name="password" label="Password" rules="required" type="password" />

        <div class="push-top">
          <button type="submit" class="btn-blue btn-block">Log in</button>
        </div>

        <div class="form-actions text-right">
          <router-link :to="{ name: 'Registration' }">Create an account?</router-link>
        </div>
      </VeeForm>

      <div class="push-top text-center">
        <button @click="loginWithGoogle"  class="btn-red btn-xsmall"><i class="fa fa-google fa-btn"></i>Sign in with Google</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageSignIn",
  data() {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('auth/signInWithEmailPassword', this.form)
        this.successRedirect()
      } catch (err) {
        alert(err.message)
      }
    },
    async loginWithGoogle() {
      try {
        await this.$store.dispatch('auth/signInWithGoogle')
        this.successRedirect()
      } catch (err) {
        alert(err.message)
      }
    },
    successRedirect() {
      const redirectTo = this.$route.query.redirectTo || { name: 'Home' }
      this.$router.push(redirectTo)
    },
  },
  created() {
    this.$emit('fetched')
  }
}
</script>