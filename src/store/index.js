import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import {firestore} from '../firestore'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userKey: '',
    uid: '',
    user: {},
    companyKey: '',
    company: '',
    jobs: [],
    jobSite: {}
  },
  mutations: {
    setUserKey (state, payload) {
      state.userKey = payload
    },
    setUID (state, payload) {
      state.uid = payload
    },
    setUser (state, payload) {
      state.user = payload
    },
    setCompanyKey (state, payload) {
      state.companyKey = payload
    },
    setCompany (state, payload) {
      state.company = payload
    },
    setJobs (state, payload) {
      state.jobs = payload
    },
    setJob (state, payload) {
      state.jobSite = payload
    }
  },
  actions: {
    signUp ({commit}, payload) {
      // create a new user in firebase
      let promise = new Promise((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
          .then((user) => {
            commit('setUID', user.uid)
            resolve(user.uid)
          })
          .catch((error) => {
            reject(error)
          })
      })
      return promise
    },
    signIn ({commit}, payload) {
      let promise = new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
          .then(
            user => {
              commit('setUID', user.uid)
              resolve()
            }
          )
          .catch(
            error => {
              reject(error)
            }
          )
      })
      return promise
    },
    findUser: ({state, commit}, payload) => {
      let promise = new Promise((resolve, reject) => {
        console.log('getting user', payload)
        firestore.collection('users').where('email', '==', payload)
          .get()
          .then((snapshot) => {
            if (snapshot.empty) {
              throw new Error('This email adress has not been registered to a user. Please contact your administrator')
            } else {
              snapshot.forEach((doc) => {
                let user = doc.data()
                if (user.uid) {
                  throw new Error('User profile already exists. Please log in with existing user details')
                } else {
                  commit('setUserKey', doc.id)
                  resolve(user)
                }
              })
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
      return promise
    },
    getUser ({commit, state}) {
      let promise = new Promise((resolve, reject) => {
        firestore.collection('users').where('uid', '==', state.uid)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              let user = doc.data()
              commit('setUser', user)
              commit('setUserKey', doc.id)
              commit('setCompanyKey', user.company)
              console.log('User profile set')
              resolve(user)
            })
          })
          .catch((error) => {
            reject(error)
          })
      })
      return promise
    },
    updateCurrentUser ({state}, payload) {
      let promise = new Promise((resolve, reject) => {
        firestore.collection('users').doc(state.userKey)
          .get()
          .then((doc) => {
            firestore.collection('users').doc(doc.id).set(payload, {merge: true})
            console.log('User updated')
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
      return promise
    },
    getJobs ({commit, state}) {
      // get all jobs in progress that this worker is assigned to
      let approvedkey = 'approved.' + state.companyKey
      firestore.collection('jobSites').where(approvedkey, '==', true)
        .get()
        .then((snapshot) => {
          console.log(snapshot)
          let jobs = []
          snapshot.forEach((doc) => {
            console.log(doc.data())
            let job = doc.data()
            jobs.push({
              id: doc.id,
              address: job.address,
              principal: job.principalName,
              projectManager: job.pm,
              PMcontact: job.pmPhone,
              HSEManager: job.hse,
              HSEcontact: job.hsePhone,
              date: job.date,
              notifiable: job.notifiable,
              info: job.info,
              medical: job.medical
            })
          })
          commit('setJobs', jobs)
        })
        .catch((error) => {
          console.log('Error getting documents: ', error)
        })
    },
    setJobSite ({commit}, payload) {
      let job = payload
      commit('setJob', job)
    }
  },
  getters: {
    jobs: (state) => state.jobs,
    jobSite: (state) => state.jobSite
  },
  plugins: [createPersistedState()]
})

export default store
