// =====================================================
// DOKTORLAR DEMO - Scope isolated version
// =====================================================

(function() {
  'use strict';

  // Supabase Configuration
  const SUPABASE_URL = 'https://ldptefnpiudquipdsezr.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkcHRlZm5waXVkcXVpcGRzZXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNTg5MDYsImV4cCI6MjA4MjYzNDkwNn0.SjeCmVUhEWpPxkGojaGh6qSOwr8EbZx1Tq_ntpvaLnc';

  // Initialize Supabase client (local to this scope)
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // State
  let selectedCity = '';
  let selectedTags = [];
  let allProviders = [];
  let allTags = [];

  // =====================================================
  // INITIALIZATION
  // =====================================================
  document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    loadData();
  });

  // =====================================================
  // INIT FILTERS
  // =====================================================
  function initFilters() {
    // City selector
    const citySelect = document.getElementById('citySelect');
    citySelect.addEventListener('change', (e) => {
      selectedCity = e.target.value;
      filterAndRender();
    });

    // Tag chips
    const tagChips = document.querySelectorAll('.tag-chip');
    tagChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const tag = chip.dataset.tag;
        chip.classList.toggle('selected');

        if (chip.classList.contains('selected')) {
          selectedTags.push(tag);
        } else {
          selectedTags = selectedTags.filter(t => t !== tag);
        }

        filterAndRender();
      });
    });
  }

  // =====================================================
  // LOAD DATA
  // =====================================================
  async function loadData() {
    try {
      console.log('Loading providers from Supabase...');

      // Load providers
      const { data: providers, error: providersError } = await supabase
        .from('providers')
        .select('*')
        .eq('type', 'doctor')
        .eq('status', 'active');

      if (providersError) {
        console.error('Error loading providers:', providersError);
        showError('Doktorlar yüklenirken hata oluştu: ' + providersError.message);
        return;
      }

      console.log('Providers loaded:', providers);
      allProviders = providers || [];

      // Load tags
      const { data: tags, error: tagsError } = await supabase
        .from('tags')
        .select('*')
        .eq('type', 'doctor');

      if (tagsError) {
        console.error('Error loading tags:', tagsError);
      } else {
        allTags = tags || [];
        console.log('Tags loaded:', allTags);
      }

      filterAndRender();

    } catch (error) {
      console.error('Unexpected error:', error);
      showError('Beklenmeyen bir hata oluştu: ' + error.message);
    }
  }

  // =====================================================
  // FILTER AND RENDER
  // =====================================================
  function filterAndRender() {
    let filtered = [...allProviders];

    // Filter by city
    if (selectedCity) {
      filtered = filtered.filter(p => p.city === selectedCity);
    }

    // Filter by tags (if we have tag data)
    // For now, skip tag filtering as we need provider_tags join

    // Render
    renderProviders(filtered);
  }

  // =====================================================
  // RENDER PROVIDERS
  // =====================================================
  function renderProviders(providers) {
    const list = document.getElementById('providersList');
    const count = document.getElementById('resultsCount');

    count.textContent = `${providers.length} sonuç bulundu`;

    if (providers.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div style="font-size: 40px; margin-bottom: 12px;">📭</div>
          <p>Henüz kayıt yok.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = '';
    providers.forEach(provider => {
      const card = createProviderCard(provider);
      list.appendChild(card);
    });
  }

  // =====================================================
  // CREATE PROVIDER CARD
  // =====================================================
  function createProviderCard(provider) {
    const card = document.createElement('div');
    card.className = 'provider-card';

    // Name
    const name = document.createElement('div');
    name.className = 'provider-name';
    name.textContent = provider.display_name;
    card.appendChild(name);

    // Rating (if available)
    if (provider.google_rating) {
      const rating = document.createElement('div');
      rating.className = 'provider-rating';
      rating.innerHTML = `
        ⭐ ${provider.google_rating.toFixed(1)}
        <span style="color: #9CA3AF;">(${provider.google_user_ratings_total || 0})</span>
      `;
      card.appendChild(rating);
    }

    // Address
    if (provider.address || provider.city) {
      const address = document.createElement('div');
      address.className = 'provider-address';
      address.textContent = provider.address || provider.city;
      card.appendChild(address);
    }

    // Phone
    if (provider.phone) {
      const phone = document.createElement('div');
      phone.style.fontSize = '13px';
      phone.style.color = '#374151';
      phone.style.marginTop = '4px';
      phone.innerHTML = `📞 ${provider.phone}`;
      card.appendChild(phone);
    }

    // Website
    if (provider.website) {
      const website = document.createElement('div');
      website.style.fontSize = '13px';
      website.style.color = '#01A1F1';
      website.style.marginTop = '4px';
      website.innerHTML = `🌐 <a href="${provider.website}" target="_blank" style="color: #01A1F1;">${provider.website}</a>`;
      card.appendChild(website);
    }

    // Actions
    if (provider.google_maps_url) {
      const actions = document.createElement('div');
      actions.className = 'provider-actions';

      const mapsBtn = document.createElement('button');
      mapsBtn.className = 'btn-maps';
      mapsBtn.textContent = '📍 Google Maps';
      mapsBtn.onclick = () => window.open(provider.google_maps_url, '_blank');

      actions.appendChild(mapsBtn);
      card.appendChild(actions);
    }

    return card;
  }

  // =====================================================
  // ERROR DISPLAY
  // =====================================================
  function showError(message) {
    const list = document.getElementById('providersList');
    list.innerHTML = `
      <div style="color: #BF0000; text-align: center; padding: 20px;">
        ${message}
      </div>
    `;
  }

})();
