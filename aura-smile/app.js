document.addEventListener('DOMContentLoaded', () => {
  // --- Before/After Teeth Slider Control ---
  const sliderRange = document.getElementById('sliderRange');
  const afterImage = document.getElementById('afterImage');
  const sliderHandle = document.getElementById('sliderHandle');

  if (sliderRange && afterImage && sliderHandle) {
    const updateSliderPosition = (value) => {
      afterImage.style.width = `${value}%`;
      sliderHandle.style.left = `${value}%`;
    };

    sliderRange.addEventListener('input', (e) => {
      updateSliderPosition(e.target.value);
    });

    // Initialize at 50%
    updateSliderPosition(50);
  }

  // --- VIP Consultation Modal Controls ---
  const consultModal = document.getElementById('consultModal');
  const openModalBtns = document.querySelectorAll('.btn-consult');
  const closeModalBtn = document.querySelector('.modal-close');
  const consultForm = document.getElementById('consultForm');
  const vipSuccess = document.getElementById('vipSuccess');
  const closeSuccessBtn = document.querySelector('.close-success-btn');

  // Open Modal
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      consultModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close Modal
  const closeModal = () => {
    consultModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset state after animation completes
    setTimeout(() => {
      consultForm.classList.remove('hidden');
      vipSuccess.classList.remove('active');
      consultForm.reset();
    }, 300);
  };

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModal);

  // Close when clicking overlay background
  consultModal.addEventListener('click', (e) => {
    if (e.target === consultModal) {
      closeModal();
    }
  });

  // --- Form Submission Integration ---
  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const clientName = document.getElementById('vipName').value;
      const clientPhone = document.getElementById('vipPhone').value;

      // Populate success message
      document.getElementById('vipConfirmName').textContent = clientName;
      document.getElementById('vipConfirmPhone').textContent = clientPhone;

      // Swap views
      consultForm.classList.add('hidden');
      vipSuccess.classList.add('active');
    });
  }
});
