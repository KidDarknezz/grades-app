import firebase from "firebase/app";
import 'firebase/database'

const state = {
  upcomingEvents: [],
  pastEvents: []
}
const mutations = {
  setNewEvent(state, payload) {
    state.upcomingEvents.push(payload)
  }
}
const actions = {
  createNewEvent({ commit }, payload) {
    let newEvent = {
      name: payload.name,
      date: payload.date,
      time: payload.time,
      parentAssignature: payload.assignature.assId,
      parentColor: payload.assignature.assColor
    }
    console.log(newEvent)
    firebase
      .database()
      .ref(`${localStorage.getItem("mgAppUid")}/events`)
      .push(newEvent)
      .then((response) => {
        console.log(response);
        newEvent.id = response.key;
        commit("setNewEvent", newEvent);
      });
  }
}
const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
