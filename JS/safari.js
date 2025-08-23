// Optimized safari.js - Unused code removed, error handling added
(function() {
  'use strict';

  document.addEventListener("DOMContentLoaded", function () {
    try {
      // Determine page type
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
              const selectedDate = info.dateStr;
              localStorage.setItem("bookingdate", selectedDate);

              // Remove previous selection
              document.querySelectorAll(".fc-day-selected").forEach((el) => {
                el.classList.remove("fc-day-selected");
              });

              info.dayEl.classList.add("fc-day-selected");
              console.log(`Selected date: ${selectedDate}`);
            },
            validRange: { start: new Date() },
          });
          calendar.render();
        }

        const form = document.getElementById("form");
        if (form) {
          form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            try {
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
              const required = ["userFullName", "userEmail", "userNumber", "userTiming", "safari", "zone", "bookingDate"];
              const missing = required.filter(field => !formData[field]);
              
              if (missing.length) {
                alert("Please fill out all form fields and select a date.");
                return;
              }

              // Store in localStorage
              Object.entries(formData).forEach(([key, value]) => {
                const storageKey = key === 'userFullName' ? 'username' : 
                                 key === 'userNumber' ? 'number' : key;
                localStorage.setItem(storageKey, value);
              });

              window.location.href = "create-safari-booking.html";
            } catch (error) {
              console.error("Form submission error:", error);
              alert("An error occurred. Please try again.");
            }
          });
        }
      }

      // Booking Page Logic
      if (isBookingPage) {
        const storageData = [
          'username', 'email', 'number', 'timing', 'safari', 'zone', 'bookingdate'
        ].map(key => ({ key, value: localStorage.getItem(key) }));

        const displayElements = {
          '.display-name': 'username',
          '.display-email': 'email', 
          '.display-mobile': 'number',
          '.display-safari': 'safari',
          '.display-zone': 'zone',
          '.display-timing': 'timing',
          '.display-date': 'bookingdate'
        };

        Object.entries(displayElements).forEach(([selector, dataKey]) => {
          const element = document.querySelector(selector);
          const data = storageData.find(item => item.key === dataKey);
          if (element) {
            element.textContent = data?.value || "N/A";
          }
        });
      }

      // Passenger management
      let passengerCount = 1;
      const addMemberBtn = document.getElementById("add-member-btn");
      
      if (addMemberBtn) {
        addMemberBtn.addEventListener("click", () => {
          if (passengerCount >= 6) {
            alert("Maximum 6 passengers allowed.");
            return;
          }
          
          addPassengerRow();
          passengerCount++;
        });
      }

      function addPassengerRow() {
        const tableBody = document.getElementById("passengerTableBody");
        if (!tableBody) return;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="p-1">
            <p class="w-full px-3 py-1 rounded-[10px] bg-[#604019] font-bold text-[#fff]">
              ${passengerCount + 1}.
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
              <option value="mumbai">Mumbai</option>
              <option value="gujarat">Gujarat</option>
              <option value="other">Other</option>
            </select>
          </td>
          <td class="p-1">
            <select class="w-full p-1 border border-gray-300 rounded" required>
              <option value="">Select ID</option>
              <option value="aadhar">Aadhar</option>
              <option value="passport">Passport</option>
              <option value="dl">Driver's License</option>
              <option value="voter">Voter ID</option>
            </select>
          </td>
          <td class="p-1"><input type="text" class="w-full p-1 border border-gray-300 rounded" placeholder="ID Number" required></td>
          <td class="p-1"><button type="button" class="w-full px-6 py-1 border border-gray-300 rounded cursor-pointer bg-[#FF0000] text-white" onclick="this.closest('tr').remove(); passengerCount--;">×</button></td>
        `;
        tableBody.appendChild(row);
      }

    } catch (error) {
      console.error("Safari script error:", error);
    }
  });
})();
