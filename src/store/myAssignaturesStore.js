import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";

const state = {
  userData: {},
  userAssignatures: [],
  openUserAssignatures: [],
  closedUserAssignatures: [],
  selectedAssignature: {},
  loadingStatus: false,
};

const mutations = {
  setUserData(state, payload) {
    state.userData = payload;
  },
  setUserAssignatures(state, payload) {
    state.userAssignatures = payload;
  },
  setAddedAssignature(state, payload) {
    state.userAssignatures.push(payload);
  },
  setRemovedAssignature(state, payload) {
    state.userAssignatures.splice(payload, 1);
  },
  setModifiedAssignature(state, payload) {
    state.userAssignatures[payload.index].name = payload.ass.name;
    state.userAssignatures[payload.index].color = payload.ass.color;
    state.userAssignatures[payload.index].status = payload.ass.status;
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
  setSelectedAssignature(state, payload) {
    state.selectedAssignature = payload;
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
    state.openUserAssignatures[payload.assIndex].items[
      payload.itmIndex
    ].grades.push(payload.grade);
  },
  setDeleteAssignature(state, payload) {
    if (payload.status == "open")
      state.openUserAssignatures.splice(payload.index, 1);
    if (payload.status == "closed")
      state.closedUserAssignatures.splice(payload.index, 1);
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
  setNewAssignatureValues(state, payload) {
    state.openUserAssignatures[payload.ass].name = payload.new.name;
    state.openUserAssignatures[payload.ass].color = payload.new.color;
  },
  setNewGradeValues(state, payload) {
    state.openUserAssignatures[payload.ass].items[payload.itm].grades[
      payload.grd
    ].grd = payload.new;
    state.openUserAssignatures[payload.ass].items[payload.itm].grades[
      payload.grd
    ].name = payload.name;
  },
  setArchiveAssignature(state, payload) {
    state.openUserAssignatures[payload].status = "closed";
    state.closedUserAssignatures.push(state.openUserAssignatures[payload]);
    state.openUserAssignatures.splice(payload, 1);
  },
  setUnarchiveAssignature(state, payload) {
    state.closedUserAssignatures[payload].status = "open";
    state.openUserAssignatures.push(state.closedUserAssignatures[payload]);
    state.closedUserAssignatures.splice(payload, 1);
  },
  setLoadingStatus(state, payload) {
    state.loadingStatus = payload;
  },
  setNewProfileValues(state, payload) {
    state.userData.name = payload.name;
    state.userData.lastName = payload.lastName;
    state.userData.profileColor = payload.profileColor;
    state.userData.profileAvatar = payload.profileAvatar;
  },
};

const actions = {
  getUserInfoAndAssignatures({ commit }, payload) {
    commit("setLoadingStatus", true);
    firebase
      .firestore()
      .collection("users")
      .doc(payload)
      .onSnapshot((snapshot) => {
        let user = snapshot.data();
        user.uid = firebase.auth().currentUser.uid;
        commit("setUserData", user);
        firebase
          .firestore()
          .collection("assignatures")
          .where("owner", "==", payload)
          .orderBy("createdAt")
          .onSnapshot((snapshot) => {
            let changes = snapshot.docChanges();
            let ass = {};
            changes.forEach((change) => {
              if (change.type == "added") {
                ass = change.doc.data();
                ass.id = change.doc.id;
                commit("setAddedAssignature", ass);
              } else if (change.type == "modified") {
                ass = change.doc.data();
                ass.id = change.doc.id;
                commit("setModifiedAssignature", {
                  ass: ass,
                  index: change.oldIndex,
                });
              } else if (change.type == "removed") {
                commit("setRemovedAssignature", change.oldIndex);
              }
            });
            setTimeout(function() {
              commit("setLoadingStatus", false);
            }, 1000);
          });
      });
  },
  selectAssignature({ commit }, payload) {
    firebase
      .firestore()
      .collection("assignatures")
      .doc(payload)
      .onSnapshot((snapshot) => {
        let selected = snapshot.data();
        selected.id = payload;
        commit("setSelectedAssignature", selected);
      });
  },
  createNewAssignature({}, payload) {
    let assignature = {
      createdAt: Date.now(),
      name: payload.name,
      color: payload.color,
      status: "open",
      owner: state.userData.uid,
      items: [],
    };
    firebase
      .firestore()
      .collection("assignatures")
      .add(assignature);
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
    let g = {
      grd: payload.grd,
      name: payload.name,
    };
    firebase
      .database()
      .ref(
        `${localStorage.getItem("mgAppUid")}/assignatures/${
          payload.ass.id
        }/items/${payload.itm.id}/grades`
      )
      .push(g)
      .then((response) => {
        g.id = response.key;
        commit("setNewGrade", {
          assIndex: payload.ass.index,
          itmIndex: payload.itm.index,
          grade: g,
        });
      });
  },
  deleteAssignature({}, payload) {
    if (confirm("Delete assignature?")) {
      console.log(payload);
      firebase
        .firestore()
        .collection("assignatures")
        .doc(payload)
        .delete()
        .then(() => {
          console.log("Assignature deleted");
        })
        .catch((err) => {
          console.log(err);
        });
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
  unarchiveAssignature({ commit }, payload) {
    if (confirm("Re-open assignature?")) {
      firebase
        .database()
        .ref(`${localStorage.getItem("mgAppUid")}/assignatures/${payload.id}`)
        .update({ status: "open" });
      commit("setUnarchiveAssignature", payload.index);
    }
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
  editAssignature({}, payload) {
    firebase
      .firestore()
      .collection("assignatures")
      .doc(state.selectedAssignature.id)
      .update(payload);
  },
  editGrade({ commit }, payload) {
    firebase
      .database()
      .ref(
        `${localStorage.getItem("mgAppUid")}/assignatures/${
          payload.ass.id
        }/items/${payload.itm.id}/grades/${payload.grd.id}`
      )
      .update({ grd: payload.newValuesGrade, name: payload.newValuesName });
    commit("setNewGradeValues", {
      ass: payload.ass.index,
      itm: payload.itm.index,
      grd: payload.grd.index,
      new: payload.newValuesGrade,
      name: payload.newValuesName,
    });
  },
  editProfileInfo({ commit }, payload) {
    firebase
      .database()
      .ref(`${localStorage.getItem("mgAppUid")}`)
      .update(payload);
    commit("setNewProfileValues", payload);
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
