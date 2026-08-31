document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const backToTop = document.querySelector(".back-to-top");
  const revealItems = document.querySelectorAll(".reveal");
  const galleryFilters = document.querySelectorAll(".gallery-filter");
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.querySelector(".lightbox");
  const lightboxImg = lightbox ? lightbox.querySelector("img") : null;
  const contactForm = document.getElementById("contactForm");
  const quoteBlock = document.querySelector(".quote-carousel blockquote");
  const statNumbers = document.querySelectorAll(".stat-number");

  const setActiveLink = () => {
    const currentPage = document.body.dataset.page;
    const links = document.querySelectorAll(".nav-menu a");
    links.forEach((link) => {
      const href = link.getAttribute("href");
      const pageName = href.split(".")[0].replace("index", "home");
      link.classList.toggle("active", currentPage === pageName || (currentPage === "home" && href === "index.html"));
    });
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTop?.classList.add("visible");
    } else {
      backToTop?.classList.remove("visible");
    }
  });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  if (galleryFilters.length && galleryItems.length) {
    galleryFilters.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        galleryFilters.forEach((btn) => btn.classList.toggle("active", btn === button));

        galleryItems.forEach((item) => {
          const matches = filter === "all" || item.dataset.category === filter;
          item.style.display = matches ? "block" : "none";
        });
      });
    });
  }

  if (lightbox && lightboxImg) {
    galleryItems.forEach((item) => {
      item.addEventListener("click", () => {
        const img = item.querySelector("img");
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
      });
    });

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox || event.target.classList.contains("lightbox-close")) {
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      let valid = true;

      const fields = [
        { name: "name", label: "Name" },
        { name: "email", label: "Email" },
        { name: "subject", label: "Subject" },
        { name: "message", label: "Message" }
      ];

      fields.forEach(({ name }) => {
        const field = contactForm.elements[name];
        const errorBox = field.parentElement.querySelector(".error-message");
        let message = "";

        if (!field.value.trim()) {
          message = "This field is required.";
          valid = false;
        } else if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
          message = "Please enter a valid email address.";
          valid = false;
        }

        field.classList.toggle("input-error", Boolean(message));
        if (errorBox) {
          errorBox.textContent = message;
        }
      });

      if (valid) {
        alert("Thank you for contacting My Family. We will be in touch soon.");
        contactForm.reset();
        contactForm.querySelectorAll(".error-message").forEach((msg) => {
          msg.textContent = "";
        });
        contactForm.querySelectorAll("input, textarea").forEach((field) => field.classList.remove("input-error"));
      }
    });
  }

  if (quoteBlock) {
    const quotes = [
      "Family is not just an important thing. It is everything.",
      "The love of family is life’s greatest blessing.",
      "Together is our favorite place to be.",
      "A family is a circle of love, support, and strength."
    ];

    let quoteIndex = 0;
    setInterval(() => {
      quoteIndex = (quoteIndex + 1) % quotes.length;
      quoteBlock.style.opacity = "0";
      setTimeout(() => {
        quoteBlock.textContent = `“${quotes[quoteIndex]}”`;
        quoteBlock.style.opacity = "1";
      }, 200);
    }, 3500);
  }

  statNumbers.forEach((element) => {
    const target = Number(element.dataset.target);
    const duration = 1200;
    const start = performance.now();

    const update = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const value = Math.floor(progress * target);
      element.textContent = value;
      if (progress < 1) requestAnimationFrame(update);
      else element.textContent = target;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(update);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
  });

  setActiveLink();
});
