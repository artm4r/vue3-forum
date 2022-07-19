<template>
  <div class="text-center" style="margin-bottom: 15px;" >
    <button @click.prevent="getRandomImage" class="btn-green btn-xsmall" >
      Random avatar
    </button>
  </div>
</template>

<script>
import { arrayRandomItem } from "@/helpers";

export default {
  name: "UserProfileCardEditorRandomAvatar",
  methods: {
    async getRandomImage() {
      const searchTerms = [
        'cats',
        'dogs',
        'abstract',
        'cars',
        'mountains',
        'beach',
        'landscape',
        'object',
        'food',
        'flowers',
        'architecture',
        'yellow',
        'green',
        'blue',
        'orange',
        'black',
        'white',
        'brown',
        'red',
        'patterns',
        'animal',
        'code',
        'space'
      ]
      const randomTerm = arrayRandomItem(searchTerms)
      const res = await fetch(`https://pixabay.com/api/?key=23208036-34604012b2ea604907f4bb000&q=${randomTerm}`)
      const data = await res.json()
      const randomImage = arrayRandomItem(data.hits)
      this.$emit('hit', randomImage.webformatURL)
    }
  },
}
</script>

<style scoped>

</style>