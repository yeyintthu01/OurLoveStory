import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Feed from "./pages/Feed.vue";
import Chat from "./pages/Chat.vue";
import Letters from "./pages/Letters.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/feed", component: Feed },
  { path: "/chat", component: Chat },
  { path: "/letters", component: Letters },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
