/**
 * PORTFOLIO CLIENT LOGIC
 * ======================
 * Minimalist rendering, filtering, and copy-email handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  initExperience();
  initProjects();
  initCopyEmail();
});

let activeCategory = 'all';
let searchKeyword = '';

function initProjects() {
  renderProjects();

  // Category Tabs
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.getAttribute('data-category');
      renderProjects();
    });
  });

  // Search input
  const searchInput = document.getElementById('projectSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchKeyword = e.target.value.toLowerCase().trim();
      renderProjects();
    });
  }
}

function renderProjects() {
  const container = document.getElementById('projectsContainer');
  const countBadge = document.getElementById('projectCount');
  if (!container || !window.portfolioProjects) return;

  const filtered = window.portfolioProjects.filter(project => {
    const matchesCategory = activeCategory === 'all' || project.category === activeCategory;
    if (!matchesCategory) return false;

    if (!searchKeyword) return true;

    const inTitle = project.title.toLowerCase().includes(searchKeyword);
    const inSummary = project.summary.toLowerCase().includes(searchKeyword);
    const inTags = project.tags.some(tag => tag.toLowerCase().includes(searchKeyword));
    const inBadge = project.badge.toLowerCase().includes(searchKeyword);

    return inTitle || inSummary || inTags || inBadge;
  });

  if (countBadge) {
    countBadge.textContent = `${filtered.length} project${filtered.length === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="padding: 2.5rem 1rem; text-align: center; color: var(--text-muted); font-size: 0.9rem; border: 1px dashed var(--border); border-radius: var(--radius-md);">
        No matching projects found.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(project => {
    const tagsHtml = project.tags.map(t => `<span class="tech-chip">${escapeHtml(t)}</span>`).join('');
    const highlightsHtml = project.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('');

    return `
      <article class="project-row-card">
        <div class="project-card-top">
          <div class="project-name-group">
            <h3 class="project-name">${escapeHtml(project.title)}</h3>
            <span class="project-category-badge">${escapeHtml(project.badge)} &bull; ${escapeHtml(project.year)}</span>
          </div>

          <div class="project-links-group">
            ${project.githubUrl && project.githubUrl !== '#' ? `
              <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-ext-link">
                <span>Source</span>
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            ` : ''}
            ${project.demoUrl && project.demoUrl !== '#' ? `
              <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="project-ext-link">
                <span>Demo</span>
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            ` : ''}
          </div>
        </div>

        <p class="project-summary">${escapeHtml(project.summary)}</p>

        <ul class="project-highlights-minimal">
          ${highlightsHtml}
        </ul>

        <div class="project-tags-row">
          ${tagsHtml}
        </div>
      </article>
    `;
  }).join('');
}

function initExperience() {
  const container = document.getElementById('experienceContainer');
  if (!container || !window.personalConfig?.experience) return;

  const items = window.personalConfig.experience;
  container.innerHTML = items.map(item => `
    <div class="experience-item">
      <div class="experience-period">${escapeHtml(item.period)}</div>
      <div class="experience-detail">
        <h4>${escapeHtml(item.role)}</h4>
        <div class="role-place">${escapeHtml(item.organization)}</div>
        <p>${escapeHtml(item.description)}</p>
      </div>
    </div>
  `).join('');
}

function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const email = window.personalConfig?.email || 'joonkang.dev@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast(`Copied ${email} to clipboard`);
    }).catch(() => {
      showToast(`Email: ${email}`);
    });
  });
}

function showToast(msg) {
  const toast = document.getElementById('toastNotice');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
