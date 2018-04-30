<template>
  <div id="q-app">
    <disconnected v-show="OfflineOnly"></disconnected>
    <router-view v-show="OnlineOnly"/>
  </div>
</template>

<script>
import Disconnected from './components/disconnected'
export default {
  name: 'App',
  components: {
    'disconnected': Disconnected
  },
  data () {
    return {
      onlineState: navigator.onLine
    }
  },
  created () {
    this.$on('online', function () {
      alert("I'm online now!")
      this.$store.dispatch('getJobs')
        .then(() => {
          window.location.reload(true)
        })
    })
    this.$on('offline', function () {
      alert("I'm offline now!")
    })
  }
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

  .q-layout-page-container {
    height: 100vh;
  }

  .outer {
    height: 100vh -50px;
  }

  .container {
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

  .q-inner-loading {
    height: 100vh
  }

</style>
