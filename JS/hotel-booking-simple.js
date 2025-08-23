// Hotel Booking - Simplified version without complex classes
(function() {
  'use strict';

  let currentImage = 0;
  let autoplayInterval = null;
  
  const carouselImages = [
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
    "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800", 
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800"
  ];

  const promoCodes = {
    SAVE10: 0.1,
    WELCOME5: 0.05,
    FIRST15: 0.15
  };

  // Get URL parameters
  function getURLParams() {
    return new URLSearchParams(window.location.search);
  }

  // Initialize hotel data
  function initializeHotelData() {
    const urlParams = getURLParams();
    
    return {
      id: "luxury-safari-lodge",
      name: urlParams.get("hotelName") || "Luxury Safari Lodge",
      location: urlParams.get("hotelLocation") || "Ranthambhore National Park, Rajasthan",
      description: urlParams.get("hotelDescription") || "A premium hotel offering comfortable accommodation with excellent amenities.",
      selectedImage: urlParams.get("hotelImage") || carouselImages[0],
      prices: {
        standard: parseInt(urlParams.get("standardPrice")) || 8000,
        deluxe: parseInt(urlParams.get("deluxePrice")) || 10000,
        suite: parseInt(urlParams.get("suitePrice")) || 15000
      }
    };
  }

  // Format currency
  function formatCurrency(amount) {
    return `₹${amount.toLocaleString("en-IN")}`;
  }

  // Update hotel display
  function updateHotelDisplay() {
    const hotel = initializeHotelData();
    
    const hotelNameElement = document.getElementById("hotel-name");
    if (hotelNameElement) hotelNameElement.textContent = hotel.name;
    
    updateRoomTypeOptions(hotel.prices);
    updatePageTitle(hotel.name);
    updateCarouselImages(hotel.selectedImage);
  }

  // Update room type options
  function updateRoomTypeOptions(prices) {
    const roomTypeSelect = document.getElementById("room-type");
    if (!roomTypeSelect || !prices) return;

    roomTypeSelect.innerHTML = `
      <option value="standard">Standard Room (${formatCurrency(prices.standard)}/night)</option>
      <option value="deluxe">Deluxe Room (${formatCurrency(prices.deluxe)}/night)</option>
      <option value="suite">Suite (${formatCurrency(prices.suite)}/night)</option>
    `;
  }

  // Update page title
  function updatePageTitle(hotelName) {
    document.title = `Book ${hotelName} - Ranthambhore 360`;
  }

  // Update carousel images
  function updateCarouselImages(selectedImage) {
    const images = document.querySelectorAll(".carousel-image");
    
    // Update carousel images array
    if (selectedImage) {
      carouselImages[0] = selectedImage;
    }
    
    images.forEach((img, index) => {
      if (carouselImages[index]) {
        img.src = carouselImages[index];
        img.alt = `Hotel Image ${index + 1}`;
        
        // Error handling
        img.onerror = () => {
          img.src = `https://via.placeholder.com/600x300/e5e7eb/9ca3af?text=Hotel+Image+${index + 1}`;
        };
        
        // Set visibility
        if (index === 0) {
          img.classList.remove('hidden');
        } else {
          img.classList.add('hidden');
        }
      }
    });

    // Add click handlers for lightbox
    images.forEach((img) => {
      if (!img.dataset.listenerAdded) {
        img.addEventListener('click', (e) => {
          e.preventDefault();
          showImageLightbox(img.src, img.alt);
        });
        img.dataset.listenerAdded = 'true';
        img.style.cursor = 'pointer';
      }
    });
  }

  // Show image lightbox
  function showImageLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4';
    lightbox.innerHTML = `
      <div class="relative max-w-4xl max-h-full">
        <button class="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl" onclick="this.closest('.fixed').remove()">×</button>
        <img src="${src}" alt="${alt}" class="max-w-full max-h-full object-contain rounded-lg">
      </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Close on outside click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.remove();
        document.body.style.overflow = '';
      }
    });
    
    // Close on ESC key
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        lightbox.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  // Carousel functionality
  function createCarouselDots() {
    const dotsContainer = document.getElementById("carousel-dots");
    if (!dotsContainer) return;

    dotsContainer.innerHTML = "";
    const imageCount = document.querySelectorAll(".carousel-image").length;

    for (let i = 0; i < imageCount; i++) {
      const dot = document.createElement("span");
      dot.className = `h-2 w-2 bg-gray-400 rounded-full mx-1 cursor-pointer transition-colors hover:bg-gray-600 ${
        i === 0 ? "bg-gray-800" : ""
      }`;
      dot.addEventListener("click", () => showImage(i));
      dotsContainer.appendChild(dot);
    }
  }

  function showImage(index) {
    const images = document.querySelectorAll(".carousel-image");
    const dots = document.getElementById("carousel-dots")?.children;

    if (index < 0 || index >= images.length) return;

    // Hide current image
    if (images[currentImage]) {
      images[currentImage].classList.add("hidden");
    }
    
    // Show new image
    if (images[index]) {
      images[index].classList.remove("hidden");
    }

    // Update dots
    if (dots && dots.length > 0) {
      if (dots[currentImage]) {
        dots[currentImage].classList.remove("bg-gray-800");
        dots[currentImage].classList.add("bg-gray-400");
      }
      if (dots[index]) {
        dots[index].classList.remove("bg-gray-400");
        dots[index].classList.add("bg-gray-800");
      }
    }

    currentImage = index;
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(() => {
      const images = document.querySelectorAll(".carousel-image");
      if (images.length > 0) {
        const nextIndex = currentImage + 1 >= images.length ? 0 : currentImage + 1;
        showImage(nextIndex);
      }
    }, 5000);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  // Initialize carousel
  function initializeCarousel() {
    createCarouselDots();
    
    // Navigation buttons
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const carousel = document.getElementById("carousel");

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const images = document.querySelectorAll(".carousel-image");
        const newIndex = currentImage - 1 < 0 ? images.length - 1 : currentImage - 1;
        showImage(newIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const images = document.querySelectorAll(".carousel-image");
        const newIndex = currentImage + 1 >= images.length ? 0 : currentImage + 1;
        showImage(newIndex);
      });
    }

    if (carousel) {
      carousel.addEventListener("mouseenter", stopAutoplay);
      carousel.addEventListener("mouseleave", startAutoplay);
    }

    startAutoplay();
  }

  // Date restrictions
  function initializeDateRestrictions() {
    const checkinDate = document.getElementById("checkin-date");
    const checkoutDate = document.getElementById("checkout-date");
    
    if (checkinDate && checkoutDate) {
      const today = new Date().toISOString().split('T')[0];
      checkinDate.min = today;
      checkoutDate.min = today;
      
      checkinDate.addEventListener("change", function() {
        const checkinValue = new Date(this.value);
        const minCheckout = new Date(checkinValue.getTime() + 24 * 60 * 60 * 1000);
        checkoutDate.min = minCheckout.toISOString().split('T')[0];
        
        if (checkoutDate.value && new Date(checkoutDate.value) <= checkinValue) {
          checkoutDate.value = minCheckout.toISOString().split('T')[0];
        }
      });
    }
  }

  // Price calculation
  function calculatePrice() {
    const hotel = initializeHotelData();
    const roomType = document.getElementById("room-type")?.value || "deluxe";
    const checkinDate = document.getElementById("checkin-date")?.value;
    const checkoutDate = document.getElementById("checkout-date")?.value;
    const guests = parseInt(document.getElementById("guests")?.value) || 1;

    if (!checkinDate || !checkoutDate) return;

    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    const nights = Math.max(1, Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24)));
    
    const basePrice = hotel.prices[roomType] || hotel.prices.deluxe;
    let totalPrice = basePrice * nights;
    
    // Extra guest charges (beyond 2 guests)
    if (guests > 2) {
      totalPrice += (guests - 2) * 500 * nights;
    }

    // Update price display
    const priceElement = document.getElementById("total-price");
    if (priceElement) {
      priceElement.textContent = formatCurrency(totalPrice);
    }
  }

  // Form submission
  function handleBookingForm() {
    const bookingForm = document.getElementById("booking-form");
    if (!bookingForm) return;

    bookingForm.addEventListener("submit", function(e) {
      e.preventDefault();
      
      // Simple validation
      const requiredFields = bookingForm.querySelectorAll("[required]");
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add("border-red-500");
          isValid = false;
        } else {
          field.classList.remove("border-red-500");
        }
      });
      
      if (!isValid) {
        alert("Please fill all required fields.");
        return;
      }
      
      // Show success message
      const successMessage = document.createElement("div");
      successMessage.className = "fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50";
      successMessage.innerHTML = `
        <div class="flex items-center">
          <span class="mr-2">✓</span>
          <span>Booking request submitted successfully!</span>
          <button class="ml-4 hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
      `;
      document.body.appendChild(successMessage);
      
      setTimeout(() => successMessage.remove(), 5000);
      
      // Reset form
      bookingForm.reset();
    });
  }

  // Initialize everything
  document.addEventListener("DOMContentLoaded", function() {
    updateHotelDisplay();
    initializeCarousel();
    initializeDateRestrictions();
    handleBookingForm();
    
    // Add event listeners for price calculation
    const priceInputs = ["room-type", "checkin-date", "checkout-date", "guests"];
    priceInputs.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener("change", calculatePrice);
      }
    });
    
    // Initial price calculation
    setTimeout(calculatePrice, 100);
  });
})();
