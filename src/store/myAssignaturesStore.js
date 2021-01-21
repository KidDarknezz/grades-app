import firebase from "firebase";
import router from "../router";

const state = {};

const mutations = {};

const actions = {
  getUserInfoAndAssignatures({}, payload) {
    // let allOwings = [];
    // let owing = {};
    firebase
      .database()
      .ref(`${payload}`)
      .once("value", (snapshot) => {
        // for (let owe in snapshot.val()) {
        //   owing = snapshot.val()[owe];
        //   owing.id = owe;
        //   allOwings.push(owing);
        // }
        console.log(snapshot.val());
        // commit('setAllOwings', allOwings)
      });
  },
  logoutCurrentUser({}, payload) {
    firebase.auth().signOut();
    localStorage.removeItem("mgAppUid");
    router.push("/");
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
