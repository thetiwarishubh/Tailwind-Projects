/**
 * Enhanced Safari Booking System
 * Professional Safari Booking Application with Full Responsive Design
 * 
 * Features:
 * - Real-time form validation with proper error handling
 * - Responsive passenger management (desktop table + mobile cards)
 * - Professional payment modal with multiple payment methods
 * - Booking confirmation with generated booking ID
 * - Loading animations and smooth UI transitions
 * - Accessibility support and professional UX
 * 
 * @version 1.2.0
 * @author Ranthambore 360 Development Team
 */

// ============================================================
// CONFIGURATION & CONSTANTS
// ============================================================
const CONFIG = {
  MAX_PASSENGERS: 6,
  REDIRECT_DELAY: 1500,
  LOADING_DELAY: 1000,
  NOTIFICATION_DURATION: 5000,
  DEBUG: false // Set to false for production
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Email validation utility
 * @param {string} email 
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Phone number validation utility (Indian format)
 * @param {string} phone 
 * @returns {boolean}
 */
function isValidPhone(phone) {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
}

/**
 * Debug logging utility
 * @param {string} message 
 * @param {any} data 
 */
function debugLog(message, data = null) {
  if (CONFIG.DEBUG) {
    console.log(`[Safari Booking] ${message}`, data || '');
  }
}

/**
 * Sanitize input to prevent XSS
 * @param {string} input 
 * @returns {string}
 */
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// ============================================================
// MAIN APPLICATION
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
  try {
    // Determine which page is loaded
    const isFormPage =
      window.location.pathname.includes("safari.html") ||
      window.location.pathname === "/" ||
      !window.location.pathname.includes("create-safari-booking.html");
    const isBookingPage = window.location.pathname.includes(
      "create-safari-booking.html"
    );

    // Form submission logic for safari.html
    if (isFormPage) {
      const calendarEl = document.getElementById("calendar");
      if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: "dayGridMonth",
        });
        calendar.render();
      }

      const form = document.getElementById("form");
      if (!form) {
        console.error("Form element with id 'form' not found.");
        showNotification("Form not found on this page.", "error");
        return;
      }

      form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent default form submission

        // Get input values
        const userFullName = document.getElementById("name")?.value;
        const userEmail = document.getElementById("email")?.value;
        const userNumber = document.getElementById("mobile")?.value;
        const userTiming = document.getElementById("timing")?.value;
        const safari = document.getElementById("safari")?.value;
        const zone = document.getElementById("zone")?.value;

        // Enhanced input validation
        const validationErrors = [];
        
        if (!userFullName?.trim()) {
          validationErrors.push("Please enter your full name");
        }
        
        if (!userEmail?.trim()) {
          validationErrors.push("Please enter your email address");
        } else if (!isValidEmail(userEmail)) {
          validationErrors.push("Please enter a valid email address");
        }
        
        if (!userNumber?.trim()) {
          validationErrors.push("Please enter your mobile number");
        } else if (!isValidPhone(userNumber)) {
          validationErrors.push("Please enter a valid 10-digit mobile number");
        }
        
        if (!userTiming) {
          validationErrors.push("Please select safari timing");
        }
        
        if (!safari) {
          validationErrors.push("Please select safari type");
        }
        
        if (!zone) {
          validationErrors.push("Please select safari zone");
        }
        
        // Show validation errors
        if (validationErrors.length > 0) {
          showNotification(validationErrors[0], "error");
          debugLog("Form validation failed", validationErrors);
          return;
        }
        
        // Sanitize inputs before storing
        const sanitizedData = {
          userFullName: sanitizeInput(userFullName.trim()),
          userEmail: sanitizeInput(userEmail.trim().toLowerCase()),
          userNumber: sanitizeInput(userNumber.replace(/\s+/g, '')),
          userTiming: sanitizeInput(userTiming),
          safari: sanitizeInput(safari),
          zone: sanitizeInput(zone)
        };
        
        debugLog("Form submission data", sanitizedData);

        // Store sanitized values in localStorage
        localStorage.setItem("username", sanitizedData.userFullName);
        localStorage.setItem("email", sanitizedData.userEmail);
        localStorage.setItem("number", sanitizedData.userNumber);
        localStorage.setItem("timing", sanitizedData.userTiming);
        localStorage.setItem("safari", sanitizedData.safari);
        localStorage.setItem("zone", sanitizedData.zone);
        
        debugLog("Form data stored successfully", {
          itemsStored: Object.keys(sanitizedData).length,
          timestamp: new Date().toISOString()
        });

        // Show success notification
        showNotification("Form submitted successfully! Redirecting to booking page...");

        // Redirect to the second page with a slight delay
        setTimeout(() => {
          try {
            window.location.href = "create-safari-booking.html";
            console.log("Redirecting to create-safari-booking.html");
          } catch (redirectError) {
            console.error("Redirect failed:", redirectError);
            showNotification("Failed to redirect to the booking page.", "error");
          }
        }, 1000);
      });
    }

    // Data display logic for create-safari-booking.html
    if (isBookingPage) {
      // Initialize passenger counter
      window.passengerCount = 1;
      
      // Show notification system
      createNotificationContainer();
      
      // Initialize payment modal
      createPaymentModal();
      
      // Add loading state to the page
      addLoadingState();
      
      // Retrieve data from localStorage with animation delay
      setTimeout(() => {
        const username = localStorage.getItem("username");
        const email = localStorage.getItem("email");
        const number = localStorage.getItem("number");
        const timing = localStorage.getItem("timing");
        const safari = localStorage.getItem("safari");
        const zone = localStorage.getItem("zone");

        // Log retrieved values (for debugging)
        debugLog("Retrieved from localStorage:", {
          username, email, number, timing, safari, zone
        });

        // Get DOM elements and update with animated data loading
        const displayName = document.querySelector(".display-name");
        const displayEmail = document.querySelector(".display-email");
        const displayMobile = document.querySelector(".display-mobile");
        const displaySafari = document.querySelector(".display-safari");
        const displayZone = document.querySelector(".display-zone");
        const displayTiming = document.querySelector(".display-timing");

        // Update DOM with animated data loading
        animateDataLoad(displayName, username);
        animateDataLoad(displayEmail, email);
        animateDataLoad(displayMobile, number);
        animateDataLoad(displaySafari, safari);
        animateDataLoad(displayZone, zone);
        animateDataLoad(displayTiming, timing);
        
        // Remove loading state
        removeLoadingState();
      }, CONFIG.LOADING_DELAY);
      
      // Setup advanced passenger management with enhanced features
      setupPassengerManagement();
      
      // Initialize advanced form validation
      initializeFormValidation();
      
      // Setup enhanced payment system with modal
      setupEnhancedPaymentSystem();
    }
  } catch (error) {
    console.error("Error in script execution:", error);
    // Create a basic notification if showNotification is not available
    try {
      showNotification("An error occurred. Please check the console for details.", "error");
    } catch (notificationError) {
      console.error("Notification error:", notificationError);
      // Fallback notification
      alert("An error occurred. Please check the console for details.");
    }
  }
});

