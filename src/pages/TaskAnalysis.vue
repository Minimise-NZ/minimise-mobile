<template>
  <div class="outer">
    <div class="container" >
      <q-list-header class="bg-blue-9 text-white" style="margin-bottom: 0">{{task.title}}</q-list-header>
      <q-scroll-area style="width: 100%; height: 72vh">
        <div class="row justify-between">
          <div class="col-10">
            <q-input :value="task.ppe" stack-label="PPE required" readonly/>
          </div>
        </div>
        <div class="row justify-between">
          <div class="col-10">
            <q-input :value="task.plant" stack-label="Plant required" readonly/>
          </div>
        </div>
        <div class="row justify-between">
          <div class="col-10">
            <q-input stack-label="Signage required" :value="task.signage" readonly/>
          </div>
        </div>

        <q-carousel height="80vh">
        <q-carousel-slide v-for="(step, index) of task.steps" :key="index">
          <q-item-main>
           <q-list-header class="bg-secondary text-white">Step {{index+1}} - {{step.description}}</q-list-header>
            <div class="content">
              <q-card v-for="(hazard, index) in step.hazards" :key="index">
                <p><strong>{{hazard.name}}</strong></p>
              <q-card-main>
                <p class="subtitle">Risks</p>
                <p class="text-faded" v-for="(risk, index) in hazard.risks" :key="index">{{risk}}</p>
              </q-card-main>
              <q-card-separator />
              <q-card-main>
                <p class="subtitle">Controls</p>
                <p class="text-faded" v-for="(control, index) in hazard.controls" :key="index">{{control}}</p>
              </q-card-main>
              <q-card-separator />
              <q-card-main>
                <p class="text-faded" >Risk before controls: <span :class="hazard.IRA" >{{hazard.IRA}}</span></p>
                <p class="text-faded" >Risk after controls: <span :class="hazard.RRA">{{hazard.RRA}}</span></p>
                <p class="text-faded" >Control level: <span>{{hazard.controlLevel}}</span></p>
              </q-card-main>
              </q-card >
              
            </div>
          </q-item-main>
        </q-carousel-slide>
        </q-carousel>
       
      </q-scroll-area>
    </div>
    <q-modal v-model="openModal">
      <q-toolbar class="shadow-2 bg-blue-grey-8">
        <q-toolbar-title style="padding-left: 15px">{{task.title}}</q-toolbar-title>
      </q-toolbar>
      <div class="container">
        <q-list-header class="bg-blue-8 text-white">Please review task steps</q-list-header>
          <q-scroll-area style="width: 100%; height: 65vh">
            <div class="row justify-between" v-if="task.ppeRequired === 'true'">
              <div class="col-10">
                <q-input :value="task.ppe" stack-label="PPE required" readonly/>
              </div>
              <q-checkbox v-model="ppeChecked" style="margin-right: 10px"/>
            </div>
            <div class="row justify-between" v-if="task.plantRequired === 'true'">
              <div class="col-10">
                <q-input :value="task.plant" stack-label="Plant required" readonly/>
              </div>
              <q-checkbox v-model="plantChecked" style="margin-right: 10px"/>
            </div>
            <div class="row justify-between" v-if="task.signage === 'true'">
              <div class="col-10">
                 <q-input stack-label="Signage required" value="Signage in place" readonly/>
              </div>
              <q-checkbox v-model="signageChecked" style="margin-right: 10px"/>
            </div>
            <q-item v-for="(step, index) of task.steps" :key="index">
              <q-item-main>
                <q-list-header class="bg-secondary text-white">Step {{index+1}}</q-list-header>
                <div class="content">
                  <p><strong>Description of step</strong></p>
                  <q-item-tile style="padding-bottom: 15px">{{step.description}}</q-item-tile>
                  <p><strong>Hazards</strong></p>
                  <q-item-tile style="padding-bottom: 15px">{{step.hazards}}</q-item-tile>
                  <p><strong>Controls</strong></p>
                  <q-item-tile style="padding-bottom: 15px">{{step.controls}}</q-item-tile>
                </div>
              </q-item-main>
            </q-item>
            <q-checkbox v-model="signedOn" left-label label="I have reviewed this task analysis and have been appropriately trained in the process" style="margin: 10px 10px 20px 10px"/>
          </q-scroll-area>
        <q-btn class="fixed shadow-8" size="md" style="left: 18px; bottom: 18px" round color="negative" icon="clear" @click="cancel"/>
        <q-btn class="fixed shadow-8" size="md" style="right: 18px; bottom: 18px" round color="positive" icon="done" @click="saveTask"/>
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
      header: { title: 'Task Analysis', color: 'blue-grey-8' },
      openModal: false,
      index: '',
      signedOn: false,
      ppeChecked: false,
      plantChecked: false,
      signageChecked: false,
      loading: false
    }
  },
  computed: {
    task () {
      return this.$store.getters.taskAnalysis
    }
  },
  beforeCreate () {
    this.$store.dispatch('getTaskAnalysis')
  },
  beforeMount () {
    this.$store.dispatch('updateHeader', this.header)
  },
  methods: {
    saveTask () {
      // check that all requirements are met
      if (this.task.ppeRequired === 'true' && this.ppeChecked === false) {
        this.$q.notify({
          message: 'Please confirm that you have the PPE required',
          position: 'bottom',
          timeout: 1000
        })
        return
      }
      if (this.task.plantRequired === 'true' && this.plantChecked === false) {
        this.$q.notify({
          message: 'Please confirm that you have the plant required',
          position: 'bottom',
          timeout: 1000
        })
        return
      }
      if (this.task.signage === 'true' && this.signageChecked === false) {
        this.$q.notify({
          message: 'Please confirm that you have the signage required',
          position: 'bottom',
          timeout: 1000
        })
        return
      }
      if (this.signedOn === false) {
        this.$q.notify({
          message: 'Please confirm that you have reviewed this task analysis',
          position: 'bottom',
          timeout: 1000
        })
        return
      }
      this.loading = true
      this.$store.commit('setTaskRequired', false)
      this.$store.commit('setTask', this.task)
      this.loading = false
      this.$router.replace('/home')
    },
    cancel () {
      this.task = ''
      this.openModal = false
    }
  }
}
</script>

<style scoped>
  .outer {
    padding: 0;
    margin: 0;
  }
  .container {
    padding-top: 10px;
    padding-left: 5px;
    padding-right: 5px;
    padding-bottom: 0;
    margin-bottom: 0;
  }
  .col-10, .col-1 {
    padding: 10px;
  }
  .q-item-label {
    font-size: 1.2rem;
  }
  .q-item {
    border-bottom: 0.5px solid lightgrey;
    padding-left: 5px;
    padding-right: 5px;
  }
  .q-option {
    margin-top: 15px;
  }
  .content {
    padding-left: 5px;
    padding-right: 5px;
  }
  .q-item-main {
    padding: 10px 0 0 0;
  }
  .q-list-header {
    margin-bottom: 10px;
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
  .footer {
    position: absolute;
    bottom: 0;
  }
</style>