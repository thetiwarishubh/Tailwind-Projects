const logo = document.querySelector(".logo");
logo.addEventListener("click", () => {
  window.location.href = "index.html";
});

const chambalBtn = document.querySelector(".chambalBtn");
const hotelBtn = document.querySelector(".hotelBtn");
const tourBtn = document.querySelector(".tourBtn");
const safariBtn = document.querySelector(".safariBtn");

chambalBtn.addEventListener("click", () => {
  window.location.href = "chambal.html";
});
hotelBtn.addEventListener("click", () => {
  window.location.href = "hotel.html";
});
tourBtn.addEventListener("click", () => {
  window.location.href = "package-booking.html";
});
safariBtn.addEventListener("click", () => {
  window.location.href = "safari.html";
  console.log("safari Button clicked");
});

