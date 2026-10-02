// Theme switching functionality (light is the default; "dark" is the opt-in)
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');

    const apply = (theme) => {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '🌙';
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.textContent = '☀️';
        }
    };

    apply(localStorage.getItem('theme') || 'light');

    themeToggle.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        apply(next);
    });
}

// Make it globally available
window.initializeTheme = initializeTheme;
