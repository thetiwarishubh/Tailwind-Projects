const logo = document.querySelector(".logo");
logo.addEventListener("click", () => {
  window.location.href = "index.html";
});

const chambalBtn = document.querySelectorAll(".chambalBtn");
const hotelBtn = document.querySelectorAll(".hotelBtn");
const tourBtn = document.querySelectorAll(".tourBtn");
const safariBtn = document.querySelectorAll(".safariBtn");

chambalBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    window.location.href = "chambal.html";
  });
});
hotelBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    window.location.href = "hotel.html";
  });
});
tourBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    window.location.href = "package-booking.html";
  });
});
safariBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    window.location.href = "safari.html";
  });
});

const counters = document.querySelectorAll(".count");

if (counters.length > 0) {
  function animateCount(el) {
    const target = +el.getAttribute("data-target");
    let count = 0;
    const speed = target / 500;

    const updateCount = () => {
      if (count < target) {
        count += speed;
        el.textContent = Math.floor(count) + "+";
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = target + "+";
      }
    };
    updateCount();
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Reset to 0 before starting animation again
          entry.target.textContent = "0+";
          animateCount(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => {
    observer.observe(el);
  });
}

// Mobile menu toggle functionality
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    
    // Toggle hamburger icon to X icon
    const icon = mobileMenuBtn.querySelector('svg');
    if (mobileMenu.classList.contains('hidden')) {
      // Show hamburger icon
      icon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      `;
    } else {
      // Show X icon
      icon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      `;
    }
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.add('hidden');
      // Reset to hamburger icon
      const icon = mobileMenuBtn.querySelector('svg');
      icon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      `;
    }
  });

  // Close mobile menu when window is resized to desktop size
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) { // lg breakpoint
      mobileMenu.classList.add('hidden');
      // Reset to hamburger icon
      const icon = mobileMenuBtn.querySelector('svg');
      icon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      `;
    }
  });
}
