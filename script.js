// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initNavigation();
    initRegistrationForm();
    initSearchFunctionality();
    initMap();
    initAnimations();
    initModal();
});

// Navigation Toggle
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
}

// Registration Form
function initRegistrationForm() {
    const form = document.getElementById('regForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    let currentStep = 0;
    
    // Show current step
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        
        progressSteps.forEach((progress, index) => {
            progress.classList.toggle('active', index <= stepIndex);
        });
        
        currentStep = stepIndex;
    }
    
    // Next button functionality
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Validate current step before proceeding
            if (validateStep(currentStep)) {
                if (currentStep < steps.length - 1) {
                    showStep(currentStep + 1);
                }
            }
        });
    });
    
    // Previous button functionality
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateStep(currentStep)) {
            // Simulate form submission
            simulateSubmission();
        }
    });
    
    // Step validation
    function validateStep(stepIndex) {
        const currentStepElement = steps[stepIndex];
        const inputs = currentStepElement.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                highlightError(input);
            } else {
                removeErrorHighlight(input);
            }
            
            // Additional validation for specific fields
            if (input.type === 'email' && input.value) {
                if (!isValidEmail(input.value)) {
                    isValid = false;
                    highlightError(input, 'Please enter a valid email address');
                }
            }
            
            if (input.id === 'ownerPhone' && input.value) {
                if (!isValidPhone(input.value)) {
                    isValid = false;
                    highlightError(input, 'Please enter a valid phone number');
                }
            }
        });
        
        return isValid;
    }
    
    function highlightError(input, message = 'This field is required') {
        input.style.borderColor = '#e74c3c';
        
        // Remove existing error message if any
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.style.color = '#e74c3c';
        errorMessage.style.fontSize = '0.8rem';
        errorMessage.style.marginTop = '5px';
        errorMessage.textContent = message;
        input.parentNode.appendChild(errorMessage);
    }
    
    function removeErrorHighlight(input) {
        input.style.borderColor = '#ddd';
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    }
    
    function simulateSubmission() {
        // Show loading state
        const submitButton = form.querySelector('.btn-submit');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            alert('Registration submitted successfully! You will receive a confirmation email shortly.');
            
            // Reset form
            form.reset();
            showStep(0);
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    }
}

