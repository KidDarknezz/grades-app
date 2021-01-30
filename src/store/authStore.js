import firebase from "firebase";
import router from "../router";

const state = {
  loadingStatus: false,
  browserMode: false
};

const mutations = {
  setLoadingStatus(state, payload) {
    state.loadingStatus = payload;
  },
  setBrowserMode(state, payload) {
    state.browserMode = payload
  }
};

const actions = {
  getDisplayMode({commit}, payload) {
    let displayMode = "browser tab";
      if (navigator.standalone) {
        displayMode = "standalone-ios";
      }
      if (window.matchMedia("(display-mode: standalone)").matches) {
        displayMode = "standalone";
      }
      console.log('Display Mode:', displayMode)
      if (displayMode == "browser tab") {
        commit("setBrowserMode", true)
      } else {
        commit("setBrowserMode", false)
      }
  },
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
          localStorage.setItem("mgAppInstallPrompt", true);
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
