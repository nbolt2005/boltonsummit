(function(){
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const $  = (sel, root=document) => root.querySelector(sel);

  // active tab highlight
  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $$(".tab").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === here) a.classList.add("active");
  });

  // scroll reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("show"); });
  }, { threshold: 0.10 });
  $$(".reveal").forEach(el => io.observe(el));

  // ---- HAMBURGER MENU ----
  const navbar = $(".navbar");
  const tabs   = $(".tabs");
  if (navbar && tabs) {
    // create button
    const btn = document.createElement("button");
    btn.className   = "nav-toggle";
    btn.setAttribute("aria-label", "Toggle navigation");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = `
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    `;
    navbar.appendChild(btn);

    const toggle = () => {
      const open = tabs.classList.toggle("nav-open");
      btn.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    };

    btn.addEventListener("click", toggle);

    // close when a tab is clicked (mobile navigation)
    $$(".tab").forEach(a => {
      a.addEventListener("click", () => {
        tabs.classList.remove("nav-open");
        btn.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      });
    });

    // close on outside click
    document.addEventListener("click", e => {
      if (!navbar.contains(e.target)) {
        tabs.classList.remove("nav-open");
        btn.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ---- MODAL ----
  const modal = $("#modal");
  if (modal) {
    const mTitle = $("#modalTitle");
    const mImg   = $("#modalImg");
    const mCopy  = $("#modalCopy");

    const close = () => {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    };
    const open = ({ title, img, copy }) => {
      mTitle.textContent = title || "";
      if (img) mImg.setAttribute("src", img);
      mCopy.textContent = copy || "";
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    };

    $$(".click-card").forEach(card => {
      card.addEventListener("click", () => open({
        title: card.getAttribute("data-title"),
        img:   card.getAttribute("data-img"),
        copy:  card.getAttribute("data-copy")
      }));
    });

    $$(".js-open-modal").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        open({
          title: btn.getAttribute("data-title"),
          img:   btn.getAttribute("data-img"),
          copy:  btn.getAttribute("data-copy")
        });
      });
    });

    $("#modalClose")?.addEventListener("click", close);
    modal.addEventListener("click", e => { if (e.target === modal) close(); });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && modal.classList.contains("open")) close();
    });
  }
})()