/* ===========================
   VR CodeLab - UI Controller
   Benutzeroberflächen-Steuerung (Modern)
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
    
    // Lucide Icons initialisieren
    initializeLucideIcons();
    
    console.log('✅ UI initialisiert');
}

function initializeLucideIcons() {
    // Stelle sicher, dass Lucide Icons verfügbar sind
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
        console.log('✅ Lucide Icons initialisiert');
    } else {
        console.warn('⚠️ Lucide Icons nicht verfügbar');
    }
}

// ===========================
// THEME MANAGEMENT
// ===========================

function applyTheme(themeName) {
    const root = document.documentElement;
    
    const themes = {
        dark: {
            '--primary-color': '#84ACCE',
            '--primary-dark': '#6B8BB0',
            '--primary-light': '#A5C4E1',
            '--secondary-color': '#6366f1',
            '--success-color': '#10b981',
            '--warning-color': '#f59e0b',
            '--error-color': '#ef4444',
            
            '--background-primary': '#0a0a0a',
            '--background-secondary': '#1a1a1a',
            '--background-tertiary': '#2a2a2a',
            '--background-card': '#1e1e1e',
            
            '--text-primary': '#ffffff',
            '--text-secondary': '#e5e5e5',
            '--text-muted': '#9ca3af',
            '--text-dark': '#374151',
            
            '--border-primary': '#374151',
            '--border-secondary': '#4b5563',
            '--border-accent': '#84ACCE'
        },
        light: {
            '--primary-color': '#6B8BB0',
            '--primary-dark': '#5a7a9a',
            '--primary-light': '#84ACCE',
            '--secondary-color': '#4f46e5',
            '--success-color': '#059669',
            '--warning-color': '#d97706',
            '--error-color': '#dc2626',
            
            '--background-primary': '#ffffff',
            '--background-secondary': '#f8fafc',
            '--background-tertiary': '#f1f5f9',
            '--background-card': '#ffffff',
            
            '--text-primary': '#0f172a',
            '--text-secondary': '#334155',
            '--text-muted': '#64748b',
            '--text-dark': '#1e293b',
            
            '--border-primary': '#e2e8f0',
            '--border-secondary': '#cbd5e1',
            '--border-accent': '#6B8BB0'
        }
    };
    
    const theme = themes[themeName];
    if (theme) {
        Object.entries(theme).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
        UIState.currentTheme = themeName;
        
        // Icons nach Theme-Wechsel neu initialisieren
        setTimeout(() => initializeLucideIcons(), 100);
    }
}

// ===========================
// RESPONSIVE LAYOUT
// ===========================

function setupResponsiveLayout() {
    function updateViewport() {
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
            isMobile: window.innerWidth <= 768,
            isTablet: window.innerWidth <= 1024 && window.innerWidth > 768
        };
        
        updateLayoutForViewport(viewport);
    }
    
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', () => {
        setTimeout(updateViewport, 100);
    });
    
    updateViewport();
}

function updateLayoutForViewport(viewport) {
    const panels = document.querySelectorAll('.panel');
    const topBar = document.querySelector('.top-bar');
    
    if (viewport.isMobile) {
        panels.forEach(panel => {
            panel.style.position = 'relative';
            panel.style.margin = '0.5rem';
            panel.style.maxWidth = 'none';
        });
        
        topBar.style.flexDirection = 'column';
        topBar.style.gap = '0.5rem';
    } else {
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
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        hideNotification(notification);
    }, duration);
    
    notification.addEventListener('click', () => {
        hideNotification(notification);
    });
    
    return notification;
}

function createNotificationElement(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const iconMap = {
        info: 'info',
        success: 'check-circle',
        warning: 'alert-triangle',
        error: 'x-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i data-lucide="${iconMap[type] || iconMap.info}" class="notification-icon"></i>
            <span class="notification-message">${message}</span>
            <button class="notification-close">
                <i data-lucide="x"></i>
            </button>
        </div>
    `;
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hideNotification(notification);
    });
    
    // Icons initialisieren
    setTimeout(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 10);
    
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
    
    scene.addEventListener('enter-vr', () => {
        UIState.isVRMode = true;
        onEnterVR();
    });
    
    scene.addEventListener('exit-vr', () => {
        UIState.isVRMode = false;
        onExitVR();
    });
}

function onEnterVR() {
    console.log('🥽 VR Mode aktiviert');
    
    const uiOverlay = document.getElementById('ui-overlay');
    uiOverlay.style.opacity = '0.85';
    
    repositionPanelsForVR();
    
    if (window.VRCodeLab) {
        window.VRCodeLab.showRobotMessage("VR-Modus aktiviert! Verwende deine Controller zum Greifen von Blöcken.", 5000);
    }
    
    showNotification('VR-Modus aktiviert', 'success');
}

function onExitVR() {
    console.log('🖥️ Desktop Mode aktiviert');
    
    const uiOverlay = document.getElementById('ui-overlay');
    uiOverlay.style.opacity = '1';
    
    resetPanelPositions();
    
    showNotification('Desktop-Modus aktiviert', 'info');
}

function repositionPanelsForVR() {
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
    
    document.querySelectorAll('.panel, .top-bar').forEach(el => {
        observer.observe(el);
    });
}

function animateScoreIncrease(scoreElement) {
    scoreElement.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    scoreElement.style.transform = 'scale(1.2)';
    
    setTimeout(() => {
        scoreElement.style.transform = 'scale(1)';
    }, 300);
    
    createScoreGlitterEffect(scoreElement);
}

function createScoreGlitterEffect(element) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            const glitter = document.createElement('div');
            glitter.className = 'score-glitter';
            glitter.style.left = rect.left + Math.random() * rect.width + 'px';
            glitter.style.top = rect.top + Math.random() * rect.height + 'px';
            glitter.style.background = 'var(--primary-color)';
            
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
    const panelHeaders = document.querySelectorAll('.panel h3');
    panelHeaders.forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
            togglePanel(header.parentElement);
        });
    });
    
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
            content.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
        });
    } else {
        content.style.maxHeight = '0';
        content.style.opacity = '0';
        content.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
        
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
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'I') return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = panel.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            
            panel.style.position = 'fixed';
            panel.style.zIndex = '10000';
            panel.style.transition = 'none';
            
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
            panel.style.transition = '';
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
                <h2><i data-lucide="graduation-cap"></i> VR CodeLab Hilfe</h2>
                <button class="help-close" onclick="hideHelp()">
                    <i data-lucide="x"></i>
                </button>
            </div>
            
            <div class="help-sections">
                <div class="help-section">
                    <h3><i data-lucide="gamepad-2"></i> Steuerung</h3>
                    <ul>
                        <li><strong>VR:</strong> Trigger-Taste zum Greifen von Code-Blöcken</li>
                        <li><strong>Desktop:</strong> Klicken und Ziehen mit der Maus</li>
                        <li><strong>Mobil:</strong> Touch-Gesten zum Verschieben</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <h3><i data-lucide="code"></i> Programmier-Konzepte</h3>
                    <ul>
                        <li><strong>Variablen:</strong> Speichern Werte (z.B. let name = 'Max')</li>
                        <li><strong>Funktionen:</strong> Führen Aktionen aus (z.B. console.log())</li>
                        <li><strong>Schleifen:</strong> Wiederholen Code (z.B. for-Schleife)</li>
                        <li><strong>Bedingungen:</strong> Treffen Entscheidungen (z.B. if-else)</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <h3><i data-lucide="target"></i> Spielziel</h3>
                    <p>Kombiniere Code-Blöcke im Arbeitsbereich, um funktionierende Programme zu erstellen. 
                    Jedes Level bringt dir neue Programmier-Konzepte bei!</p>
                </div>
                
                <div class="help-section">
                    <h3><i data-lucide="keyboard"></i> Tastenkürzel</h3>
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
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            hideHelp();
        }
    });
    
    // Icons initialisieren
    setTimeout(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 10);
    
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
    
    animateProgressBar(current, total);
}

function animateProgressBar(current, total) {
    const percentage = (current / total) * 100;
    
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
// ACCESSIBILITY & PERFORMANCE
// ===========================

function setupAccessibility() {
    const srOnlyElements = document.querySelectorAll('.sr-only');
    srOnlyElements.forEach(element => {
        element.setAttribute('aria-hidden', 'false');
    });
    
    document.addEventListener('keydown', handleAccessibilityKeys);
    
    if (window.matchMedia('(prefers-contrast: high)').matches) {
        document.body.classList.add('high-contrast');
    }
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
    }
}

function handleAccessibilityKeys(event) {
    if (event.key === 'Tab') {
        cycleFocusableElements(event.shiftKey);
    }
    
    if (event.key.startsWith('Arrow')) {
        navigateCodeBlocks(event.key);
    }
}

function setupPerformanceMonitoring() {
    let lastTime = performance.now();
    let frameCount = 0;
    
    function measureFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
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
// UTILITY FUNCTIONS
// ===========================

function createScoreEffect(element) {
    // Modern particle effect
    const particles = [];
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'var(--primary-color)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '10000';
        
        const rect = element.getBoundingClientRect();
        particle.style.left = rect.left + rect.width/2 + 'px';
        particle.style.top = rect.top + rect.height/2 + 'px';
        
        const angle = (i / 8) * Math.PI * 2;
        const velocity = 50 + Math.random() * 30;
        
        document.body.appendChild(particle);
        
        const startTime = performance.now();
        const duration = 800;
        
        function animate() {
            const elapsed = performance.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                const distance = velocity * progress;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance - (progress * progress * 100);
                
                particle.style.transform = `translate(${x}px, ${y}px)`;
                particle.style.opacity = 1 - progress;
                
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        }
        
        animate();
    }
}

// ===========================
// EXPORT UND INITIALISIERUNG
// ===========================

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
    createScoreEffect,
    UIState
};