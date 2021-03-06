<template>
  <div class="outer">
    <div class="container" v-if="currentTask === null">
      <q-list-header class="bg-blue-7 text-white" style="margin-bottom: 0">Please select Task Analysis</q-list-header>
      <q-scroll-area style="width: 100%; height: 70vh">
        <q-item v-for="(task, index) in tasks" :key="index" @click.native="showtask(task, index)">
          <q-item-main style="padding-left: 10px">
            <q-item-tile label style="padding: 20px 0">{{task.title}}</q-item-tile>
          </q-item-main>
        </q-item>
      </q-scroll-area>
    </div>
    <div class="container" v-else>
      <q-list-header class="bg-blue-9 text-white" style="margin-bottom: 0">{{currentTask.title}}</q-list-header>
      <q-scroll-area style="width: 100%; height: 72vh">
        <div class="row justify-between" v-if="currentTask.ppeRequired === 'true'">
          <div class="col-10">
            <q-input :value="currentTask.ppe" stack-label="PPE required" readonly/>
          </div>
        </div>
        <div class="row justify-between" v-if="currentTask.plantRequired === 'true'">
          <div class="col-10">
            <q-input :value="currentTask.plant" stack-label="Plant required" readonly/>
          </div>
        </div>
        <div class="row justify-between" v-if="currentTask.signage === 'true'">
          <div class="col-10">
              <q-input stack-label="Signage required" value="Signage in place" readonly/>
          </div>
        </div>
        <q-item v-for="(step, index) of currentTask.steps" :key="index">
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
    <q-toolbar color="blue-grey-8" class="footer shadow-2">
      <q-btn flat icon="arrow_back" @click="$router.go(-1)" replace/>
    </q-toolbar>
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
      task: {},
      signedOn: false,
      ppeChecked: false,
      plantChecked: false,
      signageChecked: false,
      loading: false
    }
  },
  computed: {
    currentTask () {
      let task = this.$store.getters.task
      if (_.isEmpty(task)) {
        return null
      } else {
        return task
      }
    },
    tasks () {
      return this.$store.getters.tasks
    }
  },
  beforeCreate () {
    this.$store.dispatch('getTasks')
  },
  beforeMount () {
    this.$store.dispatch('updateHeader', this.header)
    if (!_.isEmpty(this.task)) {
      this.openModal = true
    }
  },
  methods: {
    showtask (task, index) {
      // set selected task and open modal
      this.index = index
      this.task = task
      this.openModal = true
    },
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
