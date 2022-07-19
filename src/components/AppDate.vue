<template>
  <span :title="readableDate">
    {{ diffForUsers }}
  </span>
</template>

<script>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import localizedDate from 'dayjs/plugin/localizedFormat'

dayjs.extend(relativeTime)
dayjs.extend(localizedDate)

export default {
  name: "AppDate",
  props: {
    timestamp: {
      type: [Number, Object],
      required: true,
    }
  },
  computed: {
    time() {
      return this.timestamp?.seconds || this.timestamp
    },
    diffForUsers() {
      return dayjs.unix(this.time).fromNow()
    },
    readableDate() {
      return dayjs.unix(this.time).format('llll')
    },
  },

}
</script>

<style scoped>

</style>