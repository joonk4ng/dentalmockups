// ==========================================================================
// Sunrise Dental of Eugene - Interactive Scripts
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // --- Appointment Request Form Handling ---
  const bookingForm = document.getElementById('heroBookingForm');
  const bookingSuccess = document.getElementById('bookingSuccess');
  const confirmName = document.getElementById('confirmName');
  const confirmPhone = document.getElementById('confirmPhone');
  const resetFormBtn = document.getElementById('resetFormBtn');

  if (bookingForm && bookingSuccess) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('fullName').value.trim();
      const phoneVal = document.getElementById('phoneNum').value.trim();

      // Populate confirmation screen
      if (confirmName) confirmName.textContent = nameVal || 'Neighbor';
      if (confirmPhone) confirmPhone.textContent = phoneVal || 'your phone';

      // Toggle views
      bookingForm.classList.add('hidden');
      bookingSuccess.classList.add('active');
    });

    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        bookingForm.reset();
        bookingForm.classList.remove('hidden');
        bookingSuccess.classList.remove('active');
      });
    }
  }

  // --- Mobile Navigation Drawer Toggle ---
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      mobileToggle.classList.toggle('open');
    });

    // Close menu when clicking any nav link
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        mobileToggle.classList.remove('open');
      });
    });
  }

  // --- Smooth scroll for on-page links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
