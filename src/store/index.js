import Vue from "vue";
import Vuex from "vuex";

import authStore from "./authStore";
import myAssignaturesStore from "./myAssignaturesStore";

Vue.use(Vuex);

// export default new Vuex.Store({
//   state: {},
//   mutations: {},
//   actions: {},
//   modules: {},
// });

export default function() {
  const Store = new Vuex.Store({
    modules: {
      authStore,
      myAssignaturesStore,
    },
    strict: process.env.DEV,
  });

  return Store;
}
