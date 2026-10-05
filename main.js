

// Custom Cursor, Glow & 3D Tilt Logic
try {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  const mouseGlow = document.querySelector('.mouse-glow');
  const hoverTargets = document.querySelectorAll('.hover-target, a, button, .project-card, .service-item');
  const tiltCards = document.querySelectorAll('.tilt-card');
  const magneticBtns = document.querySelectorAll('.magnetic-btn');

  if (window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      if(cursorDot) {
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
      }
      
      if(cursorOutline) {
        cursorOutline.animate({
          left: `${posX}px`,
          top: `${posY}px`
        }, { duration: 250, fill: "forwards" });
      }

      if(mouseGlow) {
        mouseGlow.animate({
          left: `${posX}px`,
          top: `${posY}px`
        }, { duration: 1500, fill: "forwards" });
      }
    });

    // Hover outline effects
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => {
        if(cursorOutline) {
          cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
          cursorOutline.style.backgroundColor = 'rgba(217, 119, 6, 0.1)';
          cursorOutline.style.borderColor = 'transparent';
        }
      });
      target.addEventListener('mouseleave', () => {
        if(cursorOutline) {
          cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
          cursorOutline.style.backgroundColor = 'transparent';
          cursorOutline.style.borderColor = 'var(--accent-light)';
        }
      });
    });

    // 3D Tilt Effect
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; 
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'none';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease';
      });
    });

    // Magnetic Buttons
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        btn.style.transition = 'transform 0.1s ease-out';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      });
    });
  }
} catch (e) {
  console.error("Cursor/Animation logic error:", e);
}

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.2)';
      navbar.style.padding = '1rem 0';
    } else {
      navbar.style.boxShadow = 'none';
      navbar.style.padding = '1.5rem 0';
    }
  });
}

// Scroll Reveal Animations
try {
  const animatedElements = document.querySelectorAll('[data-animate="fade-up"]');
  
  if (animatedElements.length > 0) {
    animatedElements.forEach(el => {
      el.classList.add('fade-up-element');
    });

    const observerOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
    
    setTimeout(() => {
      animatedElements.forEach(el => el.classList.add('is-visible'));
    }, 1500);
  }
} catch (e) {
  console.error("Intersection Observer error:", e);
}

// Contact Modal & Multi-step Form Logic
const contactModal = document.getElementById('contact-modal');
const closeModalBtn = document.getElementById('close-modal');
const closeSuccessBtn = document.getElementById('close-success');
const contactLinks = document.querySelectorAll('a[href="#contact"]');
const form = document.getElementById('contact-form');
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const nextBtn = document.getElementById('next-step');
const prevBtn = document.getElementById('prev-step');
const formProgress = document.querySelector('.form-progress');
const formSuccess = document.getElementById('form-success');
const progressSteps = document.querySelectorAll('.progress-step');

window.openContactModal = function(e) {
  if (e) e.preventDefault();
  const contactModal = document.getElementById('contact-modal');
  if (contactModal) contactModal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
};

window.closeContactModal = function() {
  const contactModal = document.getElementById('contact-modal');
  if (contactModal) contactModal.classList.remove('active');
  document.body.style.overflow = '';
};

// Open modal on click of any contact link (fallback if inline doesn't work)
contactLinks.forEach(link => {
  link.addEventListener('click', window.openContactModal);
});

// Close modal
if (closeModalBtn) closeModalBtn.addEventListener('click', window.closeContactModal);
if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', window.closeContactModal);
window.addEventListener('click', (e) => {
  const contactModal = document.getElementById('contact-modal');
  if (e.target === contactModal) window.closeContactModal();
});

// Step Navigation
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    // Basic validation for Step 1
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    if (!name || !email || !document.getElementById('email').checkValidity()) {
      alert("Veuillez remplir correctement votre nom et adresse email.");
      return;
    }

    step1.classList.remove('active');
    step2.classList.add('active');
    formProgress.classList.add('step-2');
    progressSteps[1].classList.add('active');
  });
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    step2.classList.remove('active');
    step1.classList.add('active');
    formProgress.classList.remove('step-2');
    progressSteps[1].classList.remove('active');
  });
}

// Form Submission
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Here you would normally send the data via fetch/axios to your backend (e.g. Formspree, Zapier)
    // For now, we just show the success message
    
    step1.classList.remove('active');
    step2.classList.remove('active');
    formProgress.style.display = 'none'; // hide progress
    formSuccess.classList.add('active');
    
    // Reset form for next time
    setTimeout(() => {
      form.reset();
      formProgress.classList.remove('step-2');
      progressSteps[1].classList.remove('active');
      formProgress.style.display = 'flex';
      formSuccess.classList.remove('active');
      step1.classList.add('active');
    }, 5000);
  });
}

