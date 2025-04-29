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

const auth = firebase.auth();
const db = firebase.firestore();

// Initialize AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', function() {
  // Initialize animations
  if (typeof AOS !== 'undefined') {
      AOS.init({
          duration: 800,
          easing: 'ease-out',
          once: false
      });
  }

  // Add event listeners to donation amount options
  const amountLabels = document.querySelectorAll('.amount-label');
  if (amountLabels.length > 0) {
      amountLabels.forEach(label => {
          label.addEventListener('click', function() {
              // Add a ripple effect
              const ripple = document.createElement('span');
              ripple.classList.add('ripple-effect');
              this.appendChild(ripple);
              
              // Remove the ripple after animation completes
              setTimeout(() => {
                  ripple.remove();
              }, 600);
          });
      });
  }

  // Add hover effects to cause cards
  const causeCards = document.querySelectorAll('.cause-card');
  if (causeCards.length > 0) {
      causeCards.forEach(card => {
          card.addEventListener('mouseenter', function() {
              this.style.transform = 'translateY(-10px)';
              this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
          });
          
          card.addEventListener('mouseleave', function() {
              this.style.transform = 'translateY(0)';
              this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
          });
      });
  }

  // Animate progress bars on scroll
  const progressBars = document.querySelectorAll('.progress');
  if (progressBars.length > 0) {
      const animateProgress = () => {
          progressBars.forEach(bar => {
              const rect = bar.getBoundingClientRect();
              const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
              
              if (isVisible) {
                  // Get the width from the style attribute
                  const width = bar.style.width;
                  // Reset width to 0 and then animate to the target width
                  bar.style.width = '0';
                  setTimeout(() => {
                      bar.style.width = width;
                  }, 100);
              }
          });
      };
      
      // Run once on load
      animateProgress();
      
      // Run on scroll
      window.addEventListener('scroll', animateProgress);
  }

  // Animate count-up for metric values
  const countUpElements = document.querySelectorAll('.count-up');
  if (countUpElements.length > 0) {
      countUpElements.forEach(element => {
          const target = element.textContent;
          const isNegative = target.includes('-');
          
          // Extract the numeric value
          let numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));
          
          // Start from zero
          element.textContent = isNegative ? '-$0' : '$0';
          
          // Animate to target value
          let current = 0;
          const increment = numericValue / 100;
          const duration = 2000; // 2 seconds
          const interval = duration / 100;
          
          const timer = setInterval(() => {
              current += increment;
              if (current >= numericValue) {
                  clearInterval(timer);
                  element.textContent = target;
              } else {
                  element.textContent = isNegative 
                      ? `-$${current.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` 
                      : `$${current.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
              }
          }, interval);
      });
  }

  // Add pulse animation to CTA buttons
  const ctaButtons = document.querySelectorAll('.cta-button, .donate-button');
  if (ctaButtons.length > 0) {
      ctaButtons.forEach(button => {
          button.addEventListener('mouseover', function() {
              this.classList.add('animate-pulse');
          });
          
          button.addEventListener('mouseout', function() {
              this.classList.remove('animate-pulse');
          });
      });
  }

  // Add a parallax effect to the hero section
  const heroImage = document.querySelector('.hero-image');
  if (heroImage) {
      window.addEventListener('scroll', function() {
          const scrollPosition = window.scrollY;
          heroImage.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
      });
  }

  // Add a typing animation to the section title
  const sectionTitle = document.querySelector('.section-title');
  if (sectionTitle) {
      const text = sectionTitle.textContent;
      sectionTitle.textContent = '';
      
      let i = 0;
      const typeWriter = () => {
          if (i < text.length) {
              sectionTitle.textContent += text.charAt(i);
              i++;
              setTimeout(typeWriter, 100);
          }
      };
      
      // Start typing animation when the element is in view
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  typeWriter();
                  observer.unobserve(entry.target);
              }
          });
      });
      
      observer.observe(sectionTitle);
  }

  // Modal functionality
  const modal = document.getElementById('loginModal');
  const loginBtn = document.getElementById('loginBtn');
  const closeBtn = document.querySelector('.close');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const signupLink = document.getElementById('signupLink');
  const loginLink = document.getElementById('loginLink');

  if (loginBtn && modal) {
      loginBtn.addEventListener('click', function(e) {
          if (this.textContent === 'Login') {
              e.preventDefault();
              modal.style.display = 'block';
          }
      });
  }

  if (closeBtn && modal) {
      closeBtn.addEventListener('click', function() {
          modal.style.display = 'none';
      });
  }

  window.addEventListener('click', function(e) {
      if (e.target === modal) {
          modal.style.display = 'none';
      }
  });

  if (signupLink && loginLink) {
      signupLink.addEventListener('click', function(e) {
          e.preventDefault();
          loginForm.style.display = 'none';
          signupForm.style.display = 'block';
      });

      loginLink.addEventListener('click', function(e) {
          e.preventDefault();
          signupForm.style.display = 'none';
          loginForm.style.display = 'block';
      });
  }

  // Firebase Authentication
  if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          
          // Sign in with Firebase
          auth.signInWithEmailAndPassword(email, password)
              .then((userCredential) => {
                  // Signed in
                  const user = userCredential.user;
                  console.log('User signed in:', user.email);
                  modal.style.display = 'none';
                  
                  // Redirect to dashboard
                  window.location.href = 'dashboard.html';
              })
              .catch((error) => {
                  console.error('Error signing in:', error.message);
                  alert('Login failed: ' + error.message);
              });
      });
  }

  if (signupForm) {
      signupForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const name = document.getElementById('signupName').value;
          const email = document.getElementById('signupEmail').value;
          const password = document.getElementById('signupPassword').value;
          
          // Create user with Firebase
          auth.createUserWithEmailAndPassword(email, password)
              .then((userCredential) => {
                  // Signed up
                  const user = userCredential.user;
                  console.log('User created:', user.email);
                  
                  // Add user to Firestore
                  return db.collection('users').doc(user.uid).set({
                      name: name,
                      email: email,
                      createdAt: firebase.firestore.FieldValue.serverTimestamp()
                  });
              })
              .then(() => {
                  modal.style.display = 'none';
                  alert('Account created successfully!');
                  
                  // Redirect to dashboard
                  window.location.href = 'dashboard.html';
              })
              .catch((error) => {
                  console.error('Error signing up:', error.message);
                  alert('Signup failed: ' + error.message);
              });
      });
  }

  // Fetch featured causes from Firebase
  const fetchFeaturedCauses = async () => {
      try {
          const causesSnapshot = await db.collection('causes').get();
          const causeCards = document.querySelectorAll('.cause-card');
          
          if (causesSnapshot.empty || causeCards.length === 0) {
              return;
          }
          
          let index = 0;
          causesSnapshot.forEach(doc => {
              if (index < causeCards.length) {
                  const causeData = doc.data();
                  const card = causeCards[index];
                  
                  // Update card content with data from Firebase
                  const titleElement = card.querySelector('h3');
                  const descElement = card.querySelector('p');
                  const progressElement = card.querySelector('.progress');
                  
                  if (titleElement) titleElement.textContent = causeData.title || titleElement.textContent;
                  if (descElement) descElement.textContent = causeData.description || descElement.textContent;
                  if (progressElement) progressElement.style.width = `${causeData.progress || 0}%`;
                  
                  index++;
              }
          });
      } catch (error) {
          console.error('Error fetching causes:', error);
      }
  };
  
  // Call the function to fetch causes
  fetchFeaturedCauses();
});

// Add a parallax effect to the hero section
window.addEventListener('scroll', function() {
  const heroImage = document.querySelector('.hero-image');
  if (heroImage) {
      const scrollPosition = window.scrollY;
      heroImage.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
  }
});

// Add a typing animation to the section title
document.addEventListener('DOMContentLoaded', function() {
  const sectionTitle = document.querySelector('.section-title');
  if (sectionTitle) {
      const text = sectionTitle.textContent;
      sectionTitle.textContent = '';
      
      let i = 0;
      const typeWriter = () => {
          if (i < text.length) {
              sectionTitle.textContent += text.charAt(i);
              i++;
              setTimeout(typeWriter, 100);
          }
      };
      
      // Start typing animation when the element is in view
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  typeWriter();
                  observer.unobserve(entry.target);
              }
          });
      });
      
      observer.observe(sectionTitle);
  }
});