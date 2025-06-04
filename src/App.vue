<script setup>
</script>

<template>
  <div>
    <nav class="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </nav>

    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.nav {
  display: flex;
  gap: 1rem;
  background-color: #f0f0f0;
  border-radius: 8px;
  align-items: center;
  padding: 1rem;
}

.main {
  padding-block: 1rem;
}
</style>
