<template>
  <div id="app">
    <div class="logo">
      <div class="logo__title">
        <h1>HACKTOBER</h1>
        <span>RANK</span>
      </div>
      <img :src="require('@/assets/hexagon.svg')" />
    </div>
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
  background-color: #152347;
  overflow-x: hidden;
}

.logo {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &__title {
    position: absolute;
    text-align: center;
    font-family: 'Special Elite', cursive;
    padding-top: 18px;
    span {
      font-size: 45px;
      color: #fff922;
      background: -webkit-linear-gradient(
        0deg,
        rgba(161, 30, 198, 1) 0%,
        rgba(230, 0, 153, 1) 84%,
        rgba(255, 0, 170, 1) 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    h1 {
      margin: 0px !important;
      padding: 8px;
      font-weight: bold;
      background: linear-gradient(
        0deg,
        rgba(104, 64, 214, 1) 0%,
        rgba(83, 146, 251, 1) 50%,
        rgba(83, 175, 255, 1) 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}

#app {
  font-family: 'Space Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