// Search Functionality
function initSearchFunctionality() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const searchButtons = document.querySelectorAll('.btn-search');
    const searchResults = document.getElementById('searchResults');
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Search functionality
    searchButtons.forEach(button => {
        button.addEventListener('click', function() {
            const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
            const searchInput = document.getElementById(`${activeTab}Search`).value;
            
            if (!searchInput.trim()) {
                alert('Please enter search criteria');
                return;
            }
            
            performSearch(activeTab, searchInput);
        });
    });
    
    // Allow Enter key to trigger search
    document.querySelectorAll('.tab-content input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
                performSearch(activeTab, this.value);
            }
        });
    });
    
    function performSearch(type, query) {
        // Show loading state
        searchResults.innerHTML = `
            <div class="results-loading">
                <h3>Searching...</h3>
                <p>Please wait while we retrieve the records</p>
            </div>
        `;
        
        // Simulate API call with timeout
        setTimeout(() => {
            displaySearchResults(type, query);
        }, 1500);
    }
    
    function displaySearchResults(type, query) {
        // Sample data for demonstration
        const sampleData = {
            property: {
                id: 'LR-2023-5842',
                type: 'Residential',
                area: '250 sq. meters',
                address: '123 Main Street, Capital City',
                owner: 'John Smith',
                registrationDate: '2023-05-15',
                status: 'Active'
            },
            owner: [
                {
                    id: 'LR-2023-5842',
                    type: 'Residential',
                    area: '250 sq. meters',
                    address: '123 Main Street, Capital City'
                },
                {
                    id: 'LR-2022-3921',
                    type: 'Commercial',
                    area: '500 sq. meters',
                    address: '456 Business Ave, Capital City'
                }
            ],
            location: [
                {
                    id: 'LR-2023-5842',
                    owner: 'John Smith',
                    area: '250 sq. meters',
                    coordinates: '40.7128° N, 74.0060° W'
                },
                {
                    id: 'LR-2021-7534',
                    owner: 'Jane Doe',
                    area: '180 sq. meters',
                    coordinates: '40.7125° N, 74.0055° W'
                }
            ]
        };
        
        let resultsHTML = '';
        
        if (type === 'property') {
            const property = sampleData.property;
            resultsHTML = `
                <div class="property-result">
                    <h3>Property Found</h3>
                    <div class="result-details">
                        <div class="detail-item">
                            <strong>Property ID:</strong> ${property.id}
                        </div>
                        <div class="detail-item">
                            <strong>Type:</strong> ${property.type}
                        </div>
                        <div class="detail-item">
                            <strong>Area:</strong> ${property.area}
                        </div>
                        <div class="detail-item">
                            <strong>Address:</strong> ${property.address}
                        </div>
                        <div class="detail-item">
                            <strong>Owner:</strong> ${property.owner}
                        </div>
                        <div class="detail-item">
                            <strong>Registration Date:</strong> ${property.registrationDate}
                        </div>
                        <div class="detail-item">
                            <strong>Status:</strong> <span class="status-active">${property.status}</span>
                        </div>
                    </div>
                    <button class="btn-view-details" data-id="${property.id}">View Full Details</button>
                </div>
            `;
        } else {
            const results = sampleData[type];
            resultsHTML = `
                <div class="multiple-results">
                    <h3>${results.length} Properties Found</h3>
                    <div class="results-list">
                        ${results.map(property => `
                            <div class="result-item">
                                <h4>${property.id}</h4>
                                <p><strong>Type:</strong> ${property.type}</p>
                                <p><strong>Area:</strong> ${property.area}</p>
                                <p><strong>Address:</strong> ${property.address || property.coordinates}</p>
                                ${property.owner ? `<p><strong>Owner:</strong> ${property.owner}</p>` : ''}
                                <button class="btn-view-details" data-id="${property.id}">View Details</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        searchResults.innerHTML = resultsHTML;
        
        // Add event listeners to view details buttons
        document.querySelectorAll('.btn-view-details').forEach(button => {
            button.addEventListener('click', function() {
                const propertyId = this.getAttribute('data-id');
                showPropertyDetails(propertyId);
            });
        });
    }
    
    function showPropertyDetails(propertyId) {
        // Sample detailed property data
        const propertyDetails = {
            'LR-2023-5842': {
                id: 'LR-2023-5842',
                type: 'Residential',
                area: '250 sq. meters',
                address: '123 Main Street, Capital City',
                coordinates: '40.7128° N, 74.0060° W',
                owner: 'John Smith',
                ownerId: 'NAT-89345621',
                registrationDate: '2023-05-15',
                lastTransfer: '2023-05-15',
                status: 'Active',
                valuation: '$350,000',
                zoning: 'Residential R1',
                restrictions: 'None',
                documents: ['Deed of Ownership', 'Survey Report', 'Tax Certificate']
            }
        };
        
        const property = propertyDetails[propertyId] || propertyDetails['LR-2023-5842'];
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <h2>Property Details: ${property.id}</h2>
            <div class="property-details-grid">
                <div class="detail-section">
                    <h3>Basic Information</h3>
                    <div class="detail-row">
                        <span class="detail-label">Property Type:</span>
                        <span class="detail-value">${property.type}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Area:</span>
                        <span class="detail-value">${property.area}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Address:</span>
                        <span class="detail-value">${property.address}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Coordinates:</span>
                        <span class="detail-value">${property.coordinates}</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Ownership Information</h3>
                    <div class="detail-row">
                        <span class="detail-label">Owner:</span>
                        <span class="detail-value">${property.owner}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Owner ID:</span>
                        <span class="detail-value">${property.ownerId}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Registration Date:</span>
                        <span class="detail-value">${property.registrationDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Last Transfer:</span>
                        <span class="detail-value">${property.lastTransfer}</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Additional Information</h3>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value status-active">${property.status}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Valuation:</span>
                        <span class="detail-value">${property.valuation}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Zoning:</span>
                        <span class="detail-value">${property.zoning}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Restrictions:</span>
                        <span class="detail-value">${property.restrictions}</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Associated Documents</h3>
                    <ul class="documents-list">
                        ${property.documents.map(doc => `<li>${doc}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn-print">Print Certificate</button>
                <button class="btn-download">Download Details</button>
            </div>
        `;
        
        // Show modal
        document.getElementById('resultModal').style.display = 'block';
    }
}

// Map Initialization
function initMap() {
    const propertyMap = document.getElementById('propertyMap');
    
    if (propertyMap) {
        // Initialize map with default coordinates (New York)
        const map = L.map('propertyMap').setView([40.7128, -74.0060], 13);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Add a marker
        const marker = L.marker([40.7128, -74.0060]).addTo(map)
            .bindPopup('Property Location')
            .openPopup();
        
        // Locate me button functionality
        document.getElementById('locateMe').addEventListener('click', function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    map.setView([lat, lng], 15);
                    marker.setLatLng([lat, lng])
                        .bindPopup('Your Current Location')
                        .openPopup();
                }, function(error) {
                    alert('Unable to retrieve your location. Please enter it manually.');
                });
            } else {
                alert('Geolocation is not supported by this browser.');
            }
        });
        
        // Update marker on map click
        map.on('click', function(e) {
            marker.setLatLng(e.latlng)
                .bindPopup('Selected Property Location')
                .openPopup();
        });
    }
}

// Animations
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .about-text, .contact-info, .contact-form').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// Modal Functionality
function initModal() {
    const modal = document.getElementById('resultModal');
    const closeBtn = document.querySelector('.close-modal');
    
    // Close modal when clicking X
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

// Utility function for smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});