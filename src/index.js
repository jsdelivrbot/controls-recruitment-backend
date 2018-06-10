const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
var app = express();
var Applicant = require('./applicant').Applicant;

const PORT = process.env.PORT || 5000;
// const applicantModule = require('./applicant');
// const Applicant = applicantModule.Applicant;
// console.log(applicantModule);

/*********************************************
                Firebase setup
**********************************************/
var admin = require('firebase-admin');
var hash = require('../firebase/hash.json');
var serviceAccount = require('../firebase/service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://nrg-controls-recruitment.firebaseio.com'
});

// Make reference to database
var db = admin.database();
var ref = db.ref();

var applicantRef = ref.child("applicants");
var applicant = new Applicant();

/*********************************************
                HTTP Requests
**********************************************/
app
    .use(express.static(path.join(__dirname, 'public')))
    .use(bodyParser.json()) // support json encoded bodies
    .use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

    .get('/', (req, res) => res.send("HELLO WORLD"))

//Route parameter middleware (will run before the route is called)
    .param('name', function(req, res, next, name) {
        //next(); //continue to next function
    })

//Getting post parameters
app.post('/application', function(req, res) {
    if (req.body.hash !== hash.hash) {
        res.status(400).send("Incorrect password");
        return;
    }
    
    applicant.setResponse(
        req.body.fullName,
        req.body.email,
        req.body.yearAndProgram,
        req.body.favoriteLanguage,
        req.body.hardestPartCoding,
        req.body.codingExperience,
        req.body.shapeQuestion,
        req.body.controlQuestion,
        req.body.repairManQuestion   
    )

    //Create a new applicant in the database
    //applicant.fullName = "new applicant";
    applicantRef.child(applicant.fullName).set(applicant);
    res.status(200).send("Application received");
    console.log("Application received: " + applicant.fullName + ' ' + applicant.email + ' ' + applicant.yearAndProgram);
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))


/*********************************************
               Write to database
**********************************************/


