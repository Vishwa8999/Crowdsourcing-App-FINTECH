document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const steps = document.querySelectorAll('.step');
    const cards = document.querySelectorAll('.card');
    const nextButtons = document.querySelectorAll('.next-btn');
    const backButtons = document.querySelectorAll('.back-btn');
    const skipButton = document.querySelector('.skip-btn');
    const recalculateButton = document.getElementById('recalculate-btn');
    const downloadReportButton = document.getElementById('download-report-btn');
    
    // Bank verification elements
    const bankSelect = document.getElementById('bank-select');
    const bankLoginForm = document.getElementById('bank-login-form');
    const bankHeader = document.getElementById('bank-header');
    const bankLogo = document.getElementById('bank-logo');
    const bankName = document.getElementById('bank-name');
    const togglePasswordButton = document.getElementById('toggle-password');
    const bankPassword = document.getElementById('bank-password');
    const consentCheckbox = document.getElementById('consent');
    const verifyButton = document.getElementById('verify-btn');
    const verificationStatus = document.getElementById('verification-status');
    const verificationMessage = document.getElementById('verification-message');
    const verificationBadge = document.getElementById('verification-badge');
    
    // Range sliders
    const sliders = document.querySelectorAll('.slider');
    const rangeValues = document.querySelectorAll('.range-value');
    
    // Results elements
    const finalScore = document.getElementById('final-score');
    const scoreCategory = document.getElementById('score-category');
    const scoreNeedle = document.getElementById('score-needle');
    const breakdownBars = document.querySelectorAll('.breakdown-progress');
    const recommendationList = document.getElementById('recommendation-list');
    
    // State variables
    let currentStep = 1;
    let isVerified = false;
    let calculatedScore = 0;
    
    // Bank logos (placeholder URLs - in a real app, these would be actual logo URLs)
    const bankLogos = {
        sbi: '/placeholder.svg?height=40&width=40',
        hdfc: '/placeholder.svg?height=40&width=40',
        icici: '/placeholder.svg?height=40&width=40',
        axis: '/placeholder.svg?height=40&width=40',
        pnb: '/placeholder.svg?height=40&width=40',
        bob: '/placeholder.svg?height=40&width=40',
        kotak: '/placeholder.svg?height=40&width=40',
        yes: '/placeholder.svg?height=40&width=40'
    };
    
    // Bank names
    const bankNames = {
        sbi: 'State Bank of India',
        hdfc: 'HDFC Bank',
        icici: 'ICICI Bank',
        axis: 'Axis Bank',
        pnb: 'Punjab National Bank',
        bob: 'Bank of Baroda',
        kotak: 'Kotak Mahindra Bank',
        yes: 'Yes Bank'
    };
    
    // Initialize range sliders
    sliders.forEach((slider, index) => {
        slider.addEventListener('input', function() {
            const value = this.value;
            const id = this.id;
            
            // Update the displayed value
            if (id === 'credit-utilization' || id === 'payment-history') {
                rangeValues[index].textContent = value + '%';
            } else {
                rangeValues[index].textContent = value;
            }
            
            // Add animation effect when slider changes
            rangeValues[index].style.animation = 'none';
            setTimeout(() => {
                rangeValues[index].style.animation = 'pulse 0.5s';
            }, 5);
        });
    });
    
    // Navigation - Next buttons
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = parseInt(this.getAttribute('data-next'));
            if (nextStep) {
                goToStep(nextStep);
            }
        });
    });
    
    // Navigation - Back buttons
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = parseInt(this.getAttribute('data-back'));
            if (prevStep) {
                goToStep(prevStep);
            }
        });
    });
    
    // Skip verification
    skipButton.addEventListener('click', function() {
        const nextStep = parseInt(this.getAttribute('data-next'));
        if (nextStep) {
            isVerified = false;
            goToStep(nextStep);
        }
    });
    
    // Recalculate button
    recalculateButton.addEventListener('click', function() {
        goToStep(1);
        resetForm();
    });
    
    // Download report button
    downloadReportButton.addEventListener('click', function() {
        alert('Report download functionality would be implemented here.');
    });
    
    // Bank selection change
    bankSelect.addEventListener('change', function() {
        const selectedBank = this.value;
        
        if (selectedBank) {
            bankLoginForm.classList.remove('hidden');
            bankLogo.src = bankLogos[selectedBank];
            bankName.textContent = bankNames[selectedBank];
            bankHeader.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
        } else {
            bankLoginForm.classList.add('hidden');
        }
    });
    
    // Toggle password visibility
    togglePasswordButton.addEventListener('click', function() {
        const type = bankPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        bankPassword.setAttribute('type', type);
        this.querySelector('.eye-icon').textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    });
    
    // Consent checkbox
    consentCheckbox.addEventListener('change', function() {
        verifyButton.disabled = !this.checked;
    });
    
    // Verify button
    verifyButton.addEventListener('click', function() {
        // Hide login form, show verification status
        bankLoginForm.classList.add('hidden');
        verificationStatus.classList.remove('hidden');
        
        // Simulate verification process
        setTimeout(() => {
            verificationMessage.textContent = 'Authenticating...';
        }, 1000);
        
        setTimeout(() => {
            verificationMessage.textContent = 'Fetching account data...';
        }, 2500);
        
        setTimeout(() => {
            verificationMessage.textContent = 'Analyzing transaction history...';
        }, 4000);
        
        setTimeout(() => {
            verificationMessage.textContent = 'Verification complete!';
            isVerified = true;
            
            // Go to results after verification
            setTimeout(() => {
                goToStep(4);
            }, 1000);
        }, 5500);
    });
    
    // Function to navigate between steps
    function goToStep(stepNumber) {
        // Hide all cards
        cards.forEach(card => {
            card.classList.add('hidden');
        });
        
        // Show the selected card
        document.getElementById(`step${stepNumber}`).classList.remove('hidden');
        
        // Update steps indicator
        steps.forEach(step => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            step.classList.remove('active', 'completed');
            
            if (stepNum === stepNumber) {
                step.classList.add('active');
            } else if (stepNum < stepNumber) {
                step.classList.add('completed');
            }
        });
        
        // Update current step
        currentStep = stepNumber;
        
        // If going to results step, calculate and display score
        if (stepNumber === 4) {
            calculateScore();
        }
    }
    
    // Function to calculate CIBIL score
    function calculateScore() {
        // Get values from inputs
        const existingLoans = parseInt(document.getElementById('existing-loans').value);
        const creditCards = parseInt(document.getElementById('credit-cards').value);
        const creditUtilization = parseInt(document.getElementById('credit-utilization').value);
        const paymentHistory = parseInt(document.getElementById('payment-history').value);
        const creditAge = parseInt(document.getElementById('credit-age').value);
        const hardInquiries = parseInt(document.getElementById('hard-inquiries').value);
        
        // Calculate component scores
        // Payment History (35%)
        const paymentScore = (paymentHistory / 100) * 35;
        
        // Credit Utilization (30%)
        // Lower utilization is better (below 30% is ideal)
        const utilizationScore = ((100 - creditUtilization) / 100) * 30;
        
        // Credit Age (15%)
        // Longer credit history is better (max 20 years)
        const ageScore = Math.min(creditAge / 20, 1) * 15;
        
        // Credit Mix (10%)
        // Having a mix of credit types is good, but not too many
        const totalAccounts = existingLoans + creditCards;
        const mixScore = totalAccounts > 0 ? 
            Math.min(10, Math.max(0, 10 - Math.abs(totalAccounts - 5))) : 0;
        
        // Hard Inquiries (10%)
        // Fewer inquiries is better
        const inquiryScore = Math.max(0, 10 - hardInquiries);
        
        // Calculate total score (base 300-900 scale)
        let baseScore = 300 + (paymentScore + utilizationScore + ageScore + mixScore + inquiryScore) * 6;
        
        // Apply verification bonus if verified
        if (isVerified) {
            baseScore += 20;
        }
        
        // Cap at 900
        calculatedScore = Math.min(900, Math.round(baseScore));
        
        // Animate score display
        animateCounter(0, calculatedScore, 2000, finalScore);
        
        // Rotate needle based on score (300-900 maps to 0-180 degrees)
        const needleRotation = ((calculatedScore - 300) / 600) * 180;
        setTimeout(() => {
            scoreNeedle.style.transform = `translateY(-50%) rotate(${needleRotation}deg)`;
        }, 500);
        
        // Set score category
        setTimeout(() => {
            if (calculatedScore < 550) {
                scoreCategory.textContent = "Poor";
                scoreCategory.style.color = getComputedStyle(document.documentElement).getPropertyValue('--danger');
            } else if (calculatedScore < 650) {
                scoreCategory.textContent = "Fair";
                scoreCategory.style.color = getComputedStyle(document.documentElement).getPropertyValue('--warning');
            } else if (calculatedScore < 750) {
                scoreCategory.textContent = "Good";
                scoreCategory.style.color = "#8bc34a";
            } else if (calculatedScore < 800) {
                scoreCategory.textContent = "Very Good";
                scoreCategory.style.color = getComputedStyle(document.documentElement).getPropertyValue('--success');
            } else {
                scoreCategory.textContent = "Excellent";
                scoreCategory.style.color = getComputedStyle(document.documentElement).getPropertyValue('--success');
            }
        }, 2000);
        
        // Animate breakdown bars
        setTimeout(() => {
            // Payment History
            breakdownBars[0].style.width = `${(paymentScore / 35) * 100}%`;
            
            // Credit Utilization
            breakdownBars[1].style.width = `${(utilizationScore / 30) * 100}%`;
            
            // Credit Age
            breakdownBars[2].style.width = `${(ageScore / 15) * 100}%`;
            
            // Credit Mix
            breakdownBars[3].style.width = `${(mixScore / 10) * 100}%`;
            
            // Hard Inquiries
            breakdownBars[4].style.width = `${(inquiryScore / 10) * 100}%`;
        }, 500);
        
        // Show verification badge if verified
        if (isVerified) {
            setTimeout(() => {
                verificationBadge.classList.add('show');
            }, 2500);
        } else {
            verificationBadge.classList.remove('show');
        }
        
        // Generate recommendations
        generateRecommendations({
            paymentHistory,
            creditUtilization,
            creditAge,
            existingLoans,
            creditCards,
            hardInquiries
        });
    }
    
    // Function to animate counter
    function animateCounter(start, end, duration, element) {
        const range = end - start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        let current = start;
        
        const timer = setInterval(function() {
            current += increment;
            element.textContent = current;
            
            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }
    
    // Function to generate recommendations
    function generateRecommendations(data) {
        // Clear previous recommendations
        recommendationList.innerHTML = '';
        
        // Define possible recommendations
        const recommendations = [];
        
        // Payment History recommendations
        if (data.paymentHistory < 100) {
            recommendations.push("Make all your payments on time. Set up automatic payments to avoid missing due dates.");
        }
        
        // Credit Utilization recommendations
        if (data.creditUtilization > 30) {
            recommendations.push("Try to keep your credit utilization below 30%. Consider paying down existing balances or requesting credit limit increases.");
        }
        
        // Credit Age recommendations
        if (data.creditAge < 5) {
            recommendations.push("Maintain your oldest credit accounts to increase your average credit age.");
        }
        
        // Credit Mix recommendations
        const totalAccounts = data.existingLoans + data.creditCards;
        if (totalAccounts < 3) {
            recommendations.push("Consider diversifying your credit mix with different types of credit (e.g., credit card, auto loan, etc.).");
        } else if (totalAccounts > 8) {
            recommendations.push("Avoid opening too many new accounts in a short period. Focus on managing existing accounts responsibly.");
        }
        
        // Hard Inquiries recommendations
        if (data.hardInquiries > 2) {
            recommendations.push("Limit applications for new credit to minimize hard inquiries on your credit report.");
        }
        
        // Add general recommendations if needed
        if (recommendations.length < 3) {
            recommendations.push("Regularly check your credit report for errors and dispute any inaccuracies.");
            recommendations.push("Keep old accounts open even if you don't use them frequently to maintain a longer credit history.");
        }
        
        // Add recommendations to the list with animation delay
        recommendations.forEach((recommendation, index) => {
            const li = document.createElement('li');
            li.textContent = recommendation;
            recommendationList.appendChild(li);
            
            setTimeout(() => {
                li.classList.add('show');
            }, 500 + (index * 300));
        });
    }
    
    // Function to reset form
    function resetForm() {
        // Reset sliders to default values
        document.getElementById('existing-loans').value = 0;
        document.getElementById('existing-loans-value').textContent = '0';
        
        document.getElementById('credit-cards').value = 0;
        document.getElementById('credit-cards-value').textContent = '0';
        
        document.getElementById('credit-utilization').value = 30;
        document.getElementById('credit-utilization-value').textContent = '30%';
        
        document.getElementById('payment-history').value = 100;
        document.getElementById('payment-history-value').textContent = '100%';
        
        document.getElementById('credit-age').value = 2;
        document.getElementById('credit-age-value').textContent = '2';
        
        document.getElementById('hard-inquiries').value = 0;
        document.getElementById('hard-inquiries-value').textContent = '0';
        
        // Reset bank verification
        bankSelect.value = '';
        bankLoginForm.classList.add('hidden');
        verificationStatus.classList.add('hidden');
        consentCheckbox.checked = false;
        verifyButton.disabled = true;
        isVerified = false;
        
        // Reset personal info
        document.getElementById('fullname').value = '';
        document.getElementById('dob').value = '';
        document.getElementById('pan').value = '';
        document.getElementById('mobile').value = '';
        document.getElementById('email').value = '';
        
        // Reset verification badge
        verificationBadge.classList.remove('show');
    }
    
    // Start at step 1
    goToStep(1);
});