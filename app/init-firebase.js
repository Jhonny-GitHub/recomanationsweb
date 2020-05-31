// Get a reference to the database service
var database = firebase.database();

var dataref = database.ref().child('Boxes');
var datarefUsers = database.ref().child('Users');

var index = 1;

function loadBoxes() {
    dataref.on("child_added", snap => {
        var artist = snap.child('artist').val();
        var title = snap.child('title').val();
        var link = snap.child('link').val();
        var display = snap.child('display').val();
        console.log("" + artist + " : " + title + ": " + link);
        if (display == true) {
            createBox(artist, title, link, index, "inherit");
        } else {
            createBox(artist, title, link, index, "none");
        }
        index++;
    });
}

function createBox(a, t, l, i, d) {
    $("#pageContainer").append("<div class=\"row style1\" id=\"box" + i + "\" style=\"display: " + d + "\"><div class= \"text-center col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3 style3 pt-1\" style = 'box-shadow: 0px 5px 15px -8px rgba(0,0,0,0.45); background: linear-gradient(90deg, #FFA355 0%, #FA6D6E 100%);'><div class='style4' style='position: relative; padding-bottom: 56.25%;'><iframe src=\"" + l + "\" frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen style='position: absolute; top: 0; right: 0; width: 100%; height: 100%;'></iframe></div><div class='d-block bg-transparent style7 pt-4 pb-4 pl-3 pr-3'><h5 style=\"font-family: 'Montserrat', sans-serif; font-weight: 800; color: white\">" + t + "<br><small class=\"text-muted style8\" style=\"font-weight: 300; color: white !important;\">" + a + "</small></h5><button class='btn style5 btn-sm btn-block w-50 btn-outline-light' onclick=\"removeBoxFromDataBase(" + i + ")\">Check</button></div></div></div>");
}

function removeBoxFromDataBase(i) {
    var boxToRemove = database.ref().child('Boxes');
    //boxToRemove.child('box' + i).remove();
    boxToRemove.child('box' + i).update({ display: false });
    document.getElementById("box" + i).style.display = "none";
}


// Auth
var txtEmail = document.getElementById('txtEmail');
var txtPassword = document.getElementById('txtPassword');
var btnLogIn = document.getElementById('btnLogIn');
var btnLogOut = document.getElementById('btnLogOut');
var errorTxt = document.getElementById('errorTxt');

var logInPage = document.getElementById('loginPage');
var pageContainer = document.getElementById('pageContainer');

function logIn() {
    var email = txtEmail.value;
    var password = txtPassword.value;
    var auth = firebase.auth();

    var promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(e => {
        //console.log(e.message);
        var errorCode = e.code;
        var errorMessage = e.message;
        console.log("error code: " + errorCode);
        console.log("error message: " + errorMessage);
        if (errorCode == "auth/invalid-email" || errorCode == "auth/wrong-password" || errorCode == "auth/too-many-requests") {
            errorTxt.style.display = "inherit";
            errorTxt.innerHTML = errorMessage;
        }
    });
}

btnLogOut.addEventListener('click', e => {
    firebase.auth().signOut();
    if (errorTxt.style.display == "inherit") {
        errorTxt.style.display = "none";
    }
});

function checkUserOnDataBase(e, u) {
    datarefUsers.orderByChild("email").equalTo(e).once("value", snapshot => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            console.log("exists!", userData);
        } else {
            console.log("it doesnt exists, creating a new user...");
            firebase.database().ref('Users/' + u).set({
                email: e,
                type: "user",
            });
        }
    });
}

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        //console.log(firebaseUser);
        logInPage.style.display = "none";
        pageContainer.style.display = "inherit";
        loadBoxes();
        var firebaseUid = firebaseUser.uid;
        var firebaseEmail = firebaseUser.email;
        //console.log("user UID: " + firebaseUid + "and email: " + firebaseEmail);
        checkUserOnDataBase(firebaseEmail, firebaseUid);
    } else {
        console.log('not logged in!');
        logInPage.style.display = "inherit";
        pageContainer.style.display = "none";
    }
});