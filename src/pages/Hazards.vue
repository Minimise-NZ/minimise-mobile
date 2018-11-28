<template>
  <div>
    <q-toolbar color="deep-orange-7" class="shadow-2">
      <q-btn flat icon="arrow_back" @click="$router.go(-1)" replace/>
      <q-toolbar-title>
        Hazard Register
      </q-toolbar-title>
    </q-toolbar>
    <div class="container">
      <q-list highlight>
        <q-list-header class="bg-deep-orange-5 text-white">Please review hazards</q-list-header>
      </q-list>
       <q-carousel
          v-model="slide"
          :autoplay="autoplay"
          height="80vh">
        <q-carousel-slide v-for="(hazard, index) in hazards" :key="index">
          <q-card>
            <q-card-title>
              <div class="title">{{hazard.name}}</div>
              <div slot="right" class="row items-center">
                <img :src="hazard.thumb">
              </div>
            </q-card-title>
            <q-card-separator />
            <q-card>
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
            </q-card>
           
          </q-card>
        </q-carousel-slide>
        <q-carousel-control slot="control-nav" slot-scope="carousel" :offset="[18, 250]">
            <q-btn
              @click="carousel.next"
              v-if="carousel.canGoToNext"
              color="white" text-color="text-faded"
              icon="keyboard_arrow_right"
              round dense
              size="lg"/>
            <q-btn
              @click="route"
              v-if="!carousel.canGoToNext"
              color="positive" text-color="white"
              icon="check"
              round dense
              size="lg"/>
          </q-carousel-control>
        <!--
        <q-carousel-control slot="control-progress" slot-scope="carousel" position="bottom" :offset="[42, 10]">
          <q-progress :percentage="carousel.percentage" stripe color="deep-orange-7" :animate="autoplay" />
          <p>{{carousel.percentage}}</p>
        </q-carousel-control>
        -->
      </q-carousel>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      autoplay: false,
      colors: [
      'primary',
      'secondary',
      'yellow',
      'red',
      'orange',
      'grey-2'
      ],
      slide: 0
    }
  },
  computed: {
    hazards () {
      return this.$store.getters.myHazards
    }
  },
  methods: {
    route () {
      this.$store.dispatch('inductionComplete')
      .then(() => {
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped>
  .q-card-primary {
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .q-carousel-slide {
    padding: 10px;
  }

  p {
    margin: 0 0 10px;
  }
  .title {
    margin-top: 10px;
    padding-right: 10px;
    font-size: 20px;
    line-height: 1.6rem;
    font-weight: 600;
  }

  .subtitle {
    font-weight: bold;
    font-size: 16px;
  }
  .q-list {
    border: none;
  }
  .q-list-header {
    margin-top: 10px;
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

  @media screen and (max-height: 400px) {
    .q-toolbar, .q-list-header {
      display: none;
    }
  }
  @media screen and (orientation: landscape) {
    .q-toolbar, .q-list-header {
      display: none;
    }
  }
</style>