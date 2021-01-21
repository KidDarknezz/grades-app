import firebase from "firebase";

const state = {
  userData: {},
};

const mutations = {
  setUserData(state, payload) {
    state.userData = payload;
  },
  setNewAssignature(state, payload) {
    state.userData.assignatures[payload.id] = payload;
  },
};

const actions = {
  getUserInfoAndAssignatures({ commit }, payload) {
    let allAssignatures = [];
    let assignature = {};
    firebase
      .database()
      .ref(`${payload}`)
      .once("value", (snapshot) => {
        for (let assignature in snapshot.val().assignatures) {
          // assignature.id = assignature;
          // assignature = snapshot.val()[assignature];
          // assignature.id = assignature;
          // allAssignatures.push(assignature);
          // allAssignatures.push(assignature);
        }
        console.log(allAssignatures);
        commit("setUserData", snapshot.val());
      });
  },
  createNewAssignature({ commit }, payload) {
    let assignature = {
      name: payload.name,
      color: payload.color,
      status: "open",
    };
    firebase
      .database()
      .ref(`${localStorage.getItem("mgAppUid")}/assignatures`)
      .push(assignature)
      .then((response) => {
        console.log(response);
        assignature.id = response.key;
        commit("setNewAssignature", assignature);
      });
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
