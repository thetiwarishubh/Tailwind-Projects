// ================================
// HOTEL BOOKING SYSTEM
// Clean & Optimized Version
// ================================

class HotelBookingSystem {
  constructor() {
    this.currentHotel = this.initializeDefaultHotel();
    this.promoCodes = {
      SAVE10: 0.1,
      WELCOME5: 0.05,
      FIRST15: 0.15,
    };
    this.autoplayInterval = null;
    this.currentImage = 0;
    this.carouselImages = [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
      "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800",
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800",
    ];

    this.init();
  }

  // ================================
  // INITIALIZATION METHODS
  // ================================

  initializeDefaultHotel() {
    const urlParams = this.getURLParams();

    return {
      id: "luxury-safari-lodge",
      name: urlParams.get("hotelName") || "Luxury Safari Lodge",
      location:
        urlParams.get("hotelLocation") ||
        "Ranthambhore National Park, Rajasthan",
      description:
        urlParams.get("hotelDescription") ||
        "A premium hotel offering comfortable accommodation with excellent amenities.",
      selectedImage:
        urlParams.get("hotelImage") ||
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
      prices: {
        standard: parseInt(urlParams.get("standardPrice")) || 8000,
        deluxe: parseInt(urlParams.get("deluxePrice")) || 10000,
        suite: parseInt(urlParams.get("suitePrice")) || 15000,
      },
    };
  }

  init() {
    this.loadHotelData();
    this.initializeEventListeners();
    this.initializeDateRestrictions();
    this.initializeCarousel();
    this.initializeMobileMenu();
  }

  // ================================
  // UTILITY METHODS
  // ================================

  getURLParams() {
    return new URLSearchParams(window.location.search);
  }

  formatCurrency(amount) {
    return `₹${amount.toLocaleString("en-IN")}`;
  }

  // ================================
  // HOTEL DATA MANAGEMENT
  // ================================

  loadHotelData() {
    this.updateHotelDisplay();
  }

  // ================================
  // DOM UPDATE METHODS
  // ================================

  updateHotelDisplay() {
    if (!this.currentHotel) return;

    this.updateBasicInfo();
    this.updateRoomTypeOptions();
    this.updatePageTitle();
    this.updateCarouselImages();
  }

  updateBasicInfo() {
    const elements = {
      "hotel-name": this.currentHotel.name,
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });
  }

  updateRoomTypeOptions() {
    const roomTypeSelect = document.getElementById("room-type");
    if (!roomTypeSelect || !this.currentHotel.prices) return;

    roomTypeSelect.innerHTML = `
            <option value="standard">Standard Room (${this.formatCurrency(
              this.currentHotel.prices.standard
            )}/night)</option>
            <option value="deluxe">Deluxe Room (${this.formatCurrency(
              this.currentHotel.prices.deluxe
            )}/night)</option>
            <option value="suite">Suite (${this.formatCurrency(
              this.currentHotel.prices.suite
            )}/night)</option>
        `;
  }

  updatePageTitle() {
    document.title = `Book ${this.currentHotel.name} - Ranthambhore 360`;
  }

  // ================================
  // CAROUSEL FUNCTIONALITY
  // ================================

  initializeCarousel() {
    this.createCarouselDots();
    this.addCarouselEventListeners();
    this.startAutoplay();
  }

  updateCarouselImages() {
    const images = document.querySelectorAll(".carousel-image");

    // If a specific hotel image was selected, use it as the first image
    if (this.currentHotel.selectedImage) {
      // Update carousel images array with selected image as first
      this.carouselImages = [
        this.currentHotel.selectedImage,
        ...this.carouselImages.filter(
          (img) => img !== this.currentHotel.selectedImage
        ),
      ];
    }

    // Update each carousel image
    images.forEach((img, index) => {
      if (this.carouselImages[index]) {
        img.src = this.carouselImages[index];
        img.alt = `${this.currentHotel.name} Image ${index + 1}`;

        // Add error handling for image loading (prevent infinite loops)
        if (!img.dataset.errorHandlerAdded) {
          img.onerror = () => {
            img.src = `https://via.placeholder.com/600x300/e5e7eb/9ca3af?text=Hotel+Image+${
              index + 1
            }`;
            img.dataset.errorHandlerAdded = "true";
          };

          // Add loading indicator
          img.onload = () => {
            img.style.opacity = "1";
          };
        }

        // Set visibility - show first image, hide others
        if (index === 0) {
          img.classList.remove("hidden");
          img.style.opacity = "1";
        } else {
          img.classList.add("hidden");
        }
      }
    });

    // Add click event to carousel images for lightbox (only if not already added)
    images.forEach((img, index) => {
      // Only add listeners if not already added
      if (!img.dataset.listenerAdded) {
        // Create a new click handler
        const clickHandler = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.showImageLightbox(img.src, img.alt);
        };

        img.addEventListener("click", clickHandler);
        img.dataset.listenerAdded = "true";

        // Set visual indicators
        img.style.cursor = "pointer";
        img.title = "Click to view larger image";
      }
    });
  }

  createCarouselDots() {
    const dotsContainer = document.getElementById("carousel-dots");
    if (!dotsContainer) return;

    dotsContainer.innerHTML = "";

    // Get actual carousel images from DOM
    const carouselImages = document.querySelectorAll(".carousel-image");
    const imageCount = Math.max(
      carouselImages.length,
      this.carouselImages.length
    );

    // Create dots for each image
    for (let i = 0; i < imageCount; i++) {
      const dot = document.createElement("span");
      dot.className = `h-2 w-2 bg-gray-400 rounded-full mx-1 cursor-pointer transition-colors hover:bg-gray-600 ${
        i === 0 ? "bg-gray-800" : ""
      }`;
      dot.addEventListener("click", () => this.showImage(i));
      dotsContainer.appendChild(dot);
    }
  }

  addCarouselEventListeners() {
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const carousel = document.getElementById("carousel");

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const images = document.querySelectorAll(".carousel-image");
        if (images.length > 0) {
          const newIndex =
            this.currentImage - 1 < 0
              ? images.length - 1
              : this.currentImage - 1;
          this.showImage(newIndex);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const images = document.querySelectorAll(".carousel-image");
        if (images.length > 0) {
          const newIndex =
            this.currentImage + 1 >= images.length ? 0 : this.currentImage + 1;
          this.showImage(newIndex);
        }
      });
    }

    if (carousel) {
      carousel.addEventListener("mouseenter", () => this.stopAutoplay());
      carousel.addEventListener("mouseleave", () => this.startAutoplay());
    }
  }

  showImage(index) {
    const images = document.querySelectorAll(".carousel-image");
    const dots = document.getElementById("carousel-dots")?.children;

    // Validate index
    if (index < 0 || index >= images.length) return;

    // Hide current image
    if (images[this.currentImage]) {
      images[this.currentImage].classList.add("hidden");
    }

    // Show new image
    if (images[index]) {
      images[index].classList.remove("hidden");
    }

    // Update dots
    if (dots && dots.length > 0) {
      if (dots[this.currentImage]) {
        dots[this.currentImage].classList.remove("bg-gray-800");
        dots[this.currentImage].classList.add("bg-gray-400");
      }
      if (dots[index]) {
        dots[index].classList.remove("bg-gray-400");
        dots[index].classList.add("bg-gray-800");
      }
    }

    this.currentImage = index;
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => {
      const images = document.querySelectorAll(".carousel-image");
      if (images.length > 0) {
        const nextIndex =
          this.currentImage + 1 >= images.length ? 0 : this.currentImage + 1;
        this.showImage(nextIndex);
      }
    }, 5000);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  // ================================
  // MOBILE MENU FUNCTIONALITY
  // ================================

  initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuIcon = document.getElementById("menu-icon");
    const closeIcon = document.getElementById("close-icon");

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isHidden = mobileMenu.classList.contains("hidden");

        if (isHidden) {
          mobileMenu.classList.remove("hidden");
          if (menuIcon) menuIcon.classList.add("hidden");
          if (closeIcon) closeIcon.classList.remove("hidden");
        } else {
          mobileMenu.classList.add("hidden");
          if (menuIcon) menuIcon.classList.remove("hidden");
          if (closeIcon) closeIcon.classList.add("hidden");
        }
      });

      // Close mobile menu when clicking outside
      document.addEventListener("click", (e) => {
        if (
          !mobileMenuBtn.contains(e.target) &&
          !mobileMenu.contains(e.target)
        ) {
          mobileMenu.classList.add("hidden");
          if (menuIcon) menuIcon.classList.remove("hidden");
          if (closeIcon) closeIcon.classList.add("hidden");
        }
      });
    }
  }

  // ================================
  // FORM FUNCTIONALITY
  // ================================

  initializeEventListeners() {
    this.initializeDateInputs();
    this.initializeGuestSelection();
    this.initializeRoomTypeChange();
    this.initializeFormSubmission();
    this.initializePriceCalculation();
    this.initializeValidation();
  }

  initializeDateRestrictions() {
    const today = new Date();
    const checkInInput = document.getElementById("check-in");
    const checkOutInput = document.getElementById("check-out");

    if (checkInInput)
      checkInInput.setAttribute("min", today.toISOString().split("T")[0]);
    if (checkOutInput)
      checkOutInput.setAttribute("min", today.toISOString().split("T")[0]);
  }

  initializeDateInputs() {
    const checkInInput = document.getElementById("check-in");
    const checkOutInput = document.getElementById("check-out");

    if (checkInInput) {
      checkInInput.addEventListener("change", () => {
        this.updateCheckOutMinDate();
        this.updatePrice();
        this.updateProgress();
      });
    }

    if (checkOutInput) {
      checkOutInput.addEventListener("change", () => {
        this.updatePrice();
        this.updateProgress();
      });
    }
  }

  updateCheckOutMinDate() {
    const checkInInput = document.getElementById("check-in");
    const checkOutInput = document.getElementById("check-out");

    if (checkInInput && checkOutInput && checkInInput.value) {
      const checkInDate = new Date(checkInInput.value);
      const nextDay = new Date(checkInDate);
      nextDay.setDate(checkInDate.getDate() + 1);
      checkOutInput.setAttribute("min", nextDay.toISOString().split("T")[0]);
    }
  }

  initializeGuestSelection() {
    const guestsSelect = document.getElementById("guests");
    const guestDetails = document.getElementById("guest-details");

    if (guestsSelect && guestDetails) {
      guestsSelect.addEventListener("change", () => {
        this.generateGuestInputs();
        this.updatePrice();
        this.updateProgress();
      });
    }
  }

  generateGuestInputs() {
    const guestsSelect = document.getElementById("guests");
    const guestDetails = document.getElementById("guest-details");

    if (!guestsSelect || !guestDetails) return;

    const numGuests = parseInt(guestsSelect.value);
    guestDetails.innerHTML = "";

    for (let i = 1; i <= numGuests; i++) {
      const div = document.createElement("div");
      div.className = "mb-4 animate-form";
      div.innerHTML = `
                <label for="guest-name-${i}" class="block text-sm font-medium text-gray-700">Guest ${i} Name:</label>
                <input type="text" id="guest-name-${i}" name="guest-name-${i}" 
                       placeholder="Enter guest name" 
                       class="mt-1 p-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500 focus:scale-105 transition-transform duration-200" 
                       required>
                <p id="guest-name-${i}-error" class="text-red-500 text-sm hidden animate-pulse">Please enter a valid name</p>
            `;
      guestDetails.appendChild(div);

      const guestInput = document.getElementById(`guest-name-${i}`);
      if (guestInput) {
        guestInput.addEventListener("input", (e) => this.validateRealTime(e));
      }
    }
  }

  initializeRoomTypeChange() {
    const roomTypeSelect = document.getElementById("room-type");
    if (roomTypeSelect) {
      roomTypeSelect.addEventListener("change", () => {
        this.updateRoomImage(roomTypeSelect.value);
        this.updatePrice();
      });
    }
  }

  updateRoomImage(roomType) {
    const roomImage = document.getElementById("room-image");
    if (!roomImage || !this.currentHotel?.roomImages) return;

    const imageSrc =
      this.currentHotel.roomImages[roomType] ||
      this.currentHotel.roomImages.standard ||
      "https://via.placeholder.com/150x100?text=Room+Image";

    roomImage.src = imageSrc;
    roomImage.alt = `${
      roomType.charAt(0).toUpperCase() + roomType.slice(1)
    } Room`;
    roomImage.onerror = () => {
      roomImage.src = "https://via.placeholder.com/150x100?text=Room+Image";
    };
  }

  initializePriceCalculation() {
    const elements = ["check-in", "check-out", "room-type", "promo-code"];
    elements.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener("change", () => this.updatePrice());
      }
    });
  }

  updatePrice() {
    const checkInInput = document.getElementById("check-in");
    const checkOutInput = document.getElementById("check-out");
    const roomTypeSelect = document.getElementById("room-type");
    const totalPriceEl = document.getElementById("total-price");

    if (!checkInInput || !checkOutInput || !roomTypeSelect || !totalPriceEl)
      return;

    const checkIn = new Date(checkInInput.value);
    const checkOut = new Date(checkOutInput.value);
    const roomType = roomTypeSelect.value;

    if (
      !checkIn ||
      !checkOut ||
      checkOut <= checkIn ||
      !this.currentHotel?.prices?.[roomType]
    ) {
      totalPriceEl.textContent = this.formatCurrency(0);
      return;
    }

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const roomCharges = this.currentHotel.prices[roomType] * nights;
    const taxesAndFees = Math.round(roomCharges * 0.12);
    const discount = this.calculateDiscount(roomCharges);
    const total = roomCharges + taxesAndFees - discount;

    this.updatePriceBreakdown(roomCharges, taxesAndFees, discount, total);
    this.updateProgress();
  }

  calculateDiscount(roomCharges) {
    const promoCodeInput = document.getElementById("promo-code");
    if (!promoCodeInput?.value) return 0;

    const discountRate = this.promoCodes[promoCodeInput.value];
    return discountRate ? Math.round(roomCharges * discountRate) : 0;
  }

  updatePriceBreakdown(roomCharges, taxesAndFees, discount, total) {
    const elements = {
      "total-price": this.formatCurrency(total),
      "room-charges": this.formatCurrency(roomCharges),
      "taxes-fees": this.formatCurrency(taxesAndFees),
      "discount-amount": `-${this.formatCurrency(discount)}`,
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });

    // Show/hide savings indicator
    const savingsIndicator = document.getElementById("savings-indicator");
    const savingsAmountEl = document.getElementById("savings-amount");

    if (discount > 0) {
      savingsIndicator?.classList.remove("hidden");
      if (savingsAmountEl)
        savingsAmountEl.textContent = this.formatCurrency(discount);
    } else {
      savingsIndicator?.classList.add("hidden");
    }
  }

  updateProgress() {
    // Implementation for progress bar updates
    // This would track form completion percentage
  }

  // ================================
  // VALIDATION
  // ================================

  initializeValidation() {
    const inputs = document.querySelectorAll(
      '#booking-form input:not([type="date"])'
    );
    inputs.forEach((input) => {
      input.addEventListener("input", (e) => this.validateRealTime(e));
    });
  }

  validateRealTime(event) {
    const input = event.target;
    const validators = {
      name: (val) => val && /^[a-zA-Z\s]+$/.test(val),
      email: (val) => val && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      phone: (val) => val && /^\d{10}$/.test(val),
    };

    const fieldType = input.id.startsWith("guest-name-") ? "name" : input.id;
    const validator = validators[fieldType];

    if (!validator) return;

    const isValid = validator(input.value);
    const errorElement = document.getElementById(`${input.id}-error`);

    this.updateFieldVisualState(input, isValid);
    if (errorElement) {
      errorElement.classList.toggle("hidden", isValid);
    }
  }

  updateFieldVisualState(input, isValid) {
    input.classList.remove(
      "border-red-300",
      "bg-red-50",
      "border-green-300",
      "bg-green-50"
    );

    if (isValid) {
      input.classList.add("border-green-300", "bg-green-50");
      setTimeout(() => {
        input.classList.remove("border-green-300", "bg-green-50");
        input.classList.add("border-gray-200");
      }, 2000);
    } else {
      input.classList.add("border-red-300", "bg-red-50", "animate-pulse");
      setTimeout(() => input.classList.remove("animate-pulse"), 1000);
    }
  }

  // ================================
  // FORM SUBMISSION
  // ================================

  initializeFormSubmission() {
    const form = document.getElementById("booking-form");
    if (form) {
      form.addEventListener("submit", (e) => this.handleSubmit(e));
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    if (!this.validateForm()) return;

    this.showLoadingState();

    setTimeout(() => {
      this.hideLoadingState();
      this.showBookingConfirmation();
      this.resetForm();
    }, 2000);
  }

  validateForm() {
    const requiredFields = ["name", "email", "phone", "check-in", "check-out"];
    let isValid = true;

    requiredFields.forEach((fieldId) => {
      const element = document.getElementById(fieldId);
      if (!element?.value) {
        isValid = false;
        this.updateFieldVisualState(element, false);
      }
    });

    return isValid;
  }

  showLoadingState() {
    const btn = document.getElementById("book-now-btn");
    const btnText = document.getElementById("btn-text");
    const spinner = document.getElementById("loading-spinner");

    if (btn) btn.disabled = true;
    if (btnText) btnText.classList.add("hidden");
    if (spinner) spinner.classList.remove("hidden");
  }

  hideLoadingState() {
    const btn = document.getElementById("book-now-btn");
    const btnText = document.getElementById("btn-text");
    const spinner = document.getElementById("loading-spinner");

    if (btn) btn.disabled = false;
    if (btnText) btnText.classList.remove("hidden");
    if (spinner) spinner.classList.add("hidden");
  }

  showBookingConfirmation() {
    const bookingData = this.generateBookingData();
    this.createConfirmationModal(bookingData);
  }

  generateBookingData() {
    const checkInInput = document.getElementById("check-in");
    const checkOutInput = document.getElementById("check-out");

    return {
      bookingId: "HTL" + Date.now().toString().slice(-8),
      confirmationNumber:
        "CNF" + Math.random().toString(36).substr(2, 8).toUpperCase(),
      bookingDate: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      hotel: this.currentHotel.name,
      hotelAddress: this.currentHotel.location,
      guestName: document.getElementById("name")?.value,
      email: document.getElementById("email")?.value,
      phone: document.getElementById("phone")?.value,
      checkIn: new Date(checkInInput?.value).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      checkOut: new Date(checkOutInput?.value).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      roomType: document.getElementById("room-type")?.value,
      guests: document.getElementById("guests")?.value,
      totalAmount: document.getElementById("total-price")?.textContent,
      status: "CONFIRMED",
      paymentStatus: "PAID",
    };
  }

  createConfirmationModal(bookingData) {
    const modalHTML = `
            <div id="booking-success-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate__animated animate__bounceIn">
                    <!-- Header Section -->
                    <div class="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-3xl text-center">
                        <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <i class="fas fa-check-circle text-4xl text-white"></i>
                        </div>
                        <h2 class="text-3xl font-bold mb-2">🎉 Booking Confirmed!</h2>
                        <p class="text-green-100 font-medium">Your reservation has been successfully processed</p>
                        <div class="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                            <i class="fas fa-shield-check text-white"></i>
                            <span class="text-sm font-semibold">100% Secure Booking</span>
                        </div>
                    </div>
                    
                    <!-- Booking Details Section -->
                    <div class="p-6 space-y-6">
                        <!-- Booking ID & Status -->
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-blue-50 rounded-xl p-4 text-center">
                                <p class="text-sm text-gray-600 mb-1">Booking ID</p>
                                <p class="text-xl font-black text-blue-600">${bookingData.bookingId}</p>
                            </div>
                            <div class="bg-green-50 rounded-xl p-4 text-center">
                                <p class="text-sm text-gray-600 mb-1">Status</p>
                                <div class="inline-flex items-center gap-2">
                                    <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                                    <p class="text-lg font-bold text-green-600">${bookingData.status}</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Hotel Information -->
                        <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
                            <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <i class="fas fa-hotel text-blue-600"></i>
                                Hotel Details
                            </h3>
                            <div class="space-y-2">
                                <p class="text-xl font-bold text-gray-900">${bookingData.hotel}</p>
                                <p class="text-gray-600 flex items-start gap-2">
                                    <i class="fas fa-map-marker-alt text-red-500 mt-1"></i>
                                    ${bookingData.hotelAddress}
                                </p>
                            </div>
                        </div>
                        
                        <!-- Guest & Room Information -->
                        <div class="grid lg:grid-cols-2 gap-4">
                            <div class="bg-purple-50 rounded-xl p-4">
                                <h4 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <i class="fas fa-user text-purple-600"></i>
                                    Guest Details
                                </h4>
                                <div class="space-y-2 text-sm">
                                    <p><span class="font-semibold text-gray-700">Name:</span> ${bookingData.guestName}</p>
                                    <p><span class="font-semibold text-gray-700">Email:</span> ${bookingData.email}</p>
                                    <p><span class="font-semibold text-gray-700">Phone:</span> ${bookingData.phone}</p>
                                    <p><span class="font-semibold text-gray-700">Guests:</span> ${bookingData.guests} Person(s)</p>
                                </div>
                            </div>
                            
                            <div class="bg-amber-50 rounded-xl p-4">
                                <h4 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <i class="fas fa-bed text-amber-600"></i>
                                    Room Details
                                </h4>
                                <div class="space-y-2 text-sm">
                                    <p><span class="font-semibold text-gray-700">Room Type:</span> ${bookingData.roomType}</p>
                                    <p class="text-2xl font-black text-amber-600 mt-2">${bookingData.totalAmount}</p>
                                    <p class="text-xs text-gray-500">All taxes included</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Check-in/Check-out Timeline -->
                        <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
                            <h4 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <i class="fas fa-calendar-check text-indigo-600"></i>
                                Stay Timeline
                            </h4>
                            <div class="grid lg:grid-cols-2 gap-6">
                                <div class="text-center">
                                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <i class="fas fa-sign-in-alt text-2xl text-green-600"></i>
                                    </div>
                                    <p class="text-sm text-gray-600 mb-1">Check-in</p>
                                    <p class="font-bold text-gray-900">${bookingData.checkIn}</p>
                                    <p class="text-xs text-gray-500 mt-1">After 2:00 PM</p>
                                </div>
                                <div class="text-center">
                                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <i class="fas fa-sign-out-alt text-2xl text-red-600"></i>
                                    </div>
                                    <p class="text-sm text-gray-600 mb-1">Check-out</p>
                                    <p class="font-bold text-gray-900">${bookingData.checkOut}</p>
                                    <p class="text-xs text-gray-500 mt-1">Before 12:00 PM</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Action Buttons -->
                        <div class="flex flex-col gap-3 pt-4 border-t border-gray-200">
                            <button id="download-confirmation" class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                                <i class="fas fa-download"></i>
                                Download Confirmation PDF
                            </button>
                            
                            <div class="grid grid-cols-2 gap-3">
                                <button id="share-booking-details" class="bg-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                                    <i class="fas fa-share-alt"></i>
                                    Share Details
                                </button>
                                <button id="close-booking-modal" class="bg-gray-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                                    <i class="fas fa-times"></i>
                                    Close
                                </button>
                            </div>
                            
                            <!-- Contact Support -->
                            <div class="text-center mt-4 p-4 bg-blue-50 rounded-xl">
                                <p class="text-sm text-gray-600 mb-2">Need help with your booking?</p>
                                <div class="flex justify-center gap-4 text-sm">
                                    <a href="tel:8076438491" class="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold">
                                        <i class="fas fa-phone"></i>
                                        8076438491
                                    </a>
                                    <a href="mailto:ranthambore360@gmail.com" class="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold">
                                        <i class="fas fa-envelope"></i>
                                        Support Email
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
    this.initializeModalEventListeners(bookingData);
  }

  initializeModalEventListeners(bookingData) {
    setTimeout(() => {
      // Close modal
      document
        .getElementById("close-booking-modal")
        ?.addEventListener("click", () => {
          document.getElementById("booking-success-modal")?.remove();
        });

      // Download confirmation
      document
        .getElementById("download-confirmation")
        ?.addEventListener("click", () => {
          this.downloadConfirmation(bookingData);
        });

      // Share booking details
      document
        .getElementById("share-booking-details")
        ?.addEventListener("click", () => {
          this.shareBookingDetails(bookingData);
        });

      // Auto-close after 30 seconds
      setTimeout(() => {
        const modal = document.getElementById("booking-success-modal");
        if (modal) {
          modal.style.animation = "fadeOut 0.5s ease-out";
          setTimeout(() => modal.remove(), 500);
        }
      }, 30000);
    }, 100);
  }

  downloadConfirmation(bookingData) {
    const confirmationText = `
Hotel Booking Confirmation
==========================

Booking ID: ${bookingData.bookingId}
Confirmation Number: ${bookingData.confirmationNumber}
Booking Date: ${bookingData.bookingDate}

Hotel Details:
- Name: ${bookingData.hotel}
- Address: ${bookingData.hotelAddress}

Guest Information:
- Name: ${bookingData.guestName}
- Email: ${bookingData.email}
- Phone: ${bookingData.phone}
- Number of Guests: ${bookingData.guests}

Booking Details:
- Check-in: ${bookingData.checkIn}
- Check-out: ${bookingData.checkOut}
- Room Type: ${bookingData.roomType}
- Total Amount: ${bookingData.totalAmount}

Status: ${bookingData.status}
Payment Status: ${bookingData.paymentStatus}

Thank you for booking with Ranthambore 360!
        `;

    const link = document.createElement("a");
    link.href =
      "data:text/plain;charset=utf-8," + encodeURIComponent(confirmationText);
    link.download = `Hotel_Booking_${bookingData.bookingId}.txt`;
    link.click();

    this.showToast("Confirmation downloaded!", "success");
  }

  shareBookingDetails(bookingData) {
    const shareText = `🏨 Hotel Booking Confirmed!\n\n📋 Booking ID: ${bookingData.bookingId}\n🏩 Hotel: ${bookingData.hotel}\n👤 Guest: ${bookingData.guestName}\n📅 Check-in: ${bookingData.checkIn}\n📅 Check-out: ${bookingData.checkOut}\n💰 Total: ${bookingData.totalAmount}\n\n✅ Status: ${bookingData.status}\nBooked via Ranthambore 360`;

    if (navigator.share) {
      navigator.share({
        title: "Hotel Booking Confirmed",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        this.showToast("Booking details copied to clipboard!", "success");
      });
    }
  }

  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse ${
      type === "success"
        ? "bg-green-500"
        : type === "error"
        ? "bg-red-500"
        : "bg-blue-500"
    } text-white`;
    toast.innerHTML = `<i class="fas fa-${
      type === "success" ? "check" : "info"
    }-circle mr-2"></i>${message}`;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  resetForm() {
    const form = document.getElementById("booking-form");
    if (form) {
      form.reset();
      document.getElementById("guest-details").innerHTML = "";
      document.getElementById("total-price").textContent =
        this.formatCurrency(0);
      this.updateProgress();
    }
  }

  // ================================
  // IMAGE LIGHTBOX FUNCTIONALITY
  // ================================

  showImageLightbox(imageSrc, altText) {
    const lightbox = document.getElementById("image-lightbox");
    const lightboxImage = document.getElementById("lightbox-image");

    if (lightbox && lightboxImage) {
      lightboxImage.src = imageSrc;
      lightboxImage.alt = altText || "Hotel Image";
      lightbox.classList.remove("hidden");

      // Add keyboard support for closing
      const handleKeyPress = (e) => {
        if (e.key === "Escape") {
          lightbox.classList.add("hidden");
          document.removeEventListener("keydown", handleKeyPress);
        }
      };

      document.addEventListener("keydown", handleKeyPress);

      // Close lightbox when clicking outside the image
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
          lightbox.classList.add("hidden");
          document.removeEventListener("keydown", handleKeyPress);
        }
      });
    }
  }

  // ================================
  // UTILITY METHODS FOR CLEANUP
  // ================================

  destroy() {
    this.stopAutoplay();
    // Remove any event listeners if needed for cleanup
  }
}

// ================================
// INITIALIZATION
// ================================

// Ensure DOM is fully loaded before initialization
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeEverything);
} else {
  // DOM is already loaded
  initializeEverything();
}

function initializeEverything() {
  try {
    // Create global instance
    window.hotelBookingSystem = new HotelBookingSystem();
    console.log("✅ Hotel Booking System initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Hotel Booking System:", error);
  }

  // Smooth scroll to form on page load (reduced delay)
  setTimeout(() => {
    const bookingForm = document.querySelector(".booking-form");
    if (bookingForm) {
      bookingForm.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 800);

  // Auto-focus first available input (reduced delay)
  setTimeout(() => {
    const firstInput = document.querySelector(
      '#booking-form input[type="date"]:first-of-type'
    );
    if (firstInput) {
      firstInput.focus();
    }
  }, 1200);

  // Initialize additional features with error handling
  try {
    initializePaymentModal();
    console.log("✅ Payment modal initialized");
  } catch (error) {
    console.warn("⚠️ Payment modal initialization failed:", error);
  }

  try {
    initializeImageLightbox();
    console.log("✅ Image lightbox initialized");
  } catch (error) {
    console.warn("⚠️ Image lightbox initialization failed:", error);
  }

  try {
    initializeAlertModal();
    console.log("✅ Alert modal initialized");
  } catch (error) {
    console.warn("⚠️ Alert modal initialization failed:", error);
  }
}

function initializePaymentModal() {
  const paymentModal = document.getElementById("payment-modal");
  const closePaymentModal = document.getElementById("close-payment-modal");

  if (closePaymentModal) {
    closePaymentModal.addEventListener("click", () => {
      if (paymentModal) paymentModal.classList.add("hidden");
    });
  }

  // Payment method selection
  const paymentMethods = document.querySelectorAll(".payment-method-card");
  paymentMethods.forEach((method) => {
    method.addEventListener("click", () => {
      paymentMethods.forEach((m) => {
        m.classList.remove("border-indigo-500", "bg-indigo-50");
        m.classList.add("border-gray-200");
      });
      method.classList.remove("border-gray-200");
      method.classList.add("border-indigo-500", "bg-indigo-50");
    });
  });
}

function initializeImageLightbox() {
  const lightbox = document.getElementById("image-lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const closeLightbox = document.getElementById("close-lightbox");

  if (closeLightbox && lightbox) {
    closeLightbox.addEventListener("click", () => {
      lightbox.classList.add("hidden");
    });
  }

  // Handle escape key
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      lightbox &&
      !lightbox.classList.contains("hidden")
    ) {
      lightbox.classList.add("hidden");
    }
  });

  // Handle clicking outside the image
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.closest(".relative") === null) {
        lightbox.classList.add("hidden");
      }
    });
  }

  // Initialize carousel image click handlers for lightbox
  const carouselImages = document.querySelectorAll(".carousel-image");
  carouselImages.forEach((img) => {
    img.addEventListener("click", () => {
      if (lightbox && lightboxImage) {
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt || "Hotel Image";
        lightbox.classList.remove("hidden");
      }
    });
    img.style.cursor = "pointer";
  });
}

// Console welcome message
console.log("🏨 Hotel Booking System Initialized Successfully");
console.log("📧 Support: ranthambore360@gmail.com");
console.log("📱 Phone: 8076438491");

//Alert Modal

function initializeAlertModal() {
  const hotelBookingButton = document.querySelectorAll(".hotelBookingButton");
  const alertModal = document.getElementById("alertModal");
  const startBookingButton = document.querySelector(".startingBookingBtn");
  const continueBookingButton = document.querySelector(".continueBookingBtn");

  if (!alertModal) return;

  hotelBookingButton.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      alertModal.classList.remove("hidden");
    });
  });

  if (startBookingButton) {
    startBookingButton.addEventListener("click", () => {
      window.location.reload();
    });
  }

  if (continueBookingButton) {
    continueBookingButton.addEventListener("click", () => {
      alertModal.classList.add("hidden");
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !alertModal.classList.contains("hidden")) {
      alertModal.classList.add("hidden");
    }
  });

  alertModal.addEventListener("click", (e) => {
    if (e.target === alertModal) {
      alertModal.classList.add("hidden");
    }
  });
}

// Alert modal will be initialized in the main initializeEverything function
