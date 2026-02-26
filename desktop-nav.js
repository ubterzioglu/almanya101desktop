/**
 * ALMANYA101 DESKTOP NAVIGATION INJECTOR
 * - Tüm sayfalara desktop navigasyonu ekler
 * - Mevcut mobil yapıyı korur
 */
(function() {
  "use strict";
  
  // Sayfa seviyesini hesapla (./ veya ../)
  function getBasePath() {
    const path = window.location.pathname || "";
    if (!path || path === "/" || path === "/index.html") return "./";
    const parts = path.split("/").filter(Boolean);
    if (parts.length <= 1) return "./";
    return "../".repeat(parts.length - 1);
  }
  
  const base = getBasePath();
  
  // Desktop Nav HTML
  const navHTML = `
    <nav class="desktop-nav" id="desktopNav">
      <div class="desktop-nav-inner">
        <a href="${base}index.html" class="desktop-logo">
          <img src="${base}img/ui/logoround.png" alt="almanya101">
          <span>almanya101</span>
        </a>
        
        <div class="desktop-menu">
          <a href="${base}maas/maas.html" class="desktop-menu-item">💰 Maaş</a>
          <a href="${base}vatandas/v.html" class="desktop-menu-item">📝 Vatandaşlık</a>
          <a href="${base}rehber/ua.html" class="desktop-menu-item">👨‍⚕️ Uzman</a>
          <a href="${base}banka/banka.html" class="desktop-menu-item">🏦 Banka</a>
          <a href="${base}sigorta/sigorta.html" class="desktop-menu-item">🛡️ Sigorta</a>
          <div class="desktop-menu-more">
            <button class="desktop-menu-more-btn">Diğer ▾</button>
            <div class="desktop-dropdown">
              <a href="${base}paratransfer/pt.html" class="desktop-dropdown-item">
                <span class="desktop-dropdown-icon">🔁</span> Para Transferi
              </a>
              <a href="${base}tatiltr/tatiltr.html" class="desktop-dropdown-item">
                <span class="desktop-dropdown-icon">✈️</span> Tatil TR
              </a>
              <a href="${base}tatilde/tatilde.html" class="desktop-dropdown-item">
                <span class="desktop-dropdown-icon">🏖️</span> Tatil DE
              </a>
              <a href="${base}article/article.html" class="desktop-dropdown-item">
                <span class="desktop-dropdown-icon">📝</span> Yazı Dizisi
              </a>
              <a href="${base}bizkimiz/bizkimiz.html" class="desktop-dropdown-item">
                <span class="desktop-dropdown-icon">🧑‍💻</span> Biz Kimiz?
              </a>
              <a href="${base}join/join.html" class="desktop-dropdown-item">
                <span class="desktop-dropdown-icon">🤝</span> Bize Katıl!
              </a>
              <a href="${base}contact/contact.html" class="desktop-dropdown-item">
                <span class="desktop-dropdown-icon">✉️</span> İletişim
              </a>
            </div>
          </div>
          <a href="https://chat.whatsapp.com/JXzMvjJoc57EKDDABSB0jo" target="_blank" class="desktop-menu-item primary">
            💬 WhatsApp
          </a>
        </div>
      </div>
    </nav>
  `;
  
  // Sayfa yüklendiğinde çalıştır
  function init() {
    // Eğer desktop nav zaten varsa ekleme
    if (document.getElementById('desktopNav')) return;
    
    // Body'nin başına nav ekle
    const body = document.body;
    const navDiv = document.createElement('div');
    navDiv.innerHTML = navHTML;
    body.insertBefore(navDiv.firstElementChild, body.firstChild);
    
    // Mevcut container'ları desktop container'a çevir
    convertContainers();
    
    // Aktif menü öğesini vurgula
    highlightActiveMenu();
  }
  
  // Container'ları dönüştür
  function convertContainers() {
    // .container ve .container1 sınıflarını bul
    const containers = document.querySelectorAll('.container, .container1');
    containers.forEach(container => {
      // Desktop container sınıfı ekle ama mevcut sınıfları koru
      if (!container.classList.contains('desktop-container')) {
        container.style.maxWidth = '1400px';
        container.style.margin = '0 auto';
        container.style.padding = '24px';
      }
    });
  }
  
  // Aktif menü öğesini vurgula
  function highlightActiveMenu() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.desktop-menu-item');
    
    menuItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href && currentPath.includes(href.replace('../', '').replace('./', ''))) {
        item.style.background = 'rgba(255,255,255,0.2)';
        item.style.color = '#fff';
      }
    });
  }
  
  // DOM hazır olduğunda çalıştır
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
