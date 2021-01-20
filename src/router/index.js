import Vue from "vue";
import VueRouter from "vue-router";

import Auth from "@/layouts/Auth";
import MainApp from "@/layouts/MainApp";

import AuthView from "@/views/AuthView";
import Home from "@/views/Home";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Auth",
    component: Auth,
    children: [
      {
        path: "",
        name: "AuthView",
        component: AuthView,
      },
    ],
  },
  {
    path: "/home",
    name: "MainApp",
    component: MainApp,
    children: [
      {
        path: "",
        name: "Home",
        component: Home,
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
