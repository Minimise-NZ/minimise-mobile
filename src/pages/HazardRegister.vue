<template>
  <div>
    <div class="container">
      <q-scroll-area style="width: 100%; height: 80vh;">
        <q-collapsible v-for="(hazard, index) in hazards" :key="index" :label="hazard.name" group="hazards" opened highlight>
          <q-card>
            <q-card-main>
              <q-item v-for="(control, index) in hazard.controls" :key="index">
                <q-item-side icon="check" style="color: green" v-if="control.status === 'Controlled'"></q-item-side>
                <q-item-side icon="close" style="color: red" v-if="control.status === 'Uncontrolled'"></q-item-side>
                <q-item-side icon="remove" style="color: grey" v-if="control.status === 'n/a'"></q-item-side>
                <q-item-main>
                  <q-item-tile label>{{control.desc}}</q-item-tile>
                </q-item-main>
              </q-item>
            </q-card-main>
            <!--
            <q-card-actions class="group">
              <div class="col" />
              <q-btn flat color="primary" size="md" icon="mode edit" label="Edit" />
            </q-card-actions>
            -->
          </q-card>
        </q-collapsible>
      </q-scroll-area>
    </div>
    <q-toolbar color="green-6" class="footer shadow-2">
      <q-btn flat icon="arrow_back" @click="$router.push('/home')" replace/>
    </q-toolbar>
    <q-btn class="fixed shadow-8" size="lg" style="right: 18px; bottom: 18px" round color="primary" icon="add" @click="$router.push('/hazards')" replace/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      jobSite: {},
      header: { title: 'Hazard Register', color: 'green-6' }
    }
  },
  computed: {
  },
  methods: {
  },
  beforeMount () {
    this.jobSite = this.$store.getters.jobSite
    this.hazards = this.$store.getters.siteHazards
    this.$store.dispatch('updateHeader', this.header)
  }
}
</script>

<style scoped>
  .q-scroll-area {
    margin-top: 10px;
  }

  .section-header {
    background-color:#979797;
    border-radius: 5px;
  }

  .header-text {
    color: white;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 15px;
  }

  .footer {
    position: absolute;
    bottom: 0;
  }

</style>
