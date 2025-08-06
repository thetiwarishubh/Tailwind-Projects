document.addEventListener("DOMContentLoaded", function () {
  try {
    // Determine which page is loaded
    const isFormPage =
      window.location.pathname.includes("safari.html") ||
      window.location.pathname === "/" ||
      !window.location.pathname.includes("create-safari-booking.html");
    const isBookingPage = window.location.pathname.includes(
      "create-safari-booking.html"
    );

    console.log("Current page:", window.location.pathname, {
      isFormPage,
      isBookingPage,
    });

    // Form submission logic for index.html
    if (isFormPage) {
      const calendarEl = document.getElementById("calendar");
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
      });
      calendar.render();

      const form = document.getElementById("form");
      if (!form) {
        console.error("Form element with id 'form' not found.");
        alert("Form not found on this page.");
        return;
      }

      form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent default form submission

        // Get input values
        const userFullName = document.getElementById("name")?.value;
        const userEmail = document.getElementById("email")?.value;
        const userNumber = document.getElementById("mobile")?.value;
        const userTiming = document.getElementById("timing")?.value;
        const safari = document.getElementById("safari")?.value;
        const zone = document.getElementById("zone")?.value;

        // Validate inputs
        if (
          !userFullName ||
          !userEmail ||
          !userNumber ||
          !userTiming ||
          !safari ||
          !zone
        ) {
          console.error("One or more input fields are missing or empty:", {
            userFullName,
            userEmail,
            userNumber,
            userTiming,
            safari,
            zone,
          });
          alert("Please fill out all form fields.");
          return;
        }

        // Log input values for debugging
        console.log("Form values:", {
          userFullName,
          userEmail,
          userNumber,
          userTiming,
          safari,
          zone,
        });

        // Store values in localStorage
        localStorage.setItem("username", userFullName);
        localStorage.setItem("email", userEmail);
        localStorage.setItem("number", userNumber);
        localStorage.setItem("timing", userTiming);
        localStorage.setItem("safari", safari);
        localStorage.setItem("zone", zone);

        // Verify stored values
        console.log("Stored in localStorage:", {
          username: localStorage.getItem("username"),
          email: localStorage.getItem("email"),
          number: localStorage.getItem("number"),
          timing: localStorage.getItem("timing"),
          safari: localStorage.getItem("safari"),
          zone: localStorage.getItem("zone"),
        });

        // Redirect to the second page
        try {
          window.location.href = "create-safari-booking.html";
          console.log("Redirecting to create-safari-booking.html");
        } catch (redirectError) {
          console.error("Redirect failed:", redirectError);
          alert(
            "Failed to redirect to the booking page. Please check the console."
          );
        }
      });
    }

    // Data display logic for create-safari-booking.html
    if (isBookingPage) {
      // Retrieve data from localStorage
      const username = localStorage.getItem("username");
      const email = localStorage.getItem("email");
      const number = localStorage.getItem("number");
      const timing = localStorage.getItem("timing");
      const safari = localStorage.getItem("safari");
      const zone = localStorage.getItem("zone");

      // Log retrieved values
      console.log("Retrieved from localStorage:", {
        username,
        email,
        number,
        timing,
        safari,
        zone,
      });

      // Get DOM elements
      const displayName = document.querySelector(".display-name");
      const displayEmail = document.querySelector(".display-email");
      const displayMobile = document.querySelector(".display-mobile");
      const displaySafari = document.querySelector(".display-safari");
      const displayZone = document.querySelector(".display-zone");
      const displayTiming = document.querySelector(".display-timing");

      // Log DOM elements
      console.log("DOM elements:", {
        displayName,
        displayEmail,
        displayMobile,
        displaySafari,
        displayZone,
        displayTiming,
      });

      // Update DOM with data or fallback
      if (username && displayName) displayName.textContent = username;
      else if (displayName) displayName.textContent = "N/A";

      if (email && displayEmail) displayEmail.textContent = email;
      else if (displayEmail) displayEmail.textContent = "N/A";

      if (number && displayMobile) displayMobile.textContent = number;
      else if (displayMobile) displayMobile.textContent = "N/A";

      if (safari && displaySafari) displaySafari.textContent = safari;
      else if (displaySafari) displaySafari.textContent = "N/A";

      if (zone && displayZone) displayZone.textContent = zone;
      else if (displayZone) displayZone.textContent = "N/A";

      if (timing && displayTiming) displayTiming.textContent = timing;
      else if (displayTiming) displayTiming.textContent = "N/A";
    }
  } catch (error) {
    console.error("Error in script execution:", error);
    alert("An error occurred. Please check the console for details.");
  }
  let rowCount = 0; // Initialize row counter
  const addMemberBtn = document.getElementById('add-member-btn');

  function addRow() {
    rowCount++; // Increment row number
    const tableBody = document.getElementById("passengerTableBody"); // Target the table body
    const newRow = document.createElement("tr"); // Create a new <tr> element
    newRow.innerHTML = `
        <td class="p-1">
            <p class="w-full px-3 py-1 rounded-[10px] bg-[#604019] font-bold text-[#fff]">
                ${rowCount + 1}.
            </p>
        </td>
        <td class="p-1"><input type="text" class="w-full p-1 border border-gray-300 rounded" placeholder="Enter name"></td>
        <td class="p-1"><input type="number" class="w-full p-1 border border-gray-300 rounded" placeholder="Age"></td>
        <td class="p-1">
            <select class="w-full p-1 border border-gray-300 rounded">
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
        </td>
        <td class="p-1">
            <select class="w-full p-1 border border-gray-300 rounded">
                <option value="">Nationality</option>
                <option value="indian">Indian</option>
                <option value="foreigner">Foreigner</option>
            </select>
        </td>
        <td class="p-1">
            <select class="w-full p-1 border border-gray-300 rounded">
                <option value="">State</option>
                <option value="andaman-and-nicobar-islands">Andaman and Nicobar Islands</option>
                <option value="andhra-pradesh">Andhra Pradesh</option>
                <option value="arunachal-pradesh">Arunachal Pradesh</option>
                <option value="assam">Assam</option>
                <option value="bihar">Bihar</option>
                <option value="chandigarh">Chandigarh</option>
                <option value="chhattisgarh">Chhattisgarh</option>
                <option value="dadra-and-nagar-haveli-and-daman-and-diu">Dadra and Nagar Haveli and Daman and Diu</option>
                <option value="delhi">Delhi</option>
                <option value="goa">Goa</option>
                <option value="gujarat">Gujarat</option>
                <option value="haryana">Haryana</option>
                <option value="himachal-pradesh">Himachal Pradesh</option>
                <option value="jammu-and-kashmir">Jammu and Kashmir</option>
                <option value="jharkhand">Jharkhand</option>
                <option value="karnataka">Karnataka</option>
                <option value="kerala">Kerala</option>
                <option value="ladakh">Ladakh</option>
                <option value="lakshadweep">Lakshadweep</option>
                <option value="madhya-pradesh">Madhya Pradesh</option>
                <option value="maharashtra">Maharashtra</option>
                <option value="manipur">Manipur</option>
                <option value="meghalaya">Meghalaya</option>
                <option value="mizoram">Mizoram</option>
                <option value="nagaland">Nagaland</option>
                <option value="odisha">Odisha</option>
                <option value="puducherry">Puducherry</option>
                <option value="punjab">Punjab</option>
                <option value="rajasthan">Rajasthan</option>
                <option value="sikkim">Sikkim</option>
                <option value="tamil-nadu">Tamil Nadu</option>
                <option value="telangana">Telangana</option>
                <option value="tripura">Tripura</option>
                <option value="uttar-pradesh">Uttar Pradesh</option>
                <option value="uttarakhand">Uttarakhand</option>
                <option value="west-bengal">West Bengal</option>
            </select>
        </td>
        <td class="p-1">
            <select class="w-full p-1 border border-gray-300 rounded">
                <option value="">Select ID</option>
                <option value="aadhar">Aadhar</option>
                <option value="passport">Passport</option>
                <option value="dl">Driver's License</option>
                <option value="pan-card">Pan card</option>
                <option value="voter">Voter ID</option>
                <option value="other">Any Other ID</option>
            </select>
        </td>
        <td class="p-1"><input type="text" class="w-full p-1 border border-gray-300 rounded" placeholder="ID Number"></td>
        <td class="p-1"><button class="w-full px-6 py-1 border border-gray-300 rounded cursor-pointer bg-[#FF0000]">X</button></td>
    `;
    tableBody.appendChild(newRow); // Append the new row to the table body
  }
  addMemberBtn.addEventListener('click', ()=> {
    addRow()
  })
});
