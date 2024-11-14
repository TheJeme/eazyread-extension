(function() {
  // Fetch settings from chrome.storage
  chrome.storage.sync.get(['enabled', 'fontSize', 'letterSpacing', 'bolding'], (data) => {
    document.body.innerHTML=document.body.innerHTML.replace(/\u00AD/g, ''); // Remove soft hyphens
    const enabled = data.enabled;
    const fontSizeScale = parseInt(data.fontSize) || 5;
    const letterSpacingScale = parseInt(data.letterSpacing) || 5;
    const bolding = data.bolding === "enabled";
    
    resetEazyRead();

    if (!enabled) {
      return;
    }

    // Map scales from 1-10 to CSS values
    const fontSize = 14 + (fontSizeScale - 1) * 1.6;
    const letterSpacing = (letterSpacingScale - 1) * 0.2;

    function processTextNode(node) {
      const parent = node.parentNode;

      if (parent.classList?.contains('ez-processed')) {
        return;
      }

      let text = node.nodeValue;
      if (text.trim().length > 0) {
        const words = text.split(/\b/);
        const fragment = document.createDocumentFragment();

        words.forEach((word) => {
          if (/\w/.test(word)) {
            const boldCharCount = bolding ? Math.ceil(word.length / 3) : 0;
            const span = document.createElement('span');
            span.classList.add('ez-processed');

            span.style.fontSize = `${fontSize}px`;
            span.style.letterSpacing = `${letterSpacing}px`;
            span.style.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';

            if (boldCharCount > 0) {
              const boldPart = document.createElement('b');
              boldPart.textContent = word.slice(0, boldCharCount);
              span.appendChild(boldPart);
              span.appendChild(document.createTextNode(word.slice(boldCharCount)));
            } else {
              span.textContent = word;
            }
            fragment.appendChild(span);
          } else {
            fragment.appendChild(document.createTextNode(word));
          }
        });

        parent.replaceChild(fragment, node);
      }
    }

    function traverse(node) {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        !['SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA'].includes(node.nodeName) &&
        node.contentEditable !== 'true'
      ) {
        const childNodes = Array.from(node.childNodes);
        childNodes.forEach((child) => {
          if (child.nodeType === Node.TEXT_NODE) {
            processTextNode(child);
          } else {
            traverse(child);
          }
        });
      }
    }

    function resetEazyRead() {
      const processedElements = document.querySelectorAll('.ez-processed');
      processedElements.forEach((el) => {
        const parent = el.parentNode;
        const textNode = document.createTextNode(el.innerText || el.textContent);
        parent.replaceChild(textNode, el);
      });
    }

    traverse(document.body);
  });
})();