// Create notification container if it doesn't exist
function createNotificationContainer() {
  if (!document.querySelector('.notification-container')) {
    const container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
  }
}

// Show notification function
function showNotification(message, type = 'success') {
  createNotificationContainer();
  
  const container = document.querySelector('.notification-container');
  const notification = document.createElement('div');
  
  notification.className = `notification p-4 rounded-lg shadow-lg flex items-center justify-between ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  } text-white`;
  
  notification.innerHTML = `
    <div class="flex items-center">
      <span class="mr-2">${type === 'success' ? '✓' : '✗'}</span>
      <span>${message}</span>
    </div>
    <button class="ml-4 focus:outline-none hover:text-gray-200">×</button>
  `;
  
  container.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Dismiss notification
  notification.querySelector('button').addEventListener('click', () => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  // Auto dismiss
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, CONFIG.NOTIFICATION_DURATION);
}

// ============================================================
// ESSENTIAL BOOKING PAGE FUNCTIONS
// ============================================================

// Setup passenger management system
function setupPassengerManagement() {
  const addMemberBtn = document.getElementById('add-member-btn');
  if (!addMemberBtn) return;
  
  // Add click event to add new passengers
  addMemberBtn.addEventListener('click', function() {
    addPassenger();
  });
}

// Add new passenger
function addPassenger() {
  if (window.passengerCount >= CONFIG.MAX_PASSENGERS) {
    showNotification('Maximum 6 passengers allowed per booking.', 'error');
    return;
  }
  
  window.passengerCount++;
  
  // Add to desktop table
  addDesktopPassenger();
  
  // Add to mobile container if exists
  addMobilePassenger();
  
  showNotification(`Passenger ${window.passengerCount} added successfully.`);
  
  // Disable add button if max reached
  const addBtn = document.getElementById('add-member-btn');
  if (window.passengerCount >= CONFIG.MAX_PASSENGERS && addBtn) {
    addBtn.disabled = true;
    addBtn.classList.add('opacity-50', 'cursor-not-allowed');
  }
}

// Add desktop passenger row
function addDesktopPassenger() {
  const tableBody = document.getElementById('passengerTableBody');
  if (!tableBody) return;
  
  const newRow = document.createElement('tr');
  newRow.className = 'passenger-row';
  
  newRow.innerHTML = `
    <td class="border border-gray-300 p-2 text-center">
      <span class="inline-block px-3 py-1 rounded-full bg-[#604019] text-white font-bold text-sm">${window.passengerCount}</span>
    </td>
    <td class="border border-gray-300 p-2">
      <input type="text" class="w-full p-2 border border-gray-300 rounded" placeholder="Enter name" required>
    </td>
    <td class="border border-gray-300 p-2">
      <input type="number" class="w-full p-2 border border-gray-300 rounded" placeholder="Age" min="1" max="120" required>
    </td>
    <td class="border border-gray-300 p-2">
      <select class="w-full p-2 border border-gray-300 rounded" required>
        <option value="">Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </td>
    <td class="border border-gray-300 p-2">
      <select class="w-full p-2 border border-gray-300 rounded" required>
        <option value="">Nationality</option>
        <option value="indian">Indian</option>
        <option value="foreigner">Foreigner</option>
      </select>
    </td>
    <td class="border border-gray-300 p-2">
      <select class="w-full p-2 border border-gray-300 rounded" required>
        <option value="">State</option>
        <option value="rajasthan">Rajasthan</option>
        <option value="delhi">Delhi</option>
        <option value="mumbai">Mumbai</option>
        <option value="gujarat">Gujarat</option>
        <option value="other">Other</option>
      </select>
    </td>
    <td class="border border-gray-300 p-2">
      <select class="w-full p-2 border border-gray-300 rounded" required>
        <option value="">Select ID</option>
        <option value="aadhar">Aadhar</option>
        <option value="passport">Passport</option>
        <option value="dl">Driver's License</option>
        <option value="voter">Voter ID</option>
      </select>
    </td>
    <td class="border border-gray-300 p-2">
      <input type="text" class="w-full p-2 border border-gray-300 rounded" placeholder="ID Number" required>
    </td>
    <td class="border border-gray-300 p-2 text-center">
      <button class="delete-btn px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors" onclick="removePassenger(this)">
        ✕
      </button>
    </td>
  `;
  
  tableBody.appendChild(newRow);
}

