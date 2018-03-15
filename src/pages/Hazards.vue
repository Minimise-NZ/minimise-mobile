<template>
  <div>
    <q-toolbar color="deep-orange-7" class="shadow-2">
      <q-btn flat icon="arrow_back" @click="$router.push('/location')" replace/>
      <q-toolbar-title>
        Hazard Register
      </q-toolbar-title>
    </q-toolbar>
    <div class="container">
      <q-list>
        <q-list-header >Please select your hazards</q-list-header>
        <q-scroll-area style="width: 100%; height: 75vh;">
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
        <q-toolbar-title style="padding-left: 25px">{{hazard.name}}</q-toolbar-title>
      </q-toolbar>
      <div class="container">
        <q-list highlight>
          <q-list-header>Please check your controls are in place</q-list-header>
          <q-scroll-area style="width: 100%; height: 70vh;">
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
              </q-item-main>
            </q-item>
          </q-scroll-area>
        </q-list>
        <q-btn class="fixed shadow-8" size="md" style="left: 18px; bottom: 18px" round color="negative" icon="clear" @click="cancel"/>
        <q-btn class="fixed shadow-8" size="md" style="right: 18px; bottom: 18px" round color="positive" icon="done" @click="saveHazard"/>
      </div>
    </q-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      openModal: false,
      group: 'opt1',
      index: '',
      hazard: {},
      selectedHazards: []
    }
  },
  computed: {
    hazards () {
      return this.$store.getters.allHazards
    }
  },
  methods: {
    showhazard (hazard, index) {
      // set selected hazard and open control modal
      this.index = index
      this.hazard = hazard
      this.openModal = true
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
      }
      // add hazard to array ready to be written to database
      this.selectedHazards.push(this.hazard)
      // remove hazard from hazard list and return new hazards list
      this.hazards.splice(this.index, 1)
      this.openModal = false
    },
    saveSiteHazards () {
      // save hazard register to store
      this.$store.commit('setSiteHazards', this.selectedHazards)
      this.$router.push('/home')
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
    background-color: #979797;
    color: white;
    margin-top: 8px;
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

</style>
