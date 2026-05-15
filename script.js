/**
 * Gushwork Assignment — script.js
 * All functionality consolidated into a single DOMContentLoaded listener.
 * Fixes applied:
 *  1. Sticky header: shows when scrolled past product section, hides on scroll back.
 *  2. Image carousel: distinct images per thumbnail + arrow navigation.
 *  3. Zoom preview: position:fixed + viewport-aware coords (works on any scroll depth).
 *  4. handleCompanyLogos: moved inside DOMContentLoaded so DOM is ready.
 *  5. All nested/duplicate DOMContentLoaded calls merged into one top-level listener.
 *  6. ManufacturingCarousel class preserved with null-guards.
 */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     1. STICKY HEADER
     Shows (fixed) when user scrolls past the product section,
     smoothly disappears when scrolling back to the top fold.
  ========================================================= */
  const header = document.getElementById("mainHeader");
  const productSection = document.querySelector(".product-detail-section");

  function updateStickyHeader() {
    if (!productSection || !header) return;
    const sectionBottom = productSection.getBoundingClientRect().bottom;
    if (sectionBottom <= 0) {
      header.classList.add("sticky");
      header.classList.remove("sticky-hidden");
    } else {
      header.classList.remove("sticky");
      header.classList.remove("sticky-hidden");
    }
  }

  window.addEventListener("scroll", updateStickyHeader, { passive: true });


  /* =========================================================
     2. IMAGE CAROUSEL (main product section)
  ========================================================= */
  const mainProductImage = document.querySelector(".main-product-image");
  const thumbnails = document.querySelectorAll(".thumbnail");
  const leftArrow  = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");
  let currentCarouselIndex = 0;

  // Distinct images for each thumbnail position
  const carouselImages = [
    "./Asset/Frame-1.png",
    "./Asset/Frame-2.jpg",
    "./Asset/Frame-3.jpg",
    "./Asset/Frame-1.png",
  ];

  if (mainProductImage && thumbnails.length > 0) {

    // Set distinct srcs on thumbnails so each shows a different image
    thumbnails.forEach((thumb, i) => {
      if (carouselImages[i]) thumb.src = carouselImages[i];
    });

    function updateCarouselImage(index) {
      thumbnails.forEach(t => t.classList.remove("active"));
      thumbnails[index].classList.add("active");
      mainProductImage.src = carouselImages[index] || thumbnails[index].src;
      currentCarouselIndex = index;
    }

    thumbnails.forEach((thumb, i) => {
      thumb.addEventListener("click", () => updateCarouselImage(i));
    });

    if (rightArrow) {
      rightArrow.addEventListener("click", () => {
        updateCarouselImage((currentCarouselIndex + 1) % thumbnails.length);
      });
    }

    if (leftArrow) {
      leftArrow.addEventListener("click", () => {
        updateCarouselImage((currentCarouselIndex - 1 + thumbnails.length) % thumbnails.length);
      });
    }

    updateCarouselImage(0); // initialise
  }


  /* =========================================================
     3. IMAGE ZOOM PREVIEW
     Uses position:fixed with viewport coordinates so the box
     sits correctly regardless of how far the page is scrolled.
  ========================================================= */
  const mainImageContainer = document.querySelector(".main-image-container");
  const zoomPreview = document.querySelector(".thumbnail-zoom-preview");

  if (mainImageContainer && zoomPreview && mainProductImage) {
    const PREVIEW_SIZE = 300;
    const GAP = 16;

    mainImageContainer.addEventListener("mousemove", (e) => {
      const rect = mainImageContainer.getBoundingClientRect();

      // Percentage position within image for background-position
      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPct = ((e.clientY - rect.top) / rect.height) * 100;

      // Place preview to the right; flip left if not enough room
      let leftPos = rect.right + GAP;
      if (leftPos + PREVIEW_SIZE > window.innerWidth) {
        leftPos = rect.left - PREVIEW_SIZE - GAP;
      }

      // Centre vertically on cursor, clamped to viewport
      let topPos = e.clientY - PREVIEW_SIZE / 2;
      topPos = Math.max(8, Math.min(topPos, window.innerHeight - PREVIEW_SIZE - 8));

      zoomPreview.style.left = leftPos + "px";
      zoomPreview.style.top  = topPos + "px";
      zoomPreview.style.backgroundImage    = `url(${mainProductImage.src})`;
      zoomPreview.style.backgroundPosition = `${xPct}% ${yPct}%`;
      zoomPreview.style.display = "block";
    });

    mainImageContainer.addEventListener("mouseleave", () => {
      zoomPreview.style.display = "none";
    });
  }


  /* =========================================================
     4. RESPONSIVE COMPANY LOGOS
  ========================================================= */
  function handleCompanyLogos() {
    const companyLogos = document.querySelector(".company-logos");
    if (!companyLogos) return;
    const logoImages = companyLogos.querySelectorAll("img");
    if (!logoImages.length) return;

    const w = window.innerWidth;
    logoImages.forEach((img, i) => {
      if (w >= 1240)      img.style.display = i < 6 ? "block" : "none";
      else if (w >= 1000) img.style.display = i < 5 ? "block" : "none";
      else if (w >= 550)  img.style.display = i < 4 ? "block" : "none";
      else                img.style.display = i < 3 ? "block" : "none";
    });
  }

  handleCompanyLogos();
  window.addEventListener("resize", handleCompanyLogos, { passive: true });


  /* =========================================================
     5. MOBILE HAMBURGER MENU
  ========================================================= */
  const menuToggle = document.querySelector(".menu-toggle");
  const navList    = document.querySelector(".nav-list");

  if (menuToggle && navList) {
    menuToggle.addEventListener("click", () => {
      const open = navList.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", open);
    });

    navList.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navList.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* =========================================================
     6. DROPDOWN MENU (desktop)
  ========================================================= */
  document.querySelectorAll(".dropdown").forEach(dropdown => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    const menu   = dropdown.querySelector(".dropdown-menu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      menu.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target)) menu.classList.remove("show");
    });
  });


  /* =========================================================
     7. FAQ ACCORDION
  ========================================================= */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    if (!question) return;

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      faqItems.forEach(fi => {
        fi.classList.remove("active");
        const q = fi.querySelector(".faq-question");
        if (q) q.setAttribute("aria-expanded", "false");
      });
      if (!isActive) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });


  /* =========================================================
     8. CATALOGUE EMAIL FORM
  ========================================================= */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const emailInput  = document.querySelector(".email-input");
  const sendButton  = document.querySelector(".send-catalogue-btn");

  if (sendButton && emailInput) {
    sendButton.addEventListener("click", () => {
      const email = emailInput.value.trim();
      if (!email) { alert("Please enter your email address"); emailInput.focus(); return; }
      if (!isValidEmail(email)) { alert("Please enter a valid email address"); emailInput.focus(); return; }

      const original = sendButton.textContent;
      sendButton.textContent = "SENDING...";
      sendButton.disabled = true;

      setTimeout(() => {
        sendButton.textContent = "SENT ✓";
        setTimeout(() => {
          sendButton.textContent = original;
          sendButton.disabled = false;
          emailInput.value = "";
          alert("Catalogue sent successfully! Check your email.");
        }, 2000);
      }, 1500);
    });

    emailInput.addEventListener("keypress", e => { if (e.key === "Enter") sendButton.click(); });
  }


  /* =========================================================
     9. APPLICATIONS CAROUSEL
  ========================================================= */
  const appTrack   = document.querySelector(".applications-carousel .carousel-track");
  const appPrevBtn = document.querySelector(".applications-content .prev-btn");
  const appNextBtn = document.querySelector(".applications-content .next-btn");
  const appCards   = appTrack ? appTrack.querySelectorAll(".application-card") : [];

  if (appTrack && appCards.length > 0) {
    let appIdx = 0;

    function appCardWidth() {
      return appCards[0].offsetWidth + 12;
    }
    function appMaxIdx() {
      const visible = Math.floor(appTrack.parentElement.offsetWidth / appCardWidth());
      return Math.max(0, appCards.length - visible);
    }
    function refreshAppCarousel() {
      appTrack.style.transform = `translateX(${-appIdx * appCardWidth()}px)`;
      if (appPrevBtn) appPrevBtn.disabled = appIdx === 0;
      if (appNextBtn) appNextBtn.disabled = appIdx >= appMaxIdx();
    }

    if (appPrevBtn) appPrevBtn.addEventListener("click", () => { if (appIdx > 0) { appIdx--; refreshAppCarousel(); } });
    if (appNextBtn) appNextBtn.addEventListener("click", () => { if (appIdx < appMaxIdx()) { appIdx++; refreshAppCarousel(); } });
    refreshAppCarousel();

    window.addEventListener("resize", () => {
      if (appIdx > appMaxIdx()) appIdx = appMaxIdx();
      refreshAppCarousel();
    }, { passive: true });

    // Touch swipe
    let tStart = 0;
    appTrack.addEventListener("touchstart", e => { tStart = e.touches[0].clientX; }, { passive: true });
    appTrack.addEventListener("touchend", e => {
      const delta = tStart - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 50) {
        if (delta > 0 && appIdx < appMaxIdx()) { appIdx++; refreshAppCarousel(); }
        else if (delta < 0 && appIdx > 0)      { appIdx--; refreshAppCarousel(); }
      }
    }, { passive: true });
  }


  /* =========================================================
     10. MANUFACTURING PROCESS TABS (desktop > 800 px)
  ========================================================= */
  const tabButtons  = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");
      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      const tc = document.getElementById(target);
      if (tc) tc.classList.add("active");
    });
  });


  /* =========================================================
     11. TESTIMONIALS CAROUSEL (drag / touch swipe)
  ========================================================= */
  const testimonialsTrack = document.querySelector(".testimonials-carousel .carousel-track");

  if (testimonialsTrack) {
    let isDown = false, startX = 0, scrollLeft = 0;

    testimonialsTrack.addEventListener("mousedown", e => {
      isDown = true;
      testimonialsTrack.classList.add("active-drag");
      startX = e.pageX - testimonialsTrack.offsetLeft;
      scrollLeft = testimonialsTrack.scrollLeft;
    });
    testimonialsTrack.addEventListener("mouseleave", () => { isDown = false; testimonialsTrack.classList.remove("active-drag"); });
    testimonialsTrack.addEventListener("mouseup",    () => { isDown = false; testimonialsTrack.classList.remove("active-drag"); });
    testimonialsTrack.addEventListener("mousemove",  e => {
      if (!isDown) return;
      e.preventDefault();
      testimonialsTrack.scrollLeft = scrollLeft - (e.pageX - testimonialsTrack.offsetLeft - startX) * 1.5;
    });

    let tStartX = 0, tScrollLeft = 0;
    testimonialsTrack.addEventListener("touchstart", e => { tStartX = e.touches[0].pageX - testimonialsTrack.offsetLeft; tScrollLeft = testimonialsTrack.scrollLeft; }, { passive: true });
    testimonialsTrack.addEventListener("touchend",   () => {}, { passive: true });
    testimonialsTrack.addEventListener("touchmove",  e => {
      testimonialsTrack.scrollLeft = tScrollLeft - (e.touches[0].pageX - testimonialsTrack.offsetLeft - tStartX) * 1.5;
    }, { passive: true });
  }


  /* =========================================================
     12. PORTFOLIO CARDS — "Learn More"
  ========================================================= */
  document.querySelectorAll(".learn-more-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const title = btn.closest(".portfolio-card").querySelector("h3").textContent;
      alert(`Learn more about: ${title}`);
    });
  });


  /* =========================================================
     13. CTA — "Talk to an Expert"
  ========================================================= */
  const talkBtn = document.querySelector(".talk-to-expert-btn");
  if (talkBtn) {
    talkBtn.addEventListener("click", () => alert("Connecting you with an expert! Please wait..."));
  }


  /* =========================================================
     14. CONTACT FORM — basic validation
  ========================================================= */
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", e => {
      e.preventDefault();
      const name  = contactForm.querySelector('input[type="text"]');
      const email = contactForm.querySelector('input[type="email"]');
      const tel   = contactForm.querySelector('input[type="tel"]');

      if (name  && !name.value.trim())         { alert("Please enter your full name.");         name.focus();  return; }
      if (email && !isValidEmail(email.value.trim())) { alert("Please enter a valid email."); email.focus(); return; }
      if (tel   && !tel.value.trim())          { alert("Please enter your phone number.");      tel.focus();   return; }

      alert("Thank you! Your quote request has been submitted.");
      contactForm.reset();
    });
  }


  /* =========================================================
     15. SCROLL REVEAL — fade-in for cards / rows
  ========================================================= */
  if ("IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll(
      ".feature-card, .testimonial-card, .portfolio-card, .faq-item, .application-card, .specs-row"
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    revealTargets.forEach(el => {
      el.style.opacity    = "0";
      el.style.transform  = "translateY(20px)";
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      observer.observe(el);
    });
  }

}); // end DOMContentLoaded


