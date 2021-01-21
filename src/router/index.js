import Vue from "vue";
import VueRouter from "vue-router";

import Auth from "@/layouts/Auth";
import MainApp from "@/layouts/MainApp";

import AuthView from "@/views/AuthView";
import MyAssignatures from "@/views/MyAssignatures";
import ClosedAssignatures from "@/views/ClosedAssignatures"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
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
    path: "/my-assignatures",
    component: MainApp,
    children: [
      {
        path: "",
        name: "MyAssignatures",
        component: MyAssignatures,
      },
      {
        path: "/closed-assignatures",
        name: "ClosedAssignatures",
        component: ClosedAssignatures,
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
