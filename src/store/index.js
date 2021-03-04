import Vue from "vue";
import Vuex from "vuex";

import authStore from "./authStore";
import myAssignaturesStore from "./myAssignaturesStore";
import myEventsStore from './myEventsStore'

Vue.use(Vuex);

export default function () {
  const Store = new Vuex.Store({
    modules: {
      authStore,
      myAssignaturesStore,
      myEventsStore
    },
    strict: process.env.DEV,
  });

  return Store;
}
