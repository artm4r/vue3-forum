<template>
  <div class="col-full text-center">
    <h1>Oops.. Page not found</h1>
    <router-link :to="{name: 'Home'}">Go to homepage</router-link>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  created() {
    this.$emit('fetched')
  }
}
</script>

<style scoped>
h1 {
  width: 100%;
  margin-bottom: 25px;
}
a {
  font-weight: bold;
  display: block;
  width: 100%;
}
</style>