// Chambal Essential - Optimized version with unused code removed
(function() {
  'use strict';

  // Package configurations
  const packageConfigs = {
    standard: { name: "Standard Safari", duration: "2 hours", price: 2499, features: ["2-hour boat safari with guide", "Life jacket and safety equipment", "Pickup & drop from nearby hotels"] },
    deluxe: { name: "Deluxe Safari", duration: "3 hours", price: 3499, features: ["3-hour extended boat safari", "Pickup & drop from nearby hotels", "Complimentary bottled water", "Premium life jacket provided"] },
    premium: { name: "Premium Safari", duration: "4 hours", price: 4499, features: ["4-hour private boat safari", "Pickup & drop from any hotel in city", "Lunch at riverside restaurant", "Expert wildlife naturalist guide"] },
    luxury: { name: "Luxury Safari", duration: "Full day", price: 5999, features: ["Full day private boat safari", "Luxury vehicle pickup & drop", "Gourmet lunch with river view", "Senior naturalist guide", "Binoculars and field guide included"] }
  };

  // Get package from URL
  function getPackageFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("package") || "standard";
  }

  // Update package display
  function updatePackageDisplay() {
    const packageType = getPackageFromURL();
    const config = packageConfigs[packageType];
    if (!config) return;

    const elements = {
      "package-name": config.name,
      "package-duration": config.duration,
      "package-price": `₹${config.price.toLocaleString()}`
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });

    const featuresContainer = document.getElementById("package-features");
    if (featuresContainer) {
      featuresContainer.innerHTML = config.features
        .map(feature => `<li class="flex items-center"><i class="fas fa-check text-teal-500 mr-2"></i>${feature}</li>`)
        .join("");
    }
  }

  // Set minimum date to today
  function setMinDate() {
    const today = new Date().toISOString().split("T")[0];
    const dateInput = document.getElementById("booking-date");
    if (dateInput) dateInput.min = today;
  }

  // Calculate total price
  function calculateTotal() {
    const packageType = getPackageFromURL();
    const basePrice = packageConfigs[packageType].price;
    const indianPersons = parseInt(document.getElementById("indian-persons")?.value) || 0;
    const foreignPersons = parseInt(document.getElementById("foreigner-persons")?.value) || 0;

    const indianRates = { 1: 500, 2: 900, 3: 1200, 4: 1500, 5: 1800, 6: 2100 };
    const foreignRates = { 0: 0, 1: 1250, 2: 2100, 3: 2900, 4: 3750 };

    const indianCost = indianRates[indianPersons] || 0;
    const foreignCost = foreignRates[foreignPersons] || 0;
    const total = basePrice + indianCost + foreignCost;

    // Update display
    const elements = {
      "indian-cost": `₹${indianCost.toLocaleString()}`,
      "foreign-cost": `₹${foreignCost.toLocaleString()}`,
      "package-base-cost": `₹${basePrice.toLocaleString()}`,
      "payable-amount": `₹${total.toLocaleString()}`
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });
  }

  // Form validation - essential only
  function validateForm() {
    let isValid = true;
    const fields = [
      { id: "name", errorId: "name-error", minLength: 3 },
      { id: "mobile", errorId: "mobile-error", pattern: /^[0-9]{10}$/ },
      { id: "email", errorId: "email-error", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      { id: "id-proof-type", errorId: "id-proof-error" },
      { id: "id-proof", errorId: "id-proof-error" },
      { id: "state", errorId: "state-error" },
      { id: "indian-persons", errorId: "indian-persons-error" },
      { id: "booking-date", errorId: "booking-date-error" },
      { id: "safari-timing", errorId: "safari-timing-error" },
      { id: "address", errorId: "address-error", minLength: 15 }
    ];

    fields.forEach((field) => {
      const element = document.getElementById(field.id);
      const errorElement = document.getElementById(field.errorId);
      if (!element) return;

      let fieldValid = true;
      if (element.hasAttribute("required") && !element.value.trim()) {
        fieldValid = false;
      } else if (field.minLength && element.value.length < field.minLength) {
        fieldValid = false;
      } else if (field.pattern && !field.pattern.test(element.value)) {
        fieldValid = false;
      }

      if (fieldValid) {
        element.classList.remove("border-red-500");
        element.classList.add("border-green-500");
        errorElement?.classList.add("hidden");
      } else {
        element.classList.remove("border-green-500");
        element.classList.add("border-red-500");
        errorElement?.classList.remove("hidden");
        isValid = false;
      }
    });

    // Terms checkbox validation
    const termsCheckbox = document.getElementById("terms-checkbox");
    const termsError = document.getElementById("terms-error");
    if (termsCheckbox && !termsCheckbox.checked) {
      termsError?.classList.remove("hidden");
      isValid = false;
    } else {
      termsError?.classList.add("hidden");
    }

    return isValid;
  }

  // WhatsApp booking
  function bookViaWhatsApp() {
    const formData = new FormData(document.getElementById("booking-form"));
    const packageType = getPackageFromURL();
    const config = packageConfigs[packageType];

    const message = [
      "🌊 Chambal Safari Booking Request",
      "",
      `📦 Package: ${config.name}`,
      `👤 Name: ${formData.get("name")}`,
      `📱 Mobile: +91${formData.get("mobile")}`,
      `📧 Email: ${formData.get("email")}`,
      `👥 Indian Visitors: ${formData.get("indian-persons")}`,
      `🌍 Foreign Visitors: ${formData.get("foreigner-persons")}`,
      `📅 Date: ${formData.get("booking-date")}`,
      `⏰ Time: ${formData.get("safari-timing")}`,
      `📍 Address: ${formData.get("address")}`,
      "",
      `💰 Estimated Total: ${document.getElementById("payable-amount").textContent}`
    ].join("\n");

    const whatsappURL = `https://wa.me/918076438491?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  }

  // Simple notification
  function showSimpleNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`;
    notification.innerHTML = `
      <div class="flex items-center">
        <span class="mr-2">${type === "success" ? "✓" : "✗"}</span>
        <span>${message}</span>
        <button class="ml-4 hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
  }

  // Payment process - simplified
  function startPaymentProcess() {
    const paymentModal = document.createElement("div");
    paymentModal.className = "fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4";
    paymentModal.innerHTML = `
      <div class="bg-white rounded-2xl max-w-md w-full p-6">
        <div class="text-center">
          <div class="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-credit-card text-3xl text-white"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h3>
          <p class="text-gray-600 mb-6">Please wait while we process your payment...</p>
          <div class="flex justify-center mb-4">
            <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
          <div class="bg-gray-100 p-4 rounded-lg">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-gray-600">Amount:</span>
              <span class="font-semibold">${document.getElementById("payable-amount").textContent}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Payment Method:</span>
              <span class="font-semibold">Demo Card ****1234</span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(paymentModal);
    document.body.style.overflow = "hidden";

    // Simulate payment success
    setTimeout(() => {
      paymentModal.remove();
      document.body.style.overflow = "";
      showSimpleNotification("Payment successful! Thank you for booking.");
    }, 2000);
  }

  // Alert Modal handlers
  const chambalNavBookBtn = document.querySelectorAll(".chambalBookBtn");
  const alertModal = document.getElementById("alertModal");
  const startBookingButton = document.querySelector(".startingBookingBtn");
  const continueBookingButton = document.querySelector(".continueBookingBtn");

  if (alertModal) {
    chambalNavBookBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        alertModal.classList.remove("hidden");
      });
    });

    startBookingButton?.addEventListener("click", () => {
      window.location.reload();
    });

    continueBookingButton?.addEventListener("click", () => {
      alertModal.classList.add("hidden");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        alertModal.classList.add("hidden");
      }
    });

    alertModal.addEventListener("click", (e) => {
      if (e.target === alertModal) {
        alertModal.classList.add("hidden");
      }
    });
  }

  // Initialize page
  document.addEventListener("DOMContentLoaded", function () {
    updatePackageDisplay();
    setMinDate();
    
    // Event listeners
    const indianPersonsInput = document.getElementById("indian-persons");
    const foreignPersonsInput = document.getElementById("foreigner-persons");
    
    [indianPersonsInput, foreignPersonsInput].forEach(input => {
      if (input) {
        input.addEventListener("change", calculateTotal);
      }
    });

    const whatsappBtn = document.getElementById("whatsapp-btn");
    if (whatsappBtn) {
      whatsappBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (validateForm()) {
          bookViaWhatsApp();
        }
      });
    }

    const bookingForm = document.getElementById("booking-form");
    if (bookingForm) {
      bookingForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (validateForm()) {
          startPaymentProcess();
        }
      });
    }

    // Initial calculation
    calculateTotal();
  });
})();