// Add mobile passenger card
function addMobilePassenger() {
  const mobileContainer = document.getElementById('mobilePassengerContainer');
  if (!mobileContainer) return;
  
  const newCard = document.createElement('div');
  newCard.className = 'passenger-card bg-white border-2 border-gray-200 rounded-lg p-4 mb-4 shadow-sm';
  
  newCard.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <span class="inline-block px-3 py-1 rounded-full bg-[#604019] text-white font-bold text-sm">Passenger ${window.passengerCount}</span>
      <button class="delete-btn-mobile px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors" onclick="removePassenger(this)">
        ✕
      </button>
    </div>
    
    <div class="space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input type="text" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Enter passenger name" required>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input type="number" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Age" min="1" max="120" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select class="w-full p-3 border border-gray-300 rounded-lg" required>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
          <select class="w-full p-3 border border-gray-300 rounded-lg" required>
            <option value="">Select</option>
            <option value="indian">Indian</option>
            <option value="foreigner">Foreigner</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">State</label>
          <select class="w-full p-3 border border-gray-300 rounded-lg" required>
            <option value="">Select</option>
            <option value="rajasthan">Rajasthan</option>
            <option value="delhi">Delhi</option>
            <option value="mumbai">Mumbai</option>
            <option value="gujarat">Gujarat</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
          <select class="w-full p-3 border border-gray-300 rounded-lg" required>
            <option value="">Select ID</option>
            <option value="aadhar">Aadhar Card</option>
            <option value="passport">Passport</option>
            <option value="dl">Driving License</option>
            <option value="voter">Voter ID</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
          <input type="text" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Enter ID number" required>
        </div>
      </div>
    </div>
  `;
  
  mobileContainer.appendChild(newCard);
}

// Remove passenger function
function removePassenger(button) {
  const row = button.closest('tr') || button.closest('.passenger-card');
  if (!row) return;
  
  row.remove();
  window.passengerCount--;
  
  // Reindex passengers
  reindexPassengers();
  
  // Re-enable add button if needed
  const addBtn = document.getElementById('add-member-btn');
  if (window.passengerCount < CONFIG.MAX_PASSENGERS && addBtn) {
    addBtn.disabled = false;
    addBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }
  
  showNotification('Passenger removed successfully.');
}

// Reindex passengers after removal
function reindexPassengers() {
  // Reindex desktop table
  const desktopRows = document.querySelectorAll('#passengerTableBody tr');
  desktopRows.forEach((row, index) => {
    const numberSpan = row.querySelector('span');
    if (numberSpan) {
      numberSpan.textContent = index + 1;
    }
  });
  
  // Reindex mobile cards
  const mobileCards = document.querySelectorAll('#mobilePassengerContainer .passenger-card');
  mobileCards.forEach((card, index) => {
    const numberSpan = card.querySelector('span');
    if (numberSpan) {
      numberSpan.textContent = `Passenger ${index + 1}`;
    }
  });
}

// Setup form validation
function setupFormValidation() {
  const stateSelect = document.querySelector('select[placeholder="State"]');
  const addressInput = document.querySelector('textarea[placeholder="Full Address"]');
  const termsCheckbox = document.querySelector('input[type="checkbox"]');
  
  // Basic validation setup
  if (stateSelect) {
    stateSelect.addEventListener('change', validateForm);
  }
  
  if (addressInput) {
    addressInput.addEventListener('input', validateForm);
  }
  
  if (termsCheckbox) {
    termsCheckbox.addEventListener('change', validateForm);
  }
}

// Enhanced validate form using advanced validation functions
function validateForm() {
  const stateSelect = document.querySelector('select[placeholder="State"]');
  const addressInput = document.querySelector('textarea[placeholder="Full Address"]');
  const termsCheckbox = document.querySelector('input[type="checkbox"]');
  
  let payButton = null;
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    if (btn.textContent && btn.textContent.includes('Pay Now')) {
      payButton = btn;
    }
  });
  
  let isValid = true;
  
  // Use advanced validation functions
  if (stateSelect && !validateSelect(stateSelect)) isValid = false;
  if (addressInput && !validateTextarea(addressInput)) isValid = false;
  
  // Validate passenger info using advanced function
  const passengerValid = validatePassengers();
  if (!passengerValid.valid) isValid = false;
  
  // Check terms
  if (termsCheckbox && !termsCheckbox.checked) isValid = false;
  
  // Enable/disable pay button with advanced styling
  if (payButton) {
    if (isValid) {
      payButton.disabled = false;
      payButton.classList.remove('opacity-50', 'cursor-not-allowed');
      payButton.classList.add('btn-primary');
    } else {
      payButton.disabled = true;
      payButton.classList.add('opacity-50', 'cursor-not-allowed');
      payButton.classList.remove('btn-primary');
    }
  }
  
  return isValid;
}

// Setup enhanced payment system with direct booking confirmation
function setupEnhancedPaymentSystem() {
  let payButton = null;
  const termsCheckbox = document.querySelector('input[type="checkbox"]');
  
  // Find pay button by text content
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    if (btn.textContent && btn.textContent.includes('Pay Now')) {
      payButton = btn;
    }
  });
  
  if (payButton && termsCheckbox) {
    // Disable pay button initially
    payButton.disabled = true;
    payButton.classList.add('opacity-50', 'cursor-not-allowed');
    
    // Add btn-primary class for styling
    payButton.classList.add('btn-primary');
    
    // Add validation event to checkbox
    termsCheckbox.addEventListener('change', function() {
      validateForm();
    });
    
    // Add click event to pay button - Direct booking confirmation
    payButton.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Validate form before proceeding
      if (validateForm()) {
        // Show processing state
        const originalText = payButton.textContent;
        payButton.textContent = 'Processing Payment...';
        payButton.disabled = true;
        
        // Show processing notification
        showNotification('Processing your booking...', 'success');
        
        // Process payment and show booking confirmation after delay
        setTimeout(() => {
          // Reset button (in case needed)
          payButton.textContent = originalText;
          payButton.disabled = false;
          
          // Show booking confirmation directly
          showDirectBookingConfirmation();
        }, 2000);
      } else {
        showNotification('Please fill all required fields and agree to the terms and conditions.', 'error');
      }
    });
  }
}

// Keep original simple payment system as backup
function setupPaymentSystem() {
  let payButton = null;
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    if (btn.textContent && btn.textContent.includes('Pay Now')) {
      payButton = btn;
    }
  });
  
  if (payButton) {
    // Disable pay button initially
    payButton.disabled = true;
    payButton.classList.add('opacity-50', 'cursor-not-allowed');
    
    // Add click event to pay button
    payButton.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (validateForm()) {
        // Simple payment confirmation
        if (confirm('Confirm payment of ₹5000?')) {
          showNotification('Payment successful! Thank you for booking with us.');
          // Here you can redirect to confirmation page or show success modal
          setTimeout(() => {
            alert('Booking confirmed! Your booking ID is: RTB' + Date.now().toString().slice(-6));
          }, 1000);
        }
      } else {
        showNotification('Please fill all required fields and agree to the terms and conditions.', 'error');
      }
    });
  }
}

// Add loading state to the page
function addLoadingState() {
  // Add skeleton loading to all display elements
  const displayElements = document.querySelectorAll('.display-name, .display-email, .display-mobile, .display-safari, .display-zone, .display-timing');
  displayElements.forEach(element => {
    element.classList.add('skeleton');
    element.style.height = '20px';
    element.style.width = '100%';
    element.style.borderRadius = '4px';
    element.textContent = '';
  });
}

// Remove loading state
function removeLoadingState() {
  const skeletons = document.querySelectorAll('.skeleton');
  skeletons.forEach(skeleton => {
    skeleton.classList.remove('skeleton');
  });
}

// Animate data loading
function animateDataLoad(element, value) {
  if (!element) return;
  
  // Remove skeleton class
  element.classList.remove('skeleton');
  
  // Add content with animation
  element.textContent = value || "N/A";
  element.classList.add('animate__animated', 'animate__fadeIn');
  
  // Add highlight effect
  setTimeout(() => {
    element.style.backgroundColor = '#fef3c7';
    setTimeout(() => {
      element.style.transition = 'background-color 1s ease';
      element.style.backgroundColor = 'transparent';
    }, 500);
  }, 300);
}

// Initialize form validation
function initializeFormValidation() {
  // Get form elements
  const stateSelect = document.querySelector('select[placeholder="State"]');
  const addressInput = document.querySelector('textarea[placeholder="Full Address"]');
  const termsCheckbox = document.querySelector('input[type="checkbox"]');
  // Find pay button by checking text content
  let payButton = null;
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    if (btn.textContent && btn.textContent.includes('Pay Now')) {
      payButton = btn;
    }
  });

  if (stateSelect) {
    stateSelect.classList.add('form-field');
    stateSelect.addEventListener('change', function() {
      validateSelect(this);
    });
  }

  if (addressInput) {
    addressInput.classList.add('form-field');
    addressInput.addEventListener('input', function() {
      validateTextarea(this);
    });
  }
  
  if (termsCheckbox) {
    termsCheckbox.addEventListener('change', function() {
      if (this.checked) {
        this.classList.remove('border-red-500');
        showNotification('Thank you for agreeing to our terms and conditions');
      } else {
        this.classList.add('border-red-500');
      }
      validateForm();
    });
  }
}

// Validate select dropdown
function validateSelect(select) {
  if (!select.value) {
    select.classList.remove('valid');
    select.classList.add('invalid');
    return false;
  } else {
    select.classList.remove('invalid');
    select.classList.add('valid');
    return true;
  }
}

// Validate textarea
function validateTextarea(textarea) {
  if (!textarea.value.trim() || textarea.value.length < 10) {
    textarea.classList.remove('valid');
    textarea.classList.add('invalid');
    return false;
  } else {
    textarea.classList.remove('invalid');
    textarea.classList.add('valid');
    return true;
  }
}

// Validate the entire form
function validateForm() {
  const stateSelect = document.querySelector('select[placeholder="State"]');
  const addressInput = document.querySelector('textarea[placeholder="Full Address"]');
  const termsCheckbox = document.querySelector('input[type="checkbox"]');
  
  // Find pay button by text content
  let payButton = null;
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    if (btn.textContent && btn.textContent.includes('Pay Now')) {
      payButton = btn;
    }
  });
  
  let isValid = true;
  
  if (stateSelect && !validateSelect(stateSelect)) isValid = false;
  if (addressInput && !validateTextarea(addressInput)) isValid = false;
  
  // Validate passenger info
  const passengerValid = validatePassengers();
  if (!passengerValid.valid) isValid = false;
  
  // Check terms
  if (termsCheckbox && !termsCheckbox.checked) isValid = false;
  
  // Enable/disable pay button
  if (payButton) {
    if (isValid) {
      payButton.disabled = false;
      payButton.classList.add('btn-primary');
    } else {
      payButton.disabled = true;
      payButton.classList.remove('btn-primary');
    }
  }
  
  return isValid;
}

// Validate passenger details
function validatePassengers() {
  const rows = document.querySelectorAll('#passengerTableBody tr');
  
  if (rows.length === 0) {
    return { valid: false, message: 'Please add at least one passenger' };
  }
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const name = row.querySelector('input[placeholder="Enter name"]');
    const age = row.querySelector('input[placeholder="Age"]');
    const gender = row.querySelector('select:nth-of-type(1)');
    
    if (name && !name.value.trim()) {
      name.classList.add('invalid');
      return { valid: false, message: `Passenger ${i+1}: Please enter name` };
    } else if (name) {
      name.classList.remove('invalid');
    }
    
    if (age && (!age.value || age.value < 1 || age.value > 120)) {
      age.classList.add('invalid');
      return { valid: false, message: `Passenger ${i+1}: Please enter valid age` };
    } else if (age) {
      age.classList.remove('invalid');
    }
    
    if (gender && !gender.value) {
      gender.classList.add('invalid');
      return { valid: false, message: `Passenger ${i+1}: Please select gender` };
    } else if (gender) {
      gender.classList.remove('invalid');
    }
  }
  
  return { valid: true };
}

// Setup passenger management system
function setupPassengerManagement() {
  const addMemberBtn = document.getElementById('add-member-btn');
  const desktopTableBody = document.getElementById('passengerTableBody');
  const mobileContainer = document.getElementById('mobilePassengerContainer');
  
  if (!addMemberBtn) return;
  
  // Setup existing desktop row
  if (desktopTableBody) {
    const existingDesktopRow = desktopTableBody.querySelector('tr');
    if (existingDesktopRow) {
      setupDesktopRowEvents(existingDesktopRow);
    }
  }
  
  // Setup existing mobile card
  if (mobileContainer) {
    const existingMobileCard = mobileContainer.querySelector('.passenger-card');
    if (existingMobileCard) {
      setupMobileCardEvents(existingMobileCard);
    }
  }
  
  // Add click event to add new passengers
  addMemberBtn.addEventListener('click', function() {
    addPassenger();
  });
  
  // Add passenger row function
  function addPassengerRow() {
    window.passengerCount++;
    
    const newRow = document.createElement('tr');
    newRow.className = 'passenger-row animate__animated animate__fadeIn';
    
    newRow.innerHTML = `
      <td class="p-1" data-label="No.">
        <p class="w-full px-3 py-1 rounded-[10px] bg-[#604019] font-bold text-[#fff]">
          ${window.passengerCount}.
        </p>
      </td>
      <td class="p-1" data-label="Name">
        <input type="text" class="w-full p-1 border border-gray-300 rounded form-field" placeholder="Enter name">
      </td>
      <td class="p-1" data-label="Age">
        <input type="number" class="w-full p-1 border border-gray-300 rounded form-field" placeholder="Age">
      </td>
      <td class="p-1" data-label="Gender">
        <select class="w-full p-1 border border-gray-300 rounded form-field">
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </td>
      <td class="p-1" data-label="Nationality">
        <select class="w-full p-1 border border-gray-300 rounded form-field">
          <option value="">Nationality</option>
          <option value="indian">Indian</option>
          <option value="foreigner">Foreigner</option>
        </select>
      </td>
      <td class="p-1" data-label="State">
        <select class="w-full p-1 border border-gray-300 rounded form-field">
          <option value="">State</option>
          <option value="andhra-pradesh">Andhra Pradesh</option>
          <option value="arunachal-pradesh">Arunachal Pradesh</option>
          <option value="assam">Assam</option>
          <option value="bihar">Bihar</option>
          <option value="chhattisgarh">Chhattisgarh</option>
          <option value="goa">Goa</option>
          <option value="gujarat">Gujarat</option>
          <option value="haryana">Haryana</option>
          <option value="himachal-pradesh">Himachal Pradesh</option>
          <option value="jharkhand">Jharkhand</option>
          <option value="karnataka">Karnataka</option>
          <option value="kerala">Kerala</option>
          <option value="madhya-pradesh">Madhya Pradesh</option>
          <option value="maharashtra">Maharashtra</option>
          <option value="manipur">Manipur</option>
          <option value="meghalaya">Meghalaya</option>
          <option value="mizoram">Mizoram</option>
          <option value="nagaland">Nagaland</option>
          <option value="odisha">Odisha</option>
          <option value="punjab">Punjab</option>
          <option value="rajasthan">Rajasthan</option>
          <option value="sikkim">Sikkim</option>
          <option value="tamil-nadu">Tamil Nadu</option>
          <option value="telangana">Telangana</option>
          <option value="tripura">Tripura</option>
          <option value="uttar-pradesh">Uttar Pradesh</option>
          <option value="uttarakhand">Uttarakhand</option>
          <option value="west-bengal">West Bengal</option>
          <option value="delhi">Delhi</option>
        </select>
      </td>
      <td class="p-1" data-label="ID Type">
        <select class="w-full p-1 border border-gray-300 rounded form-field">
          <option value="">Select ID</option>
          <option value="aadhar">Aadhar</option>
          <option value="passport">Passport</option>
          <option value="dl">Driver's License</option>
          <option value="pan-card">Pan card</option>
          <option value="voter">Voter ID</option>
          <option value="other">Any Other ID</option>
        </select>
      </td>
      <td class="p-1" data-label="ID Number">
        <input type="text" class="w-full p-1 border border-gray-300 rounded form-field" placeholder="ID Number">
      </td>
      <td class="p-1" data-label="Action">
        <button class="delete-btn w-full px-6 py-1 border border-gray-300 rounded cursor-pointer bg-[#FF0000] text-white hover:bg-red-700 transition-colors">X</button>
      </td>
    `;
    
    tableBody.appendChild(newRow);
    
    // Add validation events to all form fields
    const formFields = newRow.querySelectorAll('.form-field');
    formFields.forEach(field => {
      if (field.tagName === 'SELECT') {
        field.addEventListener('change', function() {
          validateSelect(this);
          validateForm();
        });
      } else {
        field.addEventListener('input', function() {
          if (this.type === 'number') {
            if (this.value < 1 || this.value > 120) {
              this.classList.add('invalid');
            } else {
              this.classList.remove('invalid');
              this.classList.add('valid');
            }
          } else {
            if (!this.value.trim()) {
              this.classList.add('invalid');
            } else {
              this.classList.remove('invalid');
              this.classList.add('valid');
            }
          }
          validateForm();
        });
      }
    });
    
    // Setup delete button
    const deleteBtn = newRow.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function() {
      removePassengerRow(newRow);
    });
    
    showNotification(`Passenger ${window.passengerCount} added successfully.`);
    
    // Disable add button if max reached
    if (window.passengerCount >= 6) {
      addMemberBtn.disabled = true;
      addMemberBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
    
    // Validate form after adding
    validateForm();
  }
  
  // Remove passenger row
  function removePassengerRow(row) {
    row.classList.add('animate__fadeOut');
    
    setTimeout(() => {
      row.remove();
      window.passengerCount--;
      
      // Re-enable add button if needed
      if (window.passengerCount < 6 && addMemberBtn) {
        addMemberBtn.disabled = false;
        addMemberBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      }
      
      // Reindex rows
      const rows = tableBody.querySelectorAll('.passenger-row');
      rows.forEach((row, index) => {
        const indexEl = row.querySelector('p');
        if (indexEl) {
          indexEl.textContent = `${index + 1}.`;
        }
      });
      
      showNotification('Passenger removed successfully.');
      
      // Validate form after removing
      validateForm();
    }, 500);
  }
  
  // Add data labels to existing row for responsive display
  function addDataLabelsToRow(row) {
    const cells = row.querySelectorAll('td');
    
    // Add data-label attributes based on the column
    if (cells.length >= 9) {
      cells[0].setAttribute('data-label', 'No.');
      cells[1].setAttribute('data-label', 'Name');
      cells[2].setAttribute('data-label', 'Age');
      cells[3].setAttribute('data-label', 'Gender');
      cells[4].setAttribute('data-label', 'Nationality');
      cells[5].setAttribute('data-label', 'State');
      cells[6].setAttribute('data-label', 'ID Type');
      cells[7].setAttribute('data-label', 'ID Number');
      cells[8].setAttribute('data-label', 'Action');
    }
  }
}

// Create payment modal
function createPaymentModal() {
  if (!document.getElementById('payment-modal')) {
    const modal = document.createElement('div');
    modal.id = 'payment-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 hidden modal';
    modal.innerHTML = `
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 modal-content">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-900">Complete Your Payment</h2>
            <button id="close-modal" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="mb-6">
            <p class="text-gray-700 mb-2">Total Amount: <span class="font-bold text-amber-700">₹5000</span></p>
            <p class="text-sm text-gray-500">Includes safari permit, vehicle, guide, and service charges</p>
          </div>
          
          <div class="mb-6">
            <h4 class="font-medium text-gray-900 mb-2">Select Payment Method</h4>
            <div class="grid grid-cols-3 gap-2">
              <button class="payment-method-btn flex flex-col items-center justify-center p-3 border rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500">
                <svg class="h-8 w-8 mb-1 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                <span class="text-xs">Credit Card</span>
              </button>
              <button class="payment-method-btn flex flex-col items-center justify-center p-3 border rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500">
                <svg class="h-8 w-8 mb-1 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                <span class="text-xs">Debit Card</span>
              </button>
              <button class="payment-method-btn flex flex-col items-center justify-center p-3 border rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500">
                <svg class="h-8 w-8 mb-1 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                <span class="text-xs">UPI</span>
              </button>
            </div>
          </div>
          
          <div id="card-payment-form" class="mb-6 hidden">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Card Number</label>
              <input type="text" class="form-field w-full p-2 border border-gray-300 rounded" placeholder="1234 5678 9012 3456">
            </div>
            <div class="flex gap-4 mb-4">
              <div class="w-1/2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Expiry Date</label>
                <input type="text" class="form-field w-full p-2 border border-gray-300 rounded" placeholder="MM/YY">
              </div>
              <div class="w-1/2">
                <label class="block text-gray-700 text-sm font-bold mb-2">CVV</label>
                <input type="text" class="form-field w-full p-2 border border-gray-300 rounded" placeholder="123">
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Name on Card</label>
              <input type="text" class="form-field w-full p-2 border border-gray-300 rounded" placeholder="John Doe">
            </div>
          </div>
          
          <div id="upi-payment-form" class="mb-6 hidden">
            <div class="bg-gray-50 p-4 rounded-lg text-center">
              <div class="mx-auto w-32 h-32 bg-white p-2 rounded-lg mb-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI QR Code" class="w-full h-full object-contain">
              </div>
              <p class="text-sm text-gray-700 mb-4">Scan this QR code with any UPI app or enter your UPI ID below</p>
              <div class="flex">
                <input type="text" class="form-field flex-1 p-2 border border-gray-300 rounded-l" placeholder="yourname@upi">
                <button class="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600">Verify</button>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-2">
            <button id="cancel-payment" class="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">Cancel</button>
            <button id="complete-payment" class="btn-primary px-4 py-2 bg-[#ff7518] text-white rounded">Pay ₹5000</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Setup modal events
    const closeBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-payment');
    const completeBtn = document.getElementById('complete-payment');
    const paymentMethods = document.querySelectorAll('.payment-method-btn');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', hidePaymentModal);
    }
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', hidePaymentModal);
    }
    
    if (completeBtn) {
      completeBtn.addEventListener('click', processPayment);
    }
    
    // Payment method selection
    paymentMethods.forEach((btn, index) => {
      btn.addEventListener('click', function() {
        // Highlight selected button
        paymentMethods.forEach(b => b.classList.remove('ring-2', 'ring-amber-500', 'bg-amber-50'));
        this.classList.add('ring-2', 'ring-amber-500', 'bg-amber-50');
        
        // Show appropriate form
        const cardForm = document.getElementById('card-payment-form');
        const upiForm = document.getElementById('upi-payment-form');
        
        if (index === 2) { // UPI
          cardForm.classList.add('hidden');
          upiForm.classList.remove('hidden');
        } else { // Cards
          cardForm.classList.remove('hidden');
          upiForm.classList.add('hidden');
        }
      });
    });
  }
}

