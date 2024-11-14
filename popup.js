document.addEventListener('DOMContentLoaded', () => {
  const onButton = document.getElementById('on-button');
  const offButton = document.getElementById('off-button');
  const fontSizeSelect = document.getElementById('font-size-select');
  const letterSpacingSelect = document.getElementById('letter-spacing-select');
  const boldingSelect = document.getElementById('bolding-select');

  // Load saved settings
  chrome.storage.sync.get(['fontSize', 'letterSpacing', 'boldingSelect'], (data) => {
    if (data.fontSize) fontSizeSelect.value = data.fontSize;
    if (data.letterSpacing) letterSpacingSelect.value = data.letterSpacing;
    if (data.boldingSelect) boldingSelect.value = data.boldingSelect;
  });

  function applyChanges() {
    const enabled = onButton.style.fontWeight === 'bold'; // if it works, it works
    const fontSize = fontSizeSelect.value;
    const letterSpacing = letterSpacingSelect.value;
    const bolding = boldingSelect.value;

    chrome.storage.sync.set({ enabled, fontSize, letterSpacing, bolding }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['script.js'],
        });
      });
    });
  }

  // Event listeners
  onButton.addEventListener('click', () => {
    onButton.style.backgroundColor = '#999';
    onButton.style.fontWeight = 'bold';
    offButton.style.backgroundColor = 'white';
    offButton.style.fontWeight = 'normal';
    applyChanges();
  });
  offButton.addEventListener('click', () => {
    onButton.style.backgroundColor = 'white';
    onButton.style.fontWeight = 'normal';
    offButton.style.backgroundColor = '#999';
    offButton.style.fontWeight = 'bold';
    applyChanges();
  });
  fontSizeSelect.addEventListener('change', applyChanges);
  letterSpacingSelect.addEventListener('change', applyChanges);
  boldingSelect.addEventListener('change', applyChanges);
});
