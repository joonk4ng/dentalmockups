// ==========================================================================
// Sunrise Dental of Eugene - Multi-Theme & Mobile-Optimized Script
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Interactive Design Switcher (Buttons as Options) ---
  const switcherPills = document.querySelectorAll('.switcher-pill');
  const validThemes = ['bento', 'scandinavian', 'editorial', 'classic'];

  const setTheme = (themeName, shouldScroll = false) => {
    if (!validThemes.includes(themeName)) themeName = 'bento';

    // Set body class
    document.body.className = `theme-${themeName}`;

    // Update active pill state
    switcherPills.forEach(pill => {
      const isTarget = pill.getAttribute('data-theme') === themeName;
      pill.classList.toggle('active', isTarget);
      pill.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    // Store in localStorage & update URL hash quietly
    try {
      localStorage.setItem('sunrise_selected_theme', themeName);
      if (history.replaceState) {
        history.replaceState(null, '', `#${themeName}`);
      }
    } catch (e) {}

    // Scroll to top of content smoothly if user tapped a button
    if (shouldScroll) {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Attach click listener to each option pill
  switcherPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetTheme = pill.getAttribute('data-theme');
      setTheme(targetTheme, true);
    });
  });

  // Check URL hash or localStorage on page load
  const hashTheme = window.location.hash.replace('#', '').toLowerCase();
  const storedTheme = localStorage.getItem('sunrise_selected_theme');
  if (validThemes.includes(hashTheme)) {
    setTheme(hashTheme, false);
  } else if (validThemes.includes(storedTheme)) {
    setTheme(storedTheme, false);
  } else {
    setTheme('bento', false);
  }


  // --- 2. Mobile Drawer Navigation ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });

    // Close drawer when any link is clicked
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }


  // --- 3. Interactive Appointment Form ---
  const appointmentForm = document.getElementById('appointmentForm');
  const bookingSuccess = document.getElementById('bookingSuccess');
  const successPatient = document.getElementById('successPatient');
  const successNumber = document.getElementById('successNumber');
  const newRequestBtn = document.getElementById('newRequestBtn');

  if (appointmentForm && bookingSuccess) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('pName').value.trim();
      const phoneVal = document.getElementById('pPhone').value.trim();

      if (successPatient) successPatient.textContent = nameVal || 'Neighbor';
      if (successNumber) successNumber.textContent = phoneVal || 'your phone number';

      appointmentForm.classList.add('hidden');
      bookingSuccess.classList.add('active');
    });

    if (newRequestBtn) {
      newRequestBtn.addEventListener('click', () => {
        appointmentForm.reset();
        appointmentForm.classList.remove('hidden');
        bookingSuccess.classList.remove('active');
      });
    }
  }


  // --- 4. Smooth Anchor Scrolling ---
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
