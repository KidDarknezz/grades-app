import firebase from "firebase";

const state = {
  userData: {
    assignatures: [],
  },
  openUserAssignatures: [],
  closedUserAssignatures: [],
  loadingStatus: false,
};

const mutations = {
  setUserData(state, payload) {
    state.userData = payload;
  },
  setOpenAndClosedAssignatures(state, payload) {
    let open = [];
    let closed = [];
    payload.assignatures.forEach((assignature) => {
      if (assignature.status == "open") open.push(assignature);
      if (assignature.status == "closed") closed.push(assignature);
    });
    state.openUserAssignatures = open;
    state.closedUserAssignatures = closed;
  },
  setNewAssignature(state, payload) {
    state.openUserAssignatures.push(payload);
  },
  setNewItem(state, payload) {
    for (let i = 0; i < state.openUserAssignatures.length; i++) {
      if (state.openUserAssignatures[i].id == payload.assId) {
        state.openUserAssignatures[i].items.push(payload);
        break;
      }
    }
  },
  setNewGrade(state, payload) {
    for (let i = 0; i < state.openUserAssignatures.length; i++) {
      if (state.openUserAssignatures[i].id == payload.assId) {
        for (let j = 0; j < state.openUserAssignatures[i].items.length; j++) {
          if (state.openUserAssignatures[i].items[j].id == payload.itmId) {
            state.openUserAssignatures[i].items[j].grades.push(payload);
          }
        }
      }
    }
  },
  setDeleteAssignature(state, payload) {
    state.openUserAssignatures.splice(payload, 1);
  },
  setDeleteItem(state, payload) {
    state.openUserAssignatures[payload.ass].items.splice(payload.itm, 1);
  },
  setDeleteGrade(state, payload) {
    state.openUserAssignatures[payload.ass].items[payload.itm].grades.splice(
      payload.grd,
      1
    );
  },
  setNewItemValues(state, payload) {
    state.openUserAssignatures[payload.ass].items[payload.itm].name =
      payload.new.name;
    state.openUserAssignatures[payload.ass].items[
      payload.itm
    ].percentage = parseInt(payload.new.percentage);
  },
  setArchiveAssignature(state, payload) {
    state.openUserAssignatures[payload].status = "closed";
    state.closedUserAssignatures.push(state.openUserAssignatures[payload]);
    state.openUserAssignatures.splice(payload, 1);
  },
  setLoadingStatus(state, payload) {
    state.loadingStatus = payload;
  },
};

const actions = {
  getUserInfoAndAssignatures({ commit }, payload) {
    commit("setLoadingStatus", true);
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
        commit("setOpenAndClosedAssignatures", data);
        commit("setLoadingStatus", false);
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
  archiveAssignature({ commit }, payload) {
    if (confirm("Close assignature?")) {
      firebase
        .database()
        .ref(`${localStorage.getItem("mgAppUid")}/assignatures/${payload.id}`)
        .update({ status: "closed" });
    }
    commit("setArchiveAssignature", payload.index);
  },
  deleteItem({ commit }, payload) {
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
  deleteGrade({ commit }, payload) {
    if (confirm("Delete grade?")) {
      firebase
        .database()
        .ref(
          `${localStorage.getItem("mgAppUid")}/assignatures/${
            payload.ass.id
          }/items/${payload.itm.id}/grades/${payload.grd.id}`
        )
        .remove();
      commit("setDeleteGrade", {
        ass: payload.ass.index,
        itm: payload.itm.index,
        grd: payload.grd.index,
      });
    }
  },
  editItem({ commit }, payload) {
    firebase
      .database()
      .ref(
        `${localStorage.getItem("mgAppUid")}/assignatures/${
          payload.ass.id
        }/items/${payload.itm.id}`
      )
      .update(payload.newValues);
    commit("setNewItemValues", {
      ass: payload.ass.index,
      itm: payload.itm.index,
      new: payload.newValues,
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
