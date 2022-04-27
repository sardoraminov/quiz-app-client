import { createRouter, createWebHistory } from "vue-router";
import ExamView from "../views/ExamView.vue";
import LoginView from "../views/LoginView.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/exam",
    name: "exam",
    component: ExamView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
