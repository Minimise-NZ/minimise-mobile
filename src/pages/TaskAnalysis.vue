<template>
  <div class="outer">
    <div class="container" v-if="selectedTask === null">
      <q-list highlight>
        <q-list-header class="bg-light-plum text-white">Please select Task Analysis</q-list-header>
        <q-scroll-area >
          <q-item @click.native="setTask(index)" v-for="(task, index) in taskAnalysis" :key="index">
            <q-item-side icon="fas fa-clipboard-list"></q-item-side>
            <q-item-main>
              <q-item-tile label>{{task.title}}</q-item-tile>
              <q-item-tile sublabel class="sublabel" v-if="signedInStatus(task.id)== true">Signed In</q-item-tile>
            </q-item-main>
          </q-item>
        </q-scroll-area>
      </q-list>
    </div>
    <div class="container" v-if="selectedTask !== null">
      <q-carousel arrows color="white" height="80vh">
        <q-carousel-slide>
          <q-list-header class="bg-light-plum text-white" style="margin-bottom: 0">Task Requirements</q-list-header>
          <q-card style="min-height: 65vh">
            <q-card-main>
              <q-input class="q-mt-sm" :value="selectedTask.ppe" stack-label="PPE required" type="textarea" readonly/>
              <q-input class="q-mt-sm" :value="selectedTask.plant" stack-label="Plant required" type="textarea" readonly/>
              <q-input class="q-mt-sm"  stack-label="Signage required" :value="selectedTask.signage" type="textarea" readonly/>
            </q-card-main>
          </q-card>
        </q-carousel-slide>
        <q-carousel-slide v-for="(step, index) of selectedTask.steps" :key="index">
          <q-list-header class="bg-blue-9 text-white" style="margin-bottom: 0">Step {{index+1}} - {{step.description}}</q-list-header>
          <q-card>
            <q-card v-for="(hazard, index) in step.hazards" :key="index">
              <q-card-title>
                <div class="title">{{hazard.name}}</div>
              </q-card-title>
              <q-card-main>
                <div class="row">
                  <div class="col">
                    <p class="subtitle">Risks</p>
                    <p class="text-faded" v-for="(risk, index) in hazard.risks" :key="index">{{risk}}</p>
                  </div>
                  <div class="col">
                    <p class="subtitle">Controls</p>
                    <p class="text-faded" v-for="(control, index) in hazard.controls" :key="index">{{control}}</p>
                  </div>
                </div>
                <p class="text-faded" >Risk before controls: <span :class="hazard.IRA" >{{hazard.IRA}}</span></p>
                <p class="text-faded" >Risk after controls: <span :class="hazard.RRA">{{hazard.RRA}}</span></p>
                <p class="text-faded" >Control level: <span>{{hazard.controlLevel}}</span></p>
              </q-card-main>
            </q-card>
          </q-card >
        </q-carousel-slide>
        <q-carousel-control slot="control-nav" slot-scope="carousel" :offset="[18, 0]">
          <q-btn
            label="Sign On"
            @click="saveTask"
            v-if="!carousel.canGoToNext"
            color="positive" text-color="white"
            icon="check"
            size="md"/>
        </q-carousel-control>
      </q-carousel>
    </div>
     <q-toolbar color='plum' class="footer shadow-2">
      <q-btn flat icon="arrow_back" @click="$router.push('/home')" replace/>
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
      header: { title: 'Task Analysis', color: 'plum' },
      index: '',
      loading: false,
      taskIndex: null
    }
  },
  computed: {
    userKey () {
      return this.$store.getters.userKey
    },
    jobSite () {
      return this.$store.getters.selectedJob
    },
    selectedTask () {
      if (this.taskIndex !== null) {
        return this.taskAnalysis[this.taskIndex]
      } else {
        return null
      }
    },
    taskAnalysis () {
      return this.$store.getters.taskAnalysis
    }
  },
  beforeMount () {
    this.$store.dispatch('updateHeader', this.header)
  },
  methods: {
    signedInStatus (id) {
      console.log('getting signed on status', this.jobSite.taskSignedOn)
      for (let signedOn of this.jobSite.taskSignedOn) {
        console.log(signedOn)
        if (signedOn.taskId === id) {
          if (signedOn.worker.id === this.userKey) {
            return true
          }
        }
      }
    },
    setTask (index) {
      this.taskIndex = index
      this.$store.dispatch('updateHeader', { title: this.selectedTask.title, color: 'plum' })
    },
    saveTask () {
      this.loading = true
      // sign on to task analysis if not already signed on
      if (this.signedInStatus(this.selectedTask.id) !== true) {
        console.log('signing on to task', this.selectedTask.id)
        this.$store.dispatch('taskSignOn', this.selectedTask.id)
      }
      this.loading = false
      this.$router.replace('/home')
    }
  }
}
</script>

<style scoped>
 
  .outer {
    padding: 0;
    margin: 0;
  }

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
  p {
    margin: 0 0 10px;
  }

  .q-carousel-slide {
    padding: 10px;
  }

  .q-card-main {
    padding: 10px;
  }

  .q-card-primary {
    padding: 10px;
  }

  .title {
    font-size: 16px;
    font-weight: 600;
  }

  .subtitle {
    font-weight: bold;
  }

  textarea {
    padding-top: 10px !important;
  }

  span {
    font-weight: bold;
  }

  .sublabel {
    font-weight:  bold;
    color: rgb(76, 175, 80);
    font-size: 1em;
  }
  .Low {
    color: rgb(76, 175, 80);
  }
  .Moderate {
    color: rgba(255, 87, 34, 0.75);
  }
  .High {
    color: rgb(244, 67, 54);
  }
  .Critical {
    color:rgba(233, 30, 99, 0.75);
  }

  .footer {
    position: absolute;
    bottom: 0;
  }
</style>