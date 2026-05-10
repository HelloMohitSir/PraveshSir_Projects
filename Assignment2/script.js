let index = 0;
const slides = document.querySelector(".slides");
const total = document.querySelectorAll(".slide").length;

function updateSlide() {
  slides.style.transform = `translateX(-${index * 100}%)`;
}

document.querySelector(".next").onclick = () => {
  index = (index + 1) % total;
  updateSlide();
};

document.querySelector(".prev").onclick = () => {
  index = (index - 1 + total) % total;
  updateSlide();
};

setInterval(() => {
  index = (index + 1) % total;
  updateSlide();
}, 3000);
