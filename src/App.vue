<template>
  <div id="app">
    <va-config>
      <div class="admin-container">
        <Sidebar />
        <main class="main-content">
          <Header />
          <div class="content">
            <router-view />
          </div>
        </main>
      </div>
    </va-config>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import Header from '@/components/Header.vue'

export default {
  name: 'App',
  components: {
    Sidebar,
    Header
  }
}
</script>

<style>
@import '@/assets/styles/global.css';
</style>
