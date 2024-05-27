export default {
    async R({ w: wait }) {
        await this.$sleep(wait)
    },
}