// Dark mode toggle
const darkModeBtn = document.getElementById('darkModeBtn');
darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  darkModeBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

// Contact form handler using Formspree
const form = document.getElementById('contactForm');
const responseText = document.getElementById('formResponse');

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      responseText.textContent = "Thanks! Your message has been sent successfully.";
      form.reset();
    } else {
      responseText.textContent = "Oops! Something went wrong. Please try again.";
    }
  } catch (error) {
    responseText.textContent = "Network error. Please check your connection.";
  }
});