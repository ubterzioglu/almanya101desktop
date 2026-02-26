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
      <div class="desktop-nav-inner" style="justify-content: center; position: relative;">
        <a href="${base}index.html" class="desktop-logo" style="position: absolute; left: 24px;">
          <img src="${base}akare.png" alt="almanya101" style="width: 42px; height: 42px; object-fit: contain; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
          <span>almanya101</span>
        </a>
        
        <span style="font-size: 18px; font-weight: 600; color: rgba(255,255,255,0.9);">yalnız değilsin! almanya101 seninle!</span>
        
        <div class="desktop-menu" style="position: absolute; right: 24px;">
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
