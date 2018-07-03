<template>
  <div class="login-container">
    <div class="img-container">
      <img src="../statics/minimise-256x256.png">
    </div>
    <div class="headings">
      <div class="q-display-1">m&#305;n&#305;m&#305;se</div>
    </div>
    <div class="user-form" id="form">
      <q-field v-if="!found" helper="Please contact your administrator if you need to confirm your details">
        <q-input v-model="email" type="email" :before="[{icon: 'mail'}]" placeholder=' Please enter email address' v-validate="'required|email'"/>
      </q-field>
      <q-field>
        <q-input
          name="password"
          v-validate="'required|min:6'"
          v-if="found"
          v-model="password"
          data-vv-delay="3000"
          type="password"
          :before="[{icon: 'lock'}]"
          placeholder=' Password' />
          <span class="alert-text" v-show="errors.has('password')">{{ errors.first('password') }}</span>
      </q-field>
      <q-field>
        <q-input
          name="confirmPassword"
          v-validate="'required|confirmed:password'"
          v-if="found"
          v-model="confirmPassword"
          type="password"
          data-vv-delay="3000"
          data-vv-as="password"
          :before="[{icon: 'lock'}]"
          placeholder=' Confirm Password' />
        <span class="alert-text" v-show="errors.has('confirmPassword')">{{ errors.first('confirmPassword') }}</span>
      </q-field>
    </div>
    <div class="buttons">
      <q-btn v-if="!found" color="primary" rounded big @click="findUser">Next</q-btn>
      <q-btn v-if="found" color="primary" rounded big @click="signup">Next</q-btn>
      <router-link to='/'>Go back</router-link>
    </div>
    <q-inner-loading :visible="loading">
      <q-spinner-gears size="100px" color="primary"></q-spinner-gears>
    </q-inner-loading>
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
      confirmPassword: '',
      user: {},
      loading: false
    }
  },
  computed: {
    uid () {
      return this.$store.getters.uid
    }
  },
  methods: {
    findUser () {
      this.loading = true
      // find user details in firestore
      this.$validator.validateAll().then(async (valid) => {
        if (!valid) {
          this.$q.dialog({
            title: 'Alert',
            message: 'Please enter a valid email address'
          })
          this.loading = false
          return
        }
        try {
          let user = await this.$store.dispatch('findUser', this.email)
          this.user = user
          this.found = true
          this.loading = false
        } catch (error) {
          console.log(error.message)
          this.loading = false
          this.$q.dialog({
            title: 'Alert',
            message: error.message
          })
          this.$router.go(-1)
        }
      })
    },
    signup () {
      // create new user
      this.$validator.validateAll().then(async (valid) => {
        if (!valid) { return }
        try {
          this.loading = true
          // create new user in firebase
          this.$store.dispatch('signUp', {email: this.email, password: this.password})
          .then(() => {
            setTimeout(() => { 
              this.$store.dispatch('updateCurrentUser', {uid: this.uid}) 
            }, 3000)
            this.$store.dispatch('getJobs')
            this.$store.dispatch('getCompany')
            // get hazards, substances and tasks
            this.loading = false
            this.$router.replace('/location')
            })
        } catch (err) {
          this.loading = false
          console.log(err)
        }
      })
    }
  }
}
</script>

<style scoped>

 .img-container {
    padding: 5vh 0 0 0;
    text-align: center;
    position: relative;
  }

  img {
    height: 20vh;
  }

  .headings {
    text-align: center;
    margin-bottom: 10vh;
  }

  .user-form {
    margin: 0 15px;
    margin-top: 5vh;
  }

  .q-field {
    margin-bottom: 20px;
  }
 .buttons {
    padding-bottom: 5vh;
  }

  button {
    width: 80%;
    max-width: 300px;
    margin-bottom: 20px;
  }

  a {
    display: block;
  }

  span {
    float: right;
    padding-top: 10px;
  }

  .alert-text {
    font-size: 0.7rem;
    color: red;
  }

  @media screen and (max-height: 400px) {
    .img-container, .headings {
      display: none;
    }
    .user-form {
      padding-top: 30px;
    }
  }

  @media screen and (max-height: 150px) {
    .img-container, .headings {
      display: none;
    }
    .user-form {
      padding-top: 5px;
    }
    .buttons {
      display: none;
    }
  }

</style>
