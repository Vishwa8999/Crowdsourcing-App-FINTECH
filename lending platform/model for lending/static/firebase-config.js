// Firebase configuration

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBTl1mnk3kTFysFtmzpXvbLjmcVMlzEkRU",
    authDomain: "lending-app-559fa.firebaseapp.com",
    databaseURL: "https://lending-app-559fa-default-rtdb.firebaseio.com",
    projectId: "lending-app-559fa",
    storageBucket: "lending-app-559fa.firebasestorage.app",
    messagingSenderId: "13752692266",
    appId: "1:13752692266:web:47efd0589f20850fa75d53",
    measurementId: "G-MQSLBQDNS1"
};


// Initialize Firebase
// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



// Initialize Auth
const auth = firebase.auth();

// Check authentication state
auth.onAuthStateChanged(user => {
    const loginBtn = document.getElementById('loginBtn');
    
    if (user) {
        // User is signed in
        console.log('User is signed in:', user.email);
        if (loginBtn) {
            loginBtn.textContent = 'Dashboard';
            loginBtn.href = 'dashboard.html';
        }
    } else {
        // User is signed out
        console.log('User is signed out');
        if (loginBtn) {
            loginBtn.textContent = 'Login';
            loginBtn.href = '#';
        }
    }
});
