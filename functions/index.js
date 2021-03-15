const functions = require("firebase-functions");
const admin = require('firebase-admin')

var serviceAccount = require("./credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gradesapp-ccfd8.firebaseio.com"
});

exports.checkAssignatureColorUpdate = functions.database.ref('/{userId}/assignatures/{assignatureId}').onUpdate((change, context) => {
  const before = change.before.val().color
  const after = change.after.val().color
  if (before !== after) {
    updateEventColor(context.params.userId, context.params.assignatureId, after)
  }
})

function updateEventColor(userId, assId, newColor) {
  admin.database().ref(`${userId}/events`).once('value', snapshot => {
    let allEvents = snapshot.val()
    for (let event in allEvents) {
      if (allEvents[event].parentId == assId) {
        admin.database().ref(`${userId}/events/${event}`).update({ parentColor: newColor })
      }
    }
  })
}