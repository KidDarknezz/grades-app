import firebase from "firebase";
import router from "../router";

const state = {
  loadingStatus: false,
};

const mutations = {
  setLoadingStatus(state, payload) {
    state.loadingStatus = payload;
  },
};

const actions = {
  loginUser({ commit }, payload) {
    commit("setLoadingStatus", true);
    firebase
      .auth()
      .signInWithEmailAndPassword(
        payload.email.replace(/\s/g, ""),
        payload.pass
      )
      .then(
        (resp) => {
          commit("setLoadingStatus", false);
          localStorage.setItem("mgAppUid", resp.user.uid);
          router.push("/my-assignatures");
        },
        (err) => {
          commit("setLoadingStatus", false);
          alert(`Error - ${err.message}`);
        }
      );
  },
  registerUser({ commit }, payload) {
    let sanitizedEmail = payload.email.replace(/\s/g, "");
    commit("setLoadingStatus", true);
    firebase
      .auth()
      .createUserWithEmailAndPassword(sanitizedEmail, payload.pass)
      .then(
        (resp) => {
          localStorage.setItem("mgAppUid", resp.user.uid);
          firebase
            .database()
            .ref(resp.user.uid)
            .set({
              name: payload.name,
              lastName: payload.lastName,
              email: sanitizedEmail,
              profileColor: "primary",
              profileAvatar: "003-astronaut",
            })
            .then(() => {
              commit("setLoadingStatus", false);
              router.push("/my-assignatures");
            });
        },
        (err) => {
          commit("setLoadingStatus", false);
          alert(`Error - ${err.message}`);
        }
      );
  },
  logoutCurrentUser({}, payload) {
    if (confirm("Confirm logout")) {
      firebase.auth().signOut();
      localStorage.removeItem("mgAppUid");
      router.push("/");
    }
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
