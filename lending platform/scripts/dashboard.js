document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            // Redirect to login if not logged in
            window.location.href = 'index.html';
            return;
        }
        
        // Fetch dashboard data
        await fetchDashboardData(user.uid);
        
        // Initialize the chart
        initializeChart();
    });
    
    // Function to fetch dashboard data from Firebase
    async function fetchDashboardData(userId) {
        try {
            // Fetch total donations
            const totalDonationsElement = document.getElementById('totalDonations');
            const totalPledgesElement = document.getElementById('totalPledges');
            const impactValueElement = document.getElementById('impactValue');
            const avgMonthlyElement = document.getElementById('avgMonthly');
            
            // Get user's donations
            const userDonationsSnapshot = await db.collection('users').doc(userId).collection('donations').get();
            let totalDonated = 0;
            
            userDonationsSnapshot.forEach(doc => {
                totalDonated += doc.data().amount || 0;
            });
            
            // Get total donations across platform
            const donationsSnapshot = await db.collection('donations').get();
            let platformTotal = 0;
            
            donationsSnapshot.forEach(doc => {
                platformTotal += doc.data().amount || 0;
            });
            
            // Get pledges
            const pledgesSnapshot = await db.collection('pledges').get();
            let totalPledges = 0;
            
            pledgesSnapshot.forEach(doc => {
                totalPledges += doc.data().amount || 0;
            });
            
            // Calculate impact value (example calculation)
            const impactValue = -109876.33;
            const avgMonthly = -887.12;
            
            // Update UI
            if (totalDonationsElement) totalDonationsElement.textContent = `$${platformTotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
            if (totalPledgesElement) totalPledgesElement.textContent = `$${totalPledges.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
            if (impactValueElement) impactValueElement.textContent = `$${impactValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
            if (avgMonthlyElement) avgMonthlyElement.textContent = `Avg. $${avgMonthly.toFixed(2)} per month`;
            
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    }
    
    // Initialize the chart
    function initializeChart() {
        const ctx = document.getElementById('impactChart');
        if (!ctx) return;
        
        const ctx2d = ctx.getContext('2d');
        
        // Fetch chart data from Firebase
        fetchChartData().then(chartData => {
            // Create gradient for chart
            const gradient = ctx2d.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(138, 43, 226, 0.8)');
            gradient.addColorStop(1, 'rgba(138, 43, 226, 0)');
            
            // Configure and create the chart
            const impactChart = new Chart(ctx2d, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: 'Monthly Impact',
                        data: chartData.data,
                        borderColor: '#8a2be2',
                        backgroundColor: gradient,
                        borderWidth: 3,
                        pointBackgroundColor: '#8a2be2',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#777',
                                callback: function(value) {
                                    return value.toFixed(1);
                                }
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#777'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    return `${context.parsed.y.toFixed(2)}`;
                                }
                            }
                        }
                    },
                    animation: {
                        duration: 2000,
                        easing: 'easeOutQuart'
                    }
                }
            });
            
            // Add animation to the chart
            const animateChart = () => {
                const data = impactChart.data.datasets[0].data;
                impactChart.data.datasets[0].data = Array(data.length).fill(0);
                impactChart.update();
                
                setTimeout(() => {
                    impactChart.data.datasets[0].data = data;
                    impactChart.update();
                }, 500);
            };
            
            // Run chart animation
            animateChart();
            
            // Tab switching functionality
            const tabButtons = document.querySelectorAll('.tab-button');
            tabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remove active class from all tabs
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    // Add active class to clicked tab
                    this.classList.add('active');
                    
                    // Animate the chart when switching tabs
                    animateChart();
                });
            });
        }).catch(error => {
            console.error('Error initializing chart:', error);
        });
    }
    
    // Fetch chart data from Firebase
    async function fetchChartData() {
        try {
            const chartDataSnapshot = await db.collection('chartData').orderBy('month').get();
            
            if (chartDataSnapshot.empty) {
                // Return default data if no data in Firebase
                return {
                    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
                    data: [-0.8, -1.2, -0.9, -1.5, -0.7, -0.5, -1.1, -0.6, -0.9, -1.3]
                };
            }
            
            const labels = [];
            const data = [];
            
            chartDataSnapshot.forEach(doc => {
                const chartPoint = doc.data();
                labels.push(chartPoint.monthLabel || '');
                data.push(chartPoint.value || 0);
            });
            
            return { labels, data };
        } catch (error) {
            console.error('Error fetching chart data:', error);
            // Return default data on error
            return {
                labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
                data: [-0.8, -1.2, -0.9, -1.5, -0.7, -0.5, -1.1, -0.6, -0.9, -1.3]
            };
        }
    }
    
    // Add hover effects to metric cards
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});