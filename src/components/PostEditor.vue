<template>
  <div class="col-full">
    <VeeForm @submit="savePost" :key="formKey">
      <AppFormField v-model="postCopy.text" name="text" rules="required" as="textarea" rows="10" cols="30" />
      <div class="form-actions">
        <button class="btn-blue">{{ post.id ? 'Update post' : 'Submit post' }}</button>
      </div>
    </VeeForm>
  </div>
</template>

<script>
export default {
  name: "PostEditor",
  props: {
    post: {
      type: Object,
      default: () => ({ text: null })
    }
  },
  data() {
    return {
      postCopy: { ...this.post },
      formKey: Math.random()
    }
  },
  methods: {
    savePost() {
      const post = {
        ...this.postCopy,
      }
      this.$emit('postSaved', { post })
      this.postCopy.text = ''
      this.formKey = Math.random()
    },
  },
}
</script>

<style scoped>

</style>