import VueOffline from 'vue-offline'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.use(VueOffline)
}
