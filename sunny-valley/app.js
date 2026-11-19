document.addEventListener('DOMContentLoaded', () => {
  // --- Testimonials Carousel Logic ---
  const carouselTrack = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicators = document.querySelectorAll('#indicators .indicator');
  const slides = document.querySelectorAll('.carousel-slide');
  let currentSlideIndex = 0;

  if (carouselTrack && slides.length > 0) {
    const updateCarousel = (index) => {
      // Keep index in bounds
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      
      currentSlideIndex = index;

      // Translate track
      carouselTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

      // Update indicators
      indicators.forEach((ind, idx) => {
        if (idx === currentSlideIndex) {
          ind.classList.add('active');
        } else {
          ind.classList.remove('active');
        }
      });
    };

    nextBtn.addEventListener('click', () => {
      updateCarousel(currentSlideIndex + 1);
    });

    prevBtn.addEventListener('click', () => {
      updateCarousel(currentSlideIndex - 1);
    });

    // Indicators click event
    indicators.forEach((indicator, idx) => {
      indicator.addEventListener('click', () => {
        updateCarousel(idx);
      });
    });

    // Initialize carousel
    updateCarousel(0);
  }

  // --- Kids Corner Dental Trivia Quiz Logic ---
  const quizOptions = document.querySelectorAll('.quiz-opt');
  const quizFeedback = document.getElementById('quizFeedback');
  const feedbackText = quizFeedback.querySelector('.feedback-text');

  quizOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Clear previous classes on options
      quizOptions.forEach(opt => {
        opt.classList.remove('correct', 'incorrect');
      });

      const isCorrect = option.getAttribute('data-correct') === 'true';

      if (isCorrect) {
        option.classList.add('correct');
        feedbackText.textContent = "Correct! You're a Dental Superstar! 🌟 Double brushing keeps sugar bugs away!";
        feedbackText.className = "feedback-text correct";
      } else {
        option.classList.add('incorrect');
        feedbackText.textContent = "Oops! Brushing twice a day (morning & night) keeps teeth strongest! Try again! 🦷";
        feedbackText.className = "feedback-text incorrect";
      }
    });
  });

  // --- Inline Booking Form Logic ---
  const bookingForm = document.getElementById('inlineBookingForm');
  const successScreen = document.getElementById('inlineSuccess');
  const confirmParent = document.getElementById('confirmParent');
  const resetBtn = document.getElementById('resetBookingBtn');

  if (bookingForm && successScreen) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const parentName = document.getElementById('pName').value;
      confirmParent.textContent = parentName;

      // Toggle views
      bookingForm.classList.add('hidden');
      successScreen.classList.add('active');
    });

    resetBtn.addEventListener('click', () => {
      bookingForm.classList.remove('hidden');
      successScreen.classList.remove('active');
      bookingForm.reset();
    });
  }
});
