<template>
  <div class="outer">
    <div class="container">
      <q-list>
        <q-scroll-area>
          <q-item @click.native="$router.push('/home/emergency')" replace style="padding-top: 30px">
            <q-item-side>
              <img src="statics/emergency-phone.jpg">
            </q-item-side>
            <q-item-main style="padding-left: 20px">
              <q-item-tile label>Emergency Contacts</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item @click.native="$router.push('/home/hazardRegister')" replace>
            <q-item-side>
              <img src="statics/Hazard.png">
            </q-item-side>
            <q-item-main style="padding-left: 20px">
              <q-item-tile label>Hazard Register</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item @click.native="$router.push('/home/incident')" replace>
            <q-item-side>
              <img src="statics/red-cross.jpg">
            </q-item-side>
            <q-item-main style="padding-left: 20px">
              <q-item-tile label>Report an Incident</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item  @click.native="$router.push('/home/taskAnalysis')" replace>
            <q-item-side>
              <img src="statics/Clipboard-check.jpg">
            </q-item-side>
            <q-item-main style="padding-left: 20px">
              <q-item-tile label>Task Analysis</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <img src="statics/toxic.jpg">
            </q-item-side>
            <q-item-main style="padding-left: 20px">
              <q-item-tile label>Hazardous Substances</q-item-tile>
              <q-item-tile sublabel>Coming Soon</q-item-tile>
            </q-item-main>
          </q-item>
        </q-scroll-area>
      </q-list>
    </div>
    <q-toolbar color="white" class="footer">
      <q-btn @click="signIn" color="teal-6" v-if="signedIn === false">Sign In</q-btn>
      <q-btn @click="signOut" color="deep-orange-6" v-else>Sign Out</q-btn>
    </q-toolbar>
    <q-inner-loading :visible="loading">
      <q-spinner-gears size="100px" color="primary"></q-spinner-gears>
    </q-inner-loading>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      jobSite: {},
      header: { title: 'Site Specific Safety Plan', color: 'teal-6' },
      loading: false  
    }
  },
  computed: {
    signedIn () {
      if (_.isEmpty(this.$store.getters.currentJob)) {
        return false // this.$store.getters.signedIn
      } else {
        return true
      }
    }
  },
  methods: {
    signIn () {
      console.log('signing In')
    },
    signOut () {
      console.log('signing out')
    }
  },
  beforeMount () {
    this.jobSite = this.$store.getters.selectedJob
    this.$store.dispatch('updateHeader', this.header)
  },
}
</script>

<style scoped>
  .q-list {
    border: none;
    padding-bottom: 50px;
  }
  .q-item-label {
    font-size: 1.1rem;
  }
  .q-item {
    border-bottom: 0.5px solid lightgrey;
    padding: 15px;
  }
  img {
    width: 50px;
    height: 50px;
  }
  .footer {
    position: absolute;
    background-color: white;
    bottom: 0;
  }
  button {
    width: 80%;
    margin: auto;
    border-radius: 5px;
    margin-bottom: 25px;
  }
</style>