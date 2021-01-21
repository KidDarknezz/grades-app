import firebase from "firebase";
import router from "../router";

const state = {};

const mutations = {};

const actions = {
  loginUser({}, payload) {
    firebase
      .auth()
      .signInWithEmailAndPassword(payload.email, payload.pass)
      .then(
        (resp) => {
          localStorage.setItem("mgAppUid", resp.user.uid);
          router.push("/my-assignatures");
        },
        (err) => {
          alert(`Error - ${err.message}`);
        }
      );
  },
  registerUser({}, payload) {
    console.log("register user", payload);

    firebase
      .auth()
      .createUserWithEmailAndPassword(payload.email, payload.pass)
      .then(
        (resp) => {
          localStorage.setItem("mgAppUid", resp.user.uid);
          firebase
            .database()
            .ref(resp.user.uid)
            .set({
              name: payload.name,
              lastName: payload.lastName,
              email: payload.email,
              profileColor: "primary",
            })
            .then(() => {
              router.push("/my-assignatures");
            });
        },
        (err) => {
          // this.xhrRequest = false;
          alert(`Error - ${err.message}`);
        }
      );
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
