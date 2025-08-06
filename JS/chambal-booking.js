// Package configurations
const packageConfigs = {
  standard: {
    name: "Standard Safari",
    duration: "2 hours",
    price: 2499,
    features: [
      "2-hour boat safari with guide",
      "Life jacket and safety equipment",
      "Pickup & drop from nearby hotels",
    ],
  },
  deluxe: {
    name: "Deluxe Safari",
    duration: "3 hours",
    price: 3499,
    features: [
      "3-hour extended boat safari",
      "Pickup & drop from nearby hotels",
      "Complimentary bottled water",
      "Premium life jacket provided",
    ],
  },
  premium: {
    name: "Premium Safari",
    duration: "4 hours",
    price: 4499,
    features: [
      "4-hour private boat safari",
      "Pickup & drop from any hotel in city",
      "Lunch at riverside restaurant",
      "Expert wildlife naturalist guide",
    ],
  },
  luxury: {
    name: "Luxury Safari",
    duration: "Full day",
    price: 5999,
    features: [
      "Full day private boat safari",
      "Luxury vehicle pickup & drop",
      "Gourmet lunch with river view",
      "Senior naturalist guide",
      "Binoculars and field guide included",
    ],
  },
};

// Get package from URL parameters
function getPackageFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("package") || "standard";
}

// Update package display
function updatePackageDisplay() {
  const packageType = getPackageFromURL();
  const config = packageConfigs[packageType];

  document.getElementById("package-name").textContent = config.name;
  document.getElementById("package-duration").textContent = config.duration;
  document.getElementById(
    "package-price"
  ).textContent = `₹${config.price.toLocaleString()}`;

  const featuresContainer = document.getElementById("package-features");
  featuresContainer.innerHTML = config.features
    .map(
      (feature) =>
        `<li class="flex items-center"><i class="fas fa-check text-teal-500 mr-2"></i>${feature}</li>`
    )
    .join("");
}

// Set minimum date to today
function setMinDate() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("booking-date").min = today;
}

// Calculate total price
function calculateTotal() {
  const packageType = getPackageFromURL();
  const basePrice = packageConfigs[packageType].price;
  const indianPersons =
    parseInt(document.getElementById("indian-persons").value) || 0;
  const foreignPersons =
    parseInt(document.getElementById("foreigner-persons").value) || 0;

  // Indian visitor costs
  const indianRates = { 1: 500, 2: 900, 3: 1200, 4: 1500, 5: 1800, 6: 2100 };
  const indianCost = indianRates[indianPersons] || 0;

  // Foreign visitor costs (in INR, converted from USD)
  const foreignRates = { 0: 0, 1: 1250, 2: 2100, 3: 2900, 4: 3750 }; // Approx $15, $25, $35, $45 in INR
  const foreignCost = foreignRates[foreignPersons] || 0;

  const total = basePrice + indianCost + foreignCost;

  // Update display
  document.getElementById(
    "indian-cost"
  ).textContent = `₹${indianCost.toLocaleString()}`;
  document.getElementById(
    "foreign-cost"
  ).textContent = `₹${foreignCost.toLocaleString()}`;
  document.getElementById(
    "package-base-cost"
  ).textContent = `₹${basePrice.toLocaleString()}`;
  document.getElementById(
    "payable-amount"
  ).textContent = `₹${total.toLocaleString()}`;
}

// Form validation
function validateForm() {
  let isValid = true;
  const fields = [
    { id: "name", errorId: "name-error", minLength: 3 },
    { id: "mobile", errorId: "mobile-error", pattern: /^[0-9]{10}$/ },
    {
      id: "email",
      errorId: "email-error",
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    { id: "id-proof-type", errorId: "id-proof-error" },
    { id: "id-proof", errorId: "id-proof-error" },
    { id: "state", errorId: "state-error" },
    { id: "indian-persons", errorId: "indian-persons-error" },
    { id: "booking-date", errorId: "booking-date-error" },
    { id: "safari-timing", errorId: "safari-timing-error" },
    { id: "address", errorId: "address-error", minLength: 15 },
  ];

  fields.forEach((field) => {
    const element = document.getElementById(field.id);
    const errorElement = document.getElementById(field.errorId);
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
      errorElement.classList.add("hidden");
    } else {
      element.classList.remove("border-green-500");
      element.classList.add("border-red-500");
      errorElement.classList.remove("hidden");
      isValid = false;
    }
  });

  // Terms checkbox validation
  const termsCheckbox = document.getElementById("terms-checkbox");
  const termsError = document.getElementById("terms-error");
  if (!termsCheckbox.checked) {
    termsError.classList.remove("hidden");
    isValid = false;
  } else {
    termsError.classList.add("hidden");
  }

  return isValid;
}

