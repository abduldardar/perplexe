document.addEventListener('DOMContentLoaded', () => {
  const datetimeElem = document.getElementById('datetime');
  const themeToggle = document.getElementById('theme-toggle');
  const articlesContainer = document.getElementById('articles-container');

  // Affiche la date et l'heure en temps réel, format français
  function updateDateTime() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
    datetimeElem.textContent = `${dateStr} ${timeStr}`;
  }
  updateDateTime();
  setInterval(updateDateTime, 60000);

  // Gestion du mode clair/sombre avec sauvegarde en localStorage
  function setTheme(theme) {
    if(theme === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }

  // Toggle thème au clic
  themeToggle.onclick = () => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  // Appliqie le thème enregistré ou clair par défaut
  setTheme(localStorage.getItem('theme') || 'light');

  // Charge et affiche les articles depuis data/articles.json
  async function loadArticles() {
    try {
      const response = await fetch('data/articles.json', {cache: "no-store"});
      if(!response.ok) throw new Error('Impossible de charger les articles');
      const data = await response.json();

      // Trie par date décroissante
      const sortedArticles = data.articles.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Limite à 10 articles maxi pour accueil
      const articlesToShow = sortedArticles.slice(0, 10);

      // Vide le container
      articlesContainer.innerHTML = '';

      // Fonction pour créer un article
      function createArticleElement(article) {
        const articleEl = document.createElement('article');
        articleEl.classList.add('article');

        // Image
        const img = document.createElement('img');
        img.src = article.url_image || 'assets/default-hightech.jpg';
        img.alt = article.titre;
        img.onerror = () => img.src = 'assets/default-robot.jpg';

        // Contenu texte
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('article-content');

        const titleLink = document.createElement('a');
        titleLink.href = article.lien_source;
        titleLink.textContent = article.titre;
        titleLink.className = 'article-title';
        titleLink.target = '_blank';
        titleLink.rel = 'noopener noreferrer';

        const summary = document.createElement('p');
        summary.className = 'article-summary';
        summary.textContent = article.resume;

        const sourceLink = document.createElement('a');
        sourceLink.href = article.lien_source;
        sourceLink.textContent = 'Source vérifiée';
        sourceLink.className = 'source-link';
        sourceLink.target = '_blank';
        sourceLink.rel = 'noopener noreferrer';

        contentDiv.appendChild(titleLink);
        contentDiv.appendChild(summary);
        contentDiv.appendChild(sourceLink);

        // Encadré date latéral
        const dateEncart = document.createElement('div');
        dateEncart.className = 'article-date-encart';
        const dateObj = new Date(article.date);
        dateEncart.textContent = dateObj.toLocaleDateString('fr-FR', {year: 'numeric', month: 'short', day: 'numeric'});

        articleEl.appendChild(dateEncart);
        articleEl.appendChild(img);
        articleEl.appendChild(contentDiv);

        return articleEl;
      }

      articlesToShow.forEach(article => {
        const articleElement = createArticleElement(article);
        articlesContainer.appendChild(articleElement);
      });
    } catch(e) {
      articlesContainer.innerHTML = '<p>Erreur lors du chargement des articles.</p>';
      console.error(e);
    }
  }

  loadArticles();
});
