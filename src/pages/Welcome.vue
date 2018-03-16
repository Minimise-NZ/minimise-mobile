<template>
  <div class="login-container">
    <div class="img-container">
      <img src="../statics/minimise-256x256.png">
    </div>
    <div class="headings">
      <div class="q-display-2">m&#305;n&#305;m&#305;se</div>
      <div class="q-subheading">Simple Safety on Construction Sites</div>
    </div>
    <div class="buttons">
      <router-link to='/login'>
        <q-btn color="primary" rounded big>Log In</q-btn>
      </router-link>
      <router-link to='/signup'>New User</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loggedIn: false,
      signedIn: false
    }
  },
  beforeMount () {
    // let user = this.$store.getters.userKey
  }
}
</script>

<style scoped>

  .img-container {
    height: 50vh;
    padding: 15vh 0 0 0;
    text-align: center;
  }

  img {
    height: 30vh;
  }

  .headings {
    height: 25vh;
    margin-top: 15px;
    text-align: center;
  }

  .q-subheading {
    margin-top: 10px;
  }

  button {
    width: 100%;
    max-width: 300px;
    margin-bottom: 20px;
  }

  a {
    display: block;
  }
</style>
