(function() {
    // DOM elements
    const htmlEditor = document.getElementById('htmlCode');
    const cssEditor = document.getElementById('cssCode');
    const jsEditor = document.getElementById('jsCode');
    const outputFrame = document.getElementById('outputFrame');
    const runBtn = document.getElementById('runBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const themeSwitcher = document.getElementById('themeSwitcher');

    // Helper: show floating message
    function showToast(msg, duration = 1800) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, duration);
    }

    // Core render engine: combine code and inject into iframe
    function renderCode() {
        const htmlCode = htmlEditor.value;
        const cssCode = cssEditor.value;
        const jsCode = jsEditor.value;

        // Build final document with proper error catching & graceful console
        const fullDoc = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    /* Reset inside iframe for cleaner look */
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        background: #ffffff;
                        font-family: system-ui, 'Segoe UI', 'Inter', sans-serif;
                        padding: 1.5rem;
                        transition: all 0.2s;
                    }
                    /* user custom CSS */
                    ${cssCode}
                </style>
            </head>
            <body>
                ${htmlCode}
                <script>
                    // Capture uncaught errors & log in console mirror
                    window.addEventListener('error', (e) => {
                        console.warn('[Live Preview Error]:', e.message);
                    });
                    // User JS code execution with safety
                    try {
                        ${jsCode}
                    } catch(err) {
                        console.error('JavaScript Runtime Error:', err);
                        const errorDiv = document.createElement('div');
                        errorDiv.style.position = 'fixed';
                        errorDiv.style.bottom = '10px';
                        errorDiv.style.left = '10px';
                        errorDiv.style.backgroundColor = '#fee2e2';
                        errorDiv.style.color = '#b91c1c';
                        errorDiv.style.padding = '6px 12px';
                        errorDiv.style.borderRadius = '8px';
                        errorDiv.style.fontSize = '12px';
                        errorDiv.style.fontFamily = 'monospace';
                        errorDiv.style.zIndex = '9999';
                        errorDiv.innerText = '⚠️ JS Error: ' + err.message;
                        document.body.appendChild(errorDiv);
                        setTimeout(() => errorDiv.remove(), 4000);
                    }
                <\/script>
            </body>
            </html>
        `;
        // Using srcdoc for dynamic rendering
        outputFrame.srcdoc = fullDoc;
    }

    // Auto-run on page load with demo code (impressive starter)
    function initializeDemoCode() {
        htmlEditor.value = `<div class="hero-card">
    <div class="icon"><i class="fas fa-meteor"></i></div>
    <h1>Interactive Playground 🚀</h1>
    <p>Write HTML, CSS & JS — see magic happen in real-time.</p>
    <button id="clickMeBtn" class="glow-btn">✨ Click Me ✨</button>
    <div id="counterDisplay" class="counter">0 clicks</div>
</div>`;

        cssEditor.value = `body {
    background: linear-gradient(145deg, #f9fafb 0%, #f1f5f9 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 90vh;
    font-family: 'Inter', sans-serif;
}
.hero-card {
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(12px);
    border-radius: 2rem;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 25px 45px -12px rgba(0,0,0,0.25);
    max-width: 450px;
    width: 100%;
    border: 1px solid rgba(255,255,255,0.4);
    transition: transform 0.2s;
}
.hero-card:hover {
    transform: scale(1.01);
}
.icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}
h1 {
    font-size: 1.8rem;
    background: linear-gradient(135deg, #2563eb, #8b5cf6);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin-bottom: 0.5rem;
}
.glow-btn {
    background: #3b82f6;
    border: none;
    padding: 10px 20px;
    margin-top: 1.2rem;
    border-radius: 40px;
    font-weight: bold;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(59,130,246,0.4);
}
.glow-btn:hover {
    background: #2563eb;
    transform: translateY(-2px);
}
.counter {
    margin-top: 1rem;
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
}`;

        jsEditor.value = `// Interactive demo: button counter
let clickCount = 0;
const btn = document.getElementById('clickMeBtn');
const counterDiv = document.getElementById('counterDisplay');

if(btn) {
    btn.addEventListener('click', () => {
        clickCount++;
        counterDiv.innerText = \`✨ \${clickCount} clicks ✨\`;
        if(clickCount === 5) {
            counterDiv.style.color = '#f59e0b';
        } else if(clickCount === 10) {
            counterDiv.innerText = '🎉 10 clicks! You rock! 🎉';
        }
    });
}
console.log('✅ JavaScript is live — interactive demo ready!');`;
    }

    // Download current build as an HTML file (full standalone)
    function downloadProject() {
        const htmlCode = htmlEditor.value;
        const cssCode = cssEditor.value;
        const jsCode = jsEditor.value;

        const standaloneHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Nexus Code</title>
    <style>
        /* === User CSS === */
        ${cssCode}
    </style>
</head>
<body>
    ${htmlCode}
    <script>
        // === User JavaScript ===
        ${jsCode}
    <\/script>
</body>
</html>`;
        const blob = new Blob([standaloneHtml], { type: 'text/html' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = 'nexus_playground.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('📁 Downloaded as standalone HTML!');
    }

    // Copy all code (HTML+CSS+JS) to clipboard as a formatted string
    async function copyAllCode() {
        const html = htmlEditor.value;
        const css = cssEditor.value;
        const js = jsEditor.value;
        const fullSnippet = `<!-- HTML -->\n${html}\n\n/* CSS */\n${css}\n\n// JavaScript\n${js}`;
        try {
            await navigator.clipboard.writeText(fullSnippet);
            showToast('📋 Full code copied to clipboard!');
        } catch (err) {
            showToast('⚠️ Could not copy manually');
        }
    }

    // Reset editors to fresh start (but keep nice empty placeholders)
    function resetEditors() {
        htmlEditor.value = `<!-- Start building your masterpiece -->\n<div class="container">\n  <h2>✨ New Project</h2>\n  <p>Write something creative...</p>\n</div>`;
        cssEditor.value = `/* fresh styles */\n.container {\n  text-align: center;\n  padding: 2rem;\n  background: #fef9e3;\n  border-radius: 24px;\n}`;
        jsEditor.value = `// interactive magic\ndocument.querySelector('h2')?.addEventListener('click', () => {\n  alert('Code on! ✨');\n});`;
        renderCode();
        showToast('🧹 Editors reset to starter template');
    }

    // Dark/Light mode toggle with dynamic icons
    let isDark = true;
    function toggleTheme() {
        const body = document.body;
        if (isDark) {
            body.classList.add('light-mode');
            themeSwitcher.innerHTML = '<i class="fas fa-sun"></i> <span>Light</span>';
            isDark = false;
        } else {
            body.classList.remove('light-mode');
            themeSwitcher.innerHTML = '<i class="fas fa-moon"></i> <span>Dark</span>';
            isDark = true;
        }
        showToast(isDark ? '🌙 Dark mode active' : '☀️ Light mode active');
    }

    // Smart live update with debounce
    let autoRunTimer;
    function autoRunDebounced() {
        if (autoRunTimer) clearTimeout(autoRunTimer);
        autoRunTimer = setTimeout(() => {
            renderCode();
        }, 350);
    }

    // Attach event listeners to editors for live preview (auto-run)
    htmlEditor.addEventListener('input', autoRunDebounced);
    cssEditor.addEventListener('input', autoRunDebounced);
    jsEditor.addEventListener('input', autoRunDebounced);
    
    // Manual run button also calls render instantly
    runBtn.addEventListener('click', () => {
        renderCode();
        showToast('🚀 Code executed!');
    });

    downloadBtn.addEventListener('click', downloadProject);
    copyBtn.addEventListener('click', copyAllCode);
    clearBtn.addEventListener('click', resetEditors);
    themeSwitcher.addEventListener('click', toggleTheme);

    // Set demo & initial render
    initializeDemoCode();
    renderCode(); // initial preview

    // Console log for dev tools
    console.log('%c✨ Nexus Code Editor Loaded — live preview with dynamic sandbox ready!', 'color: #3b82f6; font-size: 14px;');

    // Additional: override any errors from iframe loading gracefully
    outputFrame.addEventListener('load', () => {
        // silent success
    });
})();