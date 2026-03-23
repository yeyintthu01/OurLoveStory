<template>
  <div id="app">
    <nav class="navbar">
      <div class="container">
        <h1 class="logo">💕 Our Love Story</h1>
        <button class="hamburger" @click="menuOpen = !menuOpen">
          <span></span><span></span><span></span>
        </button>
        <ul
          class="nav-links"
          :class="{ open: menuOpen }"
          @click="menuOpen = false"
        >
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/feed">OurFeed</router-link></li>
          <li><router-link to="/letters">Letters</router-link></li>
          <li><router-link to="/diary">Diary</router-link></li>
          <li><a @click="showAdmin = !showAdmin">Admin</a></li>
        </ul>
      </div>
    </nav>

    <section v-if="$route.path === '/'" class="hero">
      <div class="hero-content">
        <h2>Our Journey Together</h2>
        <p>A love story worth sharing</p>
      </div>
    </section>

    <router-view />

    <!-- Floating Chat Button -->
    <button
      v-if="$route.path !== '/chat'"
      class="floating-chat-btn"
      @click="$router.push('/chat')"
    >
      💬
    </button>

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
  components: { AdminPanel },
  setup() {
    const showAdmin = ref(false);
    const menuOpen = ref(false);
    return { showAdmin, menuOpen };
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
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
  background: linear-gradient(135deg, #1a0000, #4d0000);
  color: white;
  padding: 0.3rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  width: 100%;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 20px;
  position: relative;
}

.logo {
  font-size: 1rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 1rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.3s;
  font-size: 0.8rem;
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
  background: linear-gradient(135deg, #1a0000, #4d0000);
  color: white;
  padding: 100px 20px;
  text-align: center;
  width: 100%;
}

.hero-content h2 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.5rem;
  opacity: 0.9;
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s;
}

@media (max-width: 768px) {
  .hero-content h2 {
    font-size: 2rem;
  }

  .hamburger {
    display: flex;
  }

  .nav-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #1a0000, #4d0000);
    padding: 10px 20px 20px;
    gap: 0.5rem;
    z-index: 99;
  }

  .nav-links.open {
    display: flex;
  }

  .nav-links li {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 8px 0;
  }
}

/* Floating Chat Button */
.floating-chat-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #cc0000, #660000);
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-chat-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.floating-chat-btn:active {
  transform: scale(0.95);
}
</style>
