import firebase from "firebase";

const state = {
  userData: {
    assignatures: []
  },
};

const mutations = {
  setUserData(state, payload) {
    state.userData = payload;
  },
  setNewAssignature(state, payload) {
    state.userData.assignatures.push(payload);
  },
  setNewItem(state, payload) {
    for (let i = 0; i < state.userData.assignatures.length; i++) {
      if (state.userData.assignatures[i].id == payload.assId) {
        state.userData.assignatures[i].items.push(payload)
        break
      }
    }
  }
};

const actions = {
  getUserInfoAndAssignatures({ commit }, payload) {
    let allAssignatures = [];
    let assignature = {};
    firebase
      .database()
      .ref(`${payload}`)
      .once("value", (snapshot) => {
        
        for (let ass in snapshot.val().assignatures) {
          assignature = snapshot.val().assignatures[ass];
          assignature.id = ass
          let allItems = []
          let item = {}
          for(let itm in assignature.items) {
            item = assignature.items[itm]
            item.id = itm
            allItems.push(item)
          }
          assignature.items = allItems
          allAssignatures.push(assignature);
        }
        let data = snapshot.val()
        data.assignatures = allAssignatures
        commit("setUserData", data);
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
        assignature.items = []
        commit("setNewAssignature", assignature);
      });
  },
  createNewItem({ commit }, payload) {
    let item = {
      name: payload.item.name,
      percentage: payload.item.percentage,
    };
    firebase
      .database()
      .ref(`${localStorage.getItem("mgAppUid")}/assignatures/${payload.assId}/items`)
      .push(item)
      .then((response) => {
        console.log(response);
        item.id = response.key;
        item.assId = payload.assId
        commit("setNewItem", item);
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
