<template>
  <div class="login-container">
    <div class="img-container">
      <img src="../statics/minimise-256x256.png">
    </div>
    <div class="headings">
      <div class="q-display-1">m&#305;n&#305;m&#305;se</div>
    </div>
    <div class="user-form" >
      <q-field helper="Please contact your administrator if you need to confirm your details">
        <q-input v-if="!found" v-model="email" type="text" :before="[{icon: 'mail'}]" placeholder=' Please enter email address' />
      </q-field>
      <q-input v-if="found" v-model="password" type="text" :before="[{icon: 'lock'}]" placeholder=' Password' />
      <q-input v-if="found" v-model="confirmPassword" type="text" :before="[{icon: 'lock'}]" placeholder=' Confirm Password' />
    </div>
    <div class="buttons">
      <q-btn v-if="!found" color="primary" rounded big @click="findUser">Next</q-btn>
      <q-btn v-if="found" color="primary" rounded big @click="signup">Next</q-btn>
      <router-link to='/'>Go back</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      found: false,
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    findUser () {
      // find user details in firestore
      this.$store.dispatch('master/findUser', this.email)
        .then((user) => {
          console.log('user found', user)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    signup () {
      // create new user
      console.log('creating new user')
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

  .q-field {
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
