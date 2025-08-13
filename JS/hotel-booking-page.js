// ================================
// ENHANCED HOTEL BOOKING SYSTEM
// Professional & Optimized Version
// ================================

class HotelBookingSystem {
    constructor() {
        this.hotels = this.initializeHotels();
        this.currentHotel = null;
        this.unavailableDates = ["2025-08-10", "2025-08-15", "2025-08-20"];
        this.promoCodes = {
            'SAVE10': 0.1,
            'WELCOME5': 0.05,
            'FIRST15': 0.15
        };
        this.autoplayInterval = null;
        this.currentImage = 0;
        
        this.init();
    }

    // ================================
    // INITIALIZATION METHODS
    // ================================
    
    initializeHotels() {
        return [
            {
                id: "tiger-safari-resort",
                name: "Tiger Safari Resort",
                images: ["/Images/hotel1-1.jpg", "/Images/hotel1-2.jpg", "/Images/hotel1-3.jpg"],
                location: "Ranthambhore Road, Sawai Madhopur, Rajasthan 322001",
                description: "A luxury wildlife resort offering premium accommodations with stunning views of Ranthambhore National Park.",
                amenities: ["Free Wi-Fi", "Swimming Pool", "Wildlife Safari", "Spa & Wellness", "Multi-Cuisine Restaurant", "Room Service", "Parking"],
                prices: { standard: 8500, deluxe: 12000, suite: 18000 },
                roomImages: {
                    standard: "/Images/standard-room-1.jpg",
                    deluxe: "/Images/deluxe-room-1.jpg",
                    suite: "/Images/suite-room-1.jpg"
                }
            },
            {
                id: "ranthambhore-regency",
                name: "Ranthambhore Regency",
                images: ["/Images/hotel2-1.jpg", "/Images/hotel2-2.jpg", "/Images/hotel2-3.jpg"],
                location: "Ranthambhore National Park, Sawai Madhopur, Rajasthan 322001",
                description: "An elegant heritage hotel blending traditional Rajasthani architecture with modern luxury.",
                amenities: ["Heritage Architecture", "Cultural Programs", "Wildlife Library", "Ayurvedic Spa", "Organic Garden", "Butler Service", "Conference Hall"],
                prices: { standard: 9500, deluxe: 14000, suite: 22000 },
                roomImages: {
                    standard: "/Images/standard-room-2.jpg",
                    deluxe: "/Images/deluxe-room-2.jpg",
                    suite: "/Images/suite-room-2.jpg"
                }
            },
            {
                id: "grand-plaza-hotel",
                name: "Grand Plaza Hotel",
                images: [
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                ],
                location: "New York, USA",
                description: "A luxury hotel in the heart of New York with stunning city views and world-class amenities",
                amenities: ["Free Wi-Fi", "Business Center", "Fitness Center", "Spa & Wellness", "Fine Dining", "Room Service", "Concierge", "Valet Parking"],
                prices: { standard: 14950, deluxe: 19900, suite: 29850 },
                roomImages: {
                    standard: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                    deluxe: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                    suite: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                }
            }
        ];
    }

    init() {
        this.showSkeletonLoader();
        this.loadHotelFromURL();
        this.initializeEventListeners();
        this.initializeDateRestrictions();
        this.initializeCarousel();
        this.hideSkeletonLoader();
    }

    // ================================
    // UTILITY METHODS
    // ================================

    showSkeletonLoader() {
        const loader = document.getElementById("skeleton-loader");
        if (loader) loader.classList.remove("hidden");
    }

    hideSkeletonLoader() {
        setTimeout(() => {
            const loader = document.getElementById("skeleton-loader");
            const details = document.querySelector(".hotel-details");
            const form = document.querySelector(".booking-form");
            
            if (loader) loader.classList.add("hidden");
            if (details) details.classList.remove("hidden");
            if (form) form.classList.remove("hidden");
        }, 1000);
    }

    getURLParams() {
        return new URLSearchParams(window.location.search);
    }

    formatCurrency(amount) {
        return `₹${amount.toLocaleString("en-IN")}`;
    }

    // ================================
    // HOTEL DATA MANAGEMENT
    // ================================