// Show payment modal
function showPaymentModal() {
  const modal = document.getElementById('payment-modal');
  if (modal) {
    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
  }
}

// Hide payment modal
function hidePaymentModal() {
  const modal = document.getElementById('payment-modal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300);
  }
}

// Process payment (mock) - Now connected to booking confirmation
function processPayment() {
  // Get complete payment button
  const completeBtn = document.getElementById('complete-payment');
  
  if (completeBtn) {
    // Change button text and disable
    const originalText = completeBtn.textContent;
    completeBtn.textContent = 'Processing...';
    completeBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
      // Hide payment modal
      hidePaymentModal();
      
      // Reset button
      completeBtn.textContent = originalText;
      completeBtn.disabled = false;
      
      // Show success notification
      showNotification('Payment successful! Redirecting to confirmation page...');
      
      // Show booking confirmation - NOW CONNECTED!
      setTimeout(showBookingConfirmation, CONFIG.REDIRECT_DELAY);
    }, 2000);
  }
}

// Show direct booking confirmation with enhanced details
function showDirectBookingConfirmation() {
  // Create a booking ID
  const bookingId = generateBookingId();
  
  // Get booking details from localStorage
  const username = localStorage.getItem("username") || 'Guest';
  const email = localStorage.getItem("email") || 'Not provided';
  const mobile = localStorage.getItem("number") || 'Not provided';
  const safari = localStorage.getItem("safari") || 'Not specified';
  const zone = localStorage.getItem("zone") || 'Not specified';
  const timing = localStorage.getItem("timing") || 'Not specified';
  
  // Get current date
  const currentDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get passenger details from forms
  const passengerDetails = getPassengerDetails();
  
  // Create full-screen confirmation page
  const confirmation = document.createElement('div');
  confirmation.className = 'fixed inset-0 bg-white z-50 overflow-y-auto';
  confirmation.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 py-8 px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Thank You Header -->
        <div class="text-center mb-8 animate__animated animate__fadeInDown">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-500 mb-6">
            <svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Thank You! 🎉</h1>
          <h2 class="text-2xl font-semibold text-green-600 mb-4">Your Safari Booking is Confirmed!</h2>
          <p class="text-lg text-gray-600">We're excited to have you join us for an amazing wildlife experience at Ranthambore National Park.</p>
        </div>

        <!-- Success Message -->
        <div class="bg-green-100 border border-green-300 rounded-lg p-6 mb-8 animate__animated animate__fadeInUp">
          <div class="flex items-center">
            <svg class="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="text-lg font-semibold text-green-800">Payment Successful!</h3>
              <p class="text-green-700">Your booking has been confirmed and payment of ₹5,000 has been processed successfully.</p>
            </div>
          </div>
        </div>

        <!-- Booking Details Card -->
        <div class="bg-white rounded-xl shadow-lg p-8 mb-8 animate__animated animate__fadeInUp" style="animation-delay: 0.2s">
          <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-3 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Booking Details
          </h3>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Left Column -->
            <div class="space-y-4">
              <div class="p-4 bg-amber-50 rounded-lg">
                <h4 class="font-semibold text-amber-800 mb-2">Booking Information</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Booking ID:</span>
                    <span class="font-bold text-amber-700">${bookingId}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Booking Date:</span>
                    <span class="font-medium">${currentDate}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Status:</span>
                    <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Confirmed</span>
                  </div>
                </div>
              </div>

              <div class="p-4 bg-blue-50 rounded-lg">
                <h4 class="font-semibold text-blue-800 mb-2">Customer Details</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Name:</span>
                    <span class="font-medium">${username}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Email:</span>
                    <span class="font-medium">${email}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Mobile:</span>
                    <span class="font-medium">${mobile}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-4">
              <div class="p-4 bg-green-50 rounded-lg">
                <h4 class="font-semibold text-green-800 mb-2">Safari Details</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Safari Type:</span>
                    <span class="font-medium">${safari}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Zone:</span>
                    <span class="font-medium">${zone}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Timing:</span>
                    <span class="font-medium">${timing}</span>
                  </div>
                </div>
              </div>

              <div class="p-4 bg-purple-50 rounded-lg">
                <h4 class="font-semibold text-purple-800 mb-2">Payment Details</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Amount Paid:</span>
                    <span class="font-bold text-purple-700 text-lg">₹5,000</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Payment Status:</span>
                    <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Paid</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Passenger Details -->
        <div class="bg-white rounded-xl shadow-lg p-8 mb-8 animate__animated animate__fadeInUp" style="animation-delay: 0.4s">
          <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
            Passenger Information
          </h3>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border border-gray-300 p-3 text-left font-semibold">S.No.</th>
                  <th class="border border-gray-300 p-3 text-left font-semibold">Name</th>
                  <th class="border border-gray-300 p-3 text-left font-semibold">Age</th>
                  <th class="border border-gray-300 p-3 text-left font-semibold">Gender</th>
                </tr>
              </thead>
              <tbody>
                ${passengerDetails}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Important Information -->
        <div class="bg-amber-50 border border-amber-300 rounded-lg p-6 mb-8 animate__animated animate__fadeInUp" style="animation-delay: 0.6s">
          <h3 class="text-lg font-semibold text-amber-800 mb-4">📧 Confirmation Email Sent!</h3>
          <p class="text-amber-700 mb-4">A detailed confirmation email with your e-ticket has been sent to <strong>${email}</strong>. Please check your inbox and spam folder.</p>
          
          <h3 class="text-lg font-semibold text-amber-800 mb-4">📋 Important Instructions:</h3>
          <ul class="text-amber-700 space-y-2 list-disc pl-6">
            <li>Please carry a printout of this confirmation or show it on your mobile device</li>
            <li>Arrive at the park gate 30 minutes before your safari timing</li>
            <li>Carry valid photo ID proof for all passengers</li>
            <li>Follow park rules and regulations during the safari</li>
            <li>Contact us for any queries: +91-7597-020-222</li>
          </ul>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row justify-center gap-4 animate__animated animate__fadeInUp" style="animation-delay: 0.8s">
          <button id="download-ticket-main" class="flex items-center justify-center py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Download E-Ticket
          </button>
          <button id="print-confirmation" class="flex items-center justify-center py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
            Print Confirmation
          </button>
          <button id="return-home-main" class="flex items-center justify-center py-3 px-6 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(confirmation);
  
  // Setup confirmation events
  const downloadBtn = confirmation.querySelector('#download-ticket-main');
  const printBtn = confirmation.querySelector('#print-confirmation');
  const homeBtn = confirmation.querySelector('#return-home-main');
  
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
      showNotification('E-Ticket download functionality would be implemented with a real backend.', 'success');
    });
  }
  
  if (printBtn) {
    printBtn.addEventListener('click', function() {
      window.print();
    });
  }
  
  if (homeBtn) {
    homeBtn.addEventListener('click', function() {
      window.location.href = 'safari.html';
    });
  }

  // Auto-scroll to top
  setTimeout(() => {
    confirmation.scrollTop = 0;
  }, 100);
}

