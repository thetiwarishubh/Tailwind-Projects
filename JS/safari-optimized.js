// Safari Essential - Optimized and compact version
(function() {
  'use strict';

  const CONFIG = {
    MAX_PASSENGERS: 6,
    NOTIFICATION_DURATION: 3000
  };

  // Utilities
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone.replace(/\s+/g, ""));
  const sanitizeInput = (input) => {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  };

  // Notification system
  function showNotification(message, type = "success") {
    let container = document.querySelector(".notification-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "notification-container fixed top-4 right-4 z-50";
      document.body.appendChild(container);
    }

    const notification = document.createElement("div");
    notification.className = `p-3 rounded-lg shadow-lg text-white mb-2 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`;
    notification.innerHTML = `
      <div class="flex items-center">
        <span class="mr-2">${type === "success" ? "✓" : "✗"}</span>
        <span>${message}</span>
        <button class="ml-4 hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    container.appendChild(notification);
    setTimeout(() => notification.remove(), CONFIG.NOTIFICATION_DURATION);
  }

  document.addEventListener("DOMContentLoaded", function () {
    const isFormPage = window.location.pathname.includes("safari.html") || 
                      window.location.pathname === "/" || 
                      !window.location.pathname.includes("create-safari-booking.html");
    const isBookingPage = window.location.pathname.includes("create-safari-booking.html");

    // Form Page Logic
    if (isFormPage) {
      const calendarEl = document.getElementById("calendar");
      if (calendarEl && typeof FullCalendar !== 'undefined') {
        const calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: "dayGridMonth",
          headerToolbar: {
            left: "prev,next today",
            center: "title", 
            right: "dayGridMonth",
          },
          dateClick: function (info) {
            localStorage.setItem("bookingdate", info.dateStr);
            document.querySelectorAll(".fc-day-selected").forEach((el) => {
              el.classList.remove("fc-day-selected");
            });
            info.dayEl.classList.add("fc-day-selected");
            showNotification(`Selected date: ${info.dateStr}`, "success");
          },
          validRange: { start: new Date() },
        });
        calendar.render();
      }

      const form = document.getElementById("form");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          
          const formData = {
            userFullName: document.getElementById("name")?.value,
            userEmail: document.getElementById("email")?.value,
            userNumber: document.getElementById("mobile")?.value,
            userTiming: document.getElementById("timing")?.value,
            safari: document.getElementById("safari")?.value,
            zone: document.getElementById("zone")?.value,
            bookingDate: localStorage.getItem("bookingdate")
          };

          // Validation
          const errors = [];
          if (!formData.bookingDate) errors.push("Please select date");
          if (!formData.userFullName?.trim()) errors.push("Please enter your full name");
          if (!formData.userEmail?.trim()) errors.push("Please enter email");
          else if (!isValidEmail(formData.userEmail)) errors.push("Please enter valid email");
          if (!formData.userNumber?.trim()) errors.push("Please enter mobile number");
          else if (!isValidPhone(formData.userNumber)) errors.push("Please enter valid 10-digit number");
          if (!formData.userTiming) errors.push("Please select safari timing");
          if (!formData.safari) errors.push("Please select safari type");
          if (!formData.zone) errors.push("Please select safari zone");

          if (errors.length) {
            showNotification(errors[0], "error");
            return;
          }

          // Store sanitized data
          Object.entries(formData).forEach(([key, value]) => {
            if (value) {
              const storageKey = key === 'userFullName' ? 'username' : 
                               key === 'userNumber' ? 'number' : key;
              localStorage.setItem(storageKey, sanitizeInput(value.toString().trim()));
            }
          });

          showNotification("Form submitted successfully! Redirecting...");
          setTimeout(() => {
            window.location.href = "create-safari-booking.html";
          }, 1500);
        });
      }
    }

    // Booking Page Logic  
    if (isBookingPage) {
      const storageKeys = ['username', 'email', 'number', 'timing', 'safari', 'zone', 'bookingdate'];
      const displaySelectors = {
        '.display-name': 'username',
        '.display-email': 'email',
        '.display-mobile': 'number', 
        '.display-safari': 'safari',
        '.display-zone': 'zone',
        '.display-timing': 'timing',
        '.display-date': 'bookingdate'
      };

      Object.entries(displaySelectors).forEach(([selector, key]) => {
        const element = document.querySelector(selector);
        if (element) {
          element.textContent = localStorage.getItem(key) || "N/A";
        }
      });

      // Passenger management
      let passengerCount = 1;
      const addMemberBtn = document.getElementById("add-member-btn");
      
      if (addMemberBtn) {
        addMemberBtn.addEventListener("click", () => {
          if (passengerCount >= CONFIG.MAX_PASSENGERS) {
            showNotification("Maximum 6 passengers allowed.", "error");
            return;
          }
          
          const tableBody = document.getElementById("passengerTableBody");
          if (!tableBody) return;

          passengerCount++;
          const row = document.createElement("tr");
          row.innerHTML = `
            <td class="p-1">
              <p class="w-full px-3 py-1 rounded-lg bg-amber-800 font-bold text-white text-center">
                ${passengerCount}.
              </p>
            </td>
            <td class="p-1"><input type="text" class="w-full p-1 border border-gray-300 rounded" placeholder="Enter name" required></td>
            <td class="p-1"><input type="number" class="w-full p-1 border border-gray-300 rounded" placeholder="Age" min="1" max="120" required></td>
            <td class="p-1">
              <select class="w-full p-1 border border-gray-300 rounded" required>
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </td>
            <td class="p-1">
              <select class="w-full p-1 border border-gray-300 rounded" required>
                <option value="">Nationality</option>
                <option value="indian">Indian</option>
                <option value="foreigner">Foreigner</option>
              </select>
            </td>
            <td class="p-1">
              <select class="w-full p-1 border border-gray-300 rounded" required>
                <option value="">State</option>
                <option value="rajasthan">Rajasthan</option>
                <option value="delhi">Delhi</option>
                <option value="other">Other</option>
              </select>
            </td>
            <td class="p-1">
              <select class="w-full p-1 border border-gray-300 rounded" required>
                <option value="">ID Type</option>
                <option value="aadhar">Aadhar</option>
                <option value="passport">Passport</option>
                <option value="dl">License</option>
                <option value="voter">Voter ID</option>
              </select>
            </td>
            <td class="p-1"><input type="text" class="w-full p-1 border border-gray-300 rounded" placeholder="ID Number" required></td>
            <td class="p-1">
              <button type="button" class="w-full px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" onclick="this.closest('tr').remove(); passengerCount--;">
                ×
              </button>
            </td>
          `;
          tableBody.appendChild(row);
          showNotification(`Passenger ${passengerCount} added successfully.`);
        });
      }
    }

    // Alert Modal handlers
    const createSafariBookingButton = document.querySelectorAll(".createSafariBookingButton");
    const alertModal = document.getElementById("alertModal");
    const startBookingButton = document.querySelector(".startingBookingBtn");
    const continueBookingButton = document.querySelector(".continueBookingBtn");

    if (alertModal) {
      createSafariBookingButton.forEach((btn) => {
        btn.addEventListener("click", () => {
          alertModal.classList.remove("hidden");
        });
      });

      if (startBookingButton) {
        startBookingButton.addEventListener("click", () => {
          window.location.href = "safari.html";
        });
      }

      if (continueBookingButton) {
        continueBookingButton.addEventListener("click", () => {
          alertModal.classList.add("hidden");
        });
      }

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          alertModal.classList.add("hidden");
        }
      });

      alertModal.addEventListener("click", (e) => {
        if (e.target === alertModal) {
          alertModal.classList.add("hidden");
        }
      });
    }
  });
})();
