<template>
  <div>
    <div class="container">
      <q-list style="padding-top: 20px">
        <q-item @click.native="$router.push('/home/emergency')" replace>
          <q-item-side>
            <img src="statics/emergency-phone.jpg">
          </q-item-side>
          <q-item-main style="padding-left: 20px">
            <q-item-tile label>Emergency Contacts</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item @click.native="$router.push('/home/hazardRegister')" replace>
          <q-item-side>
            <img src="statics/icon-hazard.png">
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
        <q-item>
          <q-item-side>
            <img src="statics/environmental.jpg">
          </q-item-side>
          <q-item-main style="padding-left: 20px">
            <q-item-tile label>Environmental Plan</q-item-tile>
            <q-item-tile sublabel>Coming Soon</q-item-tile>
          </q-item-main>
        </q-item>
      </q-list>
    </div>
    <q-toolbar color="white" class="footer">
       <q-btn @click="signIn" color="teal-6">Sign in</q-btn>
    </q-toolbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      jobSite: {},
      header: { title: 'Site Specific Safety Plan', color: 'teal-6' }
    }
  },
  beforeMount () {
    this.jobSite = this.$store.getters.jobSite
    this.$store.dispatch('updateHeader', this.header)
  },
  methods: {
    signIn () {
      // sign user in
    }
  }
}
</script>

<style scoped>

.q-list {
    border: none;
  }

  .q-item-label {
    font-size: 1.2rem;
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
    margin-bottom: 15px;
  }

</style>
