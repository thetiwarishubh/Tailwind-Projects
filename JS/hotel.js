// Optimized hotel.js - Unused code removed, performance improved
(function() {
  'use strict';

  // Advanced search toggle
  const advancedToggle = document.getElementById("advanced-toggle");
  if (advancedToggle) {
    advancedToggle.addEventListener("click", function () {
      const options = document.getElementById("advanced-options");
      const icon = this.querySelector("svg");
      if (options && icon) {
        options.classList.toggle("hidden");
        options.classList.add("grid");
        icon.classList.toggle("rotate-180");
      }
    });
  }

  // Tab functionality - optimized
  const tabButtons = document.querySelectorAll(".tab-button");
  if (tabButtons.length) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active from all
        tabButtons.forEach((btn) => {
          btn.classList.remove("border-blue-500", "text-blue-600");
          btn.classList.add("border-transparent", "text-gray-500", "hover:text-gray-700", "hover:border-gray-300");
        });
        
        // Add active to clicked
        button.classList.add("border-blue-500", "text-blue-600");
        button.classList.remove("border-transparent", "text-gray-500", "hover:text-gray-700", "hover:border-gray-300");
        
        // Hide all tab contents
        document.querySelectorAll(".tab-content").forEach((content) => {
          content.classList.add("hidden");
        });
        
        // Show selected tab
        const tabId = button.getAttribute("data-tab");
        const targetTab = document.getElementById(tabId);
        if (targetTab) targetTab.classList.remove("hidden");
      });
    });
  }

  // Testimonial carousel - optimized
  const carousel = document.querySelector(".testimonial-carousel");
  const slides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".carousel-dot");
  let currentSlide = 0;

  if (carousel && slides.length && dots.length) {
    function goToSlide(index) {
      const slideWidth = slides[0].offsetWidth + 24;
      carousel.scrollTo({ left: index * slideWidth, behavior: "smooth" });
      currentSlide = index;
      updateDots();
    }

    function updateDots() {
      dots.forEach((dot, index) => {
        const isActive = index === currentSlide;
        dot.classList.toggle("bg-blue-600", isActive);
        dot.classList.toggle("bg-gray-300", !isActive);
        dot.style.width = isActive ? "16px" : "8px";
      });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => goToSlide(index));
    });

    // Navigation buttons
    const prevBtn = document.querySelector(".carousel-prev");
    const nextBtn = document.querySelector(".carousel-next");
    
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        goToSlide((currentSlide + 1) % slides.length);
      });
    }

    updateDots();
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Scroll to top button
    const scrollToTopBtn = document.getElementById("scroll-to-top");
    if (scrollToTopBtn) {
      let scrollTimeout;
      window.addEventListener("scroll", function () {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const isVisible = window.pageYOffset > 300;
          scrollToTopBtn.style.opacity = isVisible ? "1" : "0";
          scrollToTopBtn.style.visibility = isVisible ? "visible" : "hidden";
        }, 10);
      });

      scrollToTopBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // Newsletter form - optimized
    const newsletterForm = document.getElementById("newsletter-form");
    const newsletterInput = document.getElementById("newsletter-email");
    const newsletterBtn = document.getElementById("newsletter-submit");
    const successMsg = document.getElementById("newsletter-success");
    const errorMsg = document.getElementById("newsletter-error");
    const formContainer = document.getElementById("newsletter-form-container");
    const backBtn = document.getElementById("newsletter-reset");

    if (newsletterForm && newsletterInput && newsletterBtn) {
      const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      
      const showSuccess = () => {
        formContainer?.classList.add("hidden");
        successMsg?.classList.remove("hidden");
        setTimeout(() => showForm(), 3000);
      };

      const showForm = () => {
        formContainer?.classList.remove("hidden");
        successMsg?.classList.add("hidden");
        newsletterInput.value = "";
        errorMsg?.classList.add("hidden");
      };

      newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = newsletterInput.value.trim();
        const errorText = document.getElementById("newsletter-error-text");

        if (!email) {
          if (errorText) errorText.textContent = "Please enter your email address.";
          errorMsg?.classList.remove("hidden");
          return;
        }

        if (!isValidEmail(email)) {
          if (errorText) errorText.textContent = "Please enter a valid email address.";
          errorMsg?.classList.remove("hidden");
          return;
        }

        errorMsg?.classList.add("hidden");
        newsletterBtn.textContent = "Subscribing...";
        newsletterBtn.disabled = true;

        setTimeout(() => {
          newsletterBtn.textContent = "Subscribe";
          newsletterBtn.disabled = false;
          showSuccess();
        }, 500);
      });

      backBtn?.addEventListener("click", showForm);
    }

    // Book now buttons - optimized with event delegation
    document.addEventListener('click', function(e) {
      if (e.target.closest('.book-now-btn')) {
        const btn = e.target.closest('.book-now-btn');
        const hotelCard = btn.closest('.bg-white');
        
        if (hotelCard) {
          const hotelName = hotelCard.querySelector('h3')?.textContent || 'Selected Hotel';
          const hotelImage = hotelCard.querySelector('img')?.src || '';
          const hotelLocation = hotelCard.querySelector('p')?.textContent || 'Premium Location';
          const priceElement = hotelCard.querySelector('.text-2xl');
          const basePrice = priceElement ? priceElement.textContent.replace(/[^0-9]/g, '') : '10000';
          
          const bookingUrl = new URL('hotel-booking-page.html', window.location);
          bookingUrl.searchParams.set('hotelName', encodeURIComponent(hotelName));
          bookingUrl.searchParams.set('hotelImage', encodeURIComponent(hotelImage));
          bookingUrl.searchParams.set('hotelLocation', encodeURIComponent(hotelLocation));
          bookingUrl.searchParams.set('deluxePrice', basePrice);
          
          window.location.href = bookingUrl.toString();
        } else {
          window.location.href = 'hotel-booking-page.html';
        }
      }
    });
  });
})();
