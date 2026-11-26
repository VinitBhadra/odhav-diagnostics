/* ==========================================================================
   Odhav Diagnostics — Interactive Static Site Script
   ========================================================================== */

(function () {
  "use strict";

  // 1. Footer Year
  var yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // 1b. Hero Diagnostic Center Carousel
  var carousel = document.getElementById("heroCarousel");
  var carouselTrack = document.getElementById("carouselTrack");
  var carouselPrev = document.getElementById("carouselPrev");
  var carouselNext = document.getElementById("carouselNext");
  var carouselCounter = document.getElementById("carouselCounter");
  var carouselDots = document.querySelectorAll(".carousel-dot");

  if (carousel && carouselTrack && carouselDots.length > 0) {
    var totalSlides = carouselDots.length;
    var activeSlide = 0;
    var autoTimer = null;
    var touchStartX = 0;

    function goToSlide(index) {
      activeSlide = (index + totalSlides) % totalSlides;
      carouselTrack.style.transform = "translateX(-" + activeSlide * 100 + "%)";
      if (carouselCounter) {
        carouselCounter.textContent = activeSlide + 1 + " / " + totalSlides;
      }
      carouselDots.forEach(function (dot, idx) {
        var isCurrent = idx === activeSlide;
        dot.classList.toggle("is-active", isCurrent);
        dot.setAttribute("aria-selected", isCurrent ? "true" : "false");
      });
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoTimer = setInterval(function () {
        goToSlide(activeSlide + 1);
      }, 5000);
    }

    function stopAutoPlay() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    if (carouselPrev) {
      carouselPrev.addEventListener("click", function () {
        goToSlide(activeSlide - 1);
        startAutoPlay();
      });
    }

    if (carouselNext) {
      carouselNext.addEventListener("click", function () {
        goToSlide(activeSlide + 1);
        startAutoPlay();
      });
    }

    carouselDots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var target = parseInt(dot.getAttribute("data-slide") || "0", 10);
        goToSlide(target);
        startAutoPlay();
      });
    });

    carousel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        goToSlide(activeSlide - 1);
        startAutoPlay();
      } else if (e.key === "ArrowRight") {
        goToSlide(activeSlide + 1);
        startAutoPlay();
      }
    });

    carousel.addEventListener("mouseenter", stopAutoPlay);
    carousel.addEventListener("mouseleave", startAutoPlay);
    carousel.addEventListener("focusin", stopAutoPlay);
    carousel.addEventListener("focusout", startAutoPlay);

    carousel.addEventListener(
      "touchstart",
      function (e) {
        if (e.touches && e.touches[0]) {
          touchStartX = e.touches[0].clientX;
        }
      },
      { passive: true }
    );

    carousel.addEventListener(
      "touchend",
      function (e) {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        var diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
          goToSlide(diff > 0 ? activeSlide + 1 : activeSlide - 1);
          startAutoPlay();
        }
      },
      { passive: true }
    );

    startAutoPlay();
  }

  // 2. Mobile Navigation Toggle
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 3. Service Category Filtering
  var filterTabs = document.querySelectorAll(".filter-tab");
  var serviceCards = document.querySelectorAll("#servicesGrid .service-card");

  filterTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var category = tab.getAttribute("data-filter");

      filterTabs.forEach(function (t) {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });

      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      serviceCards.forEach(function (card) {
        var cardCategory = card.getAttribute("data-category");
        if (category === "all" || cardCategory === category) {
          card.classList.remove("is-hidden");
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });

  // 4. Package Selection -> Pre-fill Booking Form
  var packageButtons = document.querySelectorAll(".select-package");
  var serviceSelect = document.getElementById("serviceSelect");
  var bookingSection = document.getElementById("book");
  var patientNameInput = document.getElementById("patientName");

  packageButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var pkgName = btn.getAttribute("data-package");
      if (serviceSelect && pkgName) {
        serviceSelect.value = pkgName;
      }
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (patientNameInput) {
        setTimeout(function () {
          patientNameInput.focus({ preventScroll: true });
        }, 350);
      }
    });
  });

  // 5. Patient Guide Accordion
  var accordionTriggers = document.querySelectorAll("#faqAccordion .accordion-trigger");

  accordionTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var item = trigger.closest(".accordion-item");
      if (!item) return;

      var willOpen = !item.classList.contains("is-open");

      document.querySelectorAll("#faqAccordion .accordion-item").forEach(function (el) {
        el.classList.remove("is-open");
        var btn = el.querySelector(".accordion-trigger");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });

      if (willOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  // 6. Preferred Date Default (Today)
  var dateInput = document.getElementById("preferredDate");
  if (dateInput) {
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var dd = String(today.getDate()).padStart(2, "0");
    var todayStr = yyyy + "-" + mm + "-" + dd;
    dateInput.setAttribute("min", todayStr);
    dateInput.value = todayStr;
  }

  // 7. Booking Form Submission -> WhatsApp + Confirmation Summary
  var bookingForm = document.getElementById("bookingForm");
  var bookingStatus = document.getElementById("bookingStatus");

  if (bookingForm && bookingStatus) {
    bookingForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = (document.getElementById("patientName").value || "").trim();
      var phone = (document.getElementById("patientPhone").value || "").trim();
      var service = (document.getElementById("serviceSelect").value || "").trim();
      var prefDate = (document.getElementById("preferredDate").value || "").trim();
      var prefSlot = (document.getElementById("preferredSlot").value || "").trim();
      var notes = (document.getElementById("notes").value || "").trim();

      var digits = phone.replace(/\D/g, "");
      if (!name || digits.length < 10) {
        bookingStatus.style.background = "#fef2f2";
        bookingStatus.style.borderColor = "#fecaca";
        bookingStatus.style.color = "#991b1b";
        bookingStatus.textContent = "Please enter your name and a valid 10-digit mobile number.";
        bookingStatus.classList.add("is-visible");
        return;
      }

      var messageLines = [
        "Hello Odhav Diagnostics,",
        "I would like to inquire/book a diagnostic test:",
        "- Patient Name: " + name,
        "- Phone: " + phone,
        "- Test / Package: " + service
      ];

      if (prefDate) {
        messageLines.push("- Preferred Date: " + prefDate);
      }
      if (prefSlot) {
        messageLines.push("- Preferred Slot: " + prefSlot);
      }
      if (notes) {
        messageLines.push("- Notes: " + notes);
      }

      var whatsappUrl =
        "https://wa.me/917383282266?text=" + encodeURIComponent(messageLines.join("\n"));

      bookingStatus.style.background = "";
      bookingStatus.style.borderColor = "";
      bookingStatus.style.color = "";
      bookingStatus.innerHTML = "";

      var strong = document.createElement("strong");
      strong.textContent = "Request prepared for " + name + " (" + service + "). ";
      bookingStatus.appendChild(strong);

      var infoText = document.createTextNode(
        "If WhatsApp did not open automatically, use the link below or call +91 73832 82266: "
      );
      bookingStatus.appendChild(infoText);

      var waLink = document.createElement("a");
      waLink.href = whatsappUrl;
      waLink.target = "_blank";
      waLink.rel = "noopener noreferrer";
      waLink.style.fontWeight = "700";
      waLink.style.textDecoration = "underline";
      waLink.textContent = "Open WhatsApp Request ↗";
      bookingStatus.appendChild(waLink);

      bookingStatus.classList.add("is-visible");

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });
  }
})();
