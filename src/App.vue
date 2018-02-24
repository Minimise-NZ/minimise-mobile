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

  #q-app {
    height: 100vh;
  }
  .container{
    margin: 0 3vh;
  }

  .login-container{
    padding: 0 5vh;
    height: 100vh;
  }

  .q-toolbar-title {
    font-size: 1.2rem;
    font-family: 'Roboto', sans-serif;
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
