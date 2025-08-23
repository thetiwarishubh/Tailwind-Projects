// Optimized app.js - Unused code removed, performance improved
(function () {
  "use strict";

  // Cache DOM elements
  const logo = document.querySelector(".logo");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  // Logo click handler
  if (logo) {
    logo.addEventListener("click", () => (window.location.href = "index.html"));
  }

  // Navigation - optimized with event delegation
  document.addEventListener("click", (e) => {
    const target = e.target.closest("button, a");
    if (!target) return;

    const actions = {
      chambalBtn: "chambal.html",
      hotelBtn: "hotel.html",
      tourBtn: "package-booking.html",
      safariBtn: "safari.html",
    };

    for (const [className, url] of Object.entries(actions)) {
      if (target.classList.contains(className)) {
        window.location.href = url;
        break;
      }
    }
  });

  // Counter animation - optimized

  const counters = document.querySelectorAll(".count");
  if (counters.length) {
    const animateCount = (el) => {
      const target = +el.dataset.target || +el.getAttribute("data-target") || 0;
      let count = 0;
      const increment = target / 100;

      const update = () => {
        count += increment;
        if (count < target) {
          el.textContent = Math.floor(count) + "+";
          requestAnimationFrame(update);
        } else {
          el.textContent = target + "+";
        }
      };
      update();
    };

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.textContent = "0+";
            animateCount(entry.target);
            observer.unobserve(entry.target); // Run only once
          }
        }),
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  // Mobile menu - optimized
  if (mobileMenuBtn && mobileMenu) {
    const hamburgerPath = "M4 6h16M4 12h16M4 18h16";
    const closePath = "M6 18L18 6M6 6l12 12";
    const icon = mobileMenuBtn.querySelector("svg path");

    const toggleMenu = (show) => {
      mobileMenu.classList.toggle("hidden", !show);
      if (icon) icon.setAttribute("d", show ? closePath : hamburgerPath);
    };

    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu(mobileMenu.classList.contains("hidden"));
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close on desktop resize with debouncing
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth >= 1024) toggleMenu(false);
      }, 150);
    });
  }
})();
