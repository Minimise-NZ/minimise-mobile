<template>
  <div>
    <div class="container">
      <q-carousel
          arrows
          color="white"
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
      </q-carousel>
    </div>
    <q-toolbar color="deep-orange-7" class="footer shadow-2">
      <q-btn flat icon="arrow_back" @click="$router.push('/home')" replace/>
    </q-toolbar>
  </div>
</template>


<script>
export default {
  data () {
    return {
      header: { title: 'Hazard Register', color: 'deep-orange-7' }
    }
  },
  computed: {
    hazards () {
      return this.$store.getters.myHazards
    }
  },
  methods: {
  },
  beforeMount () {
    this.$store.dispatch('updateHeader', this.header)
  }
}
</script>

<style scoped>
  .footer {
    position: absolute;
    bottom: 0;
  }

  .q-carousel-slide {
    padding: 10px;
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

  p {
    margin: 0 0 10px;
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
</style>