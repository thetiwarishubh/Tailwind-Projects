/**
 * Optimized Safari Booking System
 * Professional Safari Booking Application
 *
 * Features:
 * - Clean passenger management with proper numbering
 * - Real-time form validation
 * - Responsive design (desktop + mobile)
 * - Professional payment system with modal
 * - Booking confirmation system
 * - Loading animations and notifications
 *
 * @version 2.0.0
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
  DEBUG: false,
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Email validation utility
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Phone number validation utility (Indian format)
 */
function isValidPhone(phone) {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ""));
}

/**
 * Debug logging utility
 */
function debugLog(message, data = null) {
  if (CONFIG.DEBUG) {
    console.log(`[Safari Booking] ${message}`, data || "");
  }
}

/**
 * Sanitize input to prevent XSS
 */
function sanitizeInput(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}

// ============================================================
// NOTIFICATION SYSTEM
// ============================================================

/**
 * Create notification container if it doesn't exist
 */
function createNotificationContainer() {
  if (!document.querySelector(".notification-container")) {
    const container = document.createElement("div");
    container.className = "notification-container";
    document.body.appendChild(container);
  }
}

/**
 * Show notification function
 */
function showNotification(message, type = "success") {
  createNotificationContainer();

  const container = document.querySelector(".notification-container");
  const notification = document.createElement("div");

  notification.className = `notification p-4 rounded-lg shadow-lg flex items-center justify-between ${
    type === "success" ? "bg-green-500" : "bg-red-500"
  } text-white`;

  notification.innerHTML = `
    <div class="flex items-center">
      <span class="mr-2">${type === "success" ? "✓" : "✗"}</span>
      <span>${message}</span>
    </div>
    <button class="ml-4 focus:outline-none hover:text-gray-200">×</button>
  `;

  container.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Dismiss notification
  notification.querySelector("button").addEventListener("click", () => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  });

  // Auto dismiss
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, CONFIG.NOTIFICATION_DURATION);
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

    debugLog("Current page:", { isFormPage, isBookingPage });

    // =========================
    // FORM PAGE LOGIC
    // =========================
    if (isFormPage) {
      // ✅ Calendar element setup
      const calendarEl = document.getElementById("calendar");

      if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: "dayGridMonth",
          headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth",
          },
          dateClick: function (info) {
            const selectedDate = info.dateStr; // YYYY-MM-DD
            localStorage.setItem("bookingdate", selectedDate);

            // Remove previous selection
            document.querySelectorAll(".fc-day-selected").forEach((el) => {
              el.classList.remove("fc-day-selected");
            });

            // Add selection to clicked date
            info.dayEl.classList.add("fc-day-selected");

            showNotification(`Selected date: ${selectedDate}`, "success");
          },
          validRange: {
            start: new Date(), // Prevent past date selection
          },
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
        e.preventDefault();

        // Get input values
        const userFullName = document.getElementById("name")?.value;
        const userEmail = document.getElementById("email")?.value;
        const userNumber = document.getElementById("mobile")?.value;
        const userTiming = document.getElementById("timing")?.value;
        const safari = document.getElementById("safari")?.value;
        const zone = document.getElementById("zone")?.value;
        const bookingDate = localStorage.getItem("bookingdate");

        // Enhanced input validation
        const validationErrors = [];

        if (!bookingDate) {
          validationErrors.push("Please select date");
        }

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
          bookingDate: sanitizeInput(bookingDate),
          userFullName: sanitizeInput(userFullName.trim()),
          userEmail: sanitizeInput(userEmail.trim().toLowerCase()),
          userNumber: sanitizeInput(userNumber.replace(/\s+/g, "")),
          userTiming: sanitizeInput(userTiming),
          safari: sanitizeInput(safari),
          zone: sanitizeInput(zone),
        };

        // Store sanitized values in localStorage
        localStorage.setItem("bookingdate", sanitizedData.bookingDate);
        localStorage.setItem("username", sanitizedData.userFullName);
        localStorage.setItem("email", sanitizedData.userEmail);
        localStorage.setItem("number", sanitizedData.userNumber);
        localStorage.setItem("timing", sanitizedData.userTiming);
        localStorage.setItem("safari", sanitizedData.safari);
        localStorage.setItem("zone", sanitizedData.zone);

        debugLog("Form data stored successfully", sanitizedData);

        // Show success notification
        showNotification(
          "Form submitted successfully! Redirecting to booking page..."
        );

        // Redirect to booking page
        setTimeout(() => {
          try {
            window.location.href = "create-safari-booking-optimized.html";
            debugLog("Redirecting to create-safari-booking-optimized.html");
          } catch (redirectError) {
            console.error("Redirect failed:", redirectError);
            showNotification(
              "Failed to redirect to the booking page.",
              "error"
            );
          }
        }, CONFIG.REDIRECT_DELAY);
      });
    }

    // =========================
    // BOOKING PAGE LOGIC
    // =========================
    if (isBookingPage) {
      // Initialize passenger management
      initializePassengerManagement();

      // Initialize payment modal and system
      initializePaymentSystem();

      // Load and display booking data
      loadBookingData();

      // Initialize form validation
      initializeFormValidation();
    }
  } catch (error) {
    console.error("Error in script execution:", error);
    showNotification(
      "An error occurred. Please check the console for details.",
      "error"
    );
  }
});

