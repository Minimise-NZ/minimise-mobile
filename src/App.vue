<template>
  <div id="q-app">
    <!--<disconnected v-show="!online"></disconnected>-->
    <router-view/>
  </div>
</template>

<script>
// import Disconnected from './components/disconnected'
export default {
  name: 'App',
  components: {
    // 'disconnected': Disconnected
  },
  data () {
    return {
    }
  },
  computed: {
    /*
    online () {
      var networkState = navigator.connection.type
      var states = {}
      states[Connection.UNKNOWN] = 'Unknown connection'
      states[Connection.ETHERNET] = 'Ethernet connection'
      states[Connection.WIFI]  = 'WiFi connection'
      states[Connection.CELL_2G] = 'Cell 2G connection'
      states[Connection.CELL_3G] = 'Cell 3G connection'
      states[Connection.CELL_4G] = 'Cell 4G connection'
      states[Connection.CELL] = 'Cell generic connection'
      states[Connection.NONE] = 'No network connection'
      if (networkState === Connection.NONE) {
        return false
      } else {
        console.log('Connection type: ' + states[networkState])
        return true
      }
    }
    */
  },
  created () {
    console.log(navigator)
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
