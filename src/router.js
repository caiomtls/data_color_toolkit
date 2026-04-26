/**
 * Router — Hash-based SPA router
 */

let routes = {};
let currentRoute = null;

export function registerRoutes(routeMap) {
  routes = routeMap;
}

export function navigate(path) {
  window.location.hash = path;
}

export function getCurrentRoute() {
  return currentRoute;
}

export function startRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const [path, queryString] = hash.split('?');
  const params = Object.fromEntries(new URLSearchParams(queryString || ''));

  currentRoute = path;

  const main = document.getElementById('app-main');
  if (!main) return;

  // Find matching route
  const handler = routes[path] || routes['*'];
  if (handler) {
    // Add page transition
    main.style.animation = 'none';
    main.offsetHeight; // Force reflow
    main.style.animation = 'fadeIn 0.3s ease';

    handler(main, params);
  }

  // Update active nav links
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href')?.replace('#', '');
    if (href === path || (path.startsWith(href) && href !== '/')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
