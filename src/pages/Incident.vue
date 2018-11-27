<template>
  <div>
    <q-modal style="margin-top: 0" v-model="showModal" minimized :content-css="{padding: '50px'}">
      <div class="q-display-1 q-mb-md">Incident submitted</div>
      <p>Thank you for reporting this incident</p>
      <q-btn color="primary" v-close-overlay label="Close"  @click="$router.push('/home')" replace />
    </q-modal>
    <div class="container">
      <q-scroll-area style="width: 100%; height: 75vh;">
        <q-list-header class="bg-cyan-8 text-white keyboard-hide">Please enter incident details</q-list-header>
        <div class="row">
          <q-select
            required
            v-model="incident.type"
            float-label="Incident Type:"
            :options="incidentTypes"
          />
        </div>
        <div class="row">
          <q-input
            required
            v-model="incident.description"
            type="textarea"
            float-label="Please describe what happened"
            rows="5"
          />
        </div>
        <div class="row">
          <q-input
            v-if="incident.type === 'Plant Damage'"
            required
            v-model="incident.plantDamage"
            type="textarea"
            float-label="Description of damage"
            rows="5"
          />
        </div>
        <div class="row">
          <q-input
            v-if="incident.type === 'Minor Harm' || incident.type === 'Serious Harm'"
            required
            v-model="incident.injuryDescription"
            type="textarea"
            float-label="Description of injury"
            rows="5"
          />
        </div>
        <div class="row">
          <q-input
            v-model="incident.corrective"
            required
            type="textarea"
            float-label="Description of corrective measures"
            rows="5"
          />
        </div>
      </q-scroll-area>
    </div>
    <q-toolbar color="cyan-9" class="footer shadow-2 keyboard-hide">
      <q-btn flat icon="arrow_back" @click="$router.push('/home')" replace/>
      <q-btn class="fixed shadow-8" size="lg" style="right: 18px; bottom: 18px" round color="positive" icon="done" @click="submit"/>
    </q-toolbar>
    <q-inner-loading :visible="loading">
      <q-spinner-gears size="100px" color="primary"></q-spinner-gears>
    </q-inner-loading>
  </div>
</template>
<script>
export default {
  data () {
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style scoped>
</style>