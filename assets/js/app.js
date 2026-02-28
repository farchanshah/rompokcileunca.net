/**
 * =============================================
 *  ROMPOK CILEUNCA — UNIFIED APP MODULE
 *  Menggabungkan: script.js, admin-system.js,
 *  dan semua inline scripts
 * =============================================
 */

(function () {
  'use strict';

  // ===========================================
  //  1. UTILITY HELPERS
  // ===========================================
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const 
$$
= (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function formatRupiah(num) {
    return 'Rp ' + Number(num).toLocaleString('id-ID');
  }

  function safeGet(id) {
    return document.getElementById(id);
  }

  // ===========================================
  //  2. NAVIGATION SYSTEM
  // ===========================================
  const Navigation = {
    init() {
      this.header = safeGet('header');
      this.menuBtn = safeGet('menu-trigger');
      this.sidebar = safeGet('sidebar');
      this.overlay = safeGet('sidebarOverlay');
      this.closeBtn = safeGet('close-icon');

      if (!this.menuBtn || !this.sidebar) return;

      this.setupDesktopDropdown();
      this.setupSidebar();
      this.setupSidebarDropdown();
      this.setupScrollBehavior();
      this.setupSidebarNavLinks();
    },

    setupDesktopDropdown() {
      const toggle = $('.main__nav .nav__item.has-dropdown > .dropdown-toggle');
      if (!toggle) return;

      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = toggle.closest('.nav__item.has-dropdown');
$$
('.main__nav .nav__item.has-dropdown').forEach(li => {
          if (li !== parent) li.classList.remove('active');
        });
        parent.classList.toggle('active');
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.main__nav .nav__item.has-dropdown')) {
          
$$
('.main__nav .nav__item.has-dropdown').forEach(li => li.classList.remove('active'));
        }
      });
    },

    openSidebar() {
      this.sidebar.classList.add('active');
      this.sidebar.setAttribute('aria-hidden', 'false');
      this.overlay.hidden = false;
      this.overlay.classList.add('active');
      this.menuBtn.classList.add('active');
      document.body.classList.add('sidebar-open');
      document.body.style.overflow = 'hidden';
    },

    closeSidebar() {
      this.sidebar.classList.remove('active');
      this.sidebar.setAttribute('aria-hidden', 'true');
      this.overlay.classList.remove('active');
      this.menuBtn.classList.remove('active');
      document.body.classList.remove('sidebar-open');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (!this.overlay.classList.contains('active')) this.overlay.hidden = true;
      }, 300);
    },

    setupSidebar() {
      this.menuBtn.addEventListener('click', () => this.openSidebar());
      if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.closeSidebar());
      if (this.overlay) this.overlay.addEventListener('click', () => this.closeSidebar());
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeSidebar();
      });
    },

    setupSidebarDropdown() {
      const expander = $('#sidebar .sidebar__dropdown-toggle > .sidebar__expander');
      if (!expander) return;

      expander.addEventListener('click', (e) => {
        e.preventDefault();
        const li = expander.closest('.sidebar__dropdown-toggle');
        const submenu = li.querySelector(':scope > .sidebar__dropdown');
        const willOpen = !li.classList.contains('open');

        li.classList.toggle('open', willOpen);
        expander.setAttribute('aria-expanded', String(willOpen));

        if (submenu) {
          if (willOpen) {
            submenu.style.display = 'block';
            submenu.style.maxHeight = submenu.scrollHeight + 'px';
            submenu.style.opacity = '1';
          } else {
            submenu.style.maxHeight = '0px';
            submenu.style.opacity = '0';
            setTimeout(() => { submenu.style.display = 'none'; }, 280);
          }
        }
      });
    },

    setupSidebarNavLinks() {
      // Close sidebar when clicking any nav link
$$
('#sidebar .sidebar__link, #sidebar .sidebar__dropdown-link').forEach(link => {
        link.addEventListener('click', () => {
          setTimeout(() => this.closeSidebar(), 200);
        });
      });
    },

    setupScrollBehavior() {
      if (!this.header || !this.menuBtn) return;

      const checkScroll = () => {
        if (window.innerWidth >= 992) {
          const headerBottom = this.header.getBoundingClientRect().bottom;
          this.menuBtn.classList.toggle('show', headerBottom <= 0);
        }
      };

      window.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      checkScroll();
    }
  };

  // ===========================================
  //  3. PRICE CALCULATOR
  // ===========================================
  const PriceCalculator = {
    prices: {
      vip: { weekday: 1000000, weekend: 1200000 },
      cabin: { weekday: 700000, weekend: 800000 }
    },

    init() {
      this.roomSelect = safeGet('roomSelect');
      this.kategoriSelect = safeGet('kategoriSelect');
      this.durasiSelect = safeGet('durasiSelect');
      this.totalPriceEl = safeGet('total-price');
      this.priceDetailEl = safeGet('price-detail');
      this.searchBtn = safeGet('searchBtn');

      if (!this.roomSelect || !this.totalPriceEl) return;

      this.roomSelect.addEventListener('change', () => this.calculate());
      this.kategoriSelect.addEventListener('change', () => this.calculate());
      this.durasiSelect.addEventListener('change', () => this.calculate());

      if (this.searchBtn) {
        this.searchBtn.addEventListener('click', () => {
          const room = this.roomSelect.value;
          window.location.href = room === 'vip' ? '#vip-rooms' : '#cabin-rooms';
        });
      }

      this.calculate();
    },

    updatePrices(newPrices) {
      Object.assign(this.prices, newPrices);
      this.calculate();
    },

    calculate() {
      const room = this.roomSelect.value;
      const kategori = this.kategoriSelect.value;
      const durasi = parseInt(this.durasiSelect.value);
      const hargaPerHari = this.prices[room]?.[kategori] || 0;
      const total = hargaPerHari * durasi;

      this.totalPriceEl.textContent = formatRupiah(total);

      if (this.priceDetailEl) {
        const roomLabel = room === 'vip' ? 'VIP' : 'Cabin';
        const kategoriLabel = kategori === 'weekend' ? 'Weekend' : 'Weekday';
        const durasiLabel = durasi === 7 ? '1 Minggu' : durasi + ' Hari';
        this.priceDetailEl.textContent = `${roomLabel} | ${kategoriLabel} | ${durasiLabel}`;
      }
    }
  };

  // ===========================================
  //  4. VIDEO PLAYER
  // ===========================================
  const VideoPlayer = {
    init() {
      this.mainVideo = safeGet('mainVideo');
      this.mainFrame = safeGet('mainVideoFrame');
      this.mainPlay = safeGet('mainPlay');
      this.spinner = safeGet('videoSpinner');

      if (!this.mainVideo) return;

      this.setupVideoEvents();
      this.setupControls();
      this.setupExchange();
      this.setupKeyboard();
    },

    showSpinner(flag) {
      if (this.spinner) this.spinner.style.display = flag ? 'block' : 'none';
    },

    setupVideoEvents() {
      this.mainVideo.addEventListener('waiting', () => this.showSpinner(true));
      this.mainVideo.addEventListener('canplay', () => this.showSpinner(false));
      this.mainVideo.addEventListener('playing', () => {
        this.showSpinner(false);
        if (this.mainPlay) this.mainPlay.style.display = 'none';
      });
      this.mainVideo.addEventListener('pause', () => {
        if (this.mainPlay) this.mainPlay.style.display = 'flex';
      });

      if (this.mainPlay) {
        this.mainPlay.addEventListener('click', () => this.play());
      }

      // Set default volume
      const volCtrl = safeGet('volumeControl');
      this.mainVideo.volume = volCtrl ? parseFloat(volCtrl.value) : 0.8;
    },

    async play() {
      try { await this.mainVideo.play(); } catch (e) {
        console.warn('Video autoplay blocked:', e.message);
      }
    },

    setupControls() {
      const btnPlay = safeGet('btnPlay');
      const btnPause = safeGet('btnPause');
      const btnStop = safeGet('btnStop');
      const btnFs = safeGet('btnFullscreen');
      const volCtrl = safeGet('volumeControl');

      if (btnPlay) btnPlay.addEventListener('click', () => this.play());
      if (btnPause) btnPause.addEventListener('click', () => this.mainVideo.pause());
      if (btnStop) btnStop.addEventListener('click', () => {
        this.mainVideo.pause();
        this.mainVideo.currentTime = 0;
        if (this.mainPlay) this.mainPlay.style.display = 'flex';
      });
      if (btnFs) btnFs.addEventListener('click', () => {
        const el = this.mainFrame;
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
        }
      });
      if (volCtrl) {
        volCtrl.addEventListener('input', () => {
          this.mainVideo.volume = parseFloat(volCtrl.value);
        });
      }
    },

    setupExchange() {
      const thumbs = 
$$
('.exchange-thumb');
      if (thumbs.length === 0) return;

      // Set first as active
      thumbs[0].classList.add('active');

      thumbs.forEach(thumb => {
        thumb.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.exchangeVideo(thumb);
        });
      });

      // Set preview thumbnails
