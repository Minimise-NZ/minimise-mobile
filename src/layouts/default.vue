<template>
  <q-layout view="hHr LpR lFf">
    <q-layout-header>
      <q-toolbar :color='header.color' class="shadow-2">
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen">
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>
          {{header.title}}
          <div slot="subtitle">{{jobSite.address}}</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer v-model="leftDrawerOpen" content-class="bg-grey-2">
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header class="drawer-header">{{user.name}}</q-list-header>
        <q-scroll-area>
          <q-collapsible icon="person" label="My Profile" class="q-pt-md">
            <q-card>
              <q-card-main>
                <q-item class="sub-item">
                  <q-item-side icon="phone"/>
                  <q-item-main>
                    <q-input v-model="user.phone" :readonly="readonly" @change="changed === true"></q-input>
                  </q-item-main>
                </q-item>
                <q-item class="sub-item">
                  <q-item-side icon="mail outline"/>
                  <q-item-main>
                    <q-input v-model="user.email" :readonly="readonly"></q-input>
                  </q-item-main>
                </q-item>
              </q-card-main>
              <q-card-actions class="justify-end">
                <q-btn icon-right="edit" color="grey-6" label="Edit Profile" @click="editMode" v-if="readonly"/>
                <q-btn icon-right="check" color="primary" label="Save Changes" @click="updateProfile" v-if="!readonly"/>
              </q-card-actions>
            </q-card>
          </q-collapsible>
          <q-collapsible icon="feedback" label="Support/Feedback" class="q-pt-sm">
            <q-card>
              <q-input
                v-model="support"
                type="textarea"
                style="padding: 10px"
                placeholder="Please enter feedback details"
                rows="10"
              />
              <q-btn-group>
                <q-btn color="red-5" @click="support = ''">Cancel</q-btn>
              <q-btn color="green-5" @click="submitSupport">Submit</q-btn>
              </q-btn-group>
            </q-card>
          </q-collapsible>
          <q-item-separator />
          <q-list-header class="drawer-header">Current Site Location</q-list-header>
            <q-item>
              <q-item-main :label="address"/>
            </q-item>
            <div v-if="signedIn === true">
            <q-item @click.native="$router.push('/home'), leftDrawerOpen = !leftDrawerOpen" replace>
              <q-item-side icon="remove red eye" />
              <q-item-main label="View Safety Plan"/>
            </q-item>
            <q-item @click.native="signout">
              <q-item-side icon="clear" />
              <q-item-main label="Sign out"/>
            </q-item>
          </div>
          <q-item v-if="signedIn !== true" @click.native="changeLocation">
            <q-item-side icon="refresh" />
            <q-item-main label="Change location"/>
          </q-item>
        </q-scroll-area>
        <q-btn
          @click="confirmLogout"
          icon="lock"
          label="Logout"
          style="padding: 15px; border-radius: 0"
          class="logout full-width fixed-bottom bg-dark text-grey-4"
          align="left">
        </q-btn>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import _ from 'lodash'
export default {
  name: 'LayoutDefault',
  data () {
    return {
      readonly: true,
      changed: false,
      leftDrawerOpen: false,
      originalUser: {},
      support: '',
      feedback: ''
    }
  },
  computed: {
    header () {
      return this.$store.getters.header
    },
    user () {
      return this.$store.getters.user
    },
    address () {
      return this.$store.getters.jobSite.address
    },
    signedIn () {
      return this.$store.getters.signedIn
    }
  },
  beforeMount () {
    this.jobSite = this.$store.getters.jobSite
  },
  mounted () {
    var copy = Object.assign({}, this.user)
    this.originalUser = copy
  },
  methods: {
    changeLocation () {
      this.$store.commit('setJob', {})
      this.$router.push('/location')
    },
    openURL,
    editMode () {
      this.readonly = false
    },
    updateProfile () {
      // check if the profile has been changed
      let equal = _.isEqual(this.originalUser, this.user)
      if (equal === false) {
        if (this.originalUser.phone !== this.user.phone) {
          // change phone number
          this.$store.dispatch('updateCurrentUser', {phone: this.user.phone})
          console.log('Phone number has changed')
        }
        if (this.originalUser.email !== this.user.email) {
          // change email address
          this.$store.dispatch('updateEmail', this.user.email)
          console.log('Email has changed')
        }
        this.readonly = true
      } else {
        console.log('Nothing has changed')
        this.readonly = true
      }
    },
    submitSupport () {
      this.$store.dispatch('submitFeedback', {subject: 'Support Request', details: this.support})
        .then((response) => {
          if (response.status === 200) {
            this.$q.dialog({
              title: 'Success',
              message: 'Thank you for your feedback. If you have requested support, we will be in touch soon'
            })
            this.support = ''
          } else {
            this.$q.dialog({
              title: 'Oops',
              message: 'There was a problem sending your request. Please contact your administrator'
            })
            this.support = ''
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    signout () {
      this.$store.dispatch('signOut')
    },
    confirmLogout () {
      this.$q.dialog({
        title: 'Confirmation Required',
        message: 'Are you sure that you have want to logout of the minimise app completely?',
        ok: 'Yes',
        cancel: 'No',
        noBackdropDismiss: true
      }).then(() => {
        this.logout()
      }).catch(() => {
        console.log('Stopped logout')
      })
    },
    logout () {
      this.$router.replace('/')
      this.$store.dispatch('logout')
    }
  }
}
</script>

<style>
  .sub-item{
    padding-left: 0;
  }
  .q-list {
    padding-top: 0;
  }
  .q-input {
    font-size: 0.9rem;
  }
  .q-btn-group {
    width: 100%;
  }
  .q-btn-group >.q-btn.inline {
    width: 50%;
  }
  .drawer-header {
    background-color: #00608c;
    border-radius: 0;
    color: #e0e0e0;
    font-size: 1rem;
  }
  .q-scroll-area {
    width: 100%;
    height: 80vh;
  }
  @media screen and (orientation: landscape) {
    .q-scroll-area {
      height: 70vh;
    }
  }
</style>