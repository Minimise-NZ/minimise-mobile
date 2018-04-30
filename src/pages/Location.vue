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
    <q-inner-loading :visible="loading">
      <q-spinner-gears size="100px" color="primary"></q-spinner-gears>
    </q-inner-loading>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
const today = moment().format('DD-MM-YYYY')
export default {
  data () {
    return {
      loading: false
    }
  },
  computed: {
    currentSafetyPlan () {
      return this.$store.getters.safetyPlan
    }
  },
  created () {
    this.jobs = this.$store.getters.jobs
  },
  methods: {
    setLocation (job) {
      this.loading = true
      this.$store.commit('setJob', job)
      // check if a safety plan is already in store
      if (_.isEmpty(this.currentSafetyPlan) || this.currentSafetyPlan.jobId !== job.id) {
        // clear store
        this.$store.commit('setSafetyPlan', {})
        this.$store.commit('setAllHazards', [])
        this.$store.commit('setSiteHazards', [])
        this.$store.commit('setTask', {})
        this.$store.commit('setTaskRequired', false)
        // retrieve safety plan from firestore if there is one
        this.$store.dispatch('getSafetyPlan', job.id)
          .then((response) => {
            // Check expiry date of safety plan. If expired start a new plan
            if (response !== null) {
              let plan = response
              if (today > plan.expiryDate) {
                console.log('plan has expired')
                this.$q.dialog({
                  title: 'Safety Plan has expired',
                  message: 'Please create a new safety plan'
                })
                this.$router.push('/hazards')
              } else {
                // Plan has not expired. Set items in store
                this.$store.commit('setSiteHazards', plan.hazardRegister)
                this.$store.commit('setTask', plan.taskAnalysis)
                this.$store.dispatch('getNotMyHazards')
                this.loading = false
                this.$router.push('/home')
              }
            } else {
              console.log('There is no safety plan for this jobsite')
              this.loading = false
              this.$router.push('/hazards')
            }
          })
          .catch((error) => {
            this.loading = false
            console.log(error)
          })
      } else {
        if (today > this.currentSafetyPlan.expiryDate) {
          console.log('plan has expired')
          this.$q.dialog({
            title: 'Safety Plan has expired',
            message: 'Please create a new safety plan'
          })
          this.$store.commit('setAllHazards', [])
          this.$store.commit('setSiteHazards', [])
          this.$store.commit('setTask', {})
          this.$store.commit('setTaskRequired', false)
          this.loading = false
          this.$router.push('/hazards')
        } else {
          console.log('Plan is current')
          this.loading = false
          this.$router.push('/home')
        }
      }
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

  .connection-error {
    margin: auto;
    margin-top: 5vh;
    width: 90vw;
    height: 20vh;
    padding: 20px;
    line-height: 30px;
    background-color: lightgrey;
    border-radius: 15px;
    text-align: center;
  }

  @media screen and (orientation: landscape) {
    .q-scroll-area {
      height: 60vh;
    }
  }

</style>
