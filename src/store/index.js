import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import {firestore} from '../firestore'
import moment from 'moment'
import createPersistedState from 'vuex-persistedstate'
// import moment from 'moment'

Vue.use(Vuex)

const today = moment().format('DD-MM-YYYY')

const store = new Vuex.Store({
  state: {
    header: {},
    userKey: '',
    uid: '',
    signedIn: false,
    user: {},
    safetyPlan: {},
    companyKey: '',
    company: {},
    jobs: [],
    jobSite: {},
    taskRequired: false,
    task: {},
    tasks: [],
    allHazards: [],
    siteHazards: []
  },
  mutations: {
    clearStore (state) {
      state.header = {}
      state.userKey = ''
      state.uid = ''
      state.signedIn = false
      state.safetyPlan = {}
      state.user = {}
      state.companyKey = ''
      state.company = {}
      state.jobs = []
      state.jobSite = {}
      state.taskRequired = false
      state.task = {}
      state.tasks = []
      state.allHazards = []
      state.siteHazards = []
    },
    setHeader (state, payload) {
      state.header = payload
    },
    setUserKey (state, payload) {
      state.userKey = payload
    },
    setUID (state, payload) {
      state.uid = payload
    },
    setSignedin (state, payload) {
      state.signedIn = payload
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
    },
    setTaskRequired (state, payload) {
      state.taskRequired = payload
    },
    setTask (state, payload) {
      state.task = payload
    },
    setTasks (state, payload) {
      state.tasks = payload
    },
    setAllHazards (state, payload) {
      state.allHazards = payload
    },
    setSiteHazards (state, payload) {
      state.siteHazards = payload
    }
  },
  actions: {
    updateHeader ({commit}, payload) {
      let header = payload
      commit('setHeader', header)
    },
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
    logIn ({commit}, payload) {
      let promise = new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
          .then(
            user => {
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
    autoLogIn ({commit, state, dispatch}, payload) {
      commit('setUID', payload)
      if (state.user === {}) {
        dispatch('getUser')
      }
    },
    logout ({commit, dispatch}) {
      firebase.auth().signOut()
      commit('clearStore')
      localStorage.clear()
      console.log(window.history.length)
    },
    signIn (commit, dispatch) {
      // sign user into existing safety plan
    },
    findUser ({state, commit}, payload) {
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
    getCompany ({commit, state}) {
      let promise = new Promise((resolve, reject) => {
        firestore.collection('companies').doc(state.companyKey)
          .get()
          .then((doc) => {
            let company = doc.data()
            commit('setCompany', company)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
      return promise
    },
    getTasks ({commit, state}) {
      // get task analysis from firestore
      if (state.tasks.length < 1) {
        console.log('getting tasks')
        firestore.collection('companies').doc(state.companyKey)
          .collection('taskAnalysis')
          .get()
          .then((snapshot) => {
            let tasks = []
            snapshot.forEach((doc) => {
              tasks.push(doc.data())
            })
            commit('setTasks', tasks)
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        console.log('Tasks already in store')
        return state.tasks
      }
    },
    updateCurrentUser ({state, dispatch}, payload) {
      let promise = new Promise((resolve, reject) => {
        firestore.collection('users').doc(state.userKey)
          .get()
          .then((doc) => {
            firestore.collection('users').doc(doc.id).set(payload, {merge: true})
              .then(() => {
                console.log('User updated')
                dispatch('getUser')
                resolve()
              })
          })
          .catch((error) => {
            reject(error)
          })
      })
      return promise
    },
    updateEmail ({state, dispatch}, payload) {
      var user = firebase.auth().currentUser
      user.updateEmail(payload).then(function () {
        // Update successful.
        console.log('email updated successfully')
        dispatch('updateCurrentUser', {email: payload})
      }).catch(function (error) {
        // An error happened.
        console.log(error)
      })
    },
    getJobs ({commit, state}) {
      // get all jobs in progress that this worker is assigned to
      let promise = new Promise((resolve, reject) => {
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
                principalKey: job.principalKey,
                projectManager: job.pm,
                pmKey: job.pmKey,
                PMcontact: job.pmPhone,
                HSEManager: job.hse,
                HSEcontact: job.hsePhone,
                hseKey: job.hseKey,
                date: today,
                notifiable: job.notifiable,
                info: job.info,
                medical: job.medical
              })
            })
            commit('setJobs', jobs)
            resolve()
          })
          .catch((error) => {
            console.log('Error getting documents: ', error)
            reject(error)
          })
      })
      return promise
    },
    newIncident ({commit, dispatch, state}, payload) {
      // create new incident in firestore
      let incident = payload
      incident.date = today
      console.log('saving incident to firebase', incident)
      let promise = new Promise((resolve, reject) => {
        firestore.collection('incidents').add(incident)
          .then((doc) => {
            resolve(doc.id)
          })
          .catch((error) => {
            reject(error)
          })
      })
      return promise
    }
  },
  getters: {
    user: (state) => state.user,
    userKey: (state) => state.userKey,
    company: (state) => state.company,
    signedIn: (state) => state.signedIn,
    jobs: (state) => state.jobs,
    jobSite: (state) => state.jobSite,
    allHazards: (state) => state.allHazards,
    siteHazards: (state) => state.siteHazards,
    tasks: (state) => state.tasks,
    taskRequired: (state) => state.taskRequired,
    header: (state) => state.header
  },
  plugins: [createPersistedState()]
})

export default store
