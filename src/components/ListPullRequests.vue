<template>
  <div>
    <div v-for="user in users" v-bind:key="user.username">
      <h3>{{user.username}}</h3>
      <ul v-for="(pr, index) in user.pullRequests" v-bind:key="index">
        <li>{{pr}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  name: 'ListPullRequests',
  data: () => ({
    users: []
  }),
  async mounted () {
    try {
      let result = await api.getPulls(2019)
      this.users = result.data
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
