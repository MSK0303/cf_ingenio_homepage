const menuToggle = document.querySelector('.menu-toggle');
const globalNav = document.querySelector('.global-nav');
const yearNode = document.querySelector('#currentYear');
const latestNewsNode = document.querySelector('#news-latest');
const archiveNewsNode = document.querySelector('#news-archive');
const staffListNode = document.querySelector('#staff-list');
const contactFormNode = document.querySelector('.contact-form');
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

function createStaffCard(staff) {
  const article = document.createElement('article');
  article.className = 'staff-card';

  const media = document.createElement('div');
  media.className = 'staff-media';

  if (staff.image) {
    const image = document.createElement('img');
    image.src = staff.image;
    image.alt = `${staff.name} の写真`;
    media.appendChild(image);
  } else {
    const fallback = document.createElement('div');
    fallback.className = 'staff-photo-fallback';
    fallback.textContent = 'PHOTO SOON';
    media.appendChild(fallback);
  }

  const name = document.createElement('h3');
  name.className = 'staff-name';
  name.textContent = staff.name;

  const role = document.createElement('p');
  role.className = 'staff-role';
  role.textContent = staff.role;

  const careerTitle = document.createElement('p');
  careerTitle.className = 'staff-label';
  careerTitle.textContent = '指導歴 / Experiencia como entrenador';

  const careerList = document.createElement('ul');
  careerList.className = 'staff-list';
  (staff.career || []).forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    careerList.appendChild(li);
  });

  const licenseTitle = document.createElement('p');
  licenseTitle.className = 'staff-label';
  licenseTitle.textContent = '資格 / Licencias';

  const licenseList = document.createElement('ul');
  licenseList.className = 'staff-list';
  (staff.licenses || []).forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    licenseList.appendChild(li);
  });

  article.append(
    media,
    name,
    role,
    careerTitle,
    careerList,
    licenseTitle,
    licenseList
  );

  return article;
}

function renderStaff() {
  if (!staffListNode) {
    return;
  }

  const staffData = Array.isArray(window.CF_INGENIO_STAFF)
    ? window.CF_INGENIO_STAFF
    : [];

  staffListNode.textContent = '';
  staffData.forEach((staff) => staffListNode.appendChild(createStaffCard(staff)));
}

function setupContactForm() {
  if (!contactFormNode) {
    return;
  }

  contactFormNode.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = contactFormNode.querySelector('button[type="submit"]');
    const originalLabel = submitButton ? submitButton.textContent : '';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = '送信中...';
    }

    try {
      const response = await fetch(contactFormNode.action, {
        method: 'POST',
        body: new FormData(contactFormNode),
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('failed to submit form');
      }

      window.location.href = 'thankyou.html';
    } catch (error) {
      window.alert('送信に失敗しました。時間をおいて再度お試しください。');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel;
      }
    }
  });
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
    latestNewsNode.textContent = '';
  }
}

renderNews();
renderStaff();
setupContactForm();

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
