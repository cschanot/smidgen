// db.collection() returns: https://firebase.google.com/docs/reference/android/com/google/firebase/firestore/QuerySnapshot
// db.collection().doc() returns: https://firebase.google.com/docs/reference/android/com/google/firebase/firestore/DocumentSnapshot
// Why async? https://medium.com/firebase-developers/why-are-firebase-apis-asynchronous-callbacks-promises-tasks-e037a6654a93
// CRUD: [Firebase] Cloud Firestore — Add, Set, Update, Delete, Get data | by Aaron Lu | Medium
const { firestore } = require("firebase-admin");
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smidgen-5f8b9-default-rtdb.firebaseio.com"
});

const db = admin.firestore()

// Add/modify a doc inside a collection:
// const project_id = '2'
// const new_project = db.collection('projects').doc(project_id);
// new_project.set({
//   name:"test_project_2"
// })

// Add a new collection to a doc:
const project_2 = db.collection('projects').doc('2').collection('tweets').doc('1').set({
  content:"This is a tweet",
  creatAt:new Date().toISOString().slice(0,10)
})


//Add a new field:
// db.collection('projects').doc('2').update({
//   creatAt: new Date().toISOString().slice(0,10)
// })




// Read data:
//How to read data from firestore: https://stackoverflow.com/questions/52684796/nodejs-firestore-get-field

// db.collection('projects').doc('1').get().then(function(doc) {
//   console.log(doc.data().name);
// });

// db.collection('projects').get().then(function(result){
//   result.forEach(doc => {
//     console.log(doc.data())
//   })
// })


//Delete data:

//Delete an entire doc:
// db.collection('projects').doc('1').delete().then(function(){
//   console.log("Project 1 deleted!");
// }).catch(function(error){
//   console.log("Error removing doc: ", error)
// })

//Delete an field:// db.collection('projects').doc('2').update({
//   creatAt: new Date().toISOString().slice(0,10)
// })
// Delete a collection: 
// A purpose of reference is to locate a document
// db.collection('projects').doc('2').collection('tweat').get().then(querySnapShot => {
//   querySnapShot.docs.forEach(snapshot => {
//     snapshot.ref.delete()
//   })
// })
