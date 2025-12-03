// ===========================================
// SISTEM ADMIN CMS UNTUK ROMPOK CILEUNCA
// ===========================================

class AdminCMS {
  constructor() {
    this.adminPassword = 'admin123';
    this.storageKey = 'rompokCileuncaCMS';
    this.autoSaveInterval = 30000;
    this.autoSaveTimer = null;
    this.init();
  }
  
  init() {
    this.loadData();
    this.setupEventListeners();
    this.setupAutoSave();
    this.updateDynamicContent();
    this.loadCommentsCarousel();
  }
  
  loadData() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      this.data = JSON.parse(saved);
    } else {
      this.data = {
        content: {
          homeTitle: 'Rompok Cileunca',
          homeDesc: 'Nikmati villa nyaman, udara sejuk Pangalengan, dan pengalaman liburan terbaik di Rompok Cileunca.',
          aboutTitle: 'Liburan Seru di Bandung – Rompok Cileunca',
          aboutDesc: 'Nikmati villa nyaman di Rompok Cileunca dengan udara sejuk khas pegunungan Bandung Selatan.',
          vipWeekday: 1000000,
          vipWeekend: 1200000,
          cabinWeekday: 700000,
          cabinWeekend: 800000
        },
        testimonials: [],
        settings: {
          adminPassword: 'admin123',
          autoSaveInterval: 30
        }
      };
      this.saveData();
    }
  }
  
  saveData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    console.log('Data saved to localStorage');
  }
  
  setupAutoSave() {
    clearInterval(this.autoSaveTimer);
    this.autoSaveTimer = setInterval(() => {
      this.saveData();
    }, this.autoSaveInterval);
  }
  
  setupEventListeners() {
    // Admin Gear Icon
    const adminIcon = document.getElementById('adminGearIcon');
    if (adminIcon) {
      adminIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showAdminLogin();
      });
    }
    
    // Close Admin Panel
    const closeAdmin = document.getElementById('closeAdmin');
    if (closeAdmin) {
      closeAdmin.addEventListener('click', () => {
        document.getElementById('adminModal').style.display = 'none';
      });
    }
    
    // Tab Switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.target.dataset.tab;
        this.switchTab(tab);
      });
    });
    
    // Save Content
    const saveContentBtn = document.getElementById('saveContent');
    if (saveContentBtn) {
      saveContentBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.saveContentChanges();
      });
    }
    
    // Save Settings
    const saveSettingsBtn = document.getElementById('saveSettings');
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.saveSettings();
      });
    }
    
    // Comment Modal
    this.setupCommentModal();
    
    // Video Exchange
    this.setupVideoExchange();
  }
  
  setupCommentModal() {
    const addCommentIcon = document.getElementById('addCommentIcon');
    const commentModal = document.getElementById('commentModal');
    const closeCommentModal = document.getElementById('closeCommentModal');
    const commentForm = document.getElementById('visitorCommentForm');
    
    if (addCommentIcon && commentModal) {
      addCommentIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        commentModal.style.display = 'flex';
      });
    }
    
    if (closeCommentModal && commentModal) {
      closeCommentModal.addEventListener('click', () => {
        commentModal.style.display = 'none';
      });
    }
    
    // Close modal when clicking outside
    if (commentModal) {
      commentModal.addEventListener('click', (e) => {
        if (e.target === commentModal) {
          commentModal.style.display = 'none';
        }
      });
    }
    
    // Comment Form Submission
    if (commentForm) {
      commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.addVisitorComment();
      });
    }
  }
  
  setupVideoExchange() {
    const exchangeThumbs = document.querySelectorAll('.exchange-thumb');
    const mainVideo = document.getElementById('mainVideo');
    
    if (!mainVideo || exchangeThumbs.length === 0) return;
    
    exchangeThumbs.forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        e.stopPropagation();
        this.exchangeVideo(thumb, mainVideo);
      });
    });
  }
  
  // ===========================================
// VIDEO EXCHANGE SYSTEM - YANG BENAR
// ===========================================
class VideoExchangeSystem {
  constructor() {
    this.videos = [
      {
        id: 'main',
        src: 'assets/video/VID-20250815-WA0018.mp4',
        title: 'Tour Utama Villa'
      },
      {
        id: 'thumb1',
        src: 'assets/video/VID-20250819-WA0007.mp4',
        title: 'Aktivitas 1'
      },
      {
        id: 'thumb2',
        src: 'assets/video/VID-20250819-WA0001(1).mp4',
        title: 'Aktivitas 2'
      },
      {
        id: 'thumb3',
        src: 'assets/video/VID-20250819-WA0005(1).mp4',
        title: 'Aktivitas 3'
      }
    ];
    this.currentMainIndex = 0;
    this.currentThumbs = [1, 2, 3];
    this.init();
  }
  
  init() {
    this.setupVideoExchange();
  }
  
  setupVideoExchange() {
    const thumbs = document.querySelectorAll('.exchange-thumb');
    
    thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.exchangeVideo(index);
      });
    });
  }
  
  exchangeVideo(thumbIndex) {
    const mainVideo = document.getElementById('mainExchangeVideo');
    const mainSource = mainVideo.querySelector('source');
    
    const clickedThumb = document.querySelectorAll('.exchange-thumb')[thumbIndex];
    const thumbVideo = clickedThumb.querySelector('video');
    const thumbSource = thumbVideo.querySelector('source');
    
    if (!mainSource || !thumbSource) return;
    
    // Simpan sumber video sementara
    const mainSrc = mainSource.src;
    const thumbSrc = thumbSource.src;
    
    // Tukar sumber video
    mainSource.src = thumbSrc;
    thumbSource.src = mainSrc;
    
    // Load ulang video
    mainVideo.load();
    thumbVideo.load();
    
    // Update status aktif
    document.querySelectorAll('.exchange-thumb').forEach(thumb => {
      thumb.classList.remove('active');
    });
    clickedThumb.classList.add('active');
    
    console.log('Video ditukar: Main ->', thumbSrc, 'Thumb ->', mainSrc);
  }
}
  
  showAdminLogin() {
    const password = prompt('Masukkan Password Admin:');
    if (password === this.data.settings.adminPassword) {
      this.showAdminPanel();
    } else if (password !== null) {
      alert('Password salah!');
    }
  }
  
  showAdminPanel() {
    const adminModal = document.getElementById('adminModal');
    if (!adminModal) return;
    
    // Populate form fields
    document.getElementById('editHomeTitle').value = this.data.content.homeTitle;
    document.getElementById('editHomeDesc').value = this.data.content.homeDesc;
    document.getElementById('editAboutTitle').value = this.data.content.aboutTitle;
    document.getElementById('editAboutDesc').value = this.data.content.aboutDesc;
    document.getElementById('editVipWeekday').value = this.data.content.vipWeekday;
    document.getElementById('editVipWeekend').value = this.data.content.vipWeekend;
    document.getElementById('editCabinWeekday').value = this.data.content.cabinWeekday;
    document.getElementById('editCabinWeekend').value = this.data.content.cabinWeekend;
    
    // Load comments for management
    this.loadCommentsForAdmin();
    
    // Show modal
    adminModal.style.display = 'flex';
    
    // Close modal when clicking outside
    adminModal.addEventListener('click', (e) => {
      if (e.target === adminModal) {
        adminModal.style.display = 'none';
      }
    });
  }
  
  switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.tab === tabName) btn.classList.add('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
      if (content.id === tabName + 'Tab') content.classList.add('active');
    });
  }
  
  updateDynamicContent() {
    // Update Home Section
    const homeTitle = document.querySelector('.home__title');
    const homeDesc = document.querySelector('.home__desc');
    if (homeTitle) homeTitle.textContent = this.data.content.homeTitle;
    if (homeDesc) homeDesc.textContent = this.data.content.homeDesc;
    
    // Update About Section
    const aboutTitle = document.querySelector('.about__title');
    const aboutDesc = document.querySelector('.about__desc');
    if (aboutTitle) aboutTitle.textContent = this.data.content.aboutTitle;
    if (aboutDesc) aboutDesc.textContent = this.data.content.aboutDesc;
    
    // Update Room Prices
    this.updateRoomPrices();
  }
  
  updateRoomPrices() {
    // Update VIP Room prices
    const vipPrices = document.querySelectorAll('#vip-rooms .cabin__price');
    vipPrices.forEach(price => {
      price.innerHTML = `
        <span>Weekday: Rp ${this.formatPrice(this.data.content.vipWeekday)}</span><br>
        <span>Weekend: Rp ${this.formatPrice(this.data.content.vipWeekend)}</span>
      `;
    });
    
    // Update Cabin Room prices
    const cabinPrices = document.querySelectorAll('#cabin-rooms .cabin__price');
    cabinPrices.forEach(price => {
      price.innerHTML = `
        <span>Weekday: Rp ${this.formatPrice(this.data.content.cabinWeekday)}</span><br>
        <span>Weekend: Rp ${this.formatPrice(this.data.content.cabinWeekend)}</span>
      `;
    });
    
    // Update search calculator
    this.updatePriceCalculator();
  }
  
  updatePriceCalculator() {
    const roomSelect = document.getElementById("roomSelect");
    const kategoriSelect = document.getElementById("kategoriSelect");
    const durasiSelect = document.getElementById("durasiSelect");
    const totalPriceEl = document.getElementById("total-price");
    
    if (roomSelect && totalPriceEl) {
      const calculatePrice = () => {
        const room = roomSelect.value;
        const kategori = kategoriSelect.value;
        const durasi = parseInt(durasiSelect.value);
        
        let hargaPerHari = 0;
        
        if (room === "vip") {
          hargaPerHari = (kategori === "weekend") ? 
            this.data.content.vipWeekend : this.data.content.vipWeekday;
        } else if (room === "cabin") {
          hargaPerHari = (kategori === "weekend") ? 
            this.data.content.cabinWeekend : this.data.content.cabinWeekday;
        }
        
        const total = hargaPerHari * durasi;
        totalPriceEl.textContent = "Rp " + total.toLocaleString("id-ID");
      };
      
      roomSelect.addEventListener("change", calculatePrice);
      kategoriSelect.addEventListener("change", calculatePrice);
      durasiSelect.addEventListener("change", calculatePrice);
      calculatePrice();
    }
  }
  
  formatPrice(price) {
    return price.toLocaleString('id-ID');
  }
  
  saveContentChanges() {
    this.data.content.homeTitle = document.getElementById('editHomeTitle').value;
    this.data.content.homeDesc = document.getElementById('editHomeDesc').value;
    this.data.content.aboutTitle = document.getElementById('editAboutTitle').value;
    this.data.content.aboutDesc = document.getElementById('editAboutDesc').value;
    this.data.content.vipWeekday = parseInt(document.getElementById('editVipWeekday').value);
    this.data.content.vipWeekend = parseInt(document.getElementById('editVipWeekend').value);
    this.data.content.cabinWeekday = parseInt(document.getElementById('editCabinWeekday').value);
    this.data.content.cabinWeekend = parseInt(document.getElementById('editCabinWeekend').value);
    
    this.saveData();
    this.updateDynamicContent();
    alert('Perubahan berhasil disimpan!');
  }
  
  saveSettings() {
    const newPassword = document.getElementById('adminPassword').value;
    if (newPassword) {
      this.data.settings.adminPassword = newPassword;
    }
    this.data.settings.autoSaveInterval = parseInt(document.getElementById('autoSaveInterval').value);
    this.autoSaveInterval = this.data.settings.autoSaveInterval * 1000;
    this.setupAutoSave();
    
    this.saveData();
    alert('Pengaturan berhasil disimpan!');
  }
  
  addVisitorComment() {
    const name = document.getElementById('commentName').value;
    const title = document.getElementById('commentTitle').value;
    const text = document.getElementById('commentText').value;
    
    if (!name || !title || !text) {
      alert('Harap isi semua field!');
      return;
    }
    
    const newComment = {
      id: Date.now(),
      name: name,
      title: title,
      text: text,
      date: new Date().toLocaleDateString('id-ID'),
      approved: true
    };
    
    this.data.testimonials.push(newComment);
    this.saveData();
    this.loadCommentsCarousel();
    
    // Clear form and close modal
    document.getElementById('commentName').value = '';
    document.getElementById('commentTitle').value = '';
    document.getElementById('commentText').value = '';
    document.getElementById('commentModal').style.display = 'none';
    
    alert('Terima kasih atas komentar Anda!');
  }
  
  loadCommentsCarousel() {
    const carousel = document.getElementById('commentCarousel');
    if (!carousel) return;
    
    const approvedComments = this.data.testimonials.filter(c => c.approved);
    
    if (approvedComments.length === 0) {
      carousel.innerHTML = `
        <div class="no-comments" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%;">
          <i class="ri-chat-3-line" style="font-size: 40px; color: #ccc; margin-bottom: 10px;"></i>
          <p style="color: #888;">Belum ada komentar. Jadilah yang pertama!</p>
        </div>
      `;
      return;
    }
    
    carousel.innerHTML = '';
    approvedComments.forEach((comment, index) => {
      const slide = document.createElement('div');
      slide.className = `comment-slide ${index === 0 ? 'active' : ''}`;
      slide.innerHTML = `
        <div class="testimonial__wrapper" style="height:250px;">
          <div class="orange__card"></div>
          <div class="testimonial__card" style="height:100%;">
            <div class="testimonial__quote-mark"><i class="ri-double-quotes-l"></i></div> 
            <h2 class="testimonial__card-title">${comment.name}</h2>
            <h4 style="color:var(--orange-color); margin:5px 0;">${comment.title}</h4>
            <p class="testimonial__card-desc">${comment.text}</p>
            <small style="display:block; margin-top:10px; color:#888;">${comment.date}</small>
            <div class="testimonial__quote-mark testimonial__quote-mark-right"><i class="ri-double-quotes-r"></i></div>
          </div>
          <div class="testimonial__user">
            <img src="assets/images/user.jpg" alt="${comment.name}" />  
          </div>
        </div>
      `;
      carousel.appendChild(slide);
    });
    
    // Start carousel
    this.startCommentCarousel();
  }
  
  startCommentCarousel() {
    const slides = document.querySelectorAll('.comment-slide');
    if (slides.length <= 1) return;
    
    let currentSlide = 0;
    
    const carouselInterval = setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 5000); // Ganti setiap 5 detik
    
    // Pause carousel on hover
    const carousel = document.getElementById('commentCarousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
      });
      
      carousel.addEventListener('mouseleave', () => {
        clearInterval(carouselInterval);
        this.startCommentCarousel();
      });
    }
  }
  
  loadCommentsForAdmin() {
    const container = document.getElementById('commentsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    this.data.testimonials.forEach(comment => {
      const commentDiv = document.createElement('div');
      commentDiv.className = 'admin-comment-item';
      commentDiv.innerHTML = `
        <div class="comment-header">
          <strong>${comment.name}</strong>
          <span class="comment-date">${comment.date}</span>
          <span class="comment-status ${comment.approved ? 'approved' : 'pending'}">
            ${comment.approved ? '✓ Disetujui' : '⏳ Menunggu'}
          </span>
        </div>
        <h4>${comment.title}</h4>
        <p>${comment.text}</p>
        <div class="comment-actions">
          <button class="btn-approve" data-id="${comment.id}">
            ${comment.approved ? 'Batalkan' : 'Setujui'}
          </button>
          <button class="btn-delete" data-id="${comment.id}">Hapus</button>
        </div>
      `;
      container.appendChild(commentDiv);
    });
    
    // Add event listeners for actions
    container.querySelectorAll('.btn-approve').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        this.toggleCommentApproval(id);
      });
    });
    
    container.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        if (confirm('Hapus komentar ini?')) {
          this.deleteComment(id);
        }
      });
    });
  }
  
  toggleCommentApproval(id) {
    const comment = this.data.testimonials.find(c => c.id === id);
    if (comment) {
      comment.approved = !comment.approved;
      this.saveData();
      this.loadCommentsForAdmin();
      this.loadCommentsCarousel();
    }
  }
  
  deleteComment(id) {
    this.data.testimonials = this.data.testimonials.filter(c => c.id !== id);
    this.saveData();
    this.loadCommentsForAdmin();
    this.loadCommentsCarousel();
  }
}

// ===========================================
// INISIALISASI SISTEM
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Admin CMS
  window.adminSystem = new AdminCMS();
  
  console.log('✅ Rompok Cileunca Admin System Initialized');
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl + Alt + A untuk admin panel
    if (e.ctrlKey && e.altKey && e.key === 'a') {
      e.preventDefault();
      const adminIcon = document.getElementById('adminGearIcon');
      if (adminIcon) adminIcon.click();
    }
    
    // Escape untuk tutup modal
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('.admin-modal, .comment-modal');
      modals.forEach(modal => {
        if (modal.style.display === 'flex') {
          modal.style.display = 'none';
        }
      });
    }
  });
});
