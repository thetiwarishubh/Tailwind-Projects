// Advanced search toggle
document
  .getElementById("advanced-toggle")
  .addEventListener("click", function () {
    const options = document.getElementById("advanced-options");
    const icon = this.querySelector("svg");
    options.classList.toggle("hidden");
    options.classList.add("grid");
    icon.classList.toggle("rotate-180");
  });

// Tab functionality
const tabButtons = document.querySelectorAll(".tab-button");
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active styles from all buttons
    tabButtons.forEach((btn) => {
      btn.classList.remove("border-blue-500", "text-blue-600");
      btn.classList.add(
        "border-transparent",
        "text-gray-500",
        "hover:text-gray-700",
        "hover:border-gray-300"
      );
    });

    // Add active styles to clicked button
    button.classList.add("border-blue-500", "text-blue-600");
    button.classList.remove(
      "border-transparent",
      "text-gray-500",
      "hover:text-gray-700",
      "hover:border-gray-300"
    );

    // Hide all tab contents
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.add("hidden");
    });

    // Show selected tab content
    const tabId = button.getAttribute("data-tab");
    document.getElementById(tabId).classList.remove("hidden");
  });
});

// Simple carousel functionality
const carousel = document.querySelector(".testimonial-carousel");
const slides = document.querySelectorAll(".testimonial-slide");
const dots = document.querySelectorAll(".carousel-dot");
let currentSlide = 0;

function goToSlide(index) {
  const slideWidth = slides[0].offsetWidth + 24; // 24 is the gap
  carousel.scrollTo({
    left: index * slideWidth,
    behavior: "smooth",
  });
  currentSlide = index;
  updateDots();
}

function updateDots() {
  dots.forEach((dot, index) => {
    if (index === currentSlide) {
      dot.classList.remove("bg-gray-300");
      dot.classList.add("bg-blue-600");
      dot.style.width = "16px";
    } else {
      dot.classList.remove("bg-blue-600");
      dot.classList.add("bg-gray-300");
      dot.style.width = "8px";
    }
  });
}

// Dot navigation
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => goToSlide(index));
});

// Previous/next buttons
document.querySelector(".carousel-prev").addEventListener("click", () => {
  goToSlide((currentSlide - 1 + slides.length) % slides.length);
});

document.querySelector(".carousel-next").addEventListener("click", () => {
  goToSlide((currentSlide + 1) % slides.length);
});

// Initialize dots
updateDots();

// Advanced animations and interactions
document.addEventListener("DOMContentLoaded", function () {
  // Parallax effect for hero section
  const heroSection = document.querySelector(".hero");
  const parallaxElements = document.querySelectorAll(".parallax");

  if (heroSection) {
    window.addEventListener("scroll", function () {
      const scrolled = window.pageYOffset;
      const speed = scrolled * 0.5;

      parallaxElements.forEach(function (element) {
        element.style.setProperty("--parallax-y", speed + "px");
      });
    });
  }

  // Stagger animation observer
  const staggerElements = document.querySelectorAll(".stagger-animation");
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const staggerObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";
      }
    });
  }, observerOptions);

  staggerElements.forEach(function (el) {
    el.style.animationPlayState = "paused";
    staggerObserver.observe(el);
  });

  // Scroll to top button
  const scrollToTopBtn = document.getElementById("scroll-to-top");
  if (scrollToTopBtn) {
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = "1";
        scrollToTopBtn.style.visibility = "visible";
      } else {
        scrollToTopBtn.style.opacity = "0";
        scrollToTopBtn.style.visibility = "hidden";
      }
    });

    scrollToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Add floating animation to cards randomly
  const hotelCards = document.querySelectorAll(".featured-hotels .grid > div");
  hotelCards.forEach(function (card, index) {
    if (index === 1) {
      // Make second card float
      card.classList.add("floating");
    }
  });

  // Add shimmer effect to search button on hover
  const searchButton = document.querySelector('button[type="submit"]');
  if (searchButton) {
    searchButton.addEventListener("mouseenter", function () {
      searchButton.classList.add("shimmer");
    });
    searchButton.addEventListener("mouseleave", function () {
      searchButton.classList.remove("shimmer");
    });
  }

  // Add pulse glow to CTA buttons
  const ctaButtons = document.querySelectorAll(".hero a");
  ctaButtons.forEach(function (btn) {
    btn.classList.add("pulse-glow");
  });

  // Note: Typewriter effect is now handled via CSS animations using the typewriter-infinite class

  // Newsletter form handling
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterInput = document.getElementById("newsletter-email");
  const newsletterBtn = document.getElementById("newsletter-submit");
  const successMsg = document.getElementById("newsletter-success");
  const errorMsg = document.getElementById("newsletter-error");
  const formContainer = document.getElementById("newsletter-form-container");
  const backBtn = document.getElementById("newsletter-reset");
  
  if (newsletterForm && newsletterInput && newsletterBtn) {
    // Email validation function
    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Show success message
    function showSuccess() {
      formContainer.classList.add('hidden');
      successMsg.classList.remove('hidden');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        showForm();
      }, 3000);
    }
    
    // Show form again
    function showForm() {
      formContainer.classList.remove('hidden');
      successMsg.classList.add('hidden');
      newsletterInput.value = '';
      errorMsg.classList.add('hidden');
    }
    
    // Handle form submission
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = newsletterInput.value.trim();
      
      if (!email) {
        document.getElementById('newsletter-error-text').textContent = 'Please enter your email address.';
        errorMsg.classList.remove('hidden');
        return;
      }
      
      if (!isValidEmail(email)) {
        document.getElementById('newsletter-error-text').textContent = 'Please enter a valid email address.';
        errorMsg.classList.remove('hidden');
        return;
      }
      
      // Hide error message
      errorMsg.classList.add('hidden');
      
      // Show loading state
      newsletterBtn.textContent = 'Subscribing...';
      newsletterBtn.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        newsletterBtn.textContent = 'Subscribe';
        newsletterBtn.disabled = false;
        showSuccess();
      }, 500);
    });
    
    // Back to form button
    if (backBtn) {
      backBtn.addEventListener('click', showForm);
    }
  }

  // Add stagger animation to hotel cards - but keep them visible
  const hotelCardElements = document.querySelectorAll(
    ".featured-hotels .grid > div"
  );
  hotelCardElements.forEach(function (card, index) {
    // Don't add stagger animation to hotel cards to prevent hiding issues
    // card.classList.add('stagger-animation');
    // card.style.animationDelay = (index * 0.2) + 's';

    // Keep hotel cards fully visible
    card.style.opacity = "1";
    card.style.transform = "translateY(0)";
  });

  // Add stagger animation to destination cards
  const destinationCards = document.querySelectorAll(
    ".destination-guides .grid > div"
  );
  destinationCards.forEach(function (card, index) {
    card.classList.add("stagger-animation");
    card.style.animationDelay = index * 0.15 + "s";
  });

  // Enhanced hover effects for deal cards
  const dealCards = document.querySelectorAll(".special-deals .grid > div");
  dealCards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      card.style.transform = "translateY(-10px) scale(1.02)";
      card.style.boxShadow = "0 25px 50px rgba(0,0,0,0.2)";
    });

    card.addEventListener("mouseleave", function () {
      card.style.transform = "translateY(0) scale(1)";
      card.style.boxShadow = "";
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add reveal animation to sections on scroll - but avoid hiding hotel cards
  const revealElements = document.querySelectorAll(
    "section:not(.featured-hotels)"
  );
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  revealElements.forEach(function (section) {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    revealObserver.observe(section);
  });

  // Initialize first section as visible
  const firstSection = document.querySelector("section");
  if (firstSection) {
    firstSection.style.opacity = "1";
    firstSection.style.transform = "translateY(0)";
  }

  // Ensure featured hotels section is always visible
  const featuredHotelsSection = document.querySelector(".featured-hotels");
  if (featuredHotelsSection) {
    featuredHotelsSection.style.opacity = "1";
    featuredHotelsSection.style.transform = "translateY(0)";
  }

  // Add interactive hover effects to images
  const images = document.querySelectorAll("img");
  images.forEach(function (img) {
    img.addEventListener("mouseenter", function () {
      img.style.transform = "scale(1.05)";
      img.style.transition = "transform 0.3s ease";
    });

    img.addEventListener("mouseleave", function () {
      img.style.transform = "scale(1)";
    });
  });
});