$$
('.thumb__video').forEach(v => {
        v.addEventListener('loadeddata', () => { v.currentTime = 2; });
      });
    },

    exchangeVideo(clickedThumb) {
      const thumbVideo = clickedThumb.querySelector('video');
      const thumbSource = thumbVideo?.querySelector('source');
      const mainSource = this.mainVideo?.querySelector('source');

      if (!thumbSource || !mainSource) return;

      // Swap sources
      const mainSrc = mainSource.src;
      const thumbSrc = thumbSource.src;

      mainSource.src = thumbSrc;
      thumbSource.src = mainSrc;

      // Update data-src attribute
      clickedThumb.dataset.src = mainSrc;

      // Reload videos
      this.mainVideo.load();
      thumbVideo.load();

      // Update active state
      
$$
('.exchange-thumb').forEach(t => t.classList.remove('active'));
      clickedThumb.classList.add('active');

      // Autoplay after exchange
      setTimeout(() => this.play(), 500);
    },

    setupKeyboard() {
      if (!this.mainFrame) return;
      this.mainFrame.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          this.mainVideo.paused ? this.play() : this.mainVideo.pause();
        }
      });
    }
  };

  // ===========================================
  //  5. PHOTO CAROUSEL
  // ===========================================
  const PhotoCarousel = {
    index: 0,
    perView: 4,
    autoplay: true,
    autoTimer: null,
    isDragging: false,

    init() {
      this.track = safeGet('carTrack');
      this.prevBtn = safeGet('carPrev');
      this.nextBtn = safeGet('carNext');
      this.dotsWrap = safeGet('carDots');
      this.toggleBtn = safeGet('carToggle');

      if (!this.track) return;

      this.viewport = this.track.parentElement;
      this.originalItems = [...this.track.children];
      this.perView = this.getPerView();

      this.setupClones();
      this.buildDots();
      this.gotoIndex(0, true);
      this.startAuto();

      this.setupNavigation();
      this.setupDrag();
      this.setupKeyboard();
      this.setupResize();
    },

    getPerView() {
      return parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--rc-perView')) || 4;
    },

    pagesCount() {
      return Math.ceil(this.originalItems.length / this.perView);
    },

    setupClones() {
      // Remove existing clones
$$
('.carousel__clone', this.track).forEach(el => el.remove());

      // Clone items for infinite scroll
      const items = this.originalItems;
      const cloneCount = this.perView;

      // Clone last N items to prepend
      for (let i = items.length - cloneCount; i < items.length; i++) {
        const clone = items[i].cloneNode(true);
        clone.classList.add('carousel__clone');
        clone.setAttribute('aria-hidden', 'true');
        this.track.prepend(clone);
      }

      // Clone first N items to append
      for (let i = 0; i < cloneCount; i++) {
        const clone = items[i].cloneNode(true);
        clone.classList.add('carousel__clone');
        clone.setAttribute('aria-hidden', 'true');
        this.track.append(clone);
      }

      this.allItems = [...this.track.children];
    },

    getItemOffset(idx) {
      const child = this.allItems[idx];
      if (!child) return 0;
      return child.offsetLeft - this.allItems[0].offsetLeft;
    },

    applyTransform(instant = false) {
      const firstVisible = this.perView + (this.index * this.perView);
      const offset = this.getItemOffset(firstVisible);
      this.track.style.transition = instant ? 'none' : 'transform .6s ease';
      this.track.style.transform = `translateX(${-offset}px)`;
    },

    gotoIndex(i, instant = false) {
      this.index = ((i % this.pagesCount()) + this.pagesCount()) % this.pagesCount();
      this.updateDots();
      this.applyTransform(instant);
    },

    buildDots() {
      if (!this.dotsWrap) return;
      this.dotsWrap.innerHTML = '';
      for (let i = 0; i < this.pagesCount(); i++) {
        const btn = document.createElement('button');
        btn.setAttribute('aria-label', `Page ${i + 1}`);
        if (i === this.index) btn.classList.add('active');
        btn.addEventListener('click', () => this.gotoIndex(i));
        this.dotsWrap.appendChild(btn);
      }
    },

    updateDots() {
      if (!this.dotsWrap) return;
      
$$
('button', this.dotsWrap).forEach((b, i) => {
        b.classList.toggle('active', i === this.index);
      });
    },

    prev() { this.gotoIndex(this.index - 1); },
    next() { this.gotoIndex(this.index + 1); },

    startAuto() {
      this.stopAuto();
      if (!this.autoplay) return;
      this.autoTimer = setInterval(() => this.next(), 3500);
    },

    stopAuto() {
      if (this.autoTimer) { clearInterval(this.autoTimer); this.autoTimer = null; }
    },

    setupNavigation() {
      if (this.prevBtn) this.prevBtn.addEventListener('click', () => { this.prev(); this.restartAuto(); });
      if (this.nextBtn) this.nextBtn.addEventListener('click', () => { this.next(); this.restartAuto(); });

      if (this.toggleBtn) {
        this.toggleBtn.addEventListener('click', () => {
          this.autoplay = !this.autoplay;
          this.toggleBtn.textContent = this.autoplay ? 'Pause' : 'Play';
          this.autoplay ? this.startAuto() : this.stopAuto();
        });
      }

      if (this.viewport) {
        this.viewport.addEventListener('mouseenter', () => this.stopAuto());
        this.viewport.addEventListener('mouseleave', () => this.startAuto());
      }
    },

    restartAuto() {
      this.stopAuto();
      this.startAuto();
    },

    setupDrag() {
      if (!this.viewport) return;
      let startX = 0, scrollStart = 0;

      this.viewport.addEventListener('pointerdown', (e) => {
        this.isDragging = true;
        startX = e.clientX;
        const match = this.track.style.transform.match(/translateX\(([-\d.]+)px\)/);
        scrollStart = match ? parseFloat(match[1]) : 0;
        this.track.setPointerCapture(e.pointerId);
        this.track.style.transition = 'none';
        this.stopAuto();
      });

      this.viewport.addEventListener('pointermove', (e) => {
        if (!this.isDragging) return;
        const dx = e.clientX - startX;
        this.track.style.transform = `translateX(${scrollStart + dx}px)`;
      });

      this.viewport.addEventListener('pointerup', (e) => {
        if (!this.isDragging) return;
        this.isDragging = false;
        const dx = e.clientX - startX;
        const threshold = this.viewport.clientWidth * 0.15;
        if (dx > threshold) this.prev();
        else if (dx < -threshold) this.next();
        else this.applyTransform();
        this.startAuto();
      });
    },

    setupKeyboard() {
      if (!this.viewport) return;
      this.viewport.setAttribute('tabindex', '0');
      this.viewport.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { this.prev(); this.restartAuto(); }
        if (e.key === 'ArrowRight') { this.next(); this.restartAuto(); }
      });
    },

    setupResize() {
      let timer;
      window.addEventListener('resize', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const newPer = this.getPerView();
          if (newPer !== this.perView) {
            this.perView = newPer;
            this.setupClones();
            this.buildDots();
            this.gotoIndex(0, true);
          } else {
            this.applyTransform(true);
          }
        }, 150);
      });
    }
  };

  // ===========================================
  //  6. COMMENT SYSTEM (UNIFIED)
  // ===========================================
  const CommentSystem = {
    STORAGE_KEY: 'rompokCileuncaComments',
    comments: [],
    currentIndex: 0,
    rotateTimer: null,

    init() {
      this.loadComments();
      this.setupModal();
      this.updateCarousel();
      this.startRotation();
    },

    loadComments() {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        this.comments = saved ? JSON.parse(saved) : this.getDefaults();
      } catch {
        this.comments = this.getDefaults();
      }
    },

    getDefaults() {
      return [
        { id: 1, name: "Budi Santoso", title: "Liburan Keluarga Tak Terlupakan", text: "Rompok Cileunca sangat cocok untuk liburan keluarga! Villa nyaman, udara sejuk, fasilitas lengkap.", date: "15 Jan 2025", approved: true },
        { id: 2, name: "Sari Wijaya", title: "Perfect Getaway dari Kota", text: "Suasana tenang, pemandangan indah. Staff ramah. Rafting dan ATV sangat seru! Pasti kembali lagi.", date: "10 Jan 2025", approved: true },
        { id: 3, name: "Agus Setiawan", title: "Team Building Sukses", text: "Company outing di sini. Fasilitas meeting memadai, makanan enak, wahana adventure hidup. Recommended!", date: "5 Jan 2025", approved: true }
      ];
    },

    save() {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.comments));
    },

    setupModal() {
      const addIcon = safeGet('addCommentIcon');
      const modal = safeGet('commentModal');
      const closeBtn = safeGet('closeCommentModal');
      const form = safeGet('visitorCommentForm');

      if (addIcon && modal) {
        addIcon.addEventListener('click', (e) => {
          e.stopPropagation();
          modal.style.display = 'flex';
          modal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        });
      }

      const closeModal = () => {
        if (modal) {
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      };

      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      if (modal) modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.addComment();
        });
      }
    },

    addComment() {
      const name = safeGet('commentName')?.value?.trim();
      const title = safeGet('commentTitle')?.value?.trim();
      const text = safeGet('commentText')?.value?.trim();

      if (!name || !title || !text) {
        alert('Harap isi semua field yang diperlukan!');
        return;
      }

      this.comments.unshift({
        id: Date.now(),
        name, title, text,
        date: new Date().toLocaleDateString('id-ID', {
          day: 'numeric', month: 'long', year: 'numeric'
        }),
        approved: true
      });

      this.save();
      this.updateCarousel();

      // Reset form & close
      const form = safeGet('visitorCommentForm');
      if (form) form.reset();

      const modal = safeGet('commentModal');
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }

      alert('Terima kasih! Komentar Anda berhasil dikirim.');
    },

    updateCarousel() {
      const carousel = safeGet('commentCarousel');
      if (!carousel) return;

      const approved = this.comments.filter(c => c.approved).slice(0, 10);
      carousel.innerHTML = '';

      approved.forEach((comment, i) => {
        const slide = document.createElement('div');
        slide.className = `comment-slide${i === 0 ? ' active' : ''}`;
        slide.innerHTML = `
          <div class="testimonial__wrapper" style="height:auto;min-height:220px">
            <div class="orange__card"></div>
            <div class="testimonial__card" style="height:100%">
              <div class="testimonial__quote-mark"><i class="ri-double-quotes-l"></i></div>
              <h2 class="testimonial__card-title">${this.escapeHTML(comment.name)}</h2>
              <h4 style="color:var(--orange-color);margin:5px 0">${this.escapeHTML(comment.title)}</h4>
              <p class="testimonial__card-desc">${this.escapeHTML(comment.text)}</p>
              <small style="display:block;margin-top:10px;color:#888">${comment.date}</small>
              <div class="testimonial__quote-mark testimonial__quote-mark-right"><i class="ri-double-quotes-r"></i></div>
            </div>
            <div class="testimonial__user">
              <img src="assets/images/user.jpg" alt="${this.escapeHTML(comment.name)}">
            </div>
          </div>`;
        carousel.appendChild(slide);
      });

      this.startRotation();
    },

    escapeHTML(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    },

    startRotation() {
      if (this.rotateTimer) clearInterval(this.rotateTimer);
      const slides =
$$
('.comment-slide');
      if (slides.length <= 1) return;

      this.rotateTimer = setInterval(() => {
        const current = $('.comment-slide.active');
        if (!current) return;
        current.classList.remove('active');
        const next = current.nextElementSibling?.classList.contains('comment-slide')
          ? current.nextElementSibling
          : 
$$
('.comment-slide')[0];
        if (next) next.classList.add('active');
      }, 5000);
    },

    // Methods for Admin
    getComments() { return this.comments; },
    toggleApproval(id) {
      const c = this.comments.find(x => x.id === id);
      if (c) { c.approved = !c.approved; this.save(); this.updateCarousel(); }
    },
    deleteComment(id) {
      this.comments = this.comments.filter(x => x.id !== id);
      this.save();
      this.updateCarousel();
    }
  };

  // ===========================================
  //  7. ADMIN CMS SYSTEM
  // ===========================================
  const AdminCMS = {
    STORAGE_KEY: 'rompokCileuncaCMS',
    defaultPassword: 'admin123',
    data: null,
    autoTimer: null,

    init() {
      this.loadData();
      this.setupListeners();
      this.setupAutoSave();
    },

    loadData() {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        this.data = saved ? JSON.parse(saved) : this.getDefaults();
      } catch {
        this.data = this.getDefaults();
      }
    },

    getDefaults() {
      return {
        content: {
          homeTitle: 'Rompok',
          homeTitleOrange: 'Cileunca',
          homeSubtitle: 'Liburan Seru di Bandung',
          homeDesc: 'Nikmati villa nyaman, udara sejuk Pangalengan, dan pengalaman liburan terbaik di Rompok Cileunca.',
          aboutTitle: 'Liburan Seru di Bandung – Rompok Cileunca',
          aboutDesc: 'Nikmati villa nyaman di Rompok Cileunca dengan udara sejuk khas pegunungan Bandung Selatan.',
          vipWeekday: 1000000,
          vipWeekend: 1200000,
          cabinWeekday: 700000,
          cabinWeekend: 800000
        },
        settings: {
          adminPassword: 'admin123',
          whatsapp: '+6281389003040',
          autoSaveInterval: 60,
          maxComments: 10
        }
      };
    },

    save() {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    },

    setupAutoSave() {
      if (this.autoTimer) clearInterval(this.autoTimer);
      const interval = (this.data?.settings?.autoSaveInterval || 60) * 1000;
      this.autoTimer = setInterval(() => this.save(), interval);
    },

    setupListeners() {
      // Admin gear icon
      const gearIcon = safeGet('adminGearIcon');
      if (gearIcon) {
        gearIcon.addEventListener('click', (e) => {
          e.stopPropagation();
          this.showLogin();
        });
      }

      // Close admin
      const closeAdmin = safeGet('closeAdmin');
      if (closeAdmin) {
        closeAdmin.addEventListener('click', () => {
          const modal = safeGet('adminModal');
          if (modal) modal.style.display = 'none';
        });
      }

      // Tab switching
$$
('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
      });

      // Save buttons (using data-section attribute)
      
$$
('.admin-save-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const section = btn.dataset.section;
          this.saveSection(section);
        });
      });

      // Backup/Restore/Reset
      const backupBtn = safeGet('backupData');
      const restoreBtn = safeGet('restoreData');
      const resetBtn = safeGet('resetData');

      if (backupBtn) backupBtn.addEventListener('click', () => this.backup());
      if (restoreBtn) restoreBtn.addEventListener('click', () => this.restore());
      if (resetBtn) resetBtn.addEventListener('click', () => this.reset());

      // Keyboard shortcut
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key === 'a') {
          e.preventDefault();
          if (gearIcon) gearIcon.click();
        }
        if (e.key === 'Escape') {
          const modal = safeGet('adminModal');
          if (modal?.style.display === 'flex') modal.style.display = 'none';
        }
      });
    },

    showLogin() {
      const password = prompt('Masukkan Password Admin:');
      if (password === (this.data?.settings?.adminPassword || this.defaultPassword)) {
        this.showPanel();
      } else if (password !== null) {
        alert('Password salah!');
      }
    },

    showPanel() {
      const modal = safeGet('adminModal');
      if (!modal) return;

      // Populate fields
      this.populateFields();
      this.loadCommentsAdmin();

      modal.style.display = 'flex';

      // Close on outside click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      }, { once: false });
    },

    populateFields() {
      const c = this.data.content;
      const s = this.data.settings;

      const fields = {
        editHomeTitle: c.homeTitle,
        editHomeSubtitle: c.homeSubtitle || '',
        editHomeDesc: c.homeDesc,
        editAboutTitle: c.aboutTitle,
        editAboutDesc: c.aboutDesc,
        editVipWeekday: c.vipWeekday,
        editVipWeekend: c.vipWeekend,
        editCabinWeekday: c.cabinWeekday,
        editCabinWeekend: c.cabinWeekend,
        adminPassword: '',
        adminWhatsapp: s.whatsapp || '',
        autoSaveInterval: s.autoSaveInterval || 60,
        maxComments: s.maxComments || 10
      };

      Object.entries(fields).forEach(([id, value]) => {
        const el = safeGet(id);
        if (el) el.value = value;
      });
    },

    switchTab(tabName) {
$$
('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
      });
      
$$
('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === tabName + 'Tab');
      });
    },

    saveSection(section) {
      const c = this.data.content;
      const s = this.data.settings;

      switch (section) {
        case 'home':
          c.homeTitle = safeGet('editHomeTitle')?.value || c.homeTitle;
          c.homeSubtitle = safeGet('editHomeSubtitle')?.value || c.homeSubtitle;
          c.homeDesc = safeGet('editHomeDesc')?.value || c.homeDesc;
          break;
        case 'about':
          c.aboutTitle = safeGet('editAboutTitle')?.value || c.aboutTitle;
          c.aboutDesc = safeGet('editAboutDesc')?.value || c.aboutDesc;
          break;
        case 'rooms':
          c.vipWeekday = parseInt(safeGet('editVipWeekday')?.value) || c.vipWeekday;
          c.vipWeekend = parseInt(safeGet('editVipWeekend')?.value) || c.vipWeekend;
          c.cabinWeekday = parseInt(safeGet('editCabinWeekday')?.value) || c.cabinWeekday;
          c.cabinWeekend = parseInt(safeGet('editCabinWeekend')?.value) || c.cabinWeekend;
          break;
        case 'settings':
          const newPw = safeGet('adminPassword')?.value;
          if (newPw) s.adminPassword = newPw;
          s.whatsapp = safeGet('adminWhatsapp')?.value || s.whatsapp;
          s.autoSaveInterval = parseInt(safeGet('autoSaveInterval')?.value) || 60;
          s.maxComments = parseInt(safeGet('maxComments')?.value) || 10;
          this.setupAutoSave();
          break;
      }

      this.save();
      this.applyContent();
      alert('Perubahan berhasil disimpan!');
    },

    applyContent() {
      const c = this.data.content;

      // Update Home (preserve orange span)
      const homeTitle = safeGet('homeTitle');
      if (homeTitle) {
        homeTitle.innerHTML = `${c.homeTitle} <span class="home__title-orange">${c.homeTitleOrange || 'Cileunca'}</span>`;
      }

      const homeDesc = safeGet('homeDesc');
      if (homeDesc) homeDesc.textContent = c.homeDesc;

      const aboutTitle = safeGet('aboutTitle');
      if (aboutTitle) aboutTitle.textContent = c.aboutTitle;

      const aboutDesc = safeGet('aboutDesc');
      if (aboutDesc) aboutDesc.textContent = c.aboutDesc;

      // Update room prices
$$
('#vip-rooms .cabin__price').forEach(el => {
        el.innerHTML = `<span>Weekday: ${formatRupiah(c.vipWeekday)}</span><br><span>Weekend: ${formatRupiah(c.vipWeekend)}</span>`;
      });
      $$('#cabin-rooms .cabin__price').forEach(el => {
        el.innerHTML = `<span>Weekday: ${formatRupiah(c.cabinWeekday)}</span><br><span>Weekend: ${formatRupiah(c.cabinWeekend)}</span>`;
      });

      // Update price calculator
      PriceCalculator.updatePrices({
        vip: { weekday: c.vipWeekday, weekend: c.vipWeekend },
        cabin: { weekday: c.cabinWeekday, weekend: c.cabinWeekend }
      
