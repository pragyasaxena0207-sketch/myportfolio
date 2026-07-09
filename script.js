// Dark mode toggle
const darkModeBtn = document.getElementById('darkModeBtn');
darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  darkModeBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

// Contact form handler (client-side only, no backend)
const form = document.getElementById('contactForm');
const responseText = document.getElementById('formResponse');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  responseText.textContent = `Thanks, ${name}! Your message has been received (demo only — no backend connected yet).`;
  form.reset();
});