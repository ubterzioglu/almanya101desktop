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
      <div class="desktop-nav-inner" style="flex-direction: column !important; height: auto !important; padding: 16px 24px !important; max-width: 1400px !important; margin: 0 auto !important; display: flex !important; justify-content: space-between !important;">
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; position: relative;">
          <a href="${base}index.html" class="desktop-logo">
            <img src="${base}akare.png" alt="almanya101" style="width: 42px; height: 42px; object-fit: contain; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
            <span>almanya101</span>
          </a>
          
          <span style="font-size: 27px; font-weight: 600; color: rgba(255,255,255,0.9);">yalnız değilsin! almanya101 seninle!</span>
          
          <div class="desktop-menu" style="flex-direction: column !important; align-items: flex-end !important; gap: 8px !important; display: flex !important;">
            <a href="https://chat.whatsapp.com/JXzMvjJoc57EKDDABSB0jo" target="_blank" class="desktop-menu-item primary" style="background: #25D366 !important; color: #000 !important; font-weight: 700; padding: 10px 20px; border-radius: 10px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(37,211,102,0.4); font-size: 15px;">
              💬 WhatsApp
            </a>
            
            <!-- Header Menu Dropdown -->
            <details class="header-menu-dropdown">
              <summary id="desktopMenuBtn" class="header-menu-dropdown-btn" style="display: flex !important; align-items: center !important; justify-content: center !important; gap: 8px !important; padding: 10px 16px !important; cursor: pointer !important; list-style: none !important; font-size: 14px !important; font-weight: 600 !important; color: #000 !important; background: #FFBB00 !important; border-radius: 12px !important; width: 100% !important; user-select: none !important; transition: all 0.2s ease !important;">
                <span>📋 Menü</span>
                <span class="header-menu-arrow" style="font-size: 12px !important; transition: transform 0.2s ease !important;">▼</span>
              </summary>
              <div class="header-menu-dropdown-content">
                <a href="${base}maas/maas.html" class="header-menu-dropdown-item">💸 Maaş</a>
                <a href="${base}vatandas/v.html" class="header-menu-dropdown-item">📝 Vatandaşlık</a>
                <a href="${base}banka/banka.html" class="header-menu-dropdown-item">💳 Banka</a>
                <a href="${base}sigorta/sigorta.html" class="header-menu-dropdown-item">🛡️ Sigorta</a>
                <a href="${base}rehber/ua.html" class="header-menu-dropdown-item">👨‍⚕️ Uzman</a>
                <a href="${base}paratransfer/pt.html" class="header-menu-dropdown-item">🔁 Para Transfer</a>
                <a href="${base}article/article.html" class="header-menu-dropdown-item">📖 Yazılar</a>
                <a href="${base}tatiltr/tatiltr.html" class="header-menu-dropdown-item">✈️ TR Tatil</a>
                <a href="${base}tatilde/tatilde.html" class="header-menu-dropdown-item">🏖️ DE Tatil</a>
                <a href="${base}join/join.html" class="header-menu-dropdown-item">👋 Katıl</a>
                <a href="${base}bizkimiz/bizkimiz.html" class="header-menu-dropdown-item">🧑‍💻 Ekip</a>
                <a href="${base}contact/contact.html" class="header-menu-dropdown-item">✉️ İletişim</a>
              </div>
            </details>
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
