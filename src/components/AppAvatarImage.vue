<template>
  <img :src="src || '/avatar-placeholder.png'" alt="Avatar image">
</template>

<script>
export default {
  name: "AppAvatarImage",
  props: {
    src: {
      type: String
    }
  }
}
</script>

<style scoped>
img {
  object-fit: cover;
}
</style>