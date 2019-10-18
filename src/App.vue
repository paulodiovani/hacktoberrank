<template>
  <div id="app">
    <div class="app-title"> HACKTOBERRANK </div>
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
  body {
    margin: 0 !important;
  }
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;

    .app-title {
      margin-bottom: 15px;
      padding: 8px;
      background-color: #0A5373;
      text-align: center;
      font-weight: bold;
      font-size: 22px;
      color: #FFB856;

      @media screen and (min-width: 768px) {
        font-size: 40px;
      }
    }
  }
</style>