    loadHotelFromURL() {
        const urlParams = this.getURLParams();
        const hotelId = urlParams.get("hotelId");
        
        // Check if URL has dynamic hotel data
        if (urlParams.get("hotelName") || urlParams.get("hotelImage")) {
            this.currentHotel = this.createDynamicHotel(urlParams);
        } else if (hotelId) {
            this.currentHotel = this.hotels.find(h => h.id === hotelId);
        }
        
        // Fallback to first hotel
        if (!this.currentHotel) {
            this.currentHotel = this.hotels[0];
        }

        this.updateHotelDisplay();
    }

    createDynamicHotel(urlParams) {
        const usdPrice = parseInt(urlParams.get("hotelPrice")) || 199;
        const inrPrice = Math.round(usdPrice * 75);

        return {
            id: "dynamic-hotel",
            name: urlParams.get("hotelName") || "Selected Hotel",
            images: [
                urlParams.get("hotelImage") || "/Images/default-hotel-1.jpg",
                urlParams.get("hotelImage2") || urlParams.get("hotelImage") || "/Images/default-hotel-2.jpg",
                urlParams.get("hotelImage3") || urlParams.get("hotelImage") || "/Images/default-hotel-3.jpg"
            ],
            location: urlParams.get("hotelLocation") || "Prime Location",
            description: urlParams.get("hotelDescription") || "A premium hotel offering comfortable accommodation with excellent amenities.",
            amenities: urlParams.get("hotelAmenities")?.split(",") || ["Free Wi-Fi", "Business Center", "Fitness Center", "Spa & Wellness"],
            prices: {
                standard: inrPrice,
                deluxe: Math.round(inrPrice * 1.3),
                suite: Math.round(inrPrice * 2)
            },
            roomImages: {
                standard: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                deluxe: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                suite: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            }
        };
    }

    // ================================
    // DOM UPDATE METHODS
    // ================================

    updateHotelDisplay() {
        if (!this.currentHotel) return;

        this.updateBasicInfo();
        this.updateAmenities();
        this.updatePricing();
        this.updateCarouselImages();
        this.updateRoomTypeOptions();
        this.updatePageTitle();
    }

    updateBasicInfo() {
        const elements = {
            'hotel-name': this.currentHotel.name,
            'hotel-location': this.currentHotel.location,
            'hotel-description': this.currentHotel.description
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    updateAmenities() {
        const container = document.querySelector(".hotel-details .grid.grid-cols-2");
        if (!container || !this.currentHotel.amenities) return;

        container.innerHTML = "";
        this.currentHotel.amenities.forEach(amenity => {
            const amenityDiv = document.createElement("div");
            amenityDiv.className = "flex items-center gap-2 bg-gray-50 rounded-lg p-2.5 hover:bg-gray-100 transition-colors duration-200";
            amenityDiv.innerHTML = `
                <div class="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
                    <i class="${this.getAmenityIcon(amenity)} text-xs"></i>
                </div>
                <span class="text-xs font-medium text-gray-700">${amenity}</span>
            `;
            container.appendChild(amenityDiv);
        });
    }

    getAmenityIcon(amenity) {
        const iconMap = {
            'wifi': 'fas fa-wifi text-blue-600',
            'pool': 'fas fa-swimming-pool text-cyan-600',
            'fitness': 'fas fa-dumbbell text-green-600',
            'gym': 'fas fa-dumbbell text-green-600',
            'spa': 'fas fa-spa text-pink-600',
            'restaurant': 'fas fa-utensils text-purple-600',
            'dining': 'fas fa-utensils text-purple-600',
            'concierge': 'fas fa-concierge-bell text-amber-600',
            'parking': 'fas fa-parking text-gray-600',
            'business': 'fas fa-briefcase text-blue-600',
            'valet': 'fas fa-car text-purple-600'
        };

        const lowerAmenity = amenity.toLowerCase();
        for (const [key, icon] of Object.entries(iconMap)) {
            if (lowerAmenity.includes(key)) return icon;
        }
        return 'fas fa-check text-blue-600';
    }

    updatePricing() {
        const pricingSections = document.querySelectorAll(".hotel-details .bg-white.border");
        let priceSection = null;
        
        pricingSections.forEach(section => {
            if (section.textContent.includes("Room Rates") || 
                section.querySelector("h3")?.textContent?.includes("Room Rates")) {
                priceSection = section;
            }
        });

        if (!priceSection || !this.currentHotel.prices) return;

        const priceContent = priceSection.querySelector(".space-y-3");
        if (priceContent) {
            priceContent.innerHTML = this.generatePricingHTML();
        }
    }

    generatePricingHTML() {
        const roomTypes = [
            { key: 'standard', name: 'Standard Room', desc: 'Queen bed, city view' },
            { key: 'deluxe', name: 'Deluxe Room', desc: 'King bed, premium view' },
            { key: 'suite', name: 'Suite', desc: 'Premium suite, best view' }
        ];

        return roomTypes.map(room => `
            <div class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                    <span class="text-sm font-medium text-gray-900">${room.name}</span>
                    <p class="text-xs text-gray-500">${room.desc}</p>
                </div>
                <div class="text-right">
                    <div class="text-sm font-semibold text-gray-900">${this.formatCurrency(this.currentHotel.prices[room.key])}</div>
                    <div class="text-xs text-gray-500">per night</div>
                </div>
            </div>
        `).join('');
    }

    updateRoomTypeOptions() {
        const roomTypeSelect = document.getElementById("room-type");
        if (!roomTypeSelect || !this.currentHotel.prices) return;

        roomTypeSelect.innerHTML = `
            <option value="standard">Standard Room (${this.formatCurrency(this.currentHotel.prices.standard)}/night)</option>
            <option value="deluxe">Deluxe Room (${this.formatCurrency(this.currentHotel.prices.deluxe)}/night)</option>
            <option value="suite">Suite (${this.formatCurrency(this.currentHotel.prices.suite)}/night)</option>
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
        images.forEach((img, index) => {
            if (this.currentHotel.images[index]) {
                img.src = this.currentHotel.images[index];
                img.alt = `${this.currentHotel.name} Image ${index + 1}`;
                img.onerror = () => {
                    img.src = `https://via.placeholder.com/600x300?text=${encodeURIComponent(this.currentHotel.name)}+Image+${index + 1}`;
                };
            }
        });
    }

    createCarouselDots() {
        const dotsContainer = document.getElementById("carousel-dots");
        if (!dotsContainer) return;

        const images = document.querySelectorAll(".carousel-image");
        dotsContainer.innerHTML = "";

        images.forEach((_, index) => {
            const dot = document.createElement("span");
            dot.className = `h-2 w-2 bg-gray-400 rounded-full mx-1 cursor-pointer ${index === 0 ? 'bg-gray-800' : ''}`;
            dot.addEventListener("click", () => this.showImage(index));
            dotsContainer.appendChild(dot);
        });
    }

    addCarouselEventListeners() {
        const prevBtn = document.getElementById("prev-btn");
        const nextBtn = document.getElementById("next-btn");
        const carousel = document.getElementById("carousel");

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                const images = document.querySelectorAll(".carousel-image");
                this.showImage(this.currentImage - 1 < 0 ? images.length - 1 : this.currentImage - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                const images = document.querySelectorAll(".carousel-image");
                this.showImage(this.currentImage + 1 >= images.length ? 0 : this.currentImage + 1);
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

        if (images[this.currentImage]) images[this.currentImage].classList.add("hidden");
        if (images[index]) images[index].classList.remove("hidden");
        
        if (dots) {
            if (dots[this.currentImage]) dots[this.currentImage].classList.remove("bg-gray-800");
            if (dots[index]) dots[index].classList.add("bg-gray-800");
        }

        this.currentImage = index;
    }

    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            const images = document.querySelectorAll(".carousel-image");
            this.showImage(this.currentImage + 1 >= images.length ? 0 : this.currentImage + 1);
        }, 5000);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
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
        
        if (checkInInput) checkInInput.setAttribute("min", today.toISOString().split("T")[0]);
        if (checkOutInput) checkOutInput.setAttribute("min", today.toISOString().split("T")[0]);
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

        const imageSrc = this.currentHotel.roomImages[roomType] || 
                        this.currentHotel.roomImages.standard || 
                        "https://via.placeholder.com/150x100?text=Room+Image";
        
        roomImage.src = imageSrc;
        roomImage.alt = `${roomType.charAt(0).toUpperCase() + roomType.slice(1)} Room`;
        roomImage.onerror = () => {
            roomImage.src = "https://via.placeholder.com/150x100?text=Room+Image";
        };
    }

    initializePriceCalculation() {
        const elements = ['check-in', 'check-out', 'room-type', 'promo-code'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.updatePrice());
            }
        });
    }

    updatePrice() {
        const checkInInput = document.getElementById("check-in");
        const checkOutInput = document.getElementById("check-out");
        const roomTypeSelect = document.getElementById("room-type");
        const totalPriceEl = document.getElementById("total-price");

        if (!checkInInput || !checkOutInput || !roomTypeSelect || !totalPriceEl) return;

        const checkIn = new Date(checkInInput.value);
        const checkOut = new Date(checkOutInput.value);
        const roomType = roomTypeSelect.value;

        if (!checkIn || !checkOut || checkOut <= checkIn || !this.currentHotel?.prices?.[roomType]) {
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
            'total-price': this.formatCurrency(total),
            'room-charges': this.formatCurrency(roomCharges),
            'taxes-fees': this.formatCurrency(taxesAndFees),
            'discount-amount': `-${this.formatCurrency(discount)}`
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
            if (savingsAmountEl) savingsAmountEl.textContent = this.formatCurrency(discount);
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
        const inputs = document.querySelectorAll('#booking-form input:not([type="date"])');
        inputs.forEach(input => {
            input.addEventListener("input", (e) => this.validateRealTime(e));
        });
    }

    validateRealTime(event) {
        const input = event.target;
        const validators = {
            'name': (val) => val && /^[a-zA-Z\s]+$/.test(val),
            'email': (val) => val && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            'phone': (val) => val && /^\d{10}$/.test(val)
        };

        const fieldType = input.id.startsWith('guest-name-') ? 'name' : input.id;
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
        input.classList.remove("border-red-300", "bg-red-50", "border-green-300", "bg-green-50");
        
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
        const requiredFields = ['name', 'email', 'phone', 'check-in', 'check-out'];
        let isValid = true;

        requiredFields.forEach(fieldId => {
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
            confirmationNumber: "CNF" + Math.random().toString(36).substr(2, 8).toUpperCase(),
            bookingDate: new Date().toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
                hour: "2-digit", minute: "2-digit"
            }),
            hotel: this.currentHotel.name,
            hotelAddress: this.currentHotel.location,
            guestName: document.getElementById("name")?.value,
            email: document.getElementById("email")?.value,
            phone: document.getElementById("phone")?.value,
            checkIn: new Date(checkInInput?.value).toLocaleDateString("en-IN", {
                weekday: "long", day: "numeric", month: "long", year: "numeric"
            }),
            checkOut: new Date(checkOutInput?.value).toLocaleDateString("en-IN", {
                weekday: "long", day: "numeric", month: "long", year: "numeric"
            }),
            roomType: document.getElementById("room-type")?.value,
            guests: document.getElementById("guests")?.value,
            totalAmount: document.getElementById("total-price")?.textContent,
            status: "CONFIRMED",
            paymentStatus: "PAID"
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
            document.getElementById("close-booking-modal")?.addEventListener("click", () => {
                document.getElementById("booking-success-modal")?.remove();
            });

            // Download confirmation
            document.getElementById("download-confirmation")?.addEventListener("click", () => {
                this.downloadConfirmation(bookingData);
            });

            // Share booking details
            document.getElementById("share-booking-details")?.addEventListener("click", () => {
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
        link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(confirmationText);
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
            type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"
        } text-white`;
        toast.innerHTML = `<i class="fas fa-${type === "success" ? "check" : "info"}-circle mr-2"></i>${message}`;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    resetForm() {
        const form = document.getElementById("booking-form");
        if (form) {
            form.reset();
            document.getElementById("guest-details").innerHTML = "";
            document.getElementById("total-price").textContent = this.formatCurrency(0);
            this.updateProgress();
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

// Initialize the booking system when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
    // Create global instance
    window.hotelBookingSystem = new HotelBookingSystem();
    
    // Smooth scroll to form on page load
    setTimeout(() => {
        const bookingForm = document.querySelector(".booking-form");
        if (bookingForm) {
            bookingForm.scrollIntoView({ behavior: "smooth" });
        }
    }, 1500);
    
    // Auto-focus first available input
    setTimeout(() => {
        const firstInput = document.querySelector('#booking-form input[type="date"]');
        if (firstInput) {
            firstInput.focus();
        }
    }, 2000);

    // Initialize additional features if needed
    initializeAdvancedFeatures();
});

// ================================
// ADDITIONAL FEATURES
// ================================

function initializeAdvancedFeatures() {
    // Payment Modal Handler
    initializePaymentModal();
    
    // Image Lightbox
    initializeImageLightbox();
    
    // Calendar functionality if custom calendar is used
    initializeCustomCalendar();
    
    // Auto-save form data in memory (not localStorage as per restrictions)
    initializeAutoSave();
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
    paymentMethods.forEach(method => {
        method.addEventListener("click", () => {
            paymentMethods.forEach(m => {
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
    
    if (lightbox && lightboxImage && closeLightbox) {
        const carouselImages = document.querySelectorAll(".carousel-image");
        
        carouselImages.forEach(img => {
            img.addEventListener("click", () => {
                lightboxImage.src = img.src;
                lightboxImage.alt = img.alt;
                lightbox.classList.remove("hidden");
            });
        });

        closeLightbox.addEventListener("click", () => {
            lightbox.classList.add("hidden");
        });
    }
}

function initializeCustomCalendar() {
    // Calendar generation function for date inputs
    function generateCalendar(inputId, calendarId, monthOffset = 0) {
        const calendar = document.getElementById(calendarId);
        if (!calendar) return;

        const unavailableDates = ["2025-08-10", "2025-08-15", "2025-08-20"];
        const today = new Date();
        const date = new Date();
        date.setMonth(date.getMonth() + monthOffset);
        date.setDate(1);
        
        const month = date.getMonth();
        const year = date.getFullYear();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        calendar.innerHTML = `
            <div class="flex justify-between mb-2">
                <button type="button" class="text-indigo-600 hover:text-indigo-800" onclick="generateCalendar('${inputId}', '${calendarId}', ${monthOffset - 1})">◄</button>
                <div class="font-semibold">${date.toLocaleString("default", { month: "long" })} ${year}</div>
                <button type="button" class="text-indigo-600 hover:text-indigo-800" onclick="generateCalendar('${inputId}', '${calendarId}', ${monthOffset + 1})">►</button>
            </div>
        `;

        // Add day headers
        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(day => {
            calendar.innerHTML += `<div class="calendar-day font-medium">${day}</div>`;
        });

        // Add empty cells for first week
        for (let i = 0; i < firstDay; i++) {
            calendar.innerHTML += `<div class="calendar-day"></div>`;
        }

        // Add date cells
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
            const isDisabled = unavailableDates.includes(dateStr) || new Date(dateStr) < today;
            
            calendar.innerHTML += `
                <div class="calendar-day ${isDisabled ? "disabled" : ""}" 
                     data-date="${dateStr}"
                     ${!isDisabled ? `onclick="selectDate('${inputId}', '${dateStr}', '${calendarId}')"` : ""}>
                    ${i}
                </div>
            `;
        }
    }

    // Date selection function
    window.selectDate = function(inputId, dateStr, calendarId) {
        const input = document.getElementById(inputId);
        const calendar = document.getElementById(calendarId);
        
        if (input) input.value = dateStr;
        if (calendar) calendar.classList.add("hidden");
        
        if (window.hotelBookingSystem) {
            window.hotelBookingSystem.updatePrice();
            window.hotelBookingSystem.updateProgress();
        }
    };

    // Make generateCalendar globally available
    window.generateCalendar = generateCalendar;
}

function initializeAutoSave() {
    // Auto-save form data in memory (not localStorage due to restrictions)
    const formData = {};
    
    const formInputs = document.querySelectorAll("#booking-form input, #booking-form select");
    formInputs.forEach(input => {
        input.addEventListener("input", () => {
            formData[input.name] = input.value;
        });

        // Restore data on page refresh (from memory during session)
        if (formData[input.name]) {
            input.value = formData[input.name];
        }
    });
}

// ================================
// LEGACY SUPPORT & GLOBAL FUNCTIONS
// ================================

// For backward compatibility, expose key functions globally
window.updatePrice = function() {
    if (window.hotelBookingSystem) {
        window.hotelBookingSystem.updatePrice();
    }
};

window.handleSubmit = function(event) {
    if (window.hotelBookingSystem) {
        window.hotelBookingSystem.handleSubmit(event);
    }
};

window.updateProgress = function() {
    if (window.hotelBookingSystem) {
        window.hotelBookingSystem.updateProgress();
    }
};

// Console welcome message
console.log("🏨 Professional Hotel Booking System Initialized");
console.log("📧 Support: ranthambore360@gmail.com");
console.log("📱 Phone: 8076438491");