// ============================================================
// BOOKING PAGE FUNCTIONS
// ============================================================

/**
 * Initialize passenger management system
 */
function initializePassengerManagement() {
  // Initialize passenger counter based on existing rows
  const existingRows = document.querySelectorAll(
    "#passengerTableBody tr"
  ).length;
  const existingCards = document.querySelectorAll(
    "#mobilePassengerContainer .passenger-card"
  ).length;

  // Use the higher count between desktop and mobile
  window.passengerCount = Math.max(existingRows, existingCards) || 1;

  debugLog("Passenger management initialized", {
    existingRows,
    existingCards,
    passengerCount: window.passengerCount,
  });

  // Setup add passenger button
  const addMemberBtn = document.getElementById("add-member-btn");
  if (addMemberBtn) {
    addMemberBtn.addEventListener("click", addPassenger);
  }

  // Setup existing delete buttons
  setupExistingDeleteButtons();

  // Setup form field validation for existing passengers
  setupExistingFormValidation();
}

/**
 * Add new passenger
 */
function addPassenger() {
  if (window.passengerCount >= CONFIG.MAX_PASSENGERS) {
    showNotification("Maximum 6 passengers allowed per booking.", "error");
    return;
  }

  const currentRows = document.querySelectorAll(
    "#passengerTableBody tr"
  ).length;
  const nextPassengerNumber = currentRows + 1;

  // Add to desktop table
  addDesktopPassenger(nextPassengerNumber);

  // Add to mobile container
  addMobilePassenger(nextPassengerNumber);

  window.passengerCount = nextPassengerNumber;

  showNotification(`Passenger ${nextPassengerNumber} added successfully.`);

  // Disable add button if max reached
  const addBtn = document.getElementById("add-member-btn");
  if (nextPassengerNumber >= CONFIG.MAX_PASSENGERS && addBtn) {
    addBtn.disabled = true;
    addBtn.classList.add("opacity-50", "cursor-not-allowed");
  }

  validateForm();
}

/**
 * Add desktop passenger row
 */
function addDesktopPassenger(passengerNumber) {
  const tableBody = document.getElementById("passengerTableBody");
  if (!tableBody) return;

  const newRow = document.createElement("tr");
  newRow.className = "animate__animated animate__fadeIn";

  newRow.innerHTML = `
    <td class="border border-gray-300 p-2 text-center">
      <span class="inline-block px-3 py-1 rounded-full bg-[#604019] text-white font-bold text-sm">${passengerNumber}</span>
    </td>
    <td class="border border-gray-300 p-2">
      <input type="text" class="w-full p-2 border border-gray-300 rounded form-field" placeholder="Enter name" required>
    </td>
    <td class="border border-gray-300 p-2">
      <input type="number" class="w-full p-2 border border-gray-300 rounded form-field" placeholder="Age" min="1" max="120" required>
    </td>
    <td class="border border-gray-300 p-2">
      <select class="w-full p-2 border border-gray-300 rounded form-field" required>
        <option value="">Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </td>
    <td class="border border-gray-300 p-2">
      <select class="w-full p-2 border border-gray-300 rounded form-field" required>
        <option value="">Nationality</option>
        <option value="indian">Indian</option>
        <option value="foreigner">Foreigner</option>
      </select>
    </td>
    <td class="border border-gray-300 p-2">
      <select class="w-full p-2 border border-gray-300 rounded form-field" required>
        <option value="">State</option>
        <option value="rajasthan">Rajasthan</option>
        <option value="delhi">Delhi</option>
        <option value="mumbai">Mumbai</option>
        <option value="gujarat">Gujarat</option>
        <option value="other">Other</option>
      </select>
    </td>
    <td class="border border-gray-300 p-2">
      <select class="w-full p-2 border border-gray-300 rounded form-field" required>
        <option value="">Select ID</option>
        <option value="aadhar">Aadhar</option>
        <option value="passport">Passport</option>
        <option value="dl">Driver's License</option>
        <option value="voter">Voter ID</option>
      </select>
    </td>
    <td class="border border-gray-300 p-2">
      <input type="text" class="w-full p-2 border border-gray-300 rounded form-field" placeholder="ID Number" required>
    </td>
    <td class="border border-gray-300 p-2 text-center">
      <button class="delete-btn px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
        <i class="fas fa-times"></i>
      </button>
    </td>
  `;

  tableBody.appendChild(newRow);
  setupRowEvents(newRow);
}

/**
 * Add mobile passenger card
 */
function addMobilePassenger(passengerNumber) {
  const mobileContainer = document.getElementById("mobilePassengerContainer");
  if (!mobileContainer) return;

  const newCard = document.createElement("div");
  newCard.className =
    "passenger-card bg-white border-2 border-gray-200 rounded-lg p-4 mb-4 shadow-sm animate__animated animate__fadeIn";

  newCard.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <span class="inline-block px-3 py-1 rounded-full bg-[#604019] text-white font-bold text-sm">Passenger ${passengerNumber}</span>
      <button class="delete-btn-mobile px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
        <i class="fas fa-times"></i>
      </button>
    </div>
    
    <div class="space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input type="text" class="w-full p-3 border border-gray-300 rounded-lg form-field" placeholder="Enter passenger name" required>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input type="number" class="w-full p-3 border border-gray-300 rounded-lg form-field" placeholder="Age" min="1" max="120" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select class="w-full p-3 border border-gray-300 rounded-lg form-field" required>
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
          <select class="w-full p-3 border border-gray-300 rounded-lg form-field" required>
            <option value="">Select</option>
            <option value="indian">Indian</option>
            <option value="foreigner">Foreigner</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">State</label>
          <select class="w-full p-3 border border-gray-300 rounded-lg form-field" required>
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
          <select class="w-full p-3 border border-gray-300 rounded-lg form-field" required>
            <option value="">Select ID</option>
            <option value="aadhar">Aadhar Card</option>
            <option value="passport">Passport</option>
            <option value="dl">Driving License</option>
            <option value="voter">Voter ID</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
          <input type="text" class="w-full p-3 border border-gray-300 rounded-lg form-field" placeholder="Enter ID number" required>
        </div>
      </div>
    </div>
  `;

  mobileContainer.appendChild(newCard);
  setupCardEvents(newCard);
}

/**
 * Remove passenger function
 */
function removePassenger(element) {
  const row = element.closest("tr") || element.closest(".passenger-card");
  if (!row) return;

  row.classList.add("animate__fadeOut");

  setTimeout(() => {
    row.remove();
    reindexPassengers();
  }, 500);
}

/**
 * Reindex passengers after removal
 */
function reindexPassengers() {
  const desktopRows = document.querySelectorAll("#passengerTableBody tr");
  const mobileCards = document.querySelectorAll(
    "#mobilePassengerContainer .passenger-card"
  );

  // Update passenger count
  window.passengerCount = Math.max(desktopRows.length, mobileCards.length);

  // Reindex desktop table
  desktopRows.forEach((row, index) => {
    const numberSpan = row.querySelector("span");
    if (numberSpan) {
      numberSpan.textContent = index + 1;
    }
  });

  // Reindex mobile cards
  mobileCards.forEach((card, index) => {
    const numberSpan = card.querySelector("span");
    if (numberSpan) {
      numberSpan.textContent = `Passenger ${index + 1}`;
    }
  });

  // Re-enable add button if needed
  const addBtn = document.getElementById("add-member-btn");
  if (window.passengerCount < CONFIG.MAX_PASSENGERS && addBtn) {
    addBtn.disabled = false;
    addBtn.classList.remove("opacity-50", "cursor-not-allowed");
  }

  showNotification("Passenger removed successfully.");
  validateForm();
}

/**
 * Setup events for existing elements
 */
function setupExistingDeleteButtons() {
  // Desktop delete buttons
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      removePassenger(this);
    });
  });

  // Mobile delete buttons
  document.querySelectorAll(".delete-btn-mobile").forEach((btn) => {
    btn.addEventListener("click", function () {
      removePassenger(this);
    });
  });
}

/**
 * Setup row events
 */
function setupRowEvents(row) {
  const deleteBtn = row.querySelector(".delete-btn");
  const formFields = row.querySelectorAll(".form-field");

  if (deleteBtn) {
    deleteBtn.addEventListener("click", function () {
      removePassenger(this);
    });
  }

  formFields.forEach((field) => {
    if (field.tagName === "SELECT") {
      field.addEventListener("change", function () {
        validateField(this);
        validateForm();
      });
    } else {
      field.addEventListener("input", function () {
        validateField(this);
        validateForm();
      });
    }
  });
}

/**
 * Setup card events
 */
function setupCardEvents(card) {
  const deleteBtn = card.querySelector(".delete-btn-mobile");
  const formFields = card.querySelectorAll(".form-field");

  if (deleteBtn) {
    deleteBtn.addEventListener("click", function () {
      removePassenger(this);
    });
  }

  formFields.forEach((field) => {
    if (field.tagName === "SELECT") {
      field.addEventListener("change", function () {
        validateField(this);
        validateForm();
      });
    } else {
      field.addEventListener("input", function () {
        validateField(this);
        validateForm();
      });
    }
  });
}

/**
 * Setup existing form validation
 */
function setupExistingFormValidation() {
  const existingFields = document.querySelectorAll(".form-field");
  existingFields.forEach((field) => {
    if (field.tagName === "SELECT") {
      field.addEventListener("change", function () {
        validateField(this);
        validateForm();
      });
    } else {
      field.addEventListener("input", function () {
        validateField(this);
        validateForm();
      });
    }
  });
}

/**
 * Load booking data from localStorage
 */
function loadBookingData() {
  // Add loading state
  addLoadingState();

  setTimeout(() => {
    const booking = localStorage.getItem("bookingdate");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const number = localStorage.getItem("number");
    const timing = localStorage.getItem("timing");
    const safari = localStorage.getItem("safari");
    const zone = localStorage.getItem("zone");

    debugLog("Retrieved from localStorage:", {
      username,
      email,
      number,
      timing,
      safari,
      zone,
      booking,
    });

    // Update DOM elements with animated loading
    animateDataLoad(document.querySelector(".display-date"), booking);
    animateDataLoad(document.querySelector(".display-name"), username);
    animateDataLoad(document.querySelector(".display-email"), email);
    animateDataLoad(document.querySelector(".display-mobile"), number);
    animateDataLoad(document.querySelector(".display-safari"), safari);
    animateDataLoad(document.querySelector(".display-zone"), zone);
    animateDataLoad(document.querySelector(".display-timing"), timing);

    // Remove loading state
    removeLoadingState();
  }, CONFIG.LOADING_DELAY);
}

/**
 * Add loading state to elements
 */
function addLoadingState() {
  const displayElements = document.querySelectorAll(
    ".display-name, .display-email, .display-mobile, .display-safari, .display-zone, .display-timing, .display-date"
  );
  displayElements.forEach((element) => {
    element.classList.add("skeleton");
    element.style.height = "20px";
    element.style.width = "100%";
    element.style.borderRadius = "4px";
    element.textContent = "";
  });
}

/**
 * Remove loading state
 */
function removeLoadingState() {
  const skeletons = document.querySelectorAll(".skeleton");
  skeletons.forEach((skeleton) => {
    skeleton.classList.remove("skeleton");
  });
}

/**
 * Animate data loading
 */
function animateDataLoad(element, value) {
  if (!element) return;

  element.classList.remove("skeleton");
  element.textContent = value || "N/A";
  element.classList.add("animate__animated", "animate__fadeIn");

  // Add highlight effect
  setTimeout(() => {
    element.style.backgroundColor = "#fef3c7";
    setTimeout(() => {
      element.style.transition = "background-color 1s ease";
      element.style.backgroundColor = "transparent";
    }, 500);
  }, 300);
}

/**
 * Initialize form validation
 */
function initializeFormValidation() {
  const stateSelect = document.querySelector('select[placeholder="State"]');
  const addressInput = document.querySelector(
    'textarea[placeholder="Full Address"]'
  );
  const termsCheckbox = document.querySelector('input[type="checkbox"]');

  if (stateSelect) {
    stateSelect.classList.add("form-field");
    stateSelect.addEventListener("change", function () {
      validateField(this);
      validateForm();
    });
  }

  if (addressInput) {
    addressInput.classList.add("form-field");
    addressInput.addEventListener("input", function () {
      validateField(this);
      validateForm();
    });
  }

  if (termsCheckbox) {
    termsCheckbox.addEventListener("change", function () {
      if (this.checked) {
        this.classList.remove("border-red-500");
        showNotification("Thank you for agreeing to our terms and conditions");
      } else {
        this.classList.add("border-red-500");
      }
      validateForm();
    });
  }
}

/**
 * Validate individual field
 */
function validateField(field) {
  let isValid = true;

  if (field.tagName === "SELECT") {
    isValid = field.value !== "";
  } else if (field.tagName === "TEXTAREA") {
    isValid = field.value.trim().length >= 10;
  } else if (field.type === "number") {
    const value = parseInt(field.value);
    isValid = value >= 1 && value <= 120;
  } else {
    isValid = field.value.trim() !== "";
  }

  if (isValid) {
    field.classList.remove("invalid");
    field.classList.add("valid");
  } else {
    field.classList.remove("valid");
    field.classList.add("invalid");
  }

  return isValid;
}

/**
 * Validate entire form
 */
function validateForm() {
  const stateSelect = document.querySelector('select[placeholder="State"]');
  const addressInput = document.querySelector(
    'textarea[placeholder="Full Address"]'
  );
  const termsCheckbox = document.querySelector('input[type="checkbox"]');
  const payButton = document.getElementById("pay-now-btn");

  let isValid = true;

  // Validate state and address
  if (stateSelect && !validateField(stateSelect)) isValid = false;
  if (addressInput && !validateField(addressInput)) isValid = false;

  // Validate passenger info
  const passengerValid = validatePassengers();
  if (!passengerValid.valid) isValid = false;

  // Check terms
  if (termsCheckbox && !termsCheckbox.checked) isValid = false;

  // Enable/disable pay button
  if (payButton) {
    if (isValid) {
      payButton.disabled = false;
      payButton.classList.remove("opacity-50", "cursor-not-allowed");
      payButton.classList.add("btn-primary");
    } else {
      payButton.disabled = true;
      payButton.classList.add("opacity-50", "cursor-not-allowed");
      payButton.classList.remove("btn-primary");
    }
  }

  return isValid;
}

/**
 * Validate passenger details
 */
function validatePassengers() {
  const rows = document.querySelectorAll("#passengerTableBody tr");

  if (rows.length === 0) {
    return { valid: false, message: "Please add at least one passenger" };
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const name = row.querySelector('input[placeholder="Enter name"]');
    const age = row.querySelector('input[placeholder="Age"]');
    const gender = row.querySelector("select:nth-of-type(1)");

    if (name && !name.value.trim()) {
      name.classList.add("invalid");
      return { valid: false, message: `Passenger ${i + 1}: Please enter name` };
    } else if (name) {
      name.classList.remove("invalid");
    }

    if (age && (!age.value || age.value < 1 || age.value > 120)) {
      age.classList.add("invalid");
      return {
        valid: false,
        message: `Passenger ${i + 1}: Please enter valid age`,
      };
    } else if (age) {
      age.classList.remove("invalid");
    }

    if (gender && !gender.value) {
      gender.classList.add("invalid");
      return {
        valid: false,
        message: `Passenger ${i + 1}: Please select gender`,
      };
    } else if (gender) {
      gender.classList.remove("invalid");
    }
  }

  return { valid: true };
}

// ============================================================
// PAYMENT SYSTEM
// ============================================================

/**
 * Initialize payment system
 */
function initializePaymentSystem() {
  createPaymentModal();

  const payButton = document.getElementById("pay-now-btn");
  const termsCheckbox = document.querySelector('input[type="checkbox"]');

  if (payButton && termsCheckbox) {
    // Disable pay button initially
    payButton.disabled = true;
    payButton.classList.add("opacity-50", "cursor-not-allowed");

    // Add click event to pay button
    payButton.addEventListener("click", function (e) {
      e.preventDefault();

      if (validateForm()) {
        showPaymentModal();
      } else {
        showNotification(
          "Please fill all required fields and agree to the terms and conditions.",
          "error"
        );
      }
    });
  }
}

/**
 * Create payment modal
 */
function createPaymentModal() {
  if (document.getElementById("payment-modal")) return;

  const modal = document.createElement("div");
  modal.id = "payment-modal";
  modal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 hidden modal";
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
              <i class="fas fa-credit-card text-2xl mb-1 text-gray-700"></i>
              <span class="text-xs">Credit Card</span>
            </button>
            <button class="payment-method-btn flex flex-col items-center justify-center p-3 border rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500">
              <i class="fas fa-credit-card text-2xl mb-1 text-gray-700"></i>
              <span class="text-xs">Debit Card</span>
            </button>
            <button class="payment-method-btn flex flex-col items-center justify-center p-3 border rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500">
              <i class="fas fa-mobile-alt text-2xl mb-1 text-gray-700"></i>
              <span class="text-xs">UPI</span>
            </button>
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
  document
    .getElementById("close-modal")
    .addEventListener("click", hidePaymentModal);
  document
    .getElementById("cancel-payment")
    .addEventListener("click", hidePaymentModal);
  document
    .getElementById("complete-payment")
    .addEventListener("click", processPayment);

  // Payment method selection
  modal.querySelectorAll(".payment-method-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      modal
        .querySelectorAll(".payment-method-btn")
        .forEach((b) =>
          b.classList.remove("ring-2", "ring-amber-500", "bg-amber-50")
        );
      this.classList.add("ring-2", "ring-amber-500", "bg-amber-50");
    });
  });
}

/**
 * Show payment modal
 */
function showPaymentModal() {
  const modal = document.getElementById("payment-modal");
  if (modal) {
    modal.classList.remove("hidden");
    setTimeout(() => {
      modal.classList.add("show");
    }, 10);
  }
}

/**
 * Hide payment modal
 */
function hidePaymentModal() {
  const modal = document.getElementById("payment-modal");
  if (modal) {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 300);
  }
}

/**
 * Process payment
 */
function processPayment() {
  const completeBtn = document.getElementById("complete-payment");

  if (completeBtn) {
    const originalText = completeBtn.textContent;
    completeBtn.textContent = "Processing...";
    completeBtn.disabled = true;

    showNotification("Processing your payment...", "success");

    setTimeout(() => {
      hidePaymentModal();
      completeBtn.textContent = originalText;
      completeBtn.disabled = false;

      showNotification(
        "Payment successful! Redirecting to confirmation page..."
      );

      setTimeout(showBookingConfirmation, CONFIG.REDIRECT_DELAY);
    }, 2000);
  }
}

/**
 * Show booking confirmation
 */
function showBookingConfirmation() {
  const bookingId =
    "RTB" +
    Date.now().toString().slice(-6) +
    Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");

  const username = localStorage.getItem("username") || "Guest";
  const email = localStorage.getItem("email") || "Not provided";
  const mobile = localStorage.getItem("number") || "Not provided";
  const safari = localStorage.getItem("safari") || "Not specified";
  const zone = localStorage.getItem("zone") || "Not specified";
  const timing = localStorage.getItem("timing") || "Not specified";

  const confirmation = document.createElement("div");
  confirmation.className = "fixed inset-0 bg-white z-50 overflow-y-auto";
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

        <!-- Booking Details Card -->
        <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">Booking Details</h3>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-4">
              <div class="p-4 bg-amber-50 rounded-lg">
                <h4 class="font-semibold text-amber-800 mb-2">Booking Information</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Booking ID:</span>
                    <span class="font-bold text-amber-700">${bookingId}</span>
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

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <button id="print-confirmation" class="flex items-center justify-center py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            <i class="fas fa-print mr-2"></i>
            Print Confirmation
          </button>
          <button id="return-home" class="flex items-center justify-center py-3 px-6 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium">
            <i class="fas fa-home mr-2"></i>
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(confirmation);

  // Setup confirmation events
  document
    .getElementById("print-confirmation")
    .addEventListener("click", function () {
      window.print();
    });

  document.getElementById("return-home").addEventListener("click", function () {
    window.location.href = "safari.html";
  });
}
