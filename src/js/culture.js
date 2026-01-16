document.addEventListener('DOMContentLoaded', async () => {
  const get = (id) => document.getElementById(id);
  const q = (sel) => document.querySelector(sel);
  const qa = (sel) => document.querySelectorAll(sel);

  let dishData = {},
    restaurantData = {},
    allDishes = [],
    filtered = [];
  let page = 0;
  const LIMIT = 6;

  try {
    const [h, f, c] = await Promise.all([
      fetch('/partials/header.html'),
      fetch('/partials/footer.html'),
      fetch('/data/culture-data.json'),
    ]);
    if (h.ok) get('header-placeholder').innerHTML = await h.text();
    if (f.ok) get('footer-placeholder').innerHTML = await f.text();
    if (c.ok) {
      const d = await c.json();
      dishData = d.dishes;
      restaurantData = d.restaurants;
      allDishes = Object.entries(dishData).map(([id, val]) => ({ id, ...val }));
      filtered = [...allDishes];
    }

    const nav = q('.hamburger');
    if (nav) nav.onclick = () => q('.nav-links').classList.toggle('active');

    const heroData = [
      {
        t: 'The Iconic Breakfast',
        h: 'Masala Dosa',
        d: 'A crispy, golden fermented crepe filled with spiced potatoes.',
      },
      {
        t: 'The Spicy Comfort',
        h: 'Bisi Bele Bath',
        d: "A wholesome 'hot lentil rice' dish with vegetables and spices.",
      },
      {
        t: 'The Royal Feast',
        h: 'Biryani',
        d: 'Fragrant rice layered with spiced meat or vegetables.',
      },
      {
        t: 'The Rural Roots',
        h: 'Ragi Mudde',
        d: 'Nutritious finger millet balls paired with spicy curries.',
      },
      {
        t: 'The Perfect Duo',
        h: 'Idli Vada',
        d: 'Soft steamed rice cakes paired with crispy lentil donuts.',
      },
      {
        t: 'The Soul',
        h: 'Filter Coffee',
        d: 'Strong, aromatic coffee brewed in traditional filters.',
      },
    ];

    const slides = qa('.carousel-item');
    const [tag, tit, desc] = [
      q('.hero-tagline'),
      q('.culture-hero-text h1'),
      q('.culture-hero-text p'),
    ];
    let curIdx = 0;

    const showSlide = (i) => {
      const active = q('.carousel-item.active');
      if (active) {
        active.classList.replace('active', 'slide-out');
      }
      slides[i].classList.remove('slide-out');
      slides[i].classList.add('active');

      [tag, tit, desc].forEach((el) => {
        el.style.opacity = 0;
        el.style.transform = 'translateX(-50px)';
      });
      setTimeout(() => {
        const item = heroData[i];
        tag.textContent = item.t;
        tit.textContent = item.h;
        desc.textContent = item.d;
        [tag, tit, desc].forEach((el, idx) => {
          el.style.transition = 'none';
          el.style.transform = 'translateX(50px)';
          void el.offsetHeight;
          el.style.transition = `all 0.6s ease-out ${idx * 0.1}s`;
          el.style.opacity = 1;
          el.style.transform = 'translateX(0)';
        });
      }, 500);
      curIdx = i;
    };

    setInterval(() => showSlide((curIdx + 1) % slides.length), 4000);

    const updateUI = () => {
      const grid = q('.dishes-grid');
      const start = page * LIMIT;
      const slice = filtered.slice(start, start + LIMIT);

      grid.innerHTML = slice.length
        ? slice
            .map(
              (d) => `
        <article class="dish-card" id="${d.id}">
          <a href="/pages/restaurant.html?id=${d.id}" class="dish-image-link">
            <div class="dish-image"><img src="${d.image || 'https://via.placeholder.com/400x300'}" alt="${d.name}" loading="lazy"></div>
          </a>
          <div class="dish-content">
            <h3>${d.name}</h3>
            <p>${d.description}</p>
            <div class="famous-restaurants">
              <h4>Iconic places to try</h4>
              <ul class="restaurant-list">
                ${d.restaurants
                  .map((rId) => {
                    const r = restaurantData[rId];
                    return r
                      ? `<li class="restaurant-item"><div class="restaurant-header">
                    <span class="restaurant-name">${r.name}</span>
                    ${r.location && r.location !== '#' ? `<a href="${r.location}" target="_blank" class="location-icon"><i class="fas fa-map-marker-alt"></i></a>` : ''}
                    <a href="/pages/restaurant.html?id=${d.id}#${r.id}" class="place-link"><i class="fas fa-chevron-right"></i></a>
                  </div></li>`
                      : '';
                  })
                  .join('')}
              </ul>
            </div>
          </div>
        </article>`
            )
            .join('')
        : '<p style="grid-column: 1/-1; text-align: center;">No dishes found.</p>';

      const total = Math.ceil(filtered.length / LIMIT);
      if (q('.prev-btn')) q('.prev-btn').disabled = page === 0;
      if (q('.next-btn')) q('.next-btn').disabled = page >= total - 1;

      const dots = q('.page-dots');
      if (dots) {
        dots.innerHTML =
          total > 1
            ? Array.from(
                { length: total },
                (_, i) =>
                  `<div class="dot ${i === page ? 'active' : ''}" data-idx="${i}"></div>`
              ).join('')
            : '';
        qa('.dot').forEach(
          (d) =>
            (d.onclick = () => {
              page = +d.dataset.idx;
              updateUI();
            })
        );
      }
    };

    q('.prev-btn')?.addEventListener('click', () => {
      if (page > 0) {
        page--;
        updateUI();
      }
    });
    q('.next-btn')?.addEventListener('click', () => {
      if (page < Math.ceil(filtered.length / LIMIT) - 1) {
        page++;
        updateUI();
      }
    });

    slides.forEach(
      (s) =>
        (s.onclick = () => {
          const id = s.dataset.dish;
          const idx = filtered.findIndex((d) => d.id === id);
          if (idx !== -1) {
            page = Math.floor(idx / LIMIT);
            updateUI();
            setTimeout(() => {
              const el = get(id);
              if (el) {
                qa('.dish-card').forEach((c) => c.classList.remove('active'));
                el.classList.add('active');
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => el.classList.remove('active'), 3000);
              }
            }, 150);
          }
        })
    );

    get('dish-search')?.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      filtered = allDishes.filter(
        (d) =>
          d.name.toLowerCase().includes(term) ||
          d.description.toLowerCase().includes(term) ||
          d.restaurants.some((rId) =>
            (restaurantData[rId]?.name || '').toLowerCase().includes(term)
          )
      );
      page = 0;
      updateUI();
    });

    if (c.ok) updateUI();
  } catch (e) {
    console.error('Error:', e);
  }
});
