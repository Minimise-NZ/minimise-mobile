<template>
  <div>
    <div class="container">
      <q-scroll-area style="width: 100%; height: 75vh;">
        <div class="row">Please enter incident details</div>
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
            float-label="Description of incident"
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
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      incident: {
        type: '',
        description: '',
        plantDamage: '',
        injuryDescription: '',
        corrective: '',
        actionOwner: {
          key: '',
          name: ''
        },
        address: '',
        cause: '',
        company: '',
        date: moment(),
        escalate: false,
        injury: false,
        loggedBy: {
          key: '',
          name: ''
        },
        open: true,
        reportedBy: ''
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
      // scheck that all fields are complete
      if (this.incident.type === '' || this.incident.description === '' || this.incident.corrective === '') {
        this.$q.notify({
          message: 'Please complete all fields',
          position: 'bottom',
          timeout: 1000
        })
      } else if (this.incident.type === 'Minor Harm' || this.incident.type === 'Serious Harm') {
        if (this.incident.injury === '') {
          this.$q.notify({
            message: 'Please provide details of injury',
            position: 'bottom',
            timeout: 1000
          })
        }
      } else if (this.incident.type === 'Plant Damage' && this.incident.damage === '') {
        this.$q.notify({
          message: 'Please provide details of plant damage',
          position: 'bottom',
          timeout: 1000
        })
      } else {
        // save to firestore
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
  }

 .footer {
    position: absolute;
    padding-left: 20px;
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
