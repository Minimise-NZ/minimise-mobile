<template>
  <div class="login-container">
    <div class="img-container">
      <img src="../statics/minimise-256x256.png">
    </div>
    <div class="headings">
      <div class="q-display-2">m&#305;n&#305;m&#305;se</div>
      <div class="q-subheading">Simple Safety on Construction Sites</div>
    </div>
    <div class="buttons" v-if="loggedIn === false">
      <router-link to='/login'>
        <q-btn color="primary" rounded big>Log In</q-btn>
      </router-link>
      <router-link to='/signup'>New User</router-link>
    </div>
    <div class="buttons" v-if="signedIn === true">
      <p style="margin-bottom: 5px">You are signed in to</p>
      <p style="margin-bottom: 25px"><strong>{{jobSite.address}}</strong></p>
      <router-link to='/home'>
        <q-btn color="primary" rounded big>View Safety Plan</q-btn>
      </router-link>
      <q-btn color="primary" @click="signOut" rounded big>Sign out</q-btn>
    </div>
     <div class="buttons" v-if="signedIn === false && loggedIn === true">
      <router-link to='/location'>
        <q-btn color="primary" rounded big>New Job Site</q-btn>
      </router-link>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
export default {
  data () {
    return {
    }
  },
  computed: {
    loggedIn () {
      let userKey = this.$store.getters.userKey
      if (userKey === '' || userKey === undefined || userKey === null) {
        return false
      } else {
        return true
      }
    },
    signedIn () {
      return this.$store.getters.signedIn
    },
    jobSite () {
      let job = this.$store.getters.jobSite
      return job
    }
  },
  methods: {
    signOut () {
      this.$store.dispatch('signOut')
    }
  }
}
</script>

<style scoped>

  .img-container {
    height: 50vh;
    padding: 15vh 0 0 0;
    text-align: center;
  }

  img {
    height: 30vh;
  }

  .headings {
    height: 25vh;
    margin-top: 15px;
    text-align: center;
  }

  .q-subheading {
    margin-top: 10px;
  }

  button {
    width: 100%;
    max-width: 300px;
    margin-bottom: 20px;
  }

  a {
    display: block;
  }
</style>
