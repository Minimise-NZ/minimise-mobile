<template>
  <div class="outer">
    <q-toolbar class="shadow-2" color="deep-purple-5">
      <q-toolbar-title>
        Site Location
      </q-toolbar-title>
    </q-toolbar>
    <div class="container">
      <q-list highlight>
        <q-list-header class="bg-purple-4 text-white">Please select your job site</q-list-header>
        <q-scroll-area >
          <q-item @click.native="setLocation(job)" v-for="(job, index) in jobs" :key="index">
            <q-item-side icon="home"></q-item-side>
            <q-item-main>
              <q-item-tile label>{{job.address}}</q-item-tile>
              <q-item-tile sublabel>{{job.companyName}}</q-item-tile>
            </q-item-main>
          </q-item>
        </q-scroll-area>
      </q-list>
    </div>
    <q-inner-loading :visible="loading">
      <q-spinner-gears size="100px" color="primary"></q-spinner-gears>
    </q-inner-loading>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false
    }
  },
  computed: {
    jobs () {
      return this.$store.getters.jobs
    },
    userKey () {
      return this.$store.getters.userKey
    }
  },
  methods: {
    async setLocation(job) {
      console.log('setting Location', job)
      this.$store.dispatch('storeSelectedJob', job)
      this.loading = true
      let inductions = job.inducted
      let inducted = false
      for (var i = 0; i < inductions.length; i ++) {
        console.log(inductions[i])
        if (inductions[i].workerId === this.userKey) {
          console.log('INDUCTED')
          inducted = true
          this.loading = false
          this.$router.push('/home')
        }
      }
      console.log('NOT INDUCTED')
      this.$router.push('/hazards')
      this.loading = false
    }
  }
}
</script>

<style scoped>
  .q-list {
    border: none;
  }
  .q-list-header {
    margin-top: 10px;
  }
  .q-item {
    border-bottom: 0.5px solid lightgray;
  }
  .q-item-main {
    padding: 10px 0;
  }
  .q-scroll-area {
    width: 100%;
    height: 70vh;
  }
  @media screen and (orientation: landscape) {
    .q-scroll-area {
      height: 60vh;
    }
  }
</style>