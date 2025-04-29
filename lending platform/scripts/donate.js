document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase (replace with your actual Firebase config)
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
    firebase.initializeApp(firebaseConfig);

    // Get Firebase services
    const auth = firebase.auth();
    const db = firebase.firestore();

    const donateBtn = document.getElementById('donateBtn');
    const successModal = document.getElementById('successModal');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');
    
    if (donateBtn) {
        donateBtn.addEventListener('click', function() {
            // Get selected values
            const organization = document.querySelector('input[name="organization"]:checked').value;
            const amount = document.querySelector('input[name="amount"]:checked').value;
            const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
            
            // Check if user is logged in
            const user = auth.currentUser;
            if (!user) {
                alert('Please login to make a donation');
                document.getElementById('loginModal').style.display = 'block';
                return;
            }
            
            // Save donation to Firebase
            saveDonation(user.uid, organization, amount, paymentMethod)
                .then(() => {
                    // Show success modal
                    if (successModal) {
                        successModal.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error('Error saving donation:', error);
                    alert('There was an error processing your donation. Please try again.');
                });
        });
    }
    
    if (closeSuccessBtn && successModal) {
        closeSuccessBtn.addEventListener('click', function() {
            successModal.style.display = 'none';
            // Redirect to homepage after successful donation
            window.location.href = 'index.html';
        });
    }
    
    // Function to save donation to Firebase
    async function saveDonation(userId, organization, amount, paymentMethod) {
        try {
            // Add donation to donations collection
            const donationRef = await db.collection('donations').add({
                userId: userId,
                organization: organization,
                amount: parseFloat(amount),
                paymentMethod: paymentMethod,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('Donation saved with ID:', donationRef.id);
            
            // Update user's donation history
            await db.collection('users').doc(userId).collection('donations').add({
                donationId: donationRef.id,
                organization: organization,
                amount: parseFloat(amount),
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Update organization's total donations
            const orgRef = db.collection('organizations').doc(organization);
            await db.runTransaction(async (transaction) => {
                const orgDoc = await transaction.get(orgRef);
                
                if (!orgDoc.exists) {
                    transaction.set(orgRef, {
                        totalDonations: parseFloat(amount)
                    });
                } else {
                    const newTotal = (orgDoc.data().totalDonations || 0) + parseFloat(amount);
                    transaction.update(orgRef, { totalDonations: newTotal });
                }
            });
            
            return true;
        } catch (error) {
            console.error('Error saving donation:', error);
            throw error;
        }
    }
});