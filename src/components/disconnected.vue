<template>
  <div class="content">
    <div class="error">
      <q-icon name="wifi" size="56px" color="grey"/>
      <p>No internet connection</p>
      <q-btn color="primary" rounded big @click="reload">Retry</q-btn>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    reload () {
      window.location.reload(true)
    }
  }
}
</script>

<style scoped>
  .content {
    height: 100vh;
    padding: 10vh;
  }

  .error {
    text-align: center;
    margin-top: 30px;
  }

  p {
    padding-top: 10px;
    padding-bottom: 10px;
  }

</style>
