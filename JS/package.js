const bookNowButtons = document.querySelectorAll(".bookNowBtn");
bookNowButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    window.location.href = "package-booking-page.html";
  });
});

// Use event delegation for View Details buttons since they might be dynamically created
document.addEventListener("click", function (e) {
  // Check if a View Details button was clicked
  const viewDetailsBtn = e.target.closest('a[href="#"], a[aria-label^="View"]');

  if (viewDetailsBtn && viewDetailsBtn.textContent.includes("View Details")) {
    e.preventDefault();
    document.body.style.overflow = "hidden";

    // Get package details from the card
    const card = viewDetailsBtn.closest(".relative");
    const packageTitle = card.querySelector("h3").textContent;
    const packageImage = card.querySelector("img").src;
    const highlights = Array.from(card.querySelectorAll("ul li")).map(
      (li) => li.textContent
    );
    const prices = [...card.querySelectorAll(".price-tag")].map(
      (p) => p.textContent
    );
    const duration = card.querySelector('[class*="font-semibold"]').textContent;
    const location = card
      .querySelector(".flex.items-center.text-gray-600")
      .textContent.trim();
    console.log(prices);
    // Create modal HTML
    // Create modal HTML with animation classes
    const modalHTML = `
                                    <div class="fixed inset-0 backdrop-blur-4xl bg-black/50 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out" id="package-modal">
                                    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-fade-in">
                                        <div class="p-6">
                                    <div class="flex justify-between items-start mb-4">
                                    <h3 class="text-2xl font-bold text-gray-900">${packageTitle}</h3>
                                    <button class="close-modal cursor-pointer text-gray-500 hover:text-gray-700 focus:outline-none">
                                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <img class="w-full h-auto rounded-sm shadow-xl object-cover transition-all hover:scale-[1.05]" src="${packageImage}" 
                             alt="${packageTitle}" class="w-full h-64 object-cover rounded-lg shadow-md">
                    </div>
                    <div>
                        <div class="mb-4">
                            <h4 class="font-semibold text-lg text-gray-800 mb-2">Package Highlights</h4>
                            <ul class="list-disc pl-5 space-y-2 text-gray-700">
                                ${highlights
                                  .map((item) => `<li>${item}</li>`)
                                  .join("")}
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
                                        <button class="cursor-pointer book-now w-full bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
    // Insert modal into DOM
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Add event listeners for the modal
    // Add event listeners after inserting modal
    document
      .querySelector(".close-modal")
      .addEventListener("click", closeModal);
    document.querySelector(".book-now").addEventListener("click", function () {
      window.location.href = "package-booking-page.html";
    });

    // Close modal when clicking on backdrop
    document
      .getElementById("package-modal")
      .addEventListener("click", function (e) {
        if (e.target === this) {
          closeModal();
        }
      });
  }

  // Close modal when clicking outside or on close button
  if (
    e.target.closest("#package-modal") &&
    e.target === document.querySelector("#package-modal")
  ) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.getElementById("package-modal").remove();
    document.body.style.overflow = "";
  }
});

function closeModal() {
  const modal = document.getElementById("package-modal");
  if (modal) {
    // Add fade-out animations
    modal.classList.remove("backdrop-fade-in");
    modal.classList.add("backdrop-fade-out");

    const modalContent = modal.querySelector(".modal-fade-in");
    modalContent.classList.remove("modal-fade-in");
    modalContent.classList.add("modal-fade-out");
    document.body.style.overflow = "";

    // Remove modal after animations complete
    setTimeout(() => {
      modal.remove();
    }, 300); // Match this duration with your animation time
  }
}

// Select all like buttons
document.querySelectorAll(".like-btn").forEach((button) => {
  button.addEventListener("click", function () {
    const icon = this.querySelector(".like-box");

    this.classList.toggle("liked");

    if (this.classList.contains("liked")) {
      icon.style.fill = "#f43f5e"; // Instagram-like pink
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
let targetDate = new Date("2026-07-07T12:00:00").getTime();

let countdownInterval = setInterval(() => {
  let now = new Date().getTime();
  let distance = targetDate - now;

  if (distance <= 0) {
    clearInterval(countdownInterval);
    document.getElementById("timer").innerHTML = "00d : 00h : 00m : 00s";
    return;
  }

  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("timer").innerHTML = `${String(days).padStart(
    2,
    "0"
  )}d : ${String(hours).padStart(2, "0")}h : ${String(minutes).padStart(
    2,
    "0"
  )}m : ${String(seconds).padStart(2, "0")}s`;
}, 1000);

// ------------------Quick View ------------------------------

document.addEventListener("click", function (e) {
  const quickViewBtn = e.target.closest('button[aria-label^="Quick view"]');

  if (quickViewBtn) {
    e.preventDefault();
    document.body.style.overflow = "hidden";

    // Get all package details
    const card = quickViewBtn.closest(".group");
    const packageTitle = card.querySelector("h3").textContent;
    const packageImage = card.querySelector("img").src;
    const highlights = Array.from(card.querySelectorAll("ul li")).map(
      (li) => li.textContent
    );
    const price = card.querySelector(".price-tag").textContent;
    const duration = card.querySelector(
      ".flex.items-center.text-sm.text-gray-600.mb-3 span"
    ).textContent;
    const location = card
      .querySelector(".flex.items-center.text-gray-600.text-sm.mb-4")
      .textContent.trim();
    const rating = card.querySelector(
      ".flex.items-center.space-x-1 span:first-child"
    ).textContent;
    const badge =
      card.querySelector(".absolute.top-4.left-0.z-10 div")?.textContent || "";

    // Create rating stars
    const ratingNum = parseFloat(rating);
    const stars = Array(5)
      .fill(0)
      .map((_, i) =>
        i < Math.floor(ratingNum)
          ? `<svg class="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>`
          : `<svg class="h-5 w-5 text-amber-500/50" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>`
      )
      .join("");
    const modalHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm backdrop-fade-in" id="quick-view-modal">
                <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto modal-fade-in transform transition-all duration-300">
                    <div class="relative">
                        <!-- Close button with better positioning -->
                        <button class="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 transition-all shadow-md close-quick-view" aria-label="Close modal">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        <!-- Package image with badge -->
                        <div class="relative h-64 md:h-80 w-full overflow-hidden">
                            <img src="${packageImage}" alt="${packageTitle}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">
                            ${
                              badge
                                ? `
                                <div class="absolute top-4 left-0 z-10">
                                    <div class="bg-gradient-to-r from-amber-500 to-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-r-lg shadow-md">
                                        ${badge}
                                    </div>
                                </div>
                            `
                                : ""
                            }
                            <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            <div class="absolute bottom-4 left-4 right-4">
                                <h2 class="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">${packageTitle}</h2>
                                <div class="flex items-center justify-between mt-2">
                                    <div class="flex items-center">
                                        <div class="flex mr-2">
                                            ${stars}
                                        </div>
                                        <span class="text-white text-sm font-medium">${rating} (${
      Math.floor(Math.random() * 100) + 50
    } reviews)</span>
                                    </div>
                                    <span class="bg-white/90 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">${duration}</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Package details with tabs -->
                        <div class="p-6">
                            <div class="grid md:grid-cols-2 gap-8">
                                <div>
                                    <div class="mb-6">
                                        <h3 class="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Package Summary</h3>
                                        <div class="space-y-4">
                                            <div class="flex items-start">
                                                <svg class="h-5 w-5 mr-3 mt-0.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <div>
                                                    <h4 class="font-medium text-gray-800">Destination</h4>
                                                    <p class="text-sm text-gray-600">${location}</p>
                                                </div>
                                            </div>
                                            <div class="flex items-start">
                                                <svg class="h-5 w-5 mr-3 mt-0.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div>
                                                    <h4 class="font-medium text-gray-800">Best Time to Visit</h4>
                                                    <p class="text-sm text-gray-600">October to April (80% tiger sighting probability)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="bg-amber-50 rounded-lg p-4 border border-amber-200">
                                        <h4 class="font-semibold text-gray-800 mb-3">Price Details</h4>
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="text-gray-600">Package Price</span>
                                            <span class="font-medium">${price}</span>
                                        </div>
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="text-gray-600">Discount</span>
                                            <span class="text-green-600 font-medium">10% OFF</span>
                                        </div>
                                        <div class="border-t border-amber-200 pt-2 mt-2">
                                            <div class="flex justify-between items-center">
                                                <span class="font-semibold">Total Price</span>
                                                <span class="text-xl font-bold text-amber-600">${price}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <div class="mb-6">
                                        <h3 class="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Package Inclusions</h3>
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
                                    
                                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <h4 class="font-semibold text-gray-800 mb-3">Know Before You Book</h4>
                                        <ul class="space-y-2 text-sm text-gray-600">
                                            <li class="flex items-start">
                                                <svg class="h-4 w-4 mr-2 mt-0.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Free cancellation up to 15 days before travel</span>
                                            </li>
                                            <li class="flex items-start">
                                                <svg class="h-4 w-4 mr-2 mt-0.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Safari permits are non-refundable once booked</span>
                                            </li>
                                            <li class="flex items-start">
                                                <svg class="h-4 w-4 mr-2 mt-0.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Children under 5 years are free of charge</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-8 pt-6 border-t border-gray-200">
                                <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div class="flex items-center flex-wrap justify-center gap-4">
                                        <div class="flex items-center text-sm text-green-600">
                                            <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                            </svg>
                                            Instant Confirmation
                                        </div>
                                        <div class="flex items-center text-sm text-green-600">
                                            <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                            </svg>
                                            Best Price Guarantee
                                        </div>
                                    </div>
                                    <button class="quick-book-now w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
                                        Book Now - ${price}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    // Insert modal into DOM
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Add event listeners
    document
      .querySelector(".close-quick-view")
      .addEventListener("click", closeQuickViewModal);
    document
      .querySelector(".quick-book-now")
      .addEventListener("click", function () {
        window.location.href = "package-booking-page.html";
      });

    // Close modal when clicking on backdrop
    document
      .getElementById("quick-view-modal")
      .addEventListener("click", function (e) {
        if (e.target === this) {
          closeQuickViewModal();
        }
      });
  }
});

// Enhanced close function with animation
function closeQuickViewModal() {
  const modal = document.getElementById("quick-view-modal");
  if (modal) {
    modal.querySelector(".modal-fade-in").classList.add("modal-fade-out");
    modal.classList.add("backdrop-fade-out");
    document.body.style.overflow = "";

    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

// Close modal with ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.getElementById("quick-view-modal")) {
    closeQuickViewModal();
  }
});

// -------------------------Gallery------------------------------

document.addEventListener("click", function (e) {
  const galleryBtn = e.target.closest(
    '[aria-label*="gallery" i], [aria-label*="view" i]'
  );

  if (galleryBtn) {
    e.preventDefault();
    document.body.style.overflow = "hidden";

    const card =
      galleryBtn.closest(".relative") ||
      galleryBtn.closest(".card") ||
      galleryBtn.closest('[class*="card"]') ||
      galleryBtn.closest("div");
    const imgElement = card.querySelector("img");
    const imgSrc = imgElement?.src || "";
    const imgAlt = imgElement?.alt || "Gallery Image";

    const modalHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-4xl bg-opacity-90" id="gallery-modal">
                <div class="relative w-full max-w-6xl max-h-[90vh]">
                    <!-- Close button -->
                    <button class="absolute top-4 right-4 z-30 p-2 rounded-full bg-red-500 hover:bg-yellow-400 text-black transition-all shadow-md close-gallery" aria-label="Close modal">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                    <!-- Main image -->
                    <div class="flex items-center justify-center h-full">
                        <img src="${imgSrc}" alt="${imgAlt}" loading="lazy" 
                        decoding="async" class="max-h-[80vh] max-w-full w-auto rounded-lg shadow-lg  object-contain opacity-0 transition-opacity duration-300">
                    </div>
                </div>
            </div>
        `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modalImg = document.querySelector("#gallery-modal img");
    modalImg.onload = function () {
      modalImg.classList.remove("opacity-0");
    };

    modalImg.onerror = function () {
      modalImg.classList.remove("opacity-0");
    };

    document
      .querySelector(".close-gallery")
      .addEventListener("click", closeGalleryModal);

    document
      .getElementById("gallery-modal")
      .addEventListener("click", function (e) {
        if (e.target === this) {
          closeGalleryModal();
        }
      });
  }
});

function closeGalleryModal() {
  const modal = document.getElementById("gallery-modal");
  if (modal) {
    modal.style.opacity = "0";
    document.body.style.overflow = "";

    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && document.getElementById("gallery-modal")) {
    closeGalleryModal();
  }
});


const packageBookingBtn = document.querySelectorAll('.package-booking-btn');
packageBookingBtn.forEach(btn => {
    btn.addEventListener('click', ()=> {
        window.location.href = 'package-booking-page.html'
    })
})