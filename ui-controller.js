/* ===========================
   VR CodeLab - UI Controller
   Benutzeroberflächen-Steuerung
   ===========================*/

// ===========================
// UI STATE MANAGEMENT
// ===========================

const UIState = {
    isVRMode: false,
    panelsVisible: true,
    currentTheme: 'dark',
    isFullscreen: false,
    notifications: [],
    helpShown: false
};

// ===========================
// UI INITIALISIERUNG
// ===========================

function initializeUI() {
    console.log('🎨 UI wird initialisiert...');
    
    // Theme anwenden
    applyTheme(UIState.currentTheme);
    
    // Responsive Layout einrichten
    setupResponsiveLayout();
    
    // Notification System
    setupNotificationSystem();
    
    // VR Mode Detection
    setupVRModeDetection();
    
    // UI Animations
    setupUIAnimations();
    
    // Panel Interactions
    setupPanelInteractions();
    
    console.log('✅ UI initialisiert');
}

// ===========================
// THEME MANAGEMENT
// ===========================

function applyTheme(themeName) {
    const root = document.documentElement;
    
    const themes = {
        dark: {
            '--primary-color': '#00d4ff',
            '--secondary-color': '#ff6b35',
            '--success-color': '#7ed321',
            '--warning-color': '#f5a623',
            '--error-color': '#d0021b',
            '--background-primary': '#1a1a2e',
            '--background-secondary': '#16213e',
            '--background-tertiary': '#0f3460',
            '--text-primary': '#ffffff',
            '--text-secondary': '#e8e8e8',
            '--text-muted': '#888888'
        },
        light: {
            '--primary-color': '#0066cc',
            '--secondary-color': '#ff4500',
            '--success-color': '#28a745',
            '--warning-color': '#ffc107',
            '--error-color': '#dc3545',
            '--background-primary': '#f8f9fa',
            '--background-secondary': '#e9ecef',
            '--background-tertiary': '#dee2e6',
            '--text-primary': '#212529',
            '--text-secondary': '#495057',
            '--text-muted': '#6c757d'
        }
    };
    
    const theme = themes[themeName];
    if (theme) {
        Object.entries(theme).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
        UIState.currentTheme = themeName;
    }
}

// ===========================
// RESPONSIVE LAYOUT
// ===========================

function setupResponsiveLayout() {
    // Viewport size detection
    function updateViewport() {
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
            isMobile: window.innerWidth <= 768,
            isTablet: window.innerWidth <= 1024 && window.innerWidth > 768
        };
        
        updateLayoutForViewport(viewport);
    }
    
    // Event listeners
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', () => {
        setTimeout(updateViewport, 100);
    });
    
    // Initial update
    updateViewport();
}

function updateLayoutForViewport(viewport) {
    const panels = document.querySelectorAll('.panel');
    const topBar = document.querySelector('.top-bar');
    
    if (viewport.isMobile) {
        // Mobile Layout
        panels.forEach(panel => {
            panel.style.position = 'relative';
            panel.style.margin = '0.5rem';
            panel.style.maxWidth = 'none';
        });
        
        // Kompakte Top Bar
        topBar.style.flexDirection = 'column';
        topBar.style.gap = '0.5rem';
        
    } else {
        // Desktop Layout
        panels.forEach(panel => {
            panel.style.position = 'absolute';
            panel.style.maxWidth = '350px';
        });
        
        topBar.style.flexDirection = 'row';
        topBar.style.gap = '2rem';
    }
}

// ===========================
// NOTIFICATION SYSTEM
// ===========================

function setupNotificationSystem() {
    // Notification Container erstellen falls nicht vorhanden
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info', duration = 4000) {
    const notification = createNotificationElement(message, type);
    const container = document.getElementById('notification-container');
    
    container.appendChild(notification);
    
    // Erscheinungs-Animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-remove
    setTimeout(() => {
        hideNotification(notification);
    }, duration);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        hideNotification(notification);
    });
    
    return notification;
}

function createNotificationElement(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hideNotification(notification);
    });
    
    return notification;
}

