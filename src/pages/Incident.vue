<template>
  <div>
    <q-modal style="margin-top: 0" v-model="showModal" minimized :content-css="{padding: '50px'}">
      <div class="q-display-1 q-mb-md">Incident submitted</div>
      <p>Thank you for reporting this incident</p>
      <q-btn color="primary" v-close-overlay label="Close"  @click="$router.push('/home')" replace />
    </q-modal>
    <div class="container">
      <q-scroll-area style="width: 100%; height: 75vh;">
        <q-list-header class="bg-cyan-8 text-white">Please enter incident details</q-list-header>
        <div class="row">
          <q-select
            required
            v-model="incident.type"
            float-label="Incident Type:"
            :options="incidentTypes"
          />
        </div>
        <div class="row">
          <q-input
            required
            v-model="incident.description"
            type="textarea"
            float-label="Please describe what happened"
            rows="5"
          />
        </div>
        <div class="row">
          <q-input
            v-if="incident.type === 'Plant Damage'"
            required
            v-model="incident.plantDamage"
            type="textarea"
            float-label="Description of damage"
            rows="5"
          />
        </div>
        <div class="row">
          <q-input
            v-if="incident.type === 'Minor Harm' || incident.type === 'Serious Harm'"
            required
            v-model="incident.injuryDescription"
            type="textarea"
            float-label="Description of injury"
            rows="5"
          />
        </div>
        <div class="row">
          <q-input
            v-model="incident.corrective"
            required
            type="textarea"
            float-label="Description of corrective measures"
            rows="5"
          />
        </div>
      </q-scroll-area>
    </div>
    <q-toolbar color="cyan-9" class="footer shadow-2">
      <q-btn flat icon="arrow_back" @click="$router.push('/home')" replace/>
      <q-btn class="fixed shadow-8" size="lg" style="right: 18px; bottom: 18px" round color="positive" icon="done" @click="submit"/>
    </q-toolbar>
    <q-inner-loading :visible="loading">
      <q-spinner-gears size="100px" color="primary"></q-spinner-gears>
    </q-inner-loading>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      showModal: false,
      incident: {
        address: '',
        cause: '',
        company: '',
        corrective: '',
        description: '',
        escalate: false,
        injuryDescription: '',
        open: true,
        plantDamage: '',
        type: ''
      },
      jobSite: {},
      header: { title: 'Report an Incident', color: 'cyan-9' },
      incidentTypes: [
        { label: 'Near Miss', value: 'Near Miss' },
        { label: 'Minor Harm', value: 'Minor Harm' },
        { label: 'Serious Harm', value: 'Serious Harm' },
        { label: 'Plant Damage', value: 'Plant Damage' }
      ]
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    userKey () {
      return this.$store.getters.userKey
    },
    injury () {
      if (this.incident.type === 'Minor Harm' || this.incident.type === 'Serious Harm') {
        return true
      } else {
        return false
      }
    },
    plant () {
      if (this.incident.type === 'Plant Damage') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    submit () {
      // check that all fields are complete
      this.loading = true
      if (this.incident.type === '' || this.incident.description === '' || this.incident.corrective === '') {
        this.$q.notify({
          message: 'Please complete all fields',
          position: 'bottom',
          timeout: 1000
        })
      } else if ((this.incident.type === 'Minor Harm' || this.incident.type === 'Serious Harm') && (this.incident.injuryDescription === '')) {
        this.$q.notify({
          message: 'Please provide details of injury',
          position: 'bottom',
          timeout: 1000
        })
      } else if (this.incident.type === 'Plant Damage' && this.incident.plantDamage === '') {
        this.$q.notify({
          message: 'Please provide details of plant damage',
          position: 'bottom',
          timeout: 1000
        })
      } else {
        // save to firestore
        let incident = this.incident
        incident.actionOwner = {key: this.jobSite.pmKey, name: this.jobSite.projectManager}
        incident.address = this.jobSite.address
        incident.company = this.jobSite.principalKey
        incident.injury = this.injury
        incident.loggedBy = {key: this.userKey, name: this.user.name}
        incident.reportedBy = this.user.name
        this.$store.dispatch('newIncident', incident)
          .then((response) => {
            console.log(response)
            this.showModal = true
          })
          .catch((error) => {
            console.log(error)
          })
      }
    }
  },
  beforeMount () {
    this.jobSite = this.$store.getters.jobSite
    console.log(this.jobSite)
    this.$store.dispatch('updateHeader', this.header)
  }
}
</script>

<style scoped>
  .container {
    padding: 10px;
  }
  .q-scroll-area {
    margin-top: 10px;
  }

  .row {
    margin-top: 10px;
    padding-left: 5px;
  }

 .footer {
    position: absolute;
    bottom: 0;
  }

  .q-select, .q-input{
    width: 100%;
  }

  .submit {
    width: 50%;
    margin: auto;
  }
</style>