// WhatsApp booking
function bookViaWhatsApp() {
  const formData = new FormData(document.getElementById("booking-form"));
  const packageType = getPackageFromURL();
  const config = packageConfigs[packageType];

  const message =
    `🌊 Chambal Safari Booking Request\n\n` +
    `📦 Package: ${config.name}\n` +
    `👤 Name: ${formData.get("name")}\n` +
    `📱 Mobile: +91${formData.get("mobile")}\n` +
    `📧 Email: ${formData.get("email")}\n` +
    `👥 Indian Visitors: ${formData.get("indian-persons")}\n` +
    `🌍 Foreign Visitors: ${formData.get("foreigner-persons")}\n` +
    `📅 Date: ${formData.get("booking-date")}\n` +
    `⏰ Time: ${formData.get("safari-timing")}\n` +
    `📍 Address: ${formData.get("address")}\n\n` +
    `💰 Estimated Total: ${
      document.getElementById("payable-amount").textContent
    }`;

  const whatsappURL = `https://wa.me/918076438491?text=${encodeURIComponent(
    message
  )}`;
  window.open(whatsappURL, "_blank");
}

// Package selection from comparison modal
function selectPackage(packageType) {
  window.location.href = `chambal-booking-page.html?package=${packageType}`;
}

// Counter animation
function animateCounters() {
  const counters = document.querySelectorAll(".counter");
  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    const increment = target / 100;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current);
    }, 20);
  });
}

// Advanced calculator
function updateCalculator() {
  const packageType =
    document.getElementById("calc-package")?.value || "standard";
  const indianCount = parseInt(
    document.getElementById("calc-indian")?.value || 0
  );
  const foreignCount = parseInt(
    document.getElementById("calc-foreign")?.value || 0
  );

  const basePrice = packageConfigs[packageType].price;
  const indianRates = {
    0: 0,
    1: 500,
    2: 900,
    3: 1200,
    4: 1500,
    5: 1800,
    6: 2100,
  };
  const foreignRates = { 0: 0, 1: 1250, 2: 2100, 3: 2900, 4: 3750 };

  const total =
    basePrice +
    (indianRates[indianCount] || 0) +
    (foreignRates[foreignCount] || 0);
  document.getElementById(
    "calc-total"
  ).textContent = `₹${total.toLocaleString()}`;
}

// Back to top functionality
function handleBackToTop() {
  const button = document.getElementById("back-to-top-btn");
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      button.style.opacity = "1";
    } else {
      button.style.opacity = "0";
    }
  });

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Show live booking counter
function showLiveBookings() {
  const notifications = [
    "Someone from Delhi just booked Premium Safari",
    "Family from Mumbai booked Luxury Safari",
    "Couple from Jaipur booked Standard Safari",
    "Group from Pune booked Deluxe Safari",
  ];

  setInterval(() => {
    const randomNotification =
      notifications[Math.floor(Math.random() * notifications.length)];
    const notification = document.createElement("div");
    notification.className =
      "fixed bottom-24 left-4 bg-white border-l-4 border-green-500 p-4 rounded-lg shadow-lg max-w-sm z-40";
    notification.innerHTML = `
                    <div class="flex items-center">
                        <i class="fas fa-check-circle text-green-500 mr-2"></i>
                        <p class="text-sm text-gray-700">${randomNotification}</p>
                    </div>
                `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 4000);
  }, 15000);
}

