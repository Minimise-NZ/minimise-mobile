<template>
  <div>
    <div class="container">
      <q-scroll-area style="width: 100%; height: 80vh;">
        <div class="section">
          <div class="section-header">
            <p class="header-text">Site Contacts</p>
          </div>
          <div class="content">
            <p>Site Manager: {{jobSite.projectManager}}</p>
            <p><q-icon name="phone"/><span>{{jobSite.PMcontact}}</span></p>
            <p>HSE Manager: {{jobSite.HSEManager}}</p>
            <p><q-icon name="phone"/><span>{{jobSite.HSEcontact}}</span> </p>
          </div>
        </div>
        <div class="section">
          <div class="section-header">
            <p class="header-text">Emergency Contacts</p>
          </div>
          <div class="content">
            <p><q-icon name="phone"/>Fire, Ambulance, Police: <span>111</span></p>
            <p><q-icon name="phone"/>Orion Faults: <span>0800 363 9898</span></p>
            <p><q-icon name="phone"/>Poisons: <span>0800 764 766</span></p>
            <p><q-icon name="phone"/>Spill Response: <span>0800 877 455</span></p>
          </div>
        </div>
        <div class="section">
          <div class="section-header">
            <p class="header-text">Nearest Medical Centre</p>
          </div>
        </div>
        <div class="map section">
          <p>{{jobSite.medical}}</p>
          <p><q-icon name="phone"/><span>{{jobSite.medPhone}}</span></p>
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
    <q-toolbar color="indigo-5" class="footer shadow-2">
      <q-btn flat icon="arrow_back" @click="$router.push('/home')" replace/>
    </q-toolbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      jobSite: {},
      header: { title: 'Emergency Information', color: 'indigo-5' }
    }
  },
  computed: {
    medicalMap () {
      return 'https://www.google.com/maps/embed/v1/place?key=AIzaSyD7W7NiKKy0qZfRUsslzHOe-Hnkp-IncyU&q=' + this.jobSite.medical
    }
  },
  beforeMount () {
    this.jobSite = this.$store.getters.jobSite
    this.$store.dispatch('updateHeader', this.header)
  }
}
</script>

<style scoped>
  .q-scroll-area {
    margin-top: 10px;
  }

  .container {
    padding-top: 10px;
  }

  .section-header {
    background-color: #13416dba;
    border-radius: 5px;
  }

  .header-text {
    color: white;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 15px;
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