/* =========================================================
   MANUFACTURING PROCESS CAROUSEL (mobile < 800px)
========================================================= */
class ManufacturingCarousel {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides  = 8;
    this.isAnimating  = false;

    this.slides = [
      { title: "Raw Material",    step: 1 },
      { title: "Extrusion",       step: 2 },
      { title: "Cooling",         step: 3 },
      { title: "Sizing",          step: 4 },
      { title: "Quality Control", step: 5 },
      { title: "Marking",         step: 6 },
      { title: "Cutting",         step: 7 },
      { title: "Packaging",       step: 8 },
    ];

    this.init();
  }

  init() {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    if (!prevBtn || !nextBtn) return;

    prevBtn.addEventListener("click", () => this.previousSlide());
    nextBtn.addEventListener("click", () => this.nextSlide());

    this.setupSwipeGestures();
    this.setupKeyboardNavigation();
    this.updateUI();
  }

  setupSwipeGestures() {
    const container = document.querySelector(".carousel-content");
    if (!container) return;
    let sx = 0, sy = 0, st = 0;

    container.addEventListener("touchstart", e => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
      st = Date.now();
    }, { passive: true });

    container.addEventListener("touchend", e => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50 && Date.now() - st < 300) {
        dx > 0 ? this.previousSlide() : this.nextSlide();
      }
    }, { passive: true });
  }

  setupKeyboardNavigation() {
    document.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft")  { e.preventDefault(); this.previousSlide(); }
      if (e.key === "ArrowRight") { e.preventDefault(); this.nextSlide(); }
    });
  }

  nextSlide()     { if (!this.isAnimating && this.currentSlide < this.totalSlides - 1) this.goToSlide(this.currentSlide + 1, "next"); }
  previousSlide() { if (!this.isAnimating && this.currentSlide > 0) this.goToSlide(this.currentSlide - 1, "prev"); }

  goToSlide(index, direction = "next") {
    if (this.isAnimating || index === this.currentSlide || index < 0 || index >= this.totalSlides) return;
    this.isAnimating = true;
    this.animateSlide(this.currentSlide, index, direction);
    this.currentSlide = index;
    this.updateUI();
    setTimeout(() => { this.isAnimating = false; }, 400);
  }

  animateSlide(fromIdx, toIdx, direction) {
    const slides  = document.querySelectorAll(".slide");
    const current = slides[fromIdx];
    const next    = slides[toIdx];
    if (!current || !next) return;

    next.style.transform = direction === "next" ? "translateX(100%)" : "translateX(-100%)";
    next.style.opacity   = "0";
    next.style.position  = "absolute";
    next.style.top = "0"; next.style.left = "0"; next.style.width = "100%";

    next.offsetHeight; // force reflow

    requestAnimationFrame(() => {
      current.style.transform = direction === "next" ? "translateX(-100%)" : "translateX(100%)";
      current.style.opacity   = "0";
      next.style.transform    = "translateX(0)";
      next.style.opacity      = "1";

      setTimeout(() => {
        slides.forEach((s, i) => {
          s.classList.remove("active");
          if (i === toIdx) {
            s.classList.add("active");
            s.style.position  = "relative";
            s.style.transform = "";
            s.style.opacity   = "";
          } else {
            s.style.position  = "absolute";
            s.style.transform = "translateX(100%)";
            s.style.opacity   = "0";
          }
        });
      }, 400);
    });
  }

  updateUI() {
    const badge   = document.getElementById("stepBadge");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    if (!badge || !prevBtn || !nextBtn) return;

    const data = this.slides[this.currentSlide];
    badge.textContent     = `Step ${data.step}/8: ${data.title}`;
    prevBtn.disabled      = this.currentSlide === 0;
    nextBtn.disabled      = this.currentSlide === this.totalSlides - 1;
    prevBtn.style.opacity = prevBtn.disabled ? "0.5" : "1";
    nextBtn.style.opacity = nextBtn.disabled ? "0.5" : "1";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.manufacturingCarousel = new ManufacturingCarousel();
});

document.addEventListener("contextmenu", e => {
  if (e.target.closest(".carousel-card")) e.preventDefault();
});
