<template>
  <div id="app">
    <ListPullRequests />
  </div>
</template>

<script>

import ListPullRequests from './components/ListPullRequests'

export default {
  name: 'app',
  components: {
    ListPullRequests
  }
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
