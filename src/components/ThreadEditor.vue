<template>
  <VeeForm @submit="saveThread">
      <AppFormField v-model="form.title" name="title" label="Title" rules="required" type="text" />
      <AppFormField v-model="form.text" name="text" label="Content" rules="required" as="textarea" rows="8" cols="140" />
      <div class="btn-group">
        <button @click.prevent="$emit('cancel')" class="btn btn-ghost">Cancel</button>
        <button class="btn btn-blue" type="submit" name="Publish">{{ isEditing ? 'Update' : 'Publish' }}</button>
      </div>
  </VeeForm>
</template>

<script>
export default {
  name: "ThreadEditor",
  props: {
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        title: this.title,
        text: this.text,
      }
    }
  },
  computed: {
    isEditing() {
      return this.title !== ''
    },
  },
  methods: {
    saveThread () {
      this.$emit('clean')
      this.$emit('save', { ...this.form })
    }
  },
  watch: {
    form: {
      deep: true,
      handler() {
        if (this.form.title !== this.title || this.form.text !== this.text) {
          this.$emit('dirty')
        } else {
          this.$emit('clean')
        }
      }
    }
  },
}
</script>

<style scoped>

</style>