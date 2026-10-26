document.getElementById("year").textContent = new Date().getFullYear();

// Header shrink + hide-on-scroll background
const header = document.getElementById("header");
const onScroll = () => {
  if (window.scrollY > 40) header.classList.add("is-scrolled");
  else header.classList.remove("is-scrolled");
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Mobile nav
const burger = document.getElementById("burger");
const mobileNav = document.getElementById("mobileNav");
const closeMobileNav = () => {
  burger.classList.remove("is-open");
  mobileNav.classList.remove("is-open");
};
burger.addEventListener("click", () => {
  burger.classList.toggle("is-open");
  mobileNav.classList.toggle("is-open");
});
mobileNav.addEventListener("click", (e) => {
  if (e.target === mobileNav || e.target.tagName === "A") closeMobileNav();
});

// Smooth-scroll offset safety (CSS scroll-behavior already handles it) + close menu on nav click
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", () => closeMobileNav());
});

// Reveal-on-scroll
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
);
revealEls.forEach((el) => io.observe(el));

// Stagger reveal delay for cards within same grid
["adv-grid", "services", "process", "gallery"].forEach((cls) => {
  const grid = document.querySelector("." + cls);
  if (!grid) return;
  [...grid.children].forEach((child, i) => {
    child.style.transitionDelay = Math.min(i * 70, 280) + "ms";
  });
});

// Animated counters in hero stats
const counters = document.querySelectorAll("[data-count]");
const countIo = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute("data-count"), 10);
      const prefix = el.getAttribute("data-prefix") || "";
      const suffix = el.getAttribute("data-suffix") || "";
      const duration = 1200;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIo.unobserve(el);
    });
  },
  { threshold: 0.6 }
);
counters.forEach((el) => countIo.observe(el));

// Subtle parallax on hero background
const heroBg = document.querySelector(".hero__bg");
if (heroBg) {
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroBg.style.transform = `scale(1.08) translateY(${y * 0.12}px)`;
      }
    },
    { passive: true }
  );
}
