<template>
  <div>
    <div class="content">
      <div class="img-container">
        <img src="../statics/minimise-256x256.png">
      </div>
      <div class="headings">
        <div class="q-display-1">m&#305;n&#305;m&#305;se</div>
      </div>
      <form class="user-form" >
        <q-input v-model="email" type="email" :before="[{icon: 'mail'}]" placeholder=' Email address' v-validate="'required|email'"/>
        <q-input v-model="password" type="password" :before="[{icon: 'lock'}]" placeholder=' Password' v-validate="'required'"/>
      </form>
    </div>
    <div class="buttons">
      <q-btn color="primary" rounded big @click="login">Next</q-btn>
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
      email: '',
      password: '',
      loading: false
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
    login () {
      // log user in
      this.$validator.validateAll().then(async (valid) => {
        if (!valid) {
          this.$q.dialog({
            title: 'Alert',
            message: 'Please enter email address and password'
          })
        } else {
          this.loading = true
          this.$store.dispatch('logIn', {email: this.email, password: this.password})
            .then(async () => {
              let user = await this.$store.dispatch('getUser')
              // check that user companyType is not principal
              if (user.companyType === 'principal') {
                this.$q.dialog({
                  title: 'Incorrect user type',
                  message: 'Please log in to web application'
                })
                this.$store.dispatch('logout')
                this.$router.replace('/')
              } else {
                this.$store.dispatch('getJobs')
                  .then(() => {
                    this.$store.dispatch('getCompany')
                    console.log('user logged in', user)
                    this.$router.replace('/location')
                  })
              }
            })
            .catch((error) => {
              this.loading = false
              this.$q.dialog({
                title: 'Invalid email or password',
                message: error.message
              })
            })
        }
      })
    }
  }
}
</script>

<style scoped>

  .content {
    height: 80vh;
  }

  .img-container {
    padding: 5vh 0 0 0;
    text-align: center;
    position: relative;
  }

  img {
    height: 20vh;
  }

  .user-form {
    margin: 0 15px;
    margin-top: 10vh;
  }

  .headings {
    text-align: center;
  }

  .q-input {
    padding-top: 15px;
    margin: 10px;
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

  .alert-text {
    color: red;
  }

  @media screen and (max-height: 400px) {
    .img-container, .headings {
      display: none;
    }
    .user-form {
      padding-top: 5px;
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
