<template>
  <div id="app">
    <nav class="navbar">
      <div class="container">
        <h1 class="logo">💕 Our Love Story</h1>
        <ul class="nav-links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/feed">OurFeed</router-link></li>
          <li><a href="#admin" @click="showAdmin = !showAdmin">Admin</a></li>
        </ul>
      </div>
    </nav>

    <section class="hero">
      <div class="hero-content">
        <h2>Our Journey Together</h2>
        <p>A love story worth sharing</p>
      </div>
    </section>

    <router-view />

    <AdminPanel
      v-if="showAdmin"
      @close="showAdmin = false"
      @update="$router.go(0)"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import AdminPanel from "./components/AdminPanel.vue";

export default {
  components: {
    AdminPanel,
  },
  setup() {
    const showAdmin = ref(false);

    return {
      showAdmin,
    };
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Navigation */
.navbar {
  background: linear-gradient(135deg, #ff6b9d, #ffa07a);
  color: white;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.3s;
}

.nav-links a:hover {
  opacity: 0.8;
}

.nav-links a.router-link-active {
  font-weight: bold;
  border-bottom: 2px solid white;
  padding-bottom: 5px;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #ff6b9d, #ffa07a);
  color: white;
  padding: 100px 20px;
  text-align: center;
}

.hero-content h2 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.5rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .hero-content h2 {
    font-size: 2rem;
  }

  .nav-links {
    gap: 1rem;
  }
}
</style>
