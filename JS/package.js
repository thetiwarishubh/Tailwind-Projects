// Optimized package.js - Unused code removed, consolidated modal system
(function () {
  "use strict";

  // Book now buttons
  const bookNowButtons = document.querySelectorAll(".bookNowBtn");
  bookNowButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = "package-booking-page.html";
    });
  });

  // Package booking buttons
  const packageBookingBtn = document.querySelectorAll(".package-booking-btn");
  packageBookingBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = "package-booking-page.html";
    });
  });

  // Unified modal system
  let currentModal = null;

  function createModal(content) {
    if (currentModal) closeModal();

    document.body.style.overflow = "hidden";
    const modal = document.createElement("div");
    modal.id = "active-modal";
    modal.className =
      "fixed inset-0 backdrop-blur-md bg-black/50 z-50 flex items-center justify-center p-4";
    modal.innerHTML = content;
    document.body.appendChild(modal);
    currentModal = modal;

    // Close handlers
    const closeBtn = modal.querySelector(".close-modal");
    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    return modal;
  }

  function closeModal() {
    if (currentModal) {
      currentModal.remove();
      currentModal = null;
      document.body.style.overflow = "";
    }
  }

  // View Details handler
  document.addEventListener("click", function (e) {
    const viewDetailsBtn = e.target.closest(
      'a[href="#"], a[aria-label^="View"]'
    );

    if (viewDetailsBtn && viewDetailsBtn.textContent.includes("View Details")) {
      e.preventDefault();
      const card = viewDetailsBtn.closest(".relative");
      if (!card) return;

      const packageTitle = card.querySelector("h3")?.textContent || "Package";
      const packageImage = card.querySelector("img")?.src || "";
      const highlights = Array.from(card.querySelectorAll("ul li")).map(
        (li) => li.textContent
      );
      const duration =
        card.querySelector('[class*="font-semibold"]')?.textContent || "";
      const location =
        card
          .querySelector(".flex.items-center.text-gray-600")
          ?.textContent.trim() || "";
      const prices = card.querySelector(".price-tag")?.textContent || "";

      const modalContent = `
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-2xl font-bold text-gray-900">${packageTitle}</h3>
              <button class="close-modal text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <img class="w-full h-auto rounded-lg shadow-md object-cover" src="${packageImage}" alt="${packageTitle}">
              </div>
              <div>
                <div class="mb-4">
                  <h4 class="font-semibold text-lg text-gray-800 mb-2">Package Highlights</h4>
                  <ul class="list-disc pl-5 space-y-2 text-gray-700">
                    ${highlights.map((item) => `<li>${item}</li>`).join("")}
                  </ul>
                </div>
                
                <div class="space-y-4">
                  <div>
                    <p class="font-medium text-gray-800">Duration</p>
                    <p class="text-sm text-gray-600">${duration}</p>
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">Location</p>
                    <p class="text-sm text-gray-600">${location}</p>
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">Price</p>
                    <p class="text-2xl font-bold text-amber-600">${prices}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-6 pt-4 border-t border-gray-200">
              <button class="book-now w-full bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white px-6 py-3 rounded-lg font-medium">
                Book Now
              </button>
            </div>
          </div>
        </div>
      `;

      const modal = createModal(modalContent);
      modal.querySelector(".book-now").addEventListener("click", () => {
        window.location.href = "package-booking-page.html";
      });
    }
  });

  // Quick View handler
  document.addEventListener("click", function (e) {
    const quickViewBtn = e.target.closest('button[aria-label^="Quick view"]');

    if (quickViewBtn) {
      e.preventDefault();
      const card = quickViewBtn.closest(".group");
      if (!card) return;

      const packageTitle = card.querySelector("h3")?.textContent || "Package";
      const packageImage = card.querySelector("img")?.src || "";
      const highlights = Array.from(card.querySelectorAll("ul li")).map(
        (li) => li.textContent
      );
      const price = card.querySelector(".price-tag")?.textContent || "";
      const rating =
        card.querySelector(".flex.items-center.space-x-1 span:first-child")
          ?.textContent || "4.5";

      const modalContent = `
        <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="relative">
            <button class="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 close-modal">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div class="relative h-64 md:h-80 w-full overflow-hidden">
              <img src="${packageImage}" alt="${packageTitle}" class="w-full h-full object-cover">
              <div class="absolute bottom-4 left-4 right-4">
                <h2 class="text-2xl md:text-3xl font-bold text-white">${packageTitle}</h2>
                <div class="flex items-center justify-between mt-2">
                  <span class="text-white text-sm">${rating} ⭐ (Reviews)</span>
                  <span class="bg-white/90 text-amber-800 px-3 py-1 rounded-full text-sm">${price}</span>
                </div>
              </div>
            </div>
            
            <div class="p-6">
              <div class="mb-6">
                <h3 class="text-xl font-semibold mb-4 text-gray-800">Package Inclusions</h3>
                <ul class="space-y-3">
                  ${highlights
                    .map(
                      (item) => `
                    <li class="flex items-start">
                      <svg class="h-5 w-5 mr-2 mt-0.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span class="text-gray-700">${item}</span>
                    </li>
                  `
                    )
                    .join("")}
                </ul>
              </div>
              
              <button class="quick-book-now w-full px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white rounded-lg font-semibold">
                Book Now - ${price}
              </button>
            </div>
          </div>
        </div>
      `;

      const modal = createModal(modalContent);
      modal.querySelector(".quick-book-now").addEventListener("click", () => {
        window.location.href = "package-booking-page.html";
      });
    }
  });

  // Gallery handler
  document.addEventListener("click", function (e) {
    const galleryBtn = e.target.closest(
      '[aria-label*="gallery" i], [aria-label*="view" i]'
    );

    if (galleryBtn) {
      e.preventDefault();
      const card = galleryBtn.closest(".relative, .card, div");
      const imgElement = card?.querySelector("img");
      const imgSrc = imgElement?.src || "";
      const imgAlt = imgElement?.alt || "Gallery Image";

      if (imgSrc) {
        const modalContent = `
          <div class="relative w-full max-w-6xl max-h-[90vh]">
            <button class="absolute top-4 right-4 z-30 p-2 rounded-full bg-red-500 hover:bg-yellow-400 text-black close-modal">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div class="flex items-center justify-center h-full">
              <img src="${imgSrc}" alt="${imgAlt}" class="max-h-[80vh] max-w-full w-auto rounded-lg shadow-lg object-contain">
            </div>
          </div>
        `;

        createModal(modalContent);
      }
    }
  });

  // Like buttons
  document.querySelectorAll(".like-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const icon = this.querySelector(".like-box");
      this.classList.toggle("liked");

      if (this.classList.contains("liked")) {
        icon.style.fill = "#f43f5e";
        icon.style.stroke = "#f43f5e";
        icon.style.transform = "scale(1.2)";
        setTimeout(() => {
          icon.style.transform = "scale(1)";
        }, 300);
      } else {
        icon.style.fill = "none";
        icon.style.stroke = "currentColor";
      }
    });
  });

  // Countdown timer
  const targetDate = new Date("2026-07-07T12:00:00").getTime();
  const timerElement = document.getElementById("timer");

  if (timerElement) {
    const countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(countdownInterval);
        timerElement.innerHTML = "00d : 00h : 00m : 00s";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      timerElement.innerHTML = `${String(days).padStart(2, "0")}d : ${String(
        hours
      ).padStart(2, "0")}h : ${String(minutes).padStart(2, "0")}m : ${String(
        seconds
      ).padStart(2, "0")}s`;
    }, 1000);
  }

  // ESC key to close modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && currentModal) {
      closeModal();
    }
  });
})();