// Smart Recommendation System
function showSmartRecommendation() {
  const visitors =
    parseInt(document.getElementById("indian-persons").value) || 0;
  const foreigners =
    parseInt(document.getElementById("foreigner-persons").value) || 0;
  const totalVisitors = visitors + foreigners;

  let recommendation = "standard";
  let reasonText = "";

  if (totalVisitors >= 5) {
    recommendation = "luxury";
    reasonText =
      "For large groups, Luxury Safari offers the best comfort and privacy!";
  } else if (totalVisitors >= 3) {
    recommendation = "premium";
    reasonText =
      "Premium Safari is perfect for your group size with lunch included!";
  } else if (foreigners > 0) {
    recommendation = "deluxe";
    reasonText =
      "International visitors love our Deluxe package with extended duration!";
  } else {
    recommendation = "standard";
    reasonText =
      "Standard Safari offers great value with all essential experiences!";
  }

  document.getElementById("recommendation-text").textContent = reasonText;
  document.getElementById("smart-recommendation").classList.remove("hidden");

  // Auto-hide after 10 seconds
  setTimeout(() => {
    document.getElementById("smart-recommendation").classList.add("hidden");
  }, 10000);
}

// Live notifications system
function showLiveNotifications() {
  const notifications = [
    {
      type: "booking",
      message: "Amit from Delhi just booked Premium Safari for tomorrow!",
      icon: "🎉",
    },
    {
      type: "review",
      message: 'New 5-star review: "Amazing gharial sightings!"',
      icon: "⭐",
    },
    {
      type: "activity",
      message: "Wildlife activity is HIGH right now - perfect for safari!",
      icon: "🦅",
    },
    {
      type: "offer",
      message: "Limited time: 10% off on group bookings of 4+ people",
      icon: "🎁",
    },
    {
      type: "social",
      message: "Sarah shared beautiful safari photos on Instagram",
      icon: "📸",
    },
  ];

  function showNotification() {
    const notification =
      notifications[Math.floor(Math.random() * notifications.length)];
    const notificationEl = document.createElement("div");
    notificationEl.className =
      "fixed top-20 right-4 bg-white border-l-4 border-teal-500 p-4 rounded-lg shadow-xl max-w-sm z-50 notification-slide";
    notificationEl.innerHTML = `
                    <div class="flex items-start">
                        <div class="text-2xl mr-3">${notification.icon}</div>
                        <div class="flex-1">
                            <p class="text-sm font-medium text-gray-800">${notification.message}</p>
                            <p class="text-xs text-gray-500 mt-1">Just now</p>
                        </div>
                        <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-sm"></i>
                        </button>
                    </div>
                `;

    document.body.appendChild(notificationEl);

    // Auto remove after 6 seconds
    setTimeout(() => {
      if (notificationEl.parentNode) {
        notificationEl.remove();
      }
    }, 6000);
  }

  // Show first notification after 3 seconds
  setTimeout(showNotification, 3000);

  // Then show random notifications every 20-30 seconds
  setInterval(() => {
    if (Math.random() > 0.3) {
      // 70% chance to show
      showNotification();
    }
  }, 25000);
}

// Dynamic pricing based on time/demand
function updateDynamicPricing() {
  const hour = new Date().getHours();
  const selectedDate = new Date(document.getElementById("booking-date").value);
  const today = new Date();
  const daysFromNow = Math.ceil((selectedDate - today) / (1000 * 60 * 60 * 24));

  let multiplier = 1;
  let priceNote = "";

  // Peak hours (morning and evening)
  if ((hour >= 6 && hour <= 9) || (hour >= 16 && hour <= 18)) {
    multiplier = 1.1;
    priceNote = "🔥 Peak Time Pricing (+10%)";
  }

  // Last minute booking (within 2 days)
  if (daysFromNow <= 2 && daysFromNow >= 0) {
    multiplier *= 1.15;
    priceNote += " ⚡ Last Minute Booking (+15%)";
  }

  // Weekend pricing (Friday-Sunday)
  const dayOfWeek = selectedDate.getDay();
  if (dayOfWeek >= 5 || dayOfWeek === 0) {
    multiplier *= 1.05;
    priceNote += " 🌟 Weekend Premium (+5%)";
  }

  // Show price note if different from base price
  if (multiplier !== 1) {
    const priceNoteEl =
      document.getElementById("price-note") || document.createElement("div");
    priceNoteEl.id = "price-note";
    priceNoteEl.className = "text-xs text-orange-600 font-medium mt-1";
    priceNoteEl.textContent = priceNote;

    const packagePriceEl = document.getElementById("package-price");
    if (!document.getElementById("price-note")) {
      packagePriceEl.parentNode.appendChild(priceNoteEl);
    }
  }
}

