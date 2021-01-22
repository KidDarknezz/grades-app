import firebase from "firebase";

const state = {
  userData: {
    assignatures: [],
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
        state.userData.assignatures[i].items.push(payload);
        break;
      }
    }
  },
  setNewGrade(state, payload) {
    for (let i = 0; i < state.userData.assignatures.length; i++) {
      if (state.userData.assignatures[i].id == payload.assId) {
        for (let j = 0; j < state.userData.assignatures[i].items.length; j++) {
          if (state.userData.assignatures[i].items[j].id == payload.itmId) {
            state.userData.assignatures[i].items[j].grades.push(payload);
          }
        }
      }
    }
  },
  setDeleteAssignature(state, payload) {
    state.userData.assignatures.splice(payload, 1);
  },
  setDeleteItem(state, payload) {
    state.userData.assignatures[payload.ass].items.splice(payload.itm, 1);
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
        for (let ass in snapshot.val().assignatures) {
          assignature = snapshot.val().assignatures[ass];
          assignature.id = ass;
          let allItems = [];
          let item = {};
          for (let itm in assignature.items) {
            item = assignature.items[itm];
            item.id = itm;
            let allGrades = [];
            let grade = {};
            for (let grd in item.grades) {
              grade = assignature.items[itm].grades[grd];
              grade.id = grd;
              allGrades.push(grade);
            }
            assignature.items[itm].grades = allGrades;
            allItems.push(item);
          }
          assignature.items = allItems;
          allAssignatures.push(assignature);
        }
        let data = snapshot.val();
        data.assignatures = allAssignatures;
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
        assignature.items = [];
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
      .ref(
        `${localStorage.getItem("mgAppUid")}/assignatures/${
          payload.assId
        }/items`
      )
      .push(item)
      .then((response) => {
        console.log(response);
        item.id = response.key;
        item.assId = payload.assId;
        item.grades = [];
        commit("setNewItem", item);
      });
  },
  createNewGrade({ commit }, payload) {
    console.log(payload);
    let grade = {
      grd: payload.grade.grade,
    };
    firebase
      .database()
      .ref(
        `${localStorage.getItem("mgAppUid")}/assignatures/${
          payload.assId
        }/items/${payload.itmId}/grades`
      )
      .push(grade)
      .then((response) => {
        console.log(response);
        grade.id = response.key;
        grade.assId = payload.assId;
        grade.itmId = payload.itmId;
        commit("setNewGrade", grade);
      });
  },
  deleteAssignature({ commit }, payload) {
    if (confirm("Delete assignature?")) {
      firebase
        .database()
        .ref(`${localStorage.getItem("mgAppUid")}/assignatures/${payload.id}`)
        .remove();
      commit("setDeleteAssignature", payload.index);
    }
  },
  deleteItem({ commit }, payload) {
    console.log("assignature", payload.ass.id);
    console.log("item", payload.itm.id);
    if (confirm("Delete item?")) {
      firebase
        .database()
        .ref(
          `${localStorage.getItem("mgAppUid")}/assignatures/${
            payload.ass.id
          }/items/${payload.itm.id}`
        )
        .remove();
      commit("setDeleteItem", {
        ass: payload.ass.index,
        itm: payload.itm.index,
      });
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
