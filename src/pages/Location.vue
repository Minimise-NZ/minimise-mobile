<template>
  <div>
    <q-toolbar class="shadow-2" color="teal-5">
      <q-toolbar-title>
        Site Location
      </q-toolbar-title>
    </q-toolbar>
    <div class="container">
      <q-list highlight>
        <q-list-header>Please select your job site</q-list-header>
        <q-scroll-area style="width: 100%; height: 80vh;">
          <q-item @click.native="setLocation(job)" v-for="job in jobs" :key="job.id">
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
      this.$store.commit('setJob', job)
      this.$router.push('/hazards')
    }
  }
}
</script>

<style scoped>

  .q-list {
    border: none;
  }

  .q-list-header {
    background-color: #027be3;
    color: white;
    margin-top: 8px;
  }

  .q-item {
    border-bottom: 0.5px solid lightgray;
  }

  .q-item-main {
    padding: 10px 0;
  }

</style>
