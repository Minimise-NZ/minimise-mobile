<template>
  <div class="outer">
    <div class="container">
      <q-scroll-area style="width: 100%; height: 80vh;">
        <div class="section">
          <q-list-header class="bg-cyan-9 text-white">Site Contacts</q-list-header>
          <div class="content">
            <p>Site Manager: {{jobSite.supervisorName}}</p>
            <p><q-icon name="phone"/><span>{{jobSite.supervisorPhone}}</span></p>
          </div>
        </div>
        <div class="section">
          <q-list-header class="bg-cyan-9 text-white">Emergency Contacts</q-list-header>
          <div class="content">
            <p><q-icon name="phone"/>Fire, Ambulance, Police: <span>111</span></p>
            <p><q-icon name="phone"/>Orion Faults: <span>0800 363 9898</span></p>
            <p><q-icon name="phone"/>Poisons: <span>0800 764 766</span></p>
            <p><q-icon name="phone"/>Spill Response: <span>0800 877 455</span></p>
          </div>
        </div>
        <div class="section">
          <q-list-header class="bg-cyan-9 text-white">Nearest Medical Centre</q-list-header>
        </div>
        <div class="map section">
          <iframe
          width="100%"
          height="320px"
          frameborder="0" style="border:0"
          :src="medicalMap"
          allowfullscreen>
          </iframe>
        </div>
      </q-scroll-area>
    </div>
    <q-toolbar color="light-blue-9" class="footer shadow-2">
      <q-btn flat icon="arrow_back" @click="$router.push('/home')" replace/>
    </q-toolbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      jobSite: {
        header: { title: 'Emergency Information', color: 'light-blue-9' },
        supervisorName: 'supervisorName',
        supervisorPhone: 'supervisorPhone',
        medical: '187 Marine Parade'

      }
    }
  },
  computed: {
    medicalMap () {
      return 'https://www.google.com/maps/embed/v1/place?key=AIzaSyD7W7NiKKy0qZfRUsslzHOe-Hnkp-IncyU&q=' + this.jobSite.medical
    }
  },
  methods: {
  },
  beforeMount () {
    this.jobSite = this.$store.getters.jobSite
    this.$store.dispatch('updateHeader', this.header)
  }
}
</script>

<style scoped>
  .q-scroll-area {
    margin-top: 5px;
  }
  .container {
    padding-top: 5px;
  }
  .content {
    margin: 10px;
  }
  i {
    margin-right: 10px;
  }
  span {
    color: #027be3;
  }
  .map {
    margin: 10px;
  }
  .footer {
    position: absolute;
    bottom: 0;
  }
</style>