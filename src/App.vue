<script setup>
import { useRoute } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
</script>

<template>
  <div class="app-container">
    <Header />

    <main>
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<style scoped></style>
