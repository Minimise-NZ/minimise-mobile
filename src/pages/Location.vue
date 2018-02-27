<template>
  <div>
    <q-toolbar color="primary" class="shadow-2">
      <q-toolbar-title>
        Site Location
      </q-toolbar-title>
    </q-toolbar>
    <div class="container">
      <q-list highlight>
        <q-list-header >Please choose your job site</q-list-header>
        <q-scroll-area style="width: 100%; height: 80vh;">
          <q-item v-for="job in jobs" :key="job.id" @click="setLocation(job)" link>
            <q-item-side icon="home"></q-item-side>
            <q-item-main>
              <q-item-tile label>{{job.address}}</q-item-tile>
              <q-item-tile sublabel>{{job.principal}}</q-item-tile>
            </q-item-main>
          </q-item>
        </q-scroll-area>
      </q-list>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    jobs () {
      return this.$store.getters.jobs
    }
  },
  methods: {
    setLocation (job) {
      this.$store.dispatch('setJobSite', job)
      console.log(job)
      this.$router.push('/hazards')
    }
  }
}
</script>

<style scoped>

  .q-list-header {
    background-color: #149ba7;
    color: white;
  }

  .q-item-main {
    padding-top: 10px;
  }

</style>