// Payment process function
function startPaymentProcess() {
  // Create payment modal
  const paymentModal = document.createElement("div");
  paymentModal.className =
    "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4";
  paymentModal.innerHTML = `
                <div class="bg-white rounded-2xl max-w-md w-full p-6">
                    <div class="text-center">
                        <div id="payment-step-1" class="">
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
                                    <span class="font-semibold">${
                                      document.getElementById("payable-amount")
                                        .textContent
                                    }</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-600">Payment Method:</span>
                                    <span class="font-semibold">Demo Card ****1234</span>
                                </div>
                            </div>
                        </div>
                        
                        <div id="payment-step-2" class="hidden">
                            <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-check text-3xl text-white"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
                            <p class="text-gray-600 mb-6">Your booking has been confirmed.</p>
                            <button onclick="showBookingConfirmation()" class="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                                View Booking Details
                            </button>
                        </div>
                    </div>
                </div>
            `;

  document.body.appendChild(paymentModal);

  // Simulate payment processing
  setTimeout(() => {
    document.getElementById("payment-step-1").classList.add("hidden");
    document.getElementById("payment-step-2").classList.remove("hidden");
  }, 1500);
}

// Show booking confirmation
function showBookingConfirmation() {
  // Remove payment modal
  document
    .querySelectorAll(".fixed.inset-0")
    .forEach((modal) => modal.remove());

  // Get form data
  const formData = new FormData(document.getElementById("booking-form"));
  const packageType = getPackageFromURL();
  const config = packageConfigs[packageType];
  const bookingId =
    "CB" + Math.random().toString(36).substr(2, 9).toUpperCase();

  // Create confirmation modal
  const confirmationModal = document.createElement("div");
  confirmationModal.className =
    "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4";
  confirmationModal.innerHTML = `
                <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="p-6 border-b border-gray-200">
                        <div class="flex items-center justify-between">
                            <h2 class="text-2xl font-bold text-green-600">Booking Confirmed!</h2>
                            <button onclick="this.parentElement.parentElement.parentElement.parentElement.remove(); resetForm()" class="text-gray-500 hover:text-gray-700">
                                <i class="fas fa-times text-2xl"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="p-6">
                        <!-- Success Icon -->
                        <div class="text-center mb-6">
                            <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-check-circle text-4xl text-green-500"></i>
                            </div>
                            <p class="text-lg text-gray-600">Your Chambal Safari booking has been successfully confirmed!</p>
                        </div>
                        
                        <!-- Booking Details -->
                        <div class="bg-gray-50 rounded-xl p-6 mb-6">
                            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <i class="fas fa-info-circle text-teal-500 mr-2"></i>
                                Booking Details
                            </h3>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-3">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Booking ID:</span>
                                        <span class="font-semibold text-teal-600">${bookingId}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Package:</span>
                                        <span class="font-semibold">${
                                          config.name
                                        }</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Name:</span>
                                        <span class="font-semibold">${formData.get(
                                          "name"
                                        )}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Mobile:</span>
                                        <span class="font-semibold">+91 ${formData.get(
                                          "mobile"
                                        )}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Email:</span>
                                        <span class="font-semibold">${formData.get(
                                          "email"
                                        )}</span>
                                    </div>
                                </div>
                                
                                <div class="space-y-3">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Safari Date:</span>
                                        <span class="font-semibold">${new Date(
                                          formData.get("booking-date")
                                        ).toLocaleDateString("en-IN")}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Time Slot:</span>
                                        <span class="font-semibold">${formData.get(
                                          "safari-timing"
                                        )}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Indian Visitors:</span>
                                        <span class="font-semibold">${formData.get(
                                          "indian-persons"
                                        )}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Foreign Visitors:</span>
                                        <span class="font-semibold">${
                                          formData.get("foreigner-persons") || 0
                                        }</span>
                                    </div>
                                    <div class="flex justify-between border-t pt-2">
                                        <span class="text-gray-800 font-semibold">Total Amount:</span>
                                        <span class="font-bold text-xl text-green-600">${
                                          document.getElementById(
                                            "payable-amount"
                                          ).textContent
                                        }</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Important Instructions -->
                        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <h4 class="font-semibold text-yellow-800 mb-2 flex items-center">
                                <i class="fas fa-exclamation-triangle mr-2"></i>
                                Important Instructions
                            </h4>
                            <ul class="text-sm text-yellow-700 space-y-1">
                                <li>• Please arrive 30 minutes before your scheduled time at Palighat Chambal</li>
                                <li>• Carry a valid photo ID proof for verification</li>
                                <li>• Life jackets are mandatory and will be provided</li>
                                <li>• Safari is subject to weather conditions</li>
                            </ul>
                        </div>
                        
                        <!-- Action Buttons -->
                        <div class="flex flex-col sm:flex-row gap-4">
                            <button onclick="downloadBookingPDF('${bookingId}')" class="flex-1 bg-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center">
                                <i class="fas fa-download mr-2"></i>
                                Download Booking
                            </button>
                            <button onclick="sendBookingWhatsApp()" class="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center">
                                <i class="fab fa-whatsapp mr-2"></i>
                                Share on WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            `;

  document.body.appendChild(confirmationModal);

  // Reset form after showing confirmation
  document.getElementById("btn-text").innerHTML =
    '<i class="fas fa-credit-card mr-2"></i>Proceed to Payment';
  document.getElementById("loading-spinner").classList.add("hidden");
}

// Reset form function
function resetForm() {
  document.getElementById("booking-form").reset();
  calculateTotal();
  document.getElementById("btn-text").innerHTML =
    '<i class="fas fa-credit-card mr-2"></i>Proceed to Payment';
  document.getElementById("loading-spinner").classList.add("hidden");
}

// Download booking PDF (dummy function)
function downloadBookingPDF(bookingId) {
  alert(
    `Booking PDF for ${bookingId} will be downloaded. (This is a demo - actual PDF generation would be implemented here)`
  );
}

// Send booking details via WhatsApp
function sendBookingWhatsApp() {
  const formData = new FormData(document.getElementById("booking-form"));
  const packageType = getPackageFromURL();
  const config = packageConfigs[packageType];

  const message =
    `🎉 Booking Confirmed!\n\n` +
    `🌊 Chambal Safari Booking\n` +
    `📦 Package: ${config.name}\n` +
    `👤 Name: ${formData.get("name")}\n` +
    `📱 Mobile: +91${formData.get("mobile")}\n` +
    `📅 Date: ${formData.get("booking-date")}\n` +
    `⏰ Time: ${formData.get("safari-timing")}\n` +
    `👥 Visitors: ${formData.get("indian-persons")} Indian, ${
      formData.get("foreigner-persons") || 0
    } Foreign\n` +
    `💰 Total Paid: ${
      document.getElementById("payable-amount").textContent
    }\n\n` +
    `✅ Payment Status: Confirmed\n` +
    `📍 Report at: Palighat Chambal (30 min before time)`;

  const whatsappURL = `https://wa.me/918076438491?text=${encodeURIComponent(
    message
  )}`;
  window.open(whatsappURL, "_blank");
}

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  updatePackageDisplay();
  setMinDate();
  showLiveBookings();
  animateCounters();
  handleBackToTop();
  showLiveNotifications();
  updateDynamicPricing();

  // Modal event listeners
  document
    .getElementById("compare-packages-btn")
    .addEventListener("click", function () {
      document.getElementById("comparison-modal").classList.remove("hidden");
    });

  document
    .getElementById("close-comparison-modal")
    .addEventListener("click", function () {
      document.getElementById("comparison-modal").classList.add("hidden");
    });

    // Close Modal from escape button

     document.addEventListener('keydown', (e)=> {
        if(e.key === 'Escape'){
            document.getElementById("comparison-modal").classList.add("hidden");
            document.getElementById("gallery-modal").classList.add("hidden");
            document.getElementById("calculator-modal").classList.add("hidden");
            document.getElementById("availability-modal").classList.add("hidden");
            document.getElementById("safari-map-modal").classList.add("hidden");
        }
    })

  document
    .getElementById("view-gallery-btn")
    .addEventListener("click", function () {
      document.getElementById("gallery-modal").classList.remove("hidden");
    });

  document
    .getElementById("close-gallery-modal")
    .addEventListener("click", function () {
      document.getElementById("gallery-modal").classList.add("hidden");
    });

  // New modal listeners
  document
    .getElementById("pricing-calculator-btn")
    .addEventListener("click", function () {
      document.getElementById("calculator-modal").classList.remove("hidden");
      updateCalculator();
    });

  document
    .getElementById("close-calculator-modal")
    .addEventListener("click", function () {
      document.getElementById("calculator-modal").classList.add("hidden");
    });

  document
    .getElementById("availability-checker-btn")
    .addEventListener("click", function () {
      document.getElementById("availability-modal").classList.remove("hidden");
      // Set today's date as default
      const today = new Date().toISOString().split("T")[0];
      document.getElementById("availability-date").value = today;
    });

  document
    .getElementById("close-availability-modal")
    .addEventListener("click", function () {
      document.getElementById("availability-modal").classList.add("hidden");
    });

  // Calculator inputs
  document
    .getElementById("calc-package")
    ?.addEventListener("change", updateCalculator);
  document
    .getElementById("calc-indian")
    ?.addEventListener("input", updateCalculator);
  document
    .getElementById("calc-foreign")
    ?.addEventListener("input", updateCalculator);

  // Enhanced floating buttons
  const floatingWhatsAppBtn = document.getElementById('floating-whatsapp-btn');
  if (floatingWhatsAppBtn) {
    floatingWhatsAppBtn.addEventListener('click', function() {
      const message = `🌊 Hi! I'm interested in Chambal Safari booking. Can you help me?`;
      const whatsappURL = `https://wa.me/918076438491?text=${encodeURIComponent(message)}`;
      window.open(whatsappURL, '_blank');
    });
  }
  
  // Floating Call button functionality
  const floatingCallBtn = document.getElementById('floating-call-btn');
  if (floatingCallBtn) {
    floatingCallBtn.addEventListener('click', function() {
      window.location.href = 'tel:+918076438491';
    });
  }

  // New advanced modal listeners
  document
    .getElementById("safari-map-btn")
    .addEventListener("click", function () {
      document.getElementById("safari-map-modal").classList.remove("hidden");
    });

  document
    .getElementById("close-safari-map-modal")
    .addEventListener("click", function () {
      document.getElementById("safari-map-modal").classList.add("hidden");
    });

  // Smart recommendation
  document
    .getElementById("accept-recommendation")
    .addEventListener("click", function () {
      const recommendedPackage = "premium"; // This would be dynamic
      window.location.href = `chambal-booking-page.html?package=${recommendedPackage}`;
    });

  // Close modals on overlay click
  document
    .getElementById("comparison-modal")
    .addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.add("hidden");
      }
    });

  document
    .getElementById("gallery-modal")
    .addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.add("hidden");
      }
    });

  document
    .getElementById("safari-map-modal")
    .addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.add("hidden");
      }
    });

  // Add event listeners
  document
    .getElementById("indian-persons")
    .addEventListener("change", function () {
      calculateTotal();
      showSmartRecommendation();
    });
  document
    .getElementById("foreigner-persons")
    .addEventListener("change", function () {
      calculateTotal();
      showSmartRecommendation();
    });
  document
    .getElementById("booking-date")
    .addEventListener("change", updateDynamicPricing);
  document
    .getElementById("whatsapp-btn")
    .addEventListener("click", function (e) {
      e.preventDefault();
      if (validateForm()) {
        bookViaWhatsApp();
      }
    });

  document.getElementById("go-back-btn").addEventListener("click", function () {
    window.history.back();
  });

  document
    .getElementById("booking-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      if (validateForm()) {
        // Show loading
        document.getElementById("btn-text").innerHTML = "Processing...";
        document.getElementById("loading-spinner").classList.remove("hidden");

        // Start payment process
        startPaymentProcess();
      }
    });

  // Real-time validation
  const inputs = document.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      if (this.value) validateForm();
    });
    input.addEventListener("input", function () {
      if (this.classList.contains("border-red-500")) {
        validateForm();
      }
    });
  });

  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }
    });
  }, observerOptions);

  // Observe all elements with fade-in class
  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el);
  });

  // Add slide-up animation to form
  setTimeout(() => {
    document.getElementById("booking-form").classList.add("slide-up");
  }, 500);

  // Initial calculation
  calculateTotal();
});
