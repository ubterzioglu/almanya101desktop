/**
 * ALMANYA101 DESKTOP NAVIGATION INJECTOR
 * - Tüm sayfalara desktop navigasyonu ekler
 * - Sağdan açılan drawer menü içerir
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
            
            <!-- Header Menu Button - triggers drawer -->
            <button id="menuDrawerBtn" style="display: flex !important; align-items: center !important; justify-content: center !important; gap: 8px !important; padding: 10px 16px !important; cursor: pointer !important; font-size: 14px !important; font-weight: 600 !important; color: #000 !important; background: #FFBB00 !important; border: none !important; border-radius: 12px !important; width: 100% !important; user-select: none !important; transition: all 0.2s ease !important;">
              <span>📋 Menü</span>
            </button>
          </div>
      </div>
    </nav>
  `;
  
  // Drawer HTML
  const drawerHTML = `
    <!-- Drawer Overlay -->
    <div id="drawerOverlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 1999; opacity: 0; visibility: hidden; transition: all 0.3s ease;"></div>
    
    <!-- Right Drawer -->
    <div id="rightDrawer" style="position: fixed; top: 0; right: 0; width: 320px; max-width: 85vw; height: 100vh; background: #1a1a1a; border-left: 1px solid rgba(255,255,255,0.1); z-index: 2000; transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column;">
      <!-- Drawer Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <span style="font-size: 18px; font-weight: 700; color: #FFBB00;">📋 Menü</span>
        <button id="closeDrawerBtn" style="background: none; border: none; color: rgba(255,255,255,0.7); font-size: 24px; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; transition: color 0.2s ease;">✕</button>
      </div>
      
      <!-- Drawer Content -->
      <div style="flex: 1; overflow-y: auto; padding: 16px;">
        <a href="${base}maas/maas.html" class="drawer-item" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.9); text-decoration: none; transition: all 0.15s ease; margin-bottom: 4px;">
          <span style="font-size: 20px;">💸</span> Maaş
        </a>
        <a href="${base}vatandas/v.html" class="drawer-item" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.9); text-decoration: none; transition: all 0.15s ease; margin-bottom: 4px;">
          <span style="font-size: 20px;">📝</span> Vatandaşlık
        </a>
        <a href="${base}banka/banka.html" class="drawer-item" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.9); text-decoration: none; transition: all 0.15s ease; margin-bottom: 4px;">
          <span style="font-size: 20px;">💳</span> Banka
        </a>
        <a href="${base}sigorta/sigorta.html" class="drawer-item" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.9); text-decoration: none; transition: all 0.15s ease; margin-bottom: 4px;">
          <span style="font-size: 20px;">🛡️</span> Sigorta
        </a>
        <a href="${base}rehber/ua.html" class="drawer-item" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.9); text-decoration: none; transition: all 0.15s ease; margin-bottom: 4px;">
          <span style="font-size: 20px;">👨‍⚕️</span> Uzman
        </a>
        <a href="${base}paratransfer/pt.html" class="drawer-item" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.9); text-decoration: none; transition: all 0.15s ease; margin-bottom: 4px;">
          <span style="font-size: 20px;">🔁</span> Para Transfer
        </a>
        <a href="${base}article/article.html" class="drawer-item" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.9); text-decoration: none; transition: all 0.15s ease; margin-bottom: 4px;">
          <span style="font-size: 20px;">📖</span> Yazılar
        </a>
        <a href="${base}tatiltr/tatiltr.html" class="drawer-item" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.9); text-decoration: none; transition: all 0.15s ease; margin-bottom: 4px;">
          <span style="font-size: 20px;">✈️</span> TR Tatil
        </a>
        <a href="${base}tatilde/tatilde.html" class="drawer-item" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.9); text-decoration: none; transition: all 0.15s ease; margin-bottom: 4px;">
          <span style="font-size: 20px;">🏖️</span> DE Tatil
        </a>
        <a href="${base}join/join.html" class="drawer-item" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.9); text-decoration: none; transition: all 0.15s ease; margin-bottom: 4px;">
          <span style="font-size: 20px;">👋</span> Katıl
        </a>
        <a href="${base}bizkimiz/bizkimiz.html" class="drawer-item" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.9); text-decoration: none; transition: all 0.15s ease; margin-bottom: 4px;">
          <span style="font-size: 20px;">🧑‍💻</span> Ekip
        </a>
        <a href="${base}contact/contact.html" class="drawer-item" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.9); text-decoration: none; transition: all 0.15s ease; margin-bottom: 4px;">
          <span style="font-size: 20px;">✉️</span> İletişim
        </a>
      </div>
    </div>
    
    <!-- Drawer Styles -->
    <style>
      .drawer-item:hover {
        background: rgba(255,255,255,0.1) !important;
        color: #fff !important;
        transform: translateX(4px);
      }
      #closeDrawerBtn:hover {
        color: #fff !important;
      }
      #rightDrawer.open {
        transform: translateX(0) !important;
      }
      #drawerOverlay.open {
        opacity: 1 !important;
        visibility: visible !important;
      }
      body.drawer-open {
        overflow: hidden;
      }
    </style>
  `;
  
  // Drawer Script
  function initDrawer() {
    const menuBtn = document.getElementById('menuDrawerBtn');
    const closeBtn = document.getElementById('closeDrawerBtn');
    const drawer = document.getElementById('rightDrawer');
    const overlay = document.getElementById('drawerOverlay');
    
    if (!menuBtn || !drawer) return;
    
    function openDrawer() {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.classList.add('drawer-open');
    }
    
    function closeDrawer() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.classList.remove('drawer-open');
    }
    
    menuBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);
    
    // ESC tuşu ile kapat
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeDrawer();
    });
  }
  
  // Sayfa yüklendiğinde çalıştır
  function init() {
    // Eğer desktop nav zaten varsa ekleme
    if (document.getElementById('desktopNav')) return;
    
    const body = document.body;
    
    // Body'nin başına nav ekle
    const navDiv = document.createElement('div');
    navDiv.innerHTML = navHTML;
    body.insertBefore(navDiv.firstElementChild, body.firstChild);
    
    // Body'nin sonuna drawer ekle
    const drawerDiv = document.createElement('div');
    drawerDiv.innerHTML = drawerHTML;
    body.appendChild(drawerDiv);
    
    // Drawer'ı başlat
    initDrawer();
    
    // Mevcut container'ları desktop container'a çevir
    convertContainers();
    
    // Aktif menü öğesini vurgula
    highlightActiveMenu();
  }
  
  // Container'ları dönüştür
  function convertContainers() {
    const containers = document.querySelectorAll('.container, .container1');
    containers.forEach(container => {
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
