const menuToggle = document.querySelector('.menu-toggle');
const globalNav = document.querySelector('.global-nav');
const yearNode = document.querySelector('#currentYear');
const latestNewsNode = document.querySelector('#news-latest');
const archiveNewsNode = document.querySelector('#news-archive');
const newsErrorNode = document.querySelector('#news-error');
const NEWS_VISIBLE_COUNT = 5;

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (menuToggle && globalNav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    globalNav.classList.toggle('is-open');
  });

  globalNav.querySelectorAll('a').forEach((anchor) => {
    anchor.addEventListener('click', () => {
      globalNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function formatNewsDate(dateString) {
  return dateString.replaceAll('-', '.');
}

function createNewsItem(item) {
  const article = document.createElement('article');
  article.className = 'news-item';

  const time = document.createElement('time');
  time.dateTime = item.date;
  time.textContent = formatNewsDate(item.date);

  const body = document.createElement('p');

  if (item.url) {
    const link = document.createElement('a');
    link.href = item.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = item.title;
    body.appendChild(link);
  } else {
    body.textContent = item.title;
  }

  article.append(time, body);
  return article;
}

function normalizeNewsItems(items) {
  const list = Array.isArray(items) ? items : [];
  return list
    .filter((item) => item && item.date && item.title)
    .sort((a, b) => b.date.localeCompare(a.date));
}

function applyNewsToDom(newsItems) {
  latestNewsNode.textContent = '';
  archiveNewsNode.textContent = '';

  const latest = newsItems.slice(0, NEWS_VISIBLE_COUNT);
  const archive = newsItems.slice(NEWS_VISIBLE_COUNT);

  latest.forEach((item) => latestNewsNode.appendChild(createNewsItem(item)));
  archive.forEach((item) => archiveNewsNode.appendChild(createNewsItem(item)));

  const archiveContainer = document.querySelector('.news-archive');
  if (archiveContainer) {
    archiveContainer.hidden = archive.length === 0;
  }
}

async function renderNews() {
  if (!latestNewsNode || !archiveNewsNode) {
    return;
  }

  try {
    if (Array.isArray(window.CF_INGENIO_NEWS)) {
      applyNewsToDom(normalizeNewsItems(window.CF_INGENIO_NEWS));
      return;
    }

    const response = await fetch('news.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('news.json load failed');
    }

    const data = await response.json();
    applyNewsToDom(normalizeNewsItems(data.news));
  } catch (error) {
    if (newsErrorNode) {
      newsErrorNode.hidden = false;
    }
  }
}

renderNews();

const revealTargets = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && revealTargets.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}
