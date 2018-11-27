<template>
  <div>
    <q-toolbar color="green-8" class="footer shadow-2">
      <q-btn flat icon="arrow_back" @click="$router.push('/home')" replace/>
    </q-toolbar>
    <div class="container">
      <q-list>
        <q-scroll-area style="width: 100%; height: 70vh;">
          <q-item v-for="(hazard, index) in hazards" :key="index" @click.native="showhazard(hazard, index)">
            <q-item-side>
              <img :src="hazard.thumb">
            </q-item-side>
            <q-item-main style="padding-left: 20px">
              <q-item-tile label>{{hazard.name}}</q-item-tile>
            </q-item-main>
          </q-item>
        </q-scroll-area>
      </q-list>
    </div>
  </div>
</template>

<script>
export default {
  data () {
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style scoped>
</style>