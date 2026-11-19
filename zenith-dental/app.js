document.addEventListener('DOMContentLoaded', () => {
  // --- Services Tab Switcher ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Remove active from buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      // Add active to clicked button
      button.classList.add('active');

      // Hide all panes
      tabPanes.forEach(pane => pane.classList.remove('active'));
      // Show target pane
      const activePane = document.getElementById(`tab-${targetTab}`);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });

  // --- Modal Interactive Controls ---
  const bookingModal = document.getElementById('bookingModal');
  const openModalBtns = document.querySelectorAll('.btn-book');
  const closeModalBtn = document.querySelector('.modal-close');
  const bookingForm = document.getElementById('bookingForm');
  const successScreen = document.getElementById('successScreen');
  const closeSuccessBtn = document.querySelector('.close-success-btn');

  // Open Modal
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      bookingModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Stop background scrolling
    });
  });

  // Close Modal (Helper function)
  const closeModal = () => {
    bookingModal.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable background scrolling
    
    // Reset modal state after animation ends
    setTimeout(() => {
      bookingForm.classList.remove('hidden');
      successScreen.classList.remove('active');
      bookingForm.reset();
    }, 300);
  };

  closeModalBtn.addEventListener('click', closeModal);
  closeSuccessBtn.addEventListener('click', closeModal);

  // Close when clicking outside the card
  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
      closeModal();
    }
  });

  // --- Form Submission Handling ---
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get input values
    const name = document.getElementById('fullName').value;
    const serviceSelect = document.getElementById('dentalService');
    const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
    const date = document.getElementById('apptDate').value;

    // Formatting date
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Populate success screen details
    document.getElementById('successName').textContent = name;
    document.getElementById('successService').textContent = serviceName;
    document.getElementById('successDate').textContent = formattedDate;

    // Transition view
    bookingForm.classList.add('hidden');
    successScreen.classList.add('active');
  });

  // --- Simple Active Nav Link highlighting on scroll ---
  const sections = document.querySelectorAll('section, footer');
  const navLinks = document.querySelectorAll('.nav-menu a');

  window.addEventListener('scroll', () => {
    let currentSectionId = 'home';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 150)) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
});
