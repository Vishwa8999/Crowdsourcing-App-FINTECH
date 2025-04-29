document.addEventListener('DOMContentLoaded', function() {
    // Animation on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Set initial state and observe all feature cards
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Animate welcome text
    setTimeout(() => {
        document.querySelectorAll('.animate-text').forEach(el => {
            el.style.opacity = '1';
        });
    }, 300);
    
    // Floating animation for icons
    const icons = document.querySelectorAll('.icon');
    icons.forEach(icon => {
        icon.style.animation = 'float 3s ease-in-out infinite';
    });
    
    // Loan Calculator Functionality
    const loanAmountInput = document.getElementById('loan-amount');
    const loanTermInput = document.getElementById('loan-term');
    const interestRateInput = document.getElementById('interest-rate');
    
    const amountValue = document.getElementById('amount-value');
    const termValue = document.getElementById('term-value');
    const rateValue = document.getElementById('rate-value');
    
    const monthlyPayment = document.getElementById('monthly-payment');
    const totalInterest = document.getElementById('total-interest');
    const totalPayment = document.getElementById('total-payment');
    
    // Update display values
    function updateValues() {
        amountValue.textContent = `₹${parseInt(loanAmountInput.value).toLocaleString()}`;
        termValue.textContent = `${loanTermInput.value} months`;
        rateValue.textContent = `${interestRateInput.value}%`;
        
        calculateLoan();
    }
    
    // Calculate loan details
    function calculateLoan() {
        const principal = parseFloat(loanAmountInput.value);
        const interestRate = parseFloat(interestRateInput.value) / 100 / 12;
        const term = parseInt(loanTermInput.value);
        
        // Calculate monthly payment
        const x = Math.pow(1 + interestRate, term);
        const monthly = (principal * x * interestRate) / (x - 1);
        
        if (isFinite(monthly)) {
            const monthlyPaymentValue = monthly.toFixed(2);
            const totalPaymentValue = (monthly * term).toFixed(2);
            const totalInterestValue = ((monthly * term) - principal).toFixed(2);
            
            // Update UI with calculated values
            monthlyPayment.textContent = `₹${parseFloat(monthlyPaymentValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            totalInterest.textContent = `${parseFloat(totalInterestValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            totalPayment.textContent = `₹${parseFloat(totalPaymentValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            
            // Update chart
            updateChart(principal, parseFloat(totalInterestValue));
        }
    }
    
    // Add pulse animation to values when they change
    function animateValue(element) {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'pulse 0.5s ease';
    }
    
    // Chart setup
    const ctx = document.getElementById('loan-chart').getContext('2d');
    let loanChart;
    
    function updateChart(principal, interestTotal) {
        // Destroy previous chart if it exists
        if (loanChart) {
            loanChart.destroy();
        }
        
        // Create new chart
        loanChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Principal', 'Interest'],
                datasets: [{
                    data: [principal, interestTotal],
                    backgroundColor: [
                        'var(--primary)',
                        'var(--accent-1)'
                    ],
                    borderColor: [
                        'var(--white)',
                        'var(--white)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                family: 'Google Sans',
                                size: 14
                            },
                            color: 'var(--gray-800)'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += `$${context.raw.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Add event listeners to sliders
    loanAmountInput.addEventListener('input', updateValues);
    loanTermInput.addEventListener('input', updateValues);
    interestRateInput.addEventListener('input', updateValues);
    
    // Initialize calculator
    updateValues();
    
    // Interactive button effects
    const buttons = document.querySelectorAll('.learn_more');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('click', () => {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
            
            // Show a simple notification when button is clicked
            showNotification(`Exploring ${button.parentElement.querySelector('h3').textContent}`);
        });
    });
    
    // Notification system
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'var(--primary-color)';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'all 0.3s ease';
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    // paraleexxxxxxxx
    window.addEventListener('DOMContentLoaded', () => {
        const heroImage = document.querySelector('.hero-image');
    
        if (!heroImage) {
            console.warn("Element '.hero-image' not found.");
            return; // Stops further execution if the element isn't found
        }
    
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
    
            if (scrollPosition < 500) {
                heroImage.style.transform = `translateY(${scrollPosition * 0.3}px)`;
            }
        });
    });
    
    
    // Add a welcome notification
    setTimeout(() => {
        showNotification('Welcome to LendWise! Explore our lending options.');
    }, 1500);
    
    // Add interactive cursor effect
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.position = 'fixed';
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.borderRadius = '50%';
    cursor.style.backgroundColor = 'rgba(76, 175, 80, 0.3)';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.transition = 'width 0.2s, height 0.2s, background-color 0.2s';
    document.body.appendChild(cursor);
    
    // Update cursor position
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
    
    // Cursor effects on interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, .feature-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'rgba(76, 175, 80, 0.3)';
        });
    });
    
    // Typing animation for welcome text
    const welcomeHeading = document.querySelector('.welcome-section h1');
    const welcomeText = welcomeHeading.textContent;
    welcomeHeading.textContent = '';
    
    let charIndex = 0;
    function typeText() {
        if (charIndex < welcomeText.length) {
            welcomeHeading.textContent += welcomeText.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, 100);
        }
    }
    
    // Start typing animation after a delay
    setTimeout(typeText, 1000);

    // Custom cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    window.addEventListener('mousemove', function(e) {
        const posX = e.clientX;
        const posY = e.clientY;
        
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        // Add a slight delay to the outline for a trailing effect
        setTimeout(() => {
            cursorOutline.style.left = `${posX}px`;
            cursorOutline.style.top = `${posY}px`;
        }, 100);
    });
    
    // Cursor effects on interactive elements
    const interactiveElements2 = document.querySelectorAll('button, a, input[type="range"], .feature-card, .option-card');
    
    interactiveElements2.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.borderColor = 'var(--primary)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.borderColor = 'var(--primary)';
        });
    });
    
    // Hide cursor when mouse leaves the window
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
    });
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const headerActions = document.querySelector('.header-actions');
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        
        if (menuToggle.classList.contains('active')) {
            // Create mobile menu
            const mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-menu';
            mobileMenu.innerHTML = `
                ${nav.outerHTML}
                ${headerActions.outerHTML}
            `;
            
            document.body.appendChild(mobileMenu);
            
            // Animate menu in
            setTimeout(() => {
                mobileMenu.style.transform = 'translateX(0)';
            }, 10);
            
            // Prevent body scrolling
            document.body.style.overflow = 'hidden';
        } else {
            // Animate menu out
            const mobileMenu = document.querySelector('.mobile-menu');
            mobileMenu.style.transform = 'translateX(100%)';
            
            // Remove menu after animation
            setTimeout(() => {
                document.body.removeChild(mobileMenu);
            }, 300);
            
            // Re-enable body scrolling
            document.body.style.overflow = '';
        }
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = 'var(--shadow-md)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.boxShadow = 'var(--shadow-sm)';
            header.style.backdropFilter = 'blur(5px)';
        }
    });
    
    // Card hover effects
    const cards = document.querySelectorAll('.card-visual');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = card.classList.contains('card-1') ? 'rotate(5deg)' : 'rotate(-5deg)';
        });
    });
    
    // Initialize Vanilla Tilt for feature cards
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
    });
    
    // Loan calculator functionality
    const loanAmountInput2 = document.getElementById('loan-amount');
    const loanTermInput2 = document.getElementById('loan-term');
    const interestRateInput2 = document.getElementById('interest-rate');
    
    // const amountValue = document.getElementById('amount-value');
    // const termValue = document.getElementById('term-value');
    // const rateValue = document.getElementById('rate-value');
    
    // const monthlyPayment = document.getElementById('monthly-payment');
    // const totalInterest = document.getElementById('total-interest');
    // const totalPayment = document.getElementById('total-payment');
    
    // Chart setup
    const ctx2 = document.getElementById('loan-chart').getContext('2d');
    let loanChart2;
    
    function updateCalculator() {
        // Update slider values
        amountValue.textContent = `$${parseInt(loanAmountInput2.value).toLocaleString()}`;
        termValue.textContent = `${loanTermInput2.value} months`;
        rateValue.textContent = `${interestRateInput2.value}%`;
        
        // Calculate loan details
        const principal = parseFloat(loanAmountInput2.value);
        const interestRate = parseFloat(interestRateInput2.value) / 100 / 12;
        const term = parseInt(loanTermInput2.value);
        
        // Calculate monthly payment
        const x = Math.pow(1 + interestRate, term);
        const monthly = (principal * x * interestRate) / (x - 1);
        
        if (isFinite(monthly)) {
            const monthlyPaymentValue = monthly.toFixed(2);
            const totalPaymentValue = (monthly * term).toFixed(2);
            const totalInterestValue = ((monthly * term) - principal).toFixed(2);
            
            // Update UI with calculated values
            monthlyPayment.textContent = `$${parseFloat(monthlyPaymentValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            totalInterest.textContent = `$${parseFloat(totalInterestValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            totalPayment.textContent = `$${parseFloat(totalPaymentValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            
            // Update chart
            updateChart2(principal, parseFloat(totalInterestValue));
        }
    }
    
    function updateChart2(principal, interestTotal) {
        // Destroy previous chart if it exists
        if (loanChart2) {
            loanChart2.destroy();
        }
        
        // Create new chart
        loanChart2 = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['Principal', 'Interest'],
                datasets: [{
                    data: [principal, interestTotal],
                    backgroundColor: [
                        'var(--primary)',
                        'var(--accent-1)'
                    ],
                    borderColor: [
                        'var(--white)',
                        'var(--white)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                family: 'Google Sans',
                                size: 14
                            },
                            color: 'var(--gray-800)'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += `$${context.raw.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Add event listeners to sliders
    loanAmountInput2.addEventListener('input', updateCalculator);
    loanTermInput2.addEventListener('input', updateCalculator);
    interestRateInput2.addEventListener('input', updateCalculator);
    
    // Initialize calculator
    updateCalculator();
    
    // Loan options slider
    const optionsSlider = document.querySelector('.options-slider');
    const sliderDots = document.querySelectorAll('.slider-dots .dot');
    const prevButton = document.querySelector('.slider-arrow.prev');
    const nextButton = document.querySelector('.slider-arrow.next');
    
    let currentSlide = 0;
    const slideWidth = 300 + 24; // card width + gap
    const slidesPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    const maxSlide = document.querySelectorAll('.option-card').length - slidesPerView;
    
    function goToSlide(slideIndex) {
        currentSlide = Math.max(0, Math.min(slideIndex, maxSlide));
        optionsSlider.scrollTo({
            left: currentSlide * slideWidth,
            behavior: 'smooth'
        });
        
        // Update dots
        sliderDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === Math.min(currentSlide, sliderDots.length - 1));
        });
    }
    
    prevButton.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
    });
    
    nextButton.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
    });
    
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Testimonial slider
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonialCards.forEach(card => {
            card.classList.remove('active');
        });
        
        testimonialDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        testimonialCards[index].classList.add('active');
        testimonialDots[index].classList.add('active');
    }
    
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
            currentTestimonial = index;
        });
    });
    
    // Auto-rotate testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }, 5000);
    
    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.section-header, .feature-card, .calculator-card, .option-card, .testimonial-card, .cta-content');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight * 0.8) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animated elements
    document.querySelectorAll('.section-header, .feature-card, .calculator-card, .option-card, .testimonial-card, .cta-content').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Run animation on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Run once on page load
    animateOnScroll();
    
    // Apply button effect
    const applyButton = document.querySelector('.btn-apply');
    applyButton.addEventListener('click', () => {
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="notification-content">
                <h3>Application Started</h3>
                <p>We're preparing your loan application</p>
            </div>
        `;
        
        // Style notification
        notification.style.position = 'fixed';
        notification.style.bottom = '30px';
        notification.style.right = '30px';
        notification.style.backgroundColor = 'var(--white)';
        notification.style.borderRadius = 'var(--radius-md)';
        notification.style.boxShadow = 'var(--shadow-lg)';
        notification.style.padding = '20px';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.gap = '15px';
        notification.style.zIndex = '1000';
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        notification.style.transition = 'all 0.3s ease';
        
        // Style icon
        const icon = notification.querySelector('.notification-icon');
        icon.style.width = '40px';
        icon.style.height = '40px';
        icon.style.borderRadius = '50%';
        icon.style.backgroundColor = 'var(--primary-light)';
        icon.style.display = 'flex';
        icon.style.alignItems = 'center';
        icon.style.justifyContent = 'center';
        icon.style.color = 'var(--primary)';
        icon.style.fontSize = '20px';
        
        // Style content
        const content = notification.querySelector('.notification-content');
        content.style.flex = '1';
        
        const title = notification.querySelector('h3');
        title.style.fontSize = '16px';
        title.style.marginBottom = '5px';
        title.style.color = 'var(--gray-900)';
        
        const text = notification.querySelector('p');
        text.style.fontSize = '14px';
        text.style.margin = '0';
        text.style.color = 'var(--gray-700)';
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const heroSection = document.querySelector('.hero-section');
        
        if (scrollPosition < heroSection.offsetHeight) {
            const cards = document.querySelectorAll('.card-visual');
            const floatElements = document.querySelectorAll('.float-element');
            const circles = document.querySelectorAll('.bg-circle');
            
            cards.forEach((card, index) => {
                const speed = index === 0 ? 0.1 : 0.15;
                const yPos = scrollPosition * speed;
                card.style.transform = `translateY(${yPos}px) ${index === 0 ? 'rotate(5deg)' : 'rotate(-5deg)'}`;
            });
            
            floatElements.forEach((element, index) => {
                const speed = 0.05 + (index * 0.02);
                const yPos = scrollPosition * speed;
                element.style.transform = `translateY(${-yPos}px)`;
            });
            
            circles.forEach((circle, index) => {
                const speed = 0.03 + (index * 0.01);
                const yPos = scrollPosition * speed;
                circle.style.transform = `translateY(${-yPos}px)`;
            });
        }
    });
    
    // Initialize the first testimonial
    showTestimonial(0);
});

// Vanilla Tilt implementation
var VanillaTilt = (function() {
    'use strict';

    // Helper function to check if an element is a node
    function isNode(node) {
        return (typeof node === 'object') && (node !== null) && (typeof node.nodeType === 'number') && (typeof node.nodeName === 'string');
    }

    // Default settings object
    var defaultSettings = {
        reverse:                false,   // reverse the tilt direction
        max:                    15,      // max tilt rotation (degrees)
        startX:                 0,       // the starting tilt on the X axis, in degrees.
        startY:                 0,       // the starting tilt on the Y axis, in degrees.
        perspective:            1000,    // Transform perspective, the lower the more extreme the tilt gets.
        easing:                 'cubic-bezier(.03,.98,.52,.99)', // Easing on the CSS transform
        scale:                  1,       // 2 = 200%, 1.5 = 150%, etc..
        speed:                  300,     // Speed of the enter/exit transition
        transition:             true,   // Set a transition on enter/exit.
        axis:                   null,    // What axis should be disabled. Can be X or Y.
        glare:                  false,   // if it should have a "glare" effect
        "max-glare":            1,      // the maximum "glare" opacity.
        "glare-prerender":      false,   // false = VanillaTilt creates the glare elements for you; true = you need to define the glare elements (see example).
        "mouse-event-element":  null,    // element that listens to the mouse move. By default, it is the same element we add the listeners to.
        reset:                  true,    // If the tilt effect has to be reset on exit
        gyroscope:              true,   // Boolean to enable/disable device orientation detection,
        gyroscopeMinAngleX:     -45,    // This is the bottom limit of the device angle on X axis, meaning that a device angle lower than this one will be set to the minimum.
        gyroscopeMaxAngleX:     45,     // This is the top limit of the device angle on X axis, meaning that a device angle higher than this one will be set to the maximum.
        gyroscopeMinAngleY:     -45,    // This is the bottom limit of the device angle on Y axis, meaning that a device angle lower than this one will be set to the minimum.
        gyroscopeMaxAngleY:     45,     // This is the top limit of the device angle on Y axis, meaning that a device angle higher than this one will be set to the maximum.
    };

    // Constructor
    function VanillaTilt(element, settings) {
        if (! (element instanceof Node)) {
            throw "Can't initialize VanillaTilt because " + element + " is not a Node.";
        }

        this.element = element;
        this.settings = this.extendSettings(settings);

        this.reverse = this.settings.reverse ? -1 : 1;
        this.transition = this.settings.transition;
        this.reset = this.settings.reset;
        this.startX = this.settings.startX;
        this.startY = this.settings.startY;
        this.gyroscope = this.settings.gyroscope;

        this.mouseEventElement = this.settings["mouse-event-element"];

        if (this.mouseEventElement === null) {
            this.mouseEventElement = this.element;
        }

        this.width = null;
        this.height = null;
        this.left = null;
        this.top = null;

        this.transitionTimeout = null;
        this.updateCall = null;

        this.onMouseEnterBind = this.onMouseEnter.bind(this);
        this.onMouseMoveBind = this.onMouseMove.bind(this);
        this.onMouseLeaveBind = this.onMouseLeave.bind(this);
        this.onWindowResizeBind = this.onWindowResize.bind(this);
        this.onDeviceOrientationBind = this.onDeviceOrientation.bind(this);

        this.element.addEventListener('mouseenter', this.onMouseEnterBind);
        this.element.addEventListener('mouseleave', this.onMouseLeaveBind);

        if (this.settings.gyroscope) {
            window.addEventListener('deviceorientation', this.onDeviceOrientationBind);
        }

        this.onWindowResize();

        window.addEventListener('resize', this.onWindowResizeBind);

        this.initialiseGlare();
    }

    // Set variables for an element
    VanillaTilt.prototype.updateElementPosition = function() {
        var rect = this.element.getBoundingClientRect();

        this.width  = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        this.left   = rect.left;
        this.top    = rect.top;
    };

    // Add a glare effect if enabled
    VanillaTilt.prototype.initialiseGlare = function() {
        if (!this.settings.glare) {
            return;
        }

        // If the user wants to define his own glare, don't do anything
        if (this.settings["glare-prerender"]) {
            return;
        }

        // Create the glare element
        var glare = document.createElement('div');
        glare.classList.add('vanilla-tilt-glare');

        // Create the glare inner element
        var glareInner = document.createElement('div');
        glareInner.classList.add('vanilla-tilt-glare-inner');

        // Append the inner element to the glare element
        glare.appendChild(glareInner);

        // Append the glare to the element
        this.element.appendChild(glare);
    };

    // Mouse enter event
    VanillaTilt.prototype.onMouseEnter = function() {
        this.updateElementPosition();
        this.mouseEventElement.addEventListener('mousemove', this.onMouseMoveBind);
        this.reset = false;
    };

    // Mouse move event
    VanillaTilt.prototype.onMouseMove = function(event) {
        if (this.updateCall !== null) {
            cancelAnimationFrame(this.updateCall);
        }

        this.event = event;
        this.updateCall = requestAnimationFrame(this.update.bind(this));
    };

    // Mouse leave event
    VanillaTilt.prototype.onMouseLeave = function() {
        this.mouseEventElement.removeEventListener('mousemove', this.onMouseMoveBind);

        if (this.reset) {
            this.resetTilt();
        }
    };

    // Window resize event
    VanillaTilt.prototype.onWindowResize = function() {
        this.updateElementPosition();
    };

    // Device orientation event
    VanillaTilt.prototype.onDeviceOrientation = function(event) {
        if (event.gamma === null || event.beta === null) {
            return;
        }

        this.updateElementPosition();

        var x = (event.gamma / 180) * this.settings.max;
        var y = (event.beta  / 180) * this.settings.max;

        // x angle limit
        if (x >  this.settings.gyroscopeMaxAngleX) {
            x = this.settings.gyroscopeMaxAngleX;
        }

        if (x < -this.settings.gyroscopeMinAngleX) {
            x = -this.settings.gyroscopeMinAngleX;
        }

        // y angle limit
        if (y >  this.settings.gyroscopeMaxAngleY) {
            y = this.settings.gyroscopeMaxAngleY;
        }

        if (y < -this.settings.gyroscopeMinAngleY) {
            y = -this.settings.gyroscopeMinAngleY;
        }

        // Normalize angle to the same range as mouse move event
        x = this.settings.max - x;
        y = this.settings.max - y;

        // flip angles depending on reverse setting
        x *= this.reverse;
        y *= this.reverse;

        this.updateTilt(x, y);
    };

    // Reset tilt
    VanillaTilt.prototype.resetTilt = function() {
        var transition = this.transition;
        this.transition = true;

        clearTimeout(this.transitionTimeout);

        this.element.style.transition = this.settings.speed + 'ms ' + this.settings.easing;
        if (this.settings.glare) {
            var glare = this.element.querySelector('.vanilla-tilt-glare');
            glare.style.transition = this.settings.speed + 'ms ' + this.settings.easing;
        }

        this.updateTilt(this.startX, this.startY);

        this.transitionTimeout = setTimeout(function() {
            this.element.style.transition = '';
            if (this.settings.glare) {
                var glare = this.element.querySelector('.vanilla-tilt-glare');
                glare.style.transition = '';
            }

            this.transition = transition;
        }.bind(this), this.settings.speed);
    };

    // Get tilt values
    VanillaTilt.prototype.getValues = function() {
        var x, y;

        if (this.gyroscope) {
            x = this.ix;
            y = this.iy;
        } else {
            var width = this.width;
            var height = this.height;
            var left = this.left;
            var top = this.top;

            var mouseX = this.event.clientX;
            var mouseY = this.event.clientY;

            mouseX = (mouseX - left) / width;
            mouseY = (mouseY - top) / height;

            mouseX = Math.min(Math.max(mouseX, 0), 1);
            mouseY = Math.min(Math.max(mouseY, 0), 1);

            var tiltX = (this.settings.max / 2) - mouseX * this.settings.max;
            var tiltY = mouseY * this.settings.max - (this.settings.max / 2);

            tiltX *= this.reverse;
            tiltY *= this.reverse;

            x = tiltX;
            y = tiltY;
        }

        return {
            tiltX: x,
            tiltY: y
        };
    };

    // Update tilt values
    VanillaTilt.prototype.updateTilt = function(tiltX, tiltY) {
        var values = {
            tiltX: tiltX,
            tiltY: tiltY
        };

        this.element.dispatchEvent(new CustomEvent('tiltChange', {
            "detail": values
        }));

        this.element.style.transform = 'perspective(' + this.settings.perspective + 'px)' +
                                       'rotateX(' + values.tiltY + 'deg)' +
                                       'rotateY(' + values.tiltX + 'deg)' +
                                       'scale3d(' + this.settings.scale + ', ' + this.settings.scale + ', ' + this.settings.scale + ')';

        if (this.settings.glare) {
            var glare = this.element.querySelector('.vanilla-tilt-glare');

            glare.style.transform = 'rotate(' + values.tiltX + 'deg) rotate(' + values.tiltY + 'deg)';
            glare.style.opacity = this.settings["max-glare"] / 100 * Math.max(Math.abs(values.tiltX), Math.abs(values.tiltY)) / this.settings.max;
        }
    };

    // Update
    VanillaTilt.prototype.update = function() {
        if (!this.gyroscope) {
            this.updateElementPosition();
        }

        var values = this.getValues();

        this.updateTilt(values.tiltX, values.tiltY);

        this.updateCall = null;
    };

    // Helper functions
    VanillaTilt.prototype.extendSettings = function(settings) {
        var newSettings = {};

        for (var property in defaultSettings) {
            if (property in settings) {
                newSettings[property] = settings[property];
            } else if (typeof settings[property] !== 'undefined') {
                newSettings[property] = settings[property];
            } else {
                newSettings[property] = defaultSettings[property];
            }
        }

        return newSettings;
    };

    // Static method to initialize VanillaTilt on a collection of elements.
    VanillaTilt.init = function(elements, settings) {
        if (elements instanceof Node) {
            elements = [elements];
        }

        if (elements instanceof NodeList) {
            elements = [].slice.call(elements);
        }

        if (! (elements instanceof Array)) {
            return;
        }

        elements.forEach(function(element) {
            if (!('vanillaTilt' in element)) {
                element.vanillaTilt = new VanillaTilt(element, settings);
            }
        });
    };

    return VanillaTilt;
}());