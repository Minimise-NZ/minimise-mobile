<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  * {
    font-family: 'Raleway', sans-serif;
    padding: 0;
    margin: 0;
  }

  #q-app {
    height: 100vh;
  }

  .container{
    margin: 0 1.5vh;
  }

  .login-container{
    padding: 0 5vh;
    height: 100vh;
  }

  .q-toolbar-title {
    font-size: 1.2rem;
  }

  .q-list-header {
    border-radius: 5px;
  }

  .buttons {
    position: absolute;
    left: 0;
    bottom: 0;
    text-align: center;
    width: 100%;
  }

  a {
    color: #027be3;
  }

</style>
