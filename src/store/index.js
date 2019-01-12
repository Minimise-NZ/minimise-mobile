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
const usersRef = firestore.collection('users')
const companiesRef = firestore.collection('companies')
const jobSitesRef = firestore.collection('jobSites')
const toolboxRef = firestore.collection('toolbox')
const incidentsRef = firestore.collection('incidents')

const store = new Vuex.Store({
  state: {
    header: {},
    userKey: '',
    user: {},
    uid: '',
    safetyPlan: {},
    company: {},
    companyKey: '',
    jobs: [],
    selectedJob: {},
    currentJob: {},
    myHazards: [],
    hazardousSubstances: [],
    taskAnalysis: []
  },
  mutations: {
    clearStore (state) {
      state.header = {},
      state.userKey = '',
      state.user = {},
      state.uid = '',
      state.safetyPlan = {},
      state.company = {},
      state.companyKey = '',
      state.jobs = [],
      state.selectedJob = {},
      state.currentJob = {},
      state.myHazards = [],
      state.hazardousSubstances = [],
      state.taskAnalysis = []
    },
    setHeader (state, payload) {
      state.header = payload
    },
    setUserKey (state, payload) {
      console.log('Userkey set')
      state.userKey = payload
    },
    setUID (state, payload) {
      console.log('UID set')
      state.uid = payload
    },
    setUser (state, payload) {
      console.log('User profile set')
      state.user = payload
    },
    setCompany (state, payload) {
      console.log('Company set')
      state.company = payload
    },
    setCompanyKey (state, payload) {
      console.log('CompanyKey set', payload)
      state.companyKey = payload
    },
    setSelectedJob (state, payload) {
      state.selectedJob = payload
    },
    setJobs (state, payload) {
      state.jobs = payload
      console.log('Jobs set', state.jobs)
    },
    setCurrentJob (state, payload) {
      console.log('setting current job in store', payload)
      state.currentJob = payload
      state.user.currentJob = payload
    },
    setTaskAnalysis (state, payload) {
      state.taskAnalysis = payload
      console.log('Task Analysis set')
    },
    setMyHazards (state, payload) {
      console.log('My hazards set', payload)
      state.myHazards = payload
    },
    setHazardousSubstances (state, payload) {
      console.log('Hazardous Substances set')
      state.hazardousSubstances = payload
    }
  },
  actions: {
    clearStore({commit}) {
      commit('clearStore')
    },
    updateHeader ({commit}, payload) {
      let header = payload
      commit('setHeader', header)
    },
    autoLogIn ({commit, state, dispatch}, payload) {
      console.log('auto log in')
      commit('setUID', payload)
      if (state.user === {}) {
        dispatch('getUser')
      }
    },
    updateEmail ({dispatch}, payload) {
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
    signUp ({}, payload) {
      // create a new user in firebase
      console.log('signing up', payload)
      let promise = new Promise((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
          .then(() => {
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
      return promise
    },
    updateCurrentUser ({state, dispatch}, payload) {
      console.log('updating user', payload)
      let promise = new Promise((resolve, reject) => {
        usersRef.doc(state.userKey)
          .get()
          .then((doc) => {
            usersRef.doc(doc.id).set(payload, {merge: true})
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
    logIn ({}, payload) {
      let promise = new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
          .then(() => {
            resolve()
          })
          .catch(
            error => {
              reject(error)
            }
          )
      })
      return promise
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('clearStore')
      localStorage.clear()
      console.log(window.history.length)
    },
    findUser ({commit}, payload) {
      let promise = new Promise((resolve, reject) => {
        console.log('getting user', payload)
        usersRef.where('email', '==', payload)
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
        usersRef.where('uid', '==', state.uid)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              let user = doc.data()
              commit('setUser', user)
              commit('setUserKey', doc.id)
              commit('setCompanyKey', user.companyKey)
              commit('setCurrentJob', user.currentJob)
              console.log('User profile set')
              resolve()
            })
          })
          .catch((error) => {
            reject(error)
          })
      })
      return promise
    },
    getCompany ({commit, state}) {
      console.log('getting company')
      let promise = new Promise((resolve, reject) => {
        companiesRef.doc(state.companyKey)
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
    getToolbox ({commit}, payload) {
      let promise = new Promise((resolve, reject) => {
        console.log('getting toolbox')
        toolboxRef.doc(today + payload)
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log('toolbox found', doc.data())
            resolve(doc.data())
          } else {
            resolve(null)
          }
        })
        .catch((error) => {
          console.log(error)
          reject()
        })
      })
      return promise
    },
    getJobs ({commit, state}) {
      console.log('getting jobs')
      // get all jobs in progress that this worker is assigned to
      let promise = new Promise((resolve, reject) => {
        jobSitesRef.where('companyKey', '==', state.companyKey).where('open', '==', true)
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
                companyKey: job.companyKey,
                companyName: job.companyName,
                date: job.date,
                environmental: job.environmental,
                environmentalurl: job.environmentalurl,
                medical: job.medical,
                notifiable: job.notifiable,
                notifiableurl: job.notifiableurl,
                open: job.open,
                resource: job.resource,
                resourceurl: job.resourceurl,
                supervisorKey: job.supervisorKey,
                supervisorName: job.supervisorName,
                supervisorPhone: job.supervisorPhone,
                inducted: job.inducted,
                inductionRegister: job.inductionRegister,
                tasks: job.tasks,
                taskSignedOn: job.taskSignedOn
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
    inductionComplete ({commit, state}) {
      let promise = new Promise ((resolve, reject) => {
        let job = state.selectedJob
        jobSitesRef.doc(job.id).update({
          inductionRegister: firebase.firestore.FieldValue.arrayUnion({
            companyName: state.user.companyName,
            workerName: state.user.name,
            date: Date.now()
          }),
        })
        jobSitesRef.doc(job.id).update({
          inducted: firebase.firestore.FieldValue.arrayUnion(state.userKey)
        })
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
      }) 
      return promise
    },
    taskSignOn ({state}, payload) {
      let taskId = payload
      let promise = new Promise((resolve, reject) => {
        jobSitesRef.doc(state.selectedJob.id).update({
          taskSignedOn: firebase.firestore.FieldValue.arrayUnion({
            taskId: taskId,
            worker: {
              name: state.user.name,
              id: state.userKey,
              date: Date.now(),
              company: state.user.companyName
            }
          }),
        })
        .then(() => {
          state.selectedJob.taskSignedOn.push({
            taskId: taskId,
            worker: {
              name: state.user.name,
              id: state.userKey,
              date: Date.now(),
              company: state.user.companyName
            }
          })
          resolve()
        })
        .catch((error) => {
          console.log(error)
          reject()
        })
      })
      return promise
    },
    jobSignOn ({state, dispatch, commit}, payload) {
      // sign user into job site
      let jobKey = payload
      let promise = new Promise((resolve, reject) => {
        console.log('creating signInRegister')
        let docKey = today + state.userKey
        var signInRegisterRef = jobSitesRef.doc(jobKey).collection('signInRegister').doc(docKey)
        signInRegisterRef.set({
          jobId: jobKey,
          id: state.userKey,
          name: state.user.name,
          date: today,
          signedIn: Date.now(),
          signedOut: '',
          companyName: state.user.companyName,
          companyKey: state.user.companyKey
        })
        .then(() => {
          // set current job in user and in store
          let promise = new Promise((resolve, reject) => {
            jobSitesRef.doc(jobKey).collection('signInRegister').doc(docKey).get()
            .then((doc) => {
              dispatch('setCurrentJob', {registerKey: doc.id, register: doc.data()})
              commit('setCurrentJob', {registerKey: doc.id, jobKey: jobKey})
              resolve()
            })
          })
          return promise
        })
        .then(() => {
          resolve()
        })
        .catch((error) => {
          console.log(error)
          reject()
        })
      })
      return promise
    },
    storeSelectedJob ({commit}, payload) {
      commit('setSelectedJob', payload)
    },
    setCurrentJob ({state, commit}, payload) {
      let promise = new Promise((resolve, reject) => {
        console.log('setting current job in firestore', payload)
        usersRef.doc(state.userKey).set({currentJob: payload}, {merge: true})
        .then(() => {
          resolve()
        })
        .catch((error) => {
          console.log(error)
          reject()
        })
      })
      return promise
    },
    signOutCurrentJob ({state, dispatch, commit}) {
      // update Sign in register
      console.log('signing out')
      let promise = new Promise((resolve, reject) => {
        let jobKey = state.currentJob.jobKey
        let docKey = state.currentJob.registerKey
        var signInRegisterRef = jobSitesRef.doc(jobKey).collection('signInRegister').doc(docKey)
        signInRegisterRef.set({signedOut: Date.now()}, {merge: true})
        .then(() => {
          commit('setCurrentJob', {})
          dispatch('setCurrentJob', {})
          resolve()
        })
        .catch((error) => {
          console.log(error)
          reject()
        })
      })
      return promise
    },
    newIncident ({}, payload) {
      // create new incident in firestore
      let promise = new Promise((resolve, reject) => {
        incidentsRef.add(payload)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          console.log(error)
          reject()
        })
      })
      return promise
    },
    getHazards ({commit, dispatch, state}) {
      let promise = new Promise((resolve, reject) => {
        companiesRef.doc(state.companyKey).collection('hazards').orderBy('name')
        .get()
        .then((snapshot) => {
          let hazards = []
          snapshot.forEach((doc) => {
            hazards.push(doc.data())
          })
          commit('setMyHazards', hazards)
          resolve ()
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
      })
      return promise
    },
    getHazSubs ({commit, state}) {
      // get taskAnalysis from company
      companiesRef.doc(state.companyKey).collection('hazardousSubstances')
      .get()
      .then((snapshot) => {
        let hazSubs = []
        snapshot.forEach((doc) => {
          hazSubs.push(doc.data())
        })
        commit('setHazardousSubstances', hazSubs)
      })
      .catch((error) => {
        console.log(error)
      })
    },
    getTaskAnalysis ({commit, state}) {
      // get taskAnalysis from company
      companiesRef.doc(state.companyKey).collection('taskAnalysis')
      .get()
      .then((snapshot) => {
        let tasks = []
        snapshot.forEach((doc) => {
          tasks.push(doc.data())
        })
        commit('setTaskAnalysis', tasks)
      })
      .catch((error) => {
        console.log(error)
      })
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
    userKey: (state) => state.userKey,
    user: (state) => state.user,
    uid: (state) => state.uid,
    companyKey: (state) => state.companyKey,
    company: (state) => state.company,
    jobs: (state) => state.jobs,
    selectedJob: (state) => state.selectedJob,
    currentJob: (state) => state.currentJob,
    myHazards: (state) => state.myHazards,
    hazardousSubstances: (state) => state.hazardousSubstances,
    jobSite (state) {
      return (id) => {
        return state.jobs.find((job) => {
          return job.id === id
        })
      }
    },
    header: (state) => state.header,
    taskAnalysis: (state) => state.taskAnalysis
  },
  plugins: [createPersistedState()]
})

export default store