// Get passenger details from form
function getPassengerDetails() {
  let passengerHTML = '';
  const desktopRows = document.querySelectorAll('#passengerTableBody tr');
  
  if (desktopRows.length === 0) {
    passengerHTML = `
      <tr>
        <td class="border border-gray-300 p-3">1</td>
        <td class="border border-gray-300 p-3">${localStorage.getItem("username") || 'Main Guest'}</td>
        <td class="border border-gray-300 p-3">Adult</td>
        <td class="border border-gray-300 p-3">Not specified</td>
      </tr>
    `;
  } else {
    desktopRows.forEach((row, index) => {
      const name = row.querySelector('input[placeholder="Enter name"]')?.value || `Passenger ${index + 1}`;
      const age = row.querySelector('input[placeholder="Age"]')?.value || 'Not provided';
      const gender = row.querySelector('select')?.value || 'Not specified';
      
      passengerHTML += `
        <tr class="${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}">
          <td class="border border-gray-300 p-3">${index + 1}</td>
          <td class="border border-gray-300 p-3">${name}</td>
          <td class="border border-gray-300 p-3">${age}</td>
          <td class="border border-gray-300 p-3">${gender}</td>
        </tr>
      `;
    });
  }
  
  return passengerHTML;
}

// Keep original function for compatibility
function showBookingConfirmation() {
  showDirectBookingConfirmation();
}

