import { createRouter, createWebHistory } from "vue-router";
import ExamView from "../views/ExamView.vue";
import LoginView from "../views/LoginView.vue";
import Cookie from "js-cookie";
  
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
    path: "/exam/:id/",
    name: "exam",
    component: ExamView,
    props: (route) => ({ id: route.params.id }),
  },
  {
    path: "/discover",
    name: "discover",
    component: () => import("../views/DiscoverView.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name === "login") {
    if (Cookie.get("auth_token")) {
      router.push({ name: "discover" });
    } else {
      next();
    }
  } else if (to.name === "discover") {
    if (!Cookie.get("auth_token")) {
      router.push({ name: "login" });
    } else if (Cookie.get("exam")) {
      window.location.href = `/exam/${JSON.parse(Cookie.get("exam")).examId}`;
    } else {
      next();
    }
  } else if (to.name === "exam") {
    if (!Cookie.get("auth_token")) {
      router.push({ name: "login" });
    } else if (!Cookie.get("exam")) {
      Cookie.remove('pupilAnswers');
      Cookie.remove('exam_token');
      router.push({ name: "discover" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
