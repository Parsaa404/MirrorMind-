const textInput = document.getElementById('text-input');
const reflectButton = document.getElementById('reflect-button');
const reflectionContainer = document.getElementById('reflection-container');

reflectButton.addEventListener('click', async () => {
  const text = textInput.value;
  reflectionContainer.innerHTML = '';
  reflectButton.disabled = true;
  reflectButton.textContent = 'Reflecting...';

  try {
    const res = await fetch(`http://localhost:8080/reflect?text=${text}`);
    const data = await res.json();

    if (data.error) {
      reflectionContainer.innerHTML = `<p class="error-text">${data.error}</p>`;
    } else {
      reflectionContainer.innerHTML = `
        <img src="${data.image_url}" alt="Reflection" />
        <p>${data.reflection}</p>
        <p>Detected Emotions: ${JSON.stringify(data.emotion)}</p>
      `;
    }
  } catch (error) {
    console.error(error);
    reflectionContainer.innerHTML = '<p class="error-text">Error fetching data</p>';
  } finally {
    reflectButton.disabled = false;
    reflectButton.textContent = 'Reflect';
  }
});
