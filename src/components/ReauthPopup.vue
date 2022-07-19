<template>
  <VueFinalModal v-model="showModal" @closed="$emit('fail')" classes="modal-container" content-class="modal">
    <div class="modal-content">
      <h4>Login again to continue</h4>
      <VeeForm @submit="reauthenticateUser">
        <AppFormField name="reauth-email" label="Email" v-model="email" type="email" rules="email" />
        <AppFormField name="reauth-password" label="Password" v-model="password" type="password" />
        <button class="btn btn-green btn-small">Login</button>
      </VeeForm>
    </div>
  </VueFinalModal>
</template>

<script>
import { VueFinalModal } from 'vue-final-modal'


export default {
  name: "ReauthPopup",
  props: {
    modelValue: { type: Boolean, default: false }
  },
  components: {
    VueFinalModal
  },
  data() {
    return {
      email: '',
      password: '',
    }
  },
  computed: {
    showModal: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('update:modelValue', value)
      }
    },
  },
  methods: {
    async reauthenticateUser() {
      try {
        await this.$store.dispatch('auth/reauthenticateUser', { email: this.email, password: this.password })
        this.$emit('success')
      } catch (err) {
        this.$emit('fail', err)
      }
    }
  },
}
</script>
