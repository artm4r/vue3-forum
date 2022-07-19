export default {
    data() {
        return {
            dataLoadStatus_ready: false
        }
    },
    methods: {
        dataLoadStatus_fetched() {
            this.dataLoadStatus_ready = true
            this.$emit('fetched')
        }
    }
}