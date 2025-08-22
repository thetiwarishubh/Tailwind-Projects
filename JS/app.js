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