// Generate a booking ID
function generateBookingId() {
  const prefix = 'RTB';
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}

// Setup desktop row events
function setupDesktopRowEvents(row) {
  const deleteBtn = row.querySelector('.delete-btn');
  const formFields = row.querySelectorAll('.form-field');
  
  // Setup delete button
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function() {
      removeDesktopPassenger(row);
    });
  }
  
  // Setup form field validation
  formFields.forEach(field => {
    if (field.tagName === 'SELECT') {
      field.addEventListener('change', function() {
        validateSelect(this);
        validateForm();
      });
    } else {
      field.addEventListener('input', function() {
        if (this.type === 'number') {
          if (this.value < 1 || this.value > 120) {
            this.classList.add('invalid');
          } else {
            this.classList.remove('invalid');
            this.classList.add('valid');
          }
        } else {
          if (!this.value.trim()) {
            this.classList.add('invalid');
          } else {
            this.classList.remove('invalid');
            this.classList.add('valid');
          }
        }
        validateForm();
      });
    }
  });
}

// Setup mobile card events
function setupMobileCardEvents(card) {
  const deleteBtn = card.querySelector('.delete-btn-mobile');
  const formFields = card.querySelectorAll('.form-field');
  
  // Setup delete button
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function() {
      removeMobilePassenger(card);
    });
  }
  
  // Setup form field validation
  formFields.forEach(field => {
    if (field.tagName === 'SELECT') {
      field.addEventListener('change', function() {
        validateSelect(this);
        validateForm();
      });
    } else {
      field.addEventListener('input', function() {
        if (this.type === 'number') {
          if (this.value < 1 || this.value > 120) {
            this.classList.add('invalid');
          } else {
            this.classList.remove('invalid');
            this.classList.add('valid');
          }
        } else {
          if (!this.value.trim()) {
            this.classList.add('invalid');
          } else {
            this.classList.remove('invalid');
            this.classList.add('valid');
          }
        }
        validateForm();
      });
    }
  });
}

// Add new passenger (both desktop and mobile)
function addPassenger() {
  if (window.passengerCount >= 6) {
    showNotification('Maximum 6 passengers allowed per booking.', 'error');
    return;
  }
  
  window.passengerCount++;
  
  // Add to desktop table
  addDesktopPassenger();
  
  // Add to mobile container
  addMobilePassenger();
  
  showNotification(`Passenger ${window.passengerCount} added successfully.`);
  
  // Disable add button if max reached
  const addBtn = document.getElementById('add-member-btn');
  if (window.passengerCount >= 6 && addBtn) {
    addBtn.disabled = true;
    addBtn.classList.add('opacity-50', 'cursor-not-allowed');
  }
  
  validateForm();
}

// Add desktop passenger row
function addDesktopPassenger() {
  const tableBody = document.getElementById('passengerTableBody');
  if (!tableBody) return;
  
  const newRow = document.createElement('tr');
  newRow.className = 'animate__animated animate__fadeIn';
  
  newRow.innerHTML = `
    <td class="border border-gray-300 p-2 text-center">
      <span class="inline-block px-3 py-1 rounded-full bg-[#604019] text-white font-bold text-sm">${window.passengerCount}</span>
    </td>
    <td class="border border-gray-300 p-2">
      <input type="text" class="w-full p-2 border border-gray-300 rounded form-field" placeholder="Enter name">
    </td>
    <td class="border border-gray-300 p-2">
      <input type="number" class="w-full p-2 border border-gray-300 rounded form-field" placeholder="Age">
    </td>
    <td class="border border-gray-300 p-2">
      <select class="w-full p-2 border border-gray-300 rounded form-field">
        <option value="">Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </td>
    <td class="border border-gray-300 p-2">
      <select class="w-full p-2 border border-gray-300 rounded form-field">
        <option value="">Nationality</option>
        <option value="indian">Indian</option>
        <option value="foreigner">Foreigner</option>
      </select>
    </td>
    <td class="border border-gray-300 p-2">
      <select class="w-full p-2 border border-gray-300 rounded form-field">
        <option value="">State</option>
        <option value="rajasthan">Rajasthan</option>
        <option value="delhi">Delhi</option>
        <option value="mumbai">Mumbai</option>
        <option value="gujarat">Gujarat</option>
        <option value="other">Other</option>
      </select>
    </td>
    <td class="border border-gray-300 p-2">
      <select class="w-full p-2 border border-gray-300 rounded form-field">
        <option value="">Select ID</option>
        <option value="aadhar">Aadhar</option>
        <option value="passport">Passport</option>
        <option value="dl">Driver's License</option>
        <option value="voter">Voter ID</option>
      </select>
    </td>
    <td class="border border-gray-300 p-2">
      <input type="text" class="w-full p-2 border border-gray-300 rounded form-field" placeholder="ID Number">
    </td>
    <td class="border border-gray-300 p-2 text-center">
      <button class="delete-btn px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
        <i class="fas fa-times"></i>
      </button>
    </td>
  `;
  
  tableBody.appendChild(newRow);
  setupDesktopRowEvents(newRow);
}

// Add mobile passenger card
function addMobilePassenger() {
  const mobileContainer = document.getElementById('mobilePassengerContainer');
  if (!mobileContainer) return;
  
  const newCard = document.createElement('div');
  newCard.className = 'passenger-card bg-white border-2 border-gray-200 rounded-lg p-4 mb-4 shadow-sm animate__animated animate__fadeIn';
  
  newCard.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <span class="inline-block px-3 py-1 rounded-full bg-[#604019] text-white font-bold text-sm">Passenger ${window.passengerCount}</span>
      <button class="delete-btn-mobile px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
        <i class="fas fa-times"></i>
      </button>
    </div>
    
    <div class="space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input type="text" class="w-full p-3 border border-gray-300 rounded-lg form-field" placeholder="Enter passenger name">
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input type="number" class="w-full p-3 border border-gray-300 rounded-lg form-field" placeholder="Age">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select class="w-full p-3 border border-gray-300 rounded-lg form-field">
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
          <select class="w-full p-3 border border-gray-300 rounded-lg form-field">
            <option value="">Select</option>
            <option value="indian">Indian</option>
            <option value="foreigner">Foreigner</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">State</label>
          <select class="w-full p-3 border border-gray-300 rounded-lg form-field">
            <option value="">Select</option>
            <option value="rajasthan">Rajasthan</option>
            <option value="delhi">Delhi</option>
            <option value="mumbai">Mumbai</option>
            <option value="gujarat">Gujarat</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
          <select class="w-full p-3 border border-gray-300 rounded-lg form-field">
            <option value="">Select ID</option>
            <option value="aadhar">Aadhar Card</option>
            <option value="passport">Passport</option>
            <option value="dl">Driving License</option>
            <option value="voter">Voter ID</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
          <input type="text" class="w-full p-3 border border-gray-300 rounded-lg form-field" placeholder="Enter ID number">
        </div>
      </div>
    </div>
  `;
  
  mobileContainer.appendChild(newCard);
  setupMobileCardEvents(newCard);
}

// Remove desktop passenger
function removeDesktopPassenger(row) {
  row.classList.add('animate__fadeOut');
  
  setTimeout(() => {
    row.remove();
    reindexPassengers();
  }, 500);
}

// Remove mobile passenger
function removeMobilePassenger(card) {
  card.classList.add('animate__fadeOut');
  
  setTimeout(() => {
    card.remove();
    reindexPassengers();
  }, 500);
}

// Reindex passengers after removal
function reindexPassengers() {
  window.passengerCount--;
  
  // Reindex desktop table
  const desktopRows = document.querySelectorAll('#passengerTableBody tr');
  desktopRows.forEach((row, index) => {
    const numberSpan = row.querySelector('span');
    if (numberSpan) {
      numberSpan.textContent = index + 1;
    }
  });
  
  // Reindex mobile cards
  const mobileCards = document.querySelectorAll('#mobilePassengerContainer .passenger-card');
  mobileCards.forEach((card, index) => {
    const numberSpan = card.querySelector('span');
    if (numberSpan) {
      numberSpan.textContent = `Passenger ${index + 1}`;
    }
  });
  
  // Re-enable add button if needed
  const addBtn = document.getElementById('add-member-btn');
  if (window.passengerCount < 6 && addBtn) {
    addBtn.disabled = false;
    addBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }
  
  showNotification('Passenger removed successfully.');
  validateForm();
}

// Setup payment system
function setupPaymentSystem() {
  let payButton = null;
  const termsCheckbox = document.querySelector('input[type="checkbox"]');
  
  // Find pay button by text content
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    if (btn.textContent && btn.textContent.includes('Pay Now')) {
      payButton = btn;
    }
  });
  
  if (payButton && termsCheckbox) {
    // Disable pay button initially
    payButton.disabled = true;
    payButton.classList.add('opacity-50', 'cursor-not-allowed');
    
    // Add btn-primary class for styling
    payButton.classList.add('btn-primary');
    
    // Add validation event to checkbox
    termsCheckbox.addEventListener('change', function() {
      validateForm();
    });
    
    // Add click event to pay button
    payButton.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Validate form before proceeding
      if (validateForm()) {
        showPaymentModal();
      } else {
        showNotification('Please fill all required fields and agree to the terms and conditions.', 'error');
      }
    });
  }
}
