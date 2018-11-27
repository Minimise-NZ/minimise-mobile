<template>
  <div>
    <div class="content">
      <div class="orientation-portrait headings">
        <img src="../statics/icons/minimise-128x128.png">
        <div class="q-display-2">m&#305;n&#305;m&#305;se</div>
        <div class="q-subheading" v-if="currentJob === null">Simple Safety on Construction Sites</div>
      </div>
      <div class="orientation-landscape">
        <div>
          <img src="../statics/icons/minimise-long-min.jpg">
        </div>
      </div>
    </div>
    <div class="buttons" v-if="loggedIn === false">
      <router-link to='/login'>
        <q-btn color="primary" rounded big>Log In</q-btn>
      </router-link>
      <router-link to='/signup'>New User</router-link>
    </div>
    <div class="buttons" v-if="currentJob !== null">
      <p style="margin-bottom: 5px">You are signed in to</p>
      <p style="margin-bottom: 25px"><strong>jobSite.address</strong></p>
      <router-link to='/home'>
        <q-btn color="primary" rounded big>View Safety Plan</q-btn>
      </router-link>
      <q-btn color="deep-orange-6" @click="signOut" rounded big>Sign out</q-btn>
    </div>
    <div class="buttons" v-if="currentJob === null && loggedIn === true">
      <q-btn color="primary" rounded big @click="newJob">New Job Site</q-btn>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      currentJob: null
    }
  },
  mounted () {
    this.getCurrentJob()
    if (this.currentJob === null && this.loggedIn === true) {
      this.$store.dispatch('getJobs')
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
    }
  },
  methods: {
    getCurrentJob () {
      let job = this.$store.getters.currentJob
      if (_.isEmpty(job) === false) {
        this.currentJob = job
      }
    },
    signOut () {
      this.$store.dispatch('signOut')
    },
    newJob () {
      this.$router.push('/location')
    }
  }
}
</script>

<style scoped>
  .content {
    height: 80vh;
    padding-top: 10vh;
  }
  img {
    height:25vh;
    display: block;
    margin: auto;
  }
  .headings {
    height: 15vh;
    text-align: center;
  }
  .q-subheading {
    margin-top: 10px;
  }
  .buttons {
    padding-bottom: 10vh;
  }
  button {
    width: 80%;
    max-width: 300px;
    margin-bottom: 20px;
  }
  a {
    display: block;
  }
  .orientation-landscape {
    margin: 2px 100px;
    height: 97px;
    padding:0 10px;
  }
</style>