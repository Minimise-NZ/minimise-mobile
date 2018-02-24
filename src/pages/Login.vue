<template>
  <div class="login-container">
    <div class="img-container">
      <img src="../statics/minimise-256x256.png">
    </div>
    <div class="headings">
      <div class="q-display-1">m&#305;n&#305;m&#305;se</div>
    </div>
    <div class="user-form" >
      <q-input v-model="phone" type="tel" :before="[{icon: 'phone'}]" placeholder=' Your Phone Number'/>
    </div>
    <div class="buttons">
      <q-btn color="primary" rounded big @click="login">Next</q-btn>
      <router-link to='/'>Go back</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      phone: ''
    }
  },
  methods: {
    login () {
      // log user in
    }
  }
}
</script>

<style scoped>
  .img-container {
    position: relative;
    height: 40vh;
    padding: 15vh 0 0 0;
    text-align: center;
  }

  img {
    height: 20vh;
  }

  .headings {
    text-align: center;
    margin-bottom: 10vh;
  }

  .user-form {
    padding-top: 10vh;
  }

  .q-input {
    margin: 10px;
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
