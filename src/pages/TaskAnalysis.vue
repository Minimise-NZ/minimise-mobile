<template>
  <div class="outer">
    <div class="container" v-if="taskRequired !== null">
        <q-carousel arrows color="white" height="80vh">
          <q-carousel-slide>
            <q-list-header class="bg-blue-9 text-white" style="margin-bottom: 0">Task Requirements</q-list-header>
            <q-card style="height: 70vh">
              <q-card-main>
                <q-input class="q-mt-sm" :value="taskRequired.ppe" stack-label="PPE required" type="textarea" readonly/>
                <q-input class="q-mt-sm" :value="taskRequired.plant" stack-label="Plant required" type="textarea" readonly/>
                <q-input class="q-mt-sm"  stack-label="Signage required" :value="taskRequired.signage" type="textarea" readonly/>
              </q-card-main>
            </q-card>
          </q-carousel-slide>
          <q-carousel-slide v-for="(step, index) of taskRequired.steps" :key="index">
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
              label="Sign on"
              @click="saveTask"
              v-if="!carousel.canGoToNext"
              color="positive" text-color="white"
              icon="check"  
              size="md"/>
          </q-carousel-control>
        </q-carousel>
       

    </div>
     <q-toolbar color='blue-grey-8' class="footer shadow-2">
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
      header: { title: this.taskRequired.title, color: 'blue-grey-8' },
      index: '',
      signedOn: false,
      loading: false
    }
  },
  computed: {
  },
  beforeCreate () {
    this.taskRequired = this.$store.getters.taskAnalysisRequired
  },
  beforeMount () {
    this.$store.dispatch('updateHeader', this.header)
  },
  methods: {
    saveTask () {
      this.loading = true
      // sign on to task analysis if not already signed on
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

  textarea {
    padding-top: 10px !important;
  }

  span {
    font-weight: bold;
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