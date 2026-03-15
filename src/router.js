import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Feed from "./pages/Feed.vue";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/feed",
    component: Feed,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
