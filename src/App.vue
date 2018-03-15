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
    bottom: 20px;
    left: 0;
    text-align: center;
    width: 100%;
    padding: 25px;
  }

  a {
    color: #027be3;
  }

</style>
