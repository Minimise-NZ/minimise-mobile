<template>
  <div>
    <q-toolbar color="deep-orange-6" class="shadow-2">
      <q-btn flat icon="arrow_back" @click="$router.push('/location')" replace/>
      <q-toolbar-title>
        Hazard Register
      </q-toolbar-title>
    </q-toolbar>
    <div class="container">
      <q-list>
        <q-item v-for="hazard in hazards" :key="hazard.id" @click="showhazard(hazard)">
            <q-item-side :image="hazard.image"/>
            <q-item-main style="padding-left: 20px">
              <q-item-tile label>{{hazard.name}}</q-item-tile>
            </q-item-main>
        </q-item>
      </q-list>
    </div>
    <q-btn class="fixed shadow-8" style="right: 18px; bottom: 18px" round color="positive" icon="done_all" @click="$router.push('/home')" replace/>s
    <q-modal v-model="openModal">
      <q-toolbar color="blue-9" class="shadow-2">
        <q-toolbar-title style="padding-left: 25px">{{hazard.name}}</q-toolbar-title>
      </q-toolbar>
      <div class="container">
        <q-list highlight>
          <q-list-header>Please check your controls are in place</q-list-header>
          <q-scroll-area style="width: 100%; height: 70vh;">
            <q-item v-for="control in hazard.controls" :key="control.name">
              <q-item-main>
                <q-item-tile style="padding-bottom: 15px">{{control.name}}</q-item-tile>
                <q-option-group
                color="secondary"
                type="radio"
                v-model="control.status"
                inline
                :options="[
                  { label: 'Yes', value: 'yes', color: 'primary' },
                  { label: 'No', value: 'no', color: 'red' },
                  { label: 'n/a', value: 'n/a', color: 'grey'}
                ]"/>
              </q-item-main>
            </q-item>
          </q-scroll-area>
        </q-list>
        <q-btn class="fixed shadow-8" small style="left: 18px; bottom: 18px" round color="negative" icon="clear" @click="cancel"/>
        <q-btn class="fixed shadow-8" small style="right: 18px; bottom: 18px" round color="positive" icon="done" @click="saveHazard"/>
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
      hazards: [
        {
          name: 'Ladder',
          id: 'LADDER-ID',
          IRA: '15',
          RRA: '',
          controls: [
            {
              name: 'Light task, short duration',
              status: ''
            },
            {
              name: 'Don\'t overload',
              status: ''
            },
            {
              name: 'Don\'t overreach',
              status: ''
            },
            {
              name: 'Don\'t rest tools',
              status: ''
            },
            {
              name: 'Stop at 3rd step from the top',
              status: ''
            },
            {
              name: 'Keep 3 points of contact',
              status: ''
            }
          ],
          image: 'statics/ladder.jpg',
          risks: [
            'Risk 1', 'Risk 2'
          ],
          taskAnalysis: '',
          worksafe: ''
        },
        {
          name: 'Manual Handling',
          image: 'statics/manual-handling.jpg'
        },
        {
          name: 'Powder Gun',
          image: 'statics/powder-gun.jpg'
        },
        {
          name: 'Power Tools',
          image: 'statics/power-tools.jpg'
        }
      ],
      hazard: {}
    }
  },
  computed: {
  },
  methods: {
    showhazard (hazard) {
      // return link to hazard page with hazard id
      this.hazard = hazard
      this.openModal = true
    },
    saveHazard () {
      // add hazard to array ready to be written to database
      // remove hazard from hazard list na d return new hazards list
      console.log('saving hazard')
      this.openModal = false
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

  .q-item-label {
    font-size: 1.4rem;
  }

  .q-item {
    margin-bottom: 2vh;
    border-bottom: 1px solid lightgrey;
  }

  .q-item-image{
    min-width: 70px;
    width: 70px;
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
