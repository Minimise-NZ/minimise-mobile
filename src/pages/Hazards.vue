<template>
  <div>
    <q-toolbar color="deep-orange-7" class="shadow-2">
      <q-btn flat icon="arrow_back" @click="$router.go(-1)" replace/>
      <q-toolbar-title>
        Hazard Register
      </q-toolbar-title>
    </q-toolbar>
    <div class="container">
      <q-list>
        <q-list-header class="bg-deep-orange-5 text-white">Please select your hazards</q-list-header>
        <q-scroll-area style="width: 100%; height: 70vh;">
          <q-item v-for="(hazard, index) in hazards" :key="index" @click.native="showhazard(hazard, index)">
            <q-item-side>
              <img :src="hazard.thumb">
            </q-item-side>
            <q-item-main style="padding-left: 20px">
              <q-item-tile label>{{hazard.name}}</q-item-tile>
            </q-item-main>
          </q-item>
        </q-scroll-area>
      </q-list>
    </div>
    <q-btn class="fixed shadow-8" size="lg" style="right: 18px; bottom: 18px" round color="positive" icon="done_all" @click="saveSiteHazards" replace/>
    <q-modal v-model="openModal">
      <q-toolbar color="deep-orange-7" class="shadow-2">
        <q-toolbar-title style="padding-left: 25px">Please check your controls</q-toolbar-title>
      </q-toolbar>
      <div class="container">
        <q-list highlight>
          <q-scroll-area style="width: 100%; height: 80vh">
            <q-item v-for="(control, index) of hazard.controls" :key="index">
              <q-item-main>
                <q-item-tile style="padding-bottom: 15px">{{control.desc}}</q-item-tile>
                <q-option-group
                color="secondary"
                type="radio"
                v-model="control.status"
                inline
                :options="[
                  { label: 'Yes', value: 'Controlled', color: 'primary' },
                  { label: 'No', value: 'Uncontrolled', color: 'red' },
                  { label: 'n/a', value: 'n/a', color: 'grey'}
                ]"/>
                <q-item-tile v-if="control.status === 'Uncontrolled'">
                  <q-input v-model="control.corrective" style="padding-top:15px" placeholder="Corrective action/Workaround" type="textarea" rows="2"/>
                </q-item-tile>
              </q-item-main>
            </q-item>
          </q-scroll-area>
        </q-list>
        <div class="buttons">
          <q-btn class="fixed shadow-8" size="md" style="left: 18px; bottom: 18px" round color="negative" icon="clear" @click="cancel"/>
          <q-btn class="fixed shadow-8" size="md" style="right: 18px; bottom: 18px" round color="positive" icon="done" @click="saveHazard"/>
        </div>
      </div>
    </q-modal>
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
      openModal: false,
      group: 'opt1',
      index: '',
      hazard: {},
      hazards: [],
      loading: false,
      siteHazards: []
    }
  },
  created () {
    this.hazards = _.cloneDeep(this.allHazards)
  },
  computed: {
    allHazards () {
      return this.$store.getters.allHazards
    },
    taskAnalysisRequired () {
      return this.$store.getters.taskRequired
    }
  },
  methods: {
    showhazard (hazard, index) {
      // set selected hazard and open control modal
      this.loading = true
      this.index = index
      this.hazard = hazard
      this.openModal = true
      this.loading = false
      setTimeout(this.notifications, 1000)
    },
    notifications () {
      if (this.hazard.worksafe === true) {
        this.$q.dialog({
          title: 'Worksafe Notification Required',
          message: 'Please confirm that you have notified Worksafe and have a copy of the notification.',
          ok: 'Agree',
          cancel: 'Disagree',
          noBackdropDismiss: true
        }).then(() => {
          this.hazard.worksafeNotification = 'confirmed'
        }).catch(() => {
          this.$q.notify('Worksafe notification is required. You are not permitted to start this work activity')
        })
      }
    },
    saveHazard () {
      // check controls have been checked
      for (let control of this.hazard.controls) {
        if (control.status === undefined) {
          this.$q.notify({
            message: 'Oops. All controls have not been checked',
            position: 'bottom',
            timeout: 1000
          })
          return
        }
        if (control.status === 'Uncontrolled') {
          if (!control.corrective) {
            this.$q.notify({
              message: 'Please enter corrective action for uncontrolled hazards',
              position: 'bottom',
              timeout: 1000
            })
            return
          }
        }
      }
      // if a task analysis is required, go to task page
      if (this.hazard.taskAnalysis === true) {
        this.$store.commit('setTaskRequired', true)
      }
      // add hazard to array ready to be written to database
      this.siteHazards.push(this.hazard)
      // remove hazard from hazard list and return new hazards list
      this.hazards.splice(this.index, 1)
      this.openModal = false
    },
    saveSiteHazards () {
      // save hazard register to store
      this.loading = true
      if (this.siteHazards.length !== 0) {
        this.$store.commit('setSiteHazards', this.siteHazards)
        if (this.taskAnalysisRequired === true) {
          this.$router.push('/home/taskAnalysis')
        } else {
          this.$router.replace('/home')
        }
      } else {
        this.loading = false
        this.$q.notify({
          message: 'You have not selected any hazards',
          position: 'bottom',
          timeout: 1000
        })
      }
    },
    cancel () {
      this.hazard = ''
      this.openModal = false
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

  .q-item-label {
    font-size: 1.2rem;
  }

  .q-item {
    border-bottom: 0.5px solid lightgrey;
  }

  .q-item-main {
    padding: 10px 0;
  }

  h5 {
    font-size: 14px;
    font-weight: 500;
    color: #757575;
    line-height: 48px;
  }

  p {
    margin-bottom: 5px;
  }

  @media screen and (max-height: 400px) {
    .buttons, .q-toolbar, .q-list-header {
      display: none;
    }
  }

  @media screen and (orientation: landscape) {
    .buttons, .q-toolbar, .q-list-header {
      display: none;
    }
  }

</style>
