import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import {firestore} from '../firestore'
import moment from 'moment'
import createPersistedState from 'vuex-persistedstate'
import _ from 'lodash'
import router from '../router'

Vue.use(Vuex)

const today = moment().format('DD-MM-YYYY')
const expiryDate = moment().add(7, 'days').format('DD-MM-YYYY')
// const now = moment().format('DD-MM-YYYY hh:mm')

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
      state.user = {}
      state.safetyPlan = {}
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
    setSignedIn (state, payload) {
      state.signedIn = payload
    },
    setUser (state, payload) {
      state.user = payload
    },
    setSafetyPlan (state, payload) {
      state.safetyPlan = payload
    },
    setTimecard (state, payload) {
      state.safetyPlan.timecard = payload
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
    signIn ({commit, state, dispatch}) {
      // if there is no current safety plan, create safety plan and save to firestore
      let promise = new Promise((resolve, reject) => {
        let plan = state.safetyPlan
        if (_.isEmpty(plan) || plan === undefined || plan === null) {
          // create a safety plan
          console.log('No safety plan exists')
          plan.workerKey = state.userKey
          plan.workerName = state.user.name
          plan.contractorKey = state.user.company
          plan.principalKey = state.jobSite.principalKey
          plan.createdDate = today
          plan.expiryDate = expiryDate
          plan.jobId = state.jobSite.id
          plan.jobAddress = state.jobSite.address
          plan.hazardRegister = state.siteHazards
          plan.taskAnalysis = state.task
          plan.trainingRegister = state.user.training
          plan.signedIn = true
          console.log(plan)
          firestore.collection('jobSites').doc(state.jobSite.id).collection('safetyPlans').doc(state.userKey).set(plan)
            .then((doc) => {
              commit('setSignedIn', true)
              commit('setSafetyPlan', plan)
              dispatch('autoSignOut')
              resolve('Safety Plan added to firestore')
            })
            .catch((error) => {
              reject(error)
            })
        } else if (today > plan.expiryDate) {
          // if a safety plan exists but has expired
          console.log('Plan has expired')
          plan.createdDate = today
          plan.expiryDate = expiryDate
          plan.hazardRegister = state.siteHazards
          plan.taskAnalysis = state.task
          plan.trainingRegister = state.user.training
          plan.signedIn = true
          firestore.collection('jobSites').doc(state.jobSite.id).collection('safetyPlans').doc(state.userKey).set(state.safetyPlan, {merge: true})
          commit('setSafetyPlan', plan)
          commit('setSignedIn', true)
          dispatch('autoSignOut')
          resolve('Updated safety plan')
        } else {
          // if a safety plan exists and has not expired then sign onto it
          let plan = state.safetyPlan
          plan.signedIn = true
          commit('setSafetyPlan', plan)
          firestore.collection('jobSites').doc(state.jobSite.id).collection('safetyPlans').doc(state.userKey).set(state.safetyPlan)
          commit('setSignedIn', true)
          dispatch('autoSignOut')
          resolve('Signed into safety plan')
        }
      })
      return promise
    },
    autoSignOut ({ commit }) {
      setTimeout(() => {
        commit('setSignedIn', false)
        router.replace('/')
      }, 10 * 60 * 60 * 1000)
    },
    signOut ({commit, state}) {
      let plan = state.safetyPlan
      plan.signedIn = false
      commit('setSafetyPlan', plan)
      firestore.collection('jobSites').doc(state.jobSite.id).collection('safetyPlans').doc(state.userKey).set(state.safetyPlan)
      commit('setSignedIn', false)
      router.replace('/')
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
    getSafetyPlan ({commit, state}, payload) {
      let promise = new Promise((resolve, reject) => {
        let jobId = payload
        console.log('getting safety plan for job', jobId)
        firestore.collection('jobSites').doc(jobId).collection('safetyPlans').doc(state.userKey)
          .get()
          .then((doc) => {
            if (doc.exists) {
              let plan = doc.data()
              plan.id = doc.id
              commit('setSafetyPlan', plan)
              resolve(plan)
            } else {
              resolve(null)
            }
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
    getNotMyHazards ({commit, state}) {
      let myHazards = state.siteHazards
      console.log('My Hazards', myHazards)
      let allHazards = state.company.hazards.slice(0)
      if (myHazards.length !== 0) {
        for (var i = 0; i < allHazards.length; i++) {
          for (var j = 0; j < myHazards.length; j++) {
            if (allHazards[i].id === myHazards[j].id) {
              allHazards.splice(i, 1)
            }
          }
        }
      }
      console.log(allHazards)
      commit('setAllHazards', allHazards)
    },
    updateCurrentUser ({state, commit, dispatch}, payload) {
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
    updateEmail ({state, commit, dispatch}, payload) {
      var user = firebase.auth().currentUser
      user.updateEmail(payload).then(function () {
        // Update successful.
        console.log('email updated successfully')
        dispatch('updateCurrentUser', {email: payload})
      }).catch(function (error) {
        // An error happened.
        return (error)
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
                medical: job.medical,
                medPhone: job.medPhone
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
    },
    submitFeedback ({state, commit}, payload) {
      // send an email to Minimse support
      let promise = new Promise((resolve, reject) => {
        window.emailjs.send('my_service', 'support', {
          username: state.user.name,
          userEmail: state.user.email,
          subject: payload.subject,
          platform: 'mobile',
          details: payload.details
        })
          .then(
            function (response) {
              console.log('Email SUCCESS', response)
              resolve(response)
            },
            function (error) {
              console.log('Email FAILED', error)
              reject(error)
            }
          )
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
    safetyPlan: (state) => state.safetyPlan,
    jobSite: (state) => state.jobSite,
    allHazards: (state) => state.allHazards,
    siteHazards: (state) => state.siteHazards,
    tasks: (state) => state.tasks,
    task: (state) => state.task,
    taskRequired: (state) => state.taskRequired,
    header: (state) => state.header
  },
  plugins: [createPersistedState()]
})

export default store
