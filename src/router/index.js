import Vue from "vue";
import VueRouter from "vue-router";
import firebase from "firebase";

import Auth from "@/layouts/Auth";
import MainApp from "@/layouts/MainApp";

import AuthView from "@/views/AuthView";
import MyAssignatures from "@/views/MyAssignatures";
import SelectedAssignature from '@/views/SelectedAssignature'
import ClosedAssignatures from "@/views/ClosedAssignatures";
import Profile from "@/views/Profile";

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
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/selected-assignature",
        name: "SelectedAssignature",
        component: SelectedAssignature,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/closed-assignatures",
        name: "ClosedAssignatures",
        component: ClosedAssignatures,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/profile",
        name: "Profile",
        component: Profile,
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const authenticatedUser = localStorage.getItem("mgAppUid");
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !authenticatedUser) next("/");
  else next();
});

export default router;
