// ========================================
// KU Digital Library - Main Script
// Vanilla JS, SPA-style section switching
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  // Cache DOM elements
  const navLinks = document.querySelectorAll(".nav-link");

  const homeSection = document.getElementById("home-section");
  const ebooksSection = document.getElementById("ebooks-section");
  const coursesSection = document.getElementById("courses-section");
  const courseDetailSection = document.getElementById("course-detail-section");

  const exploreEbooksBtn = document.getElementById("explore-ebooks-btn");
  const browseCoursesBtn = document.getElementById("browse-courses-btn");
  const backToCoursesBtn = document.getElementById("back-to-courses-btn");

  const ebooksContainer = document.getElementById("ebooks-container");
  const ebooksEmptyState = document.getElementById("ebooks-empty-state");

  const coursesContainer = document.getElementById("courses-container");
  const coursesEmptyState = document.getElementById("courses-empty-state");

  const courseDetailImage = document.getElementById("course-detail-image");
  const courseDetailTitle = document.getElementById("course-detail-title");
  const courseDetailDescription = document.getElementById("course-detail-description");
  const courseDetailChapters = document.getElementById("course-detail-chapters");
  const chaptersEmptyState = document.getElementById("chapters-empty-state");

  const currentYearEl = document.getElementById("current-year");

  // Store data globally within this closure
  let coursesData = [];

  // Groups for toggling when entering/leaving course detail view
  const homeSections = [homeSection, ebooksSection, coursesSection];

  // ----------------------------------------
  // Utility: Nav Active State
  // ----------------------------------------
  function setActiveNav(targetSectionId) {
    navLinks.forEach((link) => {
      const linkTarget = link.getAttribute("data-target");
      if (linkTarget === targetSectionId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // ----------------------------------------
  // Navigation Handlers (smooth scroll)
  // ----------------------------------------
  function scrollToSection(sectionElement) {
    if (!sectionElement) return;
    const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 0;
    const elementTop = sectionElement.getBoundingClientRect().top + window.scrollY;
    const offsetTop = elementTop - navbarHeight - 12; // small spacing from navbar

    window.scrollTo({
      top: offsetTop < 0 ? 0 : offsetTop,
      behavior: "smooth",
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const target = link.getAttribute("data-target");
      if (!target) return;

      setActiveNav(target);

      if (target === "home-section") {
        scrollToSection(homeSection);
      } else if (target === "ebooks-section") {
        scrollToSection(ebooksSection);
      } else if (target === "courses-section") {
        scrollToSection(coursesSection);
      }

      // Ensure home sections are visible when using navbar
      homeSections.forEach((section) => section.classList.remove("hidden"));
      courseDetailSection.classList.add("hidden");
    });
  });

  exploreEbooksBtn.addEventListener("click", () => {
    setActiveNav("ebooks-section");
    scrollToSection(ebooksSection);
  });

  browseCoursesBtn.addEventListener("click", () => {
    setActiveNav("courses-section");
    scrollToSection(coursesSection);
  });

  backToCoursesBtn.addEventListener("click", () => {
    // Back to Course list within home page
    homeSections.forEach((section) => section.classList.remove("hidden"));
    courseDetailSection.classList.add("hidden");
    setActiveNav("courses-section");
    scrollToSection(coursesSection);
  });

  // ----------------------------------------
  // Data Fetch Helpers
  // ----------------------------------------
  function safeFetchJSON(path) {
    // Wrapper around fetch to handle GitHub Pages-friendly errors
    return fetch(path, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${path}: ${response.status}`);
        }
        return response.json();
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
        return null;
      });
  }

  // ----------------------------------------
  // Render E-Books
  // ----------------------------------------
  function renderEbooks(ebooks) {
    ebooksContainer.innerHTML = "";

    if (!ebooks || ebooks.length === 0) {
      ebooksEmptyState.classList.remove("hidden");
      return;
    }

    ebooksEmptyState.classList.add("hidden");

    ebooks.forEach((ebook) => {
      const card = document.createElement("article");
      card.className = "card";

      const titleEl = document.createElement("h3");
      titleEl.className = "card__title";
      titleEl.textContent = ebook.title || "Untitled E-Book";

      const metaEl = document.createElement("p");
      metaEl.className = "card__meta";
      metaEl.textContent = ebook.category || "General";

      const descEl = document.createElement("p");
      descEl.className = "card__description";
      descEl.textContent = ebook.description || "No description available.";

      const footerEl = document.createElement("div");
      footerEl.className = "card__footer";

      const badgeEl = document.createElement("span");
      badgeEl.className = "card__badge";
      badgeEl.textContent = "E-Book";

      const openBtn = document.createElement("button");
      openBtn.className = "btn btn--small btn--ghost";
      openBtn.textContent = "Open PDF";
      openBtn.addEventListener("click", () => {
        if (ebook.pdfPath) {
          window.open(ebook.pdfPath, "_blank");
        }
      });

      footerEl.appendChild(badgeEl);
      footerEl.appendChild(openBtn);

      card.appendChild(titleEl);
      card.appendChild(metaEl);
      card.appendChild(descEl);
      card.appendChild(footerEl);

      ebooksContainer.appendChild(card);
    });
  }

  // ----------------------------------------
  // Render Courses
  // ----------------------------------------
  function renderCourses(courses) {
    coursesContainer.innerHTML = "";

    if (!courses || courses.length === 0) {
      coursesEmptyState.classList.remove("hidden");
      return;
    }

    coursesEmptyState.classList.add("hidden");

    courses.forEach((course) => {
      const card = document.createElement("article");
      card.className = "card card--course";
      card.setAttribute("data-course-id", course.courseId);

      const imgEl = document.createElement("img");
      imgEl.className = "card--course-image";
      imgEl.src = course.image || "https://via.placeholder.com/640x360?text=Course+Image";
      imgEl.alt = course.title || "Course image";

      const body = document.createElement("div");
      body.className = "card--course-body";

      const titleEl = document.createElement("h3");
      titleEl.className = "card__title";
      titleEl.textContent = course.title || "Untitled Course";

      const descEl = document.createElement("p");
      descEl.className = "card__description";
      descEl.textContent = course.description || "No description available.";

      const footerEl = document.createElement("div");
      footerEl.className = "card__footer";

      const badgeEl = document.createElement("span");
      badgeEl.className = "card__badge";
      badgeEl.textContent = "Course";

      const viewBtn = document.createElement("button");
      viewBtn.className = "btn btn--small btn--primary";
      viewBtn.textContent = "View Details";

      // Navigate to course detail when card or button is clicked
      const openDetail = () => showCourseDetail(course.courseId);

      card.addEventListener("click", openDetail);
      viewBtn.addEventListener("click", (event) => {
        event.stopPropagation(); // avoid double handling
        openDetail();
      });

      footerEl.appendChild(badgeEl);
      footerEl.appendChild(viewBtn);

      body.appendChild(titleEl);
      body.appendChild(descEl);
      body.appendChild(footerEl);

      card.appendChild(imgEl);
      card.appendChild(body);

      coursesContainer.appendChild(card);
    });
  }

  // ----------------------------------------
  // Course Detail Rendering
  // ----------------------------------------
  function showCourseDetail(courseId) {
    if (!coursesData || coursesData.length === 0) return;

    const course = coursesData.find((c) => String(c.courseId) === String(courseId));
    if (!course) return;

    // Populate header
    courseDetailImage.src = course.image || "https://via.placeholder.com/640x360?text=Course+Image";
    courseDetailImage.alt = course.title || "Course image";
    courseDetailTitle.textContent = course.title || "Untitled Course";
    courseDetailDescription.textContent = course.description || "No description available.";

    // Populate chapters
    courseDetailChapters.innerHTML = "";

    const chapters = Array.isArray(course.chapters) ? course.chapters : [];
    if (chapters.length === 0) {
      chaptersEmptyState.classList.remove("hidden");
    } else {
      chaptersEmptyState.classList.add("hidden");
      chapters.forEach((chapter, index) => {
        const li = document.createElement("li");
        li.className = "chapter-item";

        const info = document.createElement("div");
        info.className = "chapter-item__info";

        const titleEl = document.createElement("span");
        titleEl.className = "chapter-item__title";
        titleEl.textContent = chapter.title || `Chapter ${index + 1}`;

        const typeEl = document.createElement("span");
        typeEl.className = "chapter-item__type";
        typeEl.textContent = chapter.type || "Resource";

        info.appendChild(titleEl);
        info.appendChild(typeEl);

        const openBtn = document.createElement("button");
        openBtn.className = "btn btn--small btn--ghost";
        openBtn.textContent = "Open PDF";
        openBtn.addEventListener("click", () => {
          if (chapter.pdfPath) {
            window.open(chapter.pdfPath, "_blank");
          }
        });

        li.appendChild(info);
        li.appendChild(openBtn);

        courseDetailChapters.appendChild(li);
      });
    }

    // Switch view: hide home sections, show course detail
    homeSections.forEach((section) => section.classList.add("hidden"));
    courseDetailSection.classList.remove("hidden");
    setActiveNav(""); // clear nav highlighting as we're in a sub-view
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ----------------------------------------
  // Initialization
  // ----------------------------------------
  function initFooterYear() {
    if (currentYearEl) {
      currentYearEl.textContent = new Date().getFullYear();
    }
  }

  function init() {
    // Initial state: all home sections visible
    homeSections.forEach((section) => section.classList.remove("hidden"));
    courseDetailSection.classList.add("hidden");
    setActiveNav("home-section");

    // Fetch and render data
    safeFetchJSON("data/ebooks.json").then((ebooks) => {
      renderEbooks(ebooks || []);
    });

    safeFetchJSON("data/courses.json").then((courses) => {
      coursesData = courses || [];
      renderCourses(coursesData);
    });

    initFooterYear();
  }

  init();
});

