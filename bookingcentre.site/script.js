
const bannerContainer = document.querySelector('.banner-container');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');

const scrollAmount = 200;
let autoScrollInterval;
let isUserInteracting = false;

const startAutoScroll = () => {
    autoScrollInterval = setInterval(() => {
        if (!isUserInteracting) {
            if (bannerContainer.scrollLeft + bannerContainer.clientWidth >= bannerContainer.scrollWidth) {
                bannerContainer.scrollTo({ left: 0, behavior: 'smooth' }); // Reset to start
            } else {
                bannerContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    }, 2000);
};

const stopAutoScroll = () => {
    clearInterval(autoScrollInterval);
};

leftArrow.addEventListener('click', () => {
    isUserInteracting = true;
    bannerContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    stopAutoScroll();
    setTimeout(startAutoScroll, 2000);
});

rightArrow.addEventListener('click', () => {
    isUserInteracting = true;
    if (bannerContainer.scrollLeft + bannerContainer.clientWidth >= bannerContainer.scrollWidth) {
        bannerContainer.scrollTo({ left: 0, behavior: 'smooth' }); // Reset to start
    } else {
        bannerContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
    stopAutoScroll();
    setTimeout(startAutoScroll, 2000);
});

startAutoScroll();
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });

  document.addEventListener('keydown', function (e) {
    // F12 or Ctrl+Shift+I or Ctrl+U
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && e.key === "I") ||
      (e.ctrlKey && e.key === "U")
    ) {
      e.preventDefault();
      alert("Action disabled");
    }
  });