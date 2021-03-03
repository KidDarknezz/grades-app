import Vue from "vue";
import firebase from "firebase/app";
import 'firebase/database'
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "./quasar";
import VueResource from "vue-resource";

Vue.config.productionTip = false;

Vue.use(VueResource);

Vue.http.options.root = "https://gradesapp-ccfd8.firebaseio.com/data.json";

var firebaseConfig = {
  apiKey: "AIzaSyAKMEq7Rw5gV0Q62X0ByrYmqLq9Rbixc3U",
  authDomain: "gradesapp-ccfd8.firebaseapp.com",
  databaseURL: "https://gradesapp-ccfd8.firebaseio.com",
  projectId: "gradesapp-ccfd8",
  storageBucket: "gradesapp-ccfd8.appspot.com",
  messagingSenderId: "568019158542",
  appId: "1:568019158542:web:258a1b82deddb007489e5f",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