function hideNotification(notification) {
    notification.classList.add('hide');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ===========================
// VR MODE DETECTION
// ===========================

function setupVRModeDetection() {
    const scene = document.querySelector('a-scene');
    
    // VR Mode Enter
    scene.addEventListener('enter-vr', () => {
        UIState.isVRMode = true;
        onEnterVR();
    });
    
    // VR Mode Exit
    scene.addEventListener('exit-vr', () => {
        UIState.isVRMode = false;
        onExitVR();
    });
}

function onEnterVR() {
    console.log('🥽 VR Mode aktiviert');
    
    // UI für VR optimieren
    const uiOverlay = document.getElementById('ui-overlay');
    uiOverlay.style.opacity = '0.8';
    
    // Panels repositionieren für bessere VR-Sichtbarkeit
    repositionPanelsForVR();
    
    // Robot-Nachricht
    if (window.VRCodeLab) {
        window.VRCodeLab.showRobotMessage("VR-Modus aktiviert! Verwende deine Controller zum Greifen von Blöcken.", 5000);
    }
    
    showNotification('VR-Modus aktiviert! 🥽', 'success');
}

function onExitVR() {
    console.log('🖥️ Desktop Mode aktiviert');
    
    // UI für Desktop optimieren
    const uiOverlay = document.getElementById('ui-overlay');
    uiOverlay.style.opacity = '1';
    
    // Panels zurücksetzen
    resetPanelPositions();
    
    showNotification('Desktop-Modus aktiviert! 🖥️', 'info');
}

function repositionPanelsForVR() {
    // Panels für VR-Sichtbarkeit anpassen
    const taskPanel = document.getElementById('task-panel');
    const codePanel = document.getElementById('code-panel');
    
    taskPanel.style.transform = 'scale(0.9)';
    codePanel.style.transform = 'scale(0.9)';
}

function resetPanelPositions() {
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
        panel.style.transform = '';
    });
}

// ===========================
// UI ANIMATIONS
// ===========================

function setupUIAnimations() {
    // Intersection Observer für Scroll-Animationen
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Alle animierbaren Elemente beobachten
    document.querySelectorAll('.panel, .top-bar').forEach(el => {
        observer.observe(el);
    });
}

function animateScoreIncrease(scoreElement) {
    // Score-Erhöhung Animation
    scoreElement.style.transition = 'transform 0.3s ease';
    scoreElement.style.transform = 'scale(1.3)';
    
    setTimeout(() => {
        scoreElement.style.transform = 'scale(1)';
    }, 300);
    
    // Glitter-Effekt
    createScoreGlitterEffect(scoreElement);
}

function createScoreGlitterEffect(element) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const glitter = document.createElement('div');
            glitter.className = 'score-glitter';
            glitter.style.left = rect.left + Math.random() * rect.width + 'px';
            glitter.style.top = rect.top + Math.random() * rect.height + 'px';
            
            document.body.appendChild(glitter);
            
            setTimeout(() => {
                glitter.remove();
            }, 1000);
        }, i * 50);
    }
}

// ===========================
// PANEL INTERACTIONS
// ===========================

function setupPanelInteractions() {
    // Collapsible panels
    const panelHeaders = document.querySelectorAll('.panel h3');
    panelHeaders.forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
            togglePanel(header.parentElement);
        });
    });
    
    // Draggable panels für Desktop
    if (!('ontouchstart' in window)) {
        makePanelsDraggable();
    }
}

function togglePanel(panel) {
    const isCollapsed = panel.classList.contains('collapsed');
    
    if (isCollapsed) {
        panel.classList.remove('collapsed');
        animatePanel(panel, 'expand');
    } else {
        animatePanel(panel, 'collapse');
        setTimeout(() => {
            panel.classList.add('collapsed');
        }, 300);
    }
}

function animatePanel(panel, action) {
    const content = panel.querySelector(':not(h3)');
    
    if (action === 'collapse') {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
        
        requestAnimationFrame(() => {
            content.style.maxHeight = '0';
            content.style.opacity = '0';
        });
    } else {
        content.style.maxHeight = '0';
        content.style.opacity = '0';
        
        requestAnimationFrame(() => {
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.opacity = '1';
        });
    }
}

function makePanelsDraggable() {
    const panels = document.querySelectorAll('.panel');
    
    panels.forEach(panel => {
        let isDragging = false;
        let startX, startY, initialX, initialY;
        
        const header = panel.querySelector('h3');
        header.style.cursor = 'move';
        
        header.addEventListener('mousedown', startDrag);
        
        function startDrag(e) {
            if (e.target.tagName === 'BUTTON') return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = panel.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            
            panel.style.position = 'fixed';
            panel.style.zIndex = '10000';
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            panel.style.left = (initialX + deltaX) + 'px';
            panel.style.top = (initialY + deltaY) + 'px';
        }
        
        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
        }
    });
}

// ===========================
// HELP SYSTEM
// ===========================

function showHelp() {
    if (UIState.helpShown) {
        hideHelp();
        return;
    }
    
    const helpOverlay = createHelpOverlay();
    document.body.appendChild(helpOverlay);
    
    setTimeout(() => {
        helpOverlay.classList.add('show');
    }, 10);
    
    UIState.helpShown = true;
}

function hideHelp() {
    const helpOverlay = document.getElementById('help-overlay');
    if (helpOverlay) {
        helpOverlay.classList.remove('show');
        setTimeout(() => {
            helpOverlay.remove();
        }, 300);
    }
    UIState.helpShown = false;
}

function createHelpOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'help-overlay';
    overlay.className = 'help-overlay';
    
    overlay.innerHTML = `
        <div class="help-content">
            <div class="help-header">
                <h2>🎓 VR CodeLab Hilfe</h2>
                <button class="help-close" onclick="hideHelp()">&times;</button>
            </div>
            
            <div class="help-sections">
                <div class="help-section">
                    <h3>🎮 Steuerung</h3>
                    <ul>
                        <li><strong>VR:</strong> Trigger-Taste zum Greifen von Code-Blöcken</li>
                        <li><strong>Desktop:</strong> Klicken und Ziehen mit der Maus</li>
                        <li><strong>Mobil:</strong> Touch-Gesten zum Verschieben</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <h3>📚 Programmier-Konzepte</h3>
                    <ul>
                        <li><span class="concept-color variable">🟦</span> <strong>Variablen:</strong> Speichern Werte (z.B. let name = 'Max')</li>
                        <li><span class="concept-color function">🟨</span> <strong>Funktionen:</strong> Führen Aktionen aus (z.B. console.log())</li>
                        <li><span class="concept-color loop">🟩</span> <strong>Schleifen:</strong> Wiederholen Code (z.B. for-Schleife)</li>
                        <li><span class="concept-color condition">🟥</span> <strong>Bedingungen:</strong> Treffen Entscheidungen (z.B. if-else)</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <h3>🎯 Spielziel</h3>
                    <p>Kombiniere Code-Blöcke im Arbeitsbereich, um funktionierende Programme zu erstellen. 
                    Jedes Level bringt dir neue Programmier-Konzepte bei!</p>
                </div>
                
                <div class="help-section">
                    <h3>⌨️ Tastenkürzel</h3>
                    <ul>
                        <li><strong>H:</strong> Hilfe ein/ausblenden</li>
                        <li><strong>Ctrl + R:</strong> Arbeitsbereich zurücksetzen</li>
                        <li><strong>Ctrl + Enter:</strong> Code ausführen</li>
                        <li><strong>ESC:</strong> Vollbild verlassen</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    // Click outside to close
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            hideHelp();
        }
    });
    
    return overlay;
}

// ===========================
// PROGRESS INDICATORS
// ===========================

function updateProgressIndicator(current, total) {
    const progressSteps = document.querySelectorAll('.step');
    
    progressSteps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        
        if (index < current - 1) {
            step.classList.add('completed');
        } else if (index === current - 1) {
            step.classList.add('active');
        }
    });
    
    // Fortschrittsbalken Animation
    animateProgressBar(current, total);
}

function animateProgressBar(current, total) {
    const percentage = (current / total) * 100;
    
    // Erstelle temporären Fortschrittsbalken falls nicht vorhanden
    let progressBar = document.getElementById('dynamic-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'dynamic-progress';
        progressBar.className = 'dynamic-progress-bar';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        
        const taskPanel = document.getElementById('task-panel');
        taskPanel.appendChild(progressBar);
    }
    
    const fill = progressBar.querySelector('.progress-fill');
    fill.style.width = percentage + '%';
}

// ===========================
// ACCESSIBILITY
// ===========================

function setupAccessibility() {
    // Screen Reader Support
    const srOnlyElements = document.querySelectorAll('.sr-only');
    srOnlyElements.forEach(element => {
        element.setAttribute('aria-hidden', 'false');
    });
    
    // Keyboard Navigation
    document.addEventListener('keydown', handleAccessibilityKeys);
    
    // High Contrast Mode
    if (window.matchMedia('(prefers-contrast: high)').matches) {
        document.body.classList.add('high-contrast');
    }
    
    // Reduced Motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
    }
}

function handleAccessibilityKeys(event) {
    // Tab-Navigation für VR-Elemente
    if (event.key === 'Tab') {
        cycleFocusableElements(event.shiftKey);
    }
    
    // Arrow-Navigation für Code-Blöcke
    if (event.key.startsWith('Arrow')) {
        navigateCodeBlocks(event.key);
    }
}

// ===========================
// PERFORMANCE MONITORING
// ===========================

function setupPerformanceMonitoring() {
    // FPS Monitoring für VR
    let lastTime = performance.now();
    let frameCount = 0;
    
    function measureFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            // FPS Warning bei schlechter Performance
            if (fps < 45 && UIState.isVRMode) {
                showNotification('Niedrige Bildrate erkannt. Versuche weniger Browser-Tabs zu öffnen.', 'warning');
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(measureFPS);
    }
    
    measureFPS();
}

// ===========================
// EXPORT UND INITIALISIERUNG
// ===========================

// UI automatisch initialisieren wenn DOM bereit ist
document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    setupAccessibility();
    setupPerformanceMonitoring();
});

// Öffentliche API
window.UIController = {
    showNotification,
    showHelp,
    hideHelp,
    applyTheme,
    updateProgressIndicator,
    animateScoreIncrease,
    UIState
};