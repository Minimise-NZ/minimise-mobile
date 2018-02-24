import Vue from 'vue'
import Vuex from 'vuex'

import master from './master'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    master
  }
})

export default store
