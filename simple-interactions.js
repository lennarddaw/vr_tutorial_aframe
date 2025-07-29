/* ===========================
   VR CodeLab - Simplified Interactions
   Einfaches, zuverlässiges Interaktionssystem
   ===========================*/

// State für einfache Interaktionen
const SimpleInteractionState = {
    isInitialized: false,
    currentWorkspaceSlot: 0
};

// ===========================
// INITIALISIERUNG
// ===========================

function initializeSimpleInteractions() {
    if (SimpleInteractionState.isInitialized) {
        return;
    }
    
    console.log('🎮 Einfaches Interaktionssystem wird initialisiert...');
    
    // Warte bis A-Frame geladen ist
    const scene = document.querySelector('a-scene');
    if (scene.hasLoaded) {
        setupSimpleEvents();
    } else {
        scene.addEventListener('loaded', setupSimpleEvents);
    }
}

function setupSimpleEvents() {
    console.log('📦 Event-Handler werden eingerichtet...');
    
    // Alle Code-Blöcke mit Click-Events ausstatten
    const codeBlocks = document.querySelectorAll('.grabbable');
    
    codeBlocks.forEach(block => {
        // Click Event für alle Plattformen
        block.addEventListener('click', handleBlockClick);
        
        // Hover-Effekte
        block.addEventListener('mouseenter', handleBlockHover);
        block.addEventListener('mouseleave', handleBlockUnhover);
        
        console.log('✅ Events hinzugefügt für Block:', block.id);
    });
    
    SimpleInteractionState.isInitialized = true;
    console.log('🎯 Einfaches Interaktionssystem bereit!');
}

// ===========================
// EVENT HANDLERS
// ===========================

function handleBlockClick(event) {
    const block = event.target;
    
    console.log('🖱️ Block angeklickt:', block.id);
    
    // Verhindere mehrfache Events
    event.stopPropagation();
    
    // Block zum Workspace hinzufügen
    addBlockToWorkspaceSimple(block);
    
    // Visuelles Feedback
    createClickEffect(block);
}

function handleBlockHover(event) {
    const block = event.target;
    
    // Leuchten verstärken
    const material = block.getAttribute('material');
    const currentEmissive = material.emissiveIntensity || 0.2;
    
    block.setAttribute('material', material + `; emissiveIntensity: 0.5`);
    
    // Sanfte Vergrößerung
    block.setAttribute('animation__hover', 
        'property: scale; to: 1.1 1.1 1.1; dur: 200; easing: easeOutQuad');
}

function handleBlockUnhover(event) {
    const block = event.target;
    
    // Emissive zurücksetzen
    const material = block.getAttribute('material');
    const cleanMaterial = material.replace(/; emissiveIntensity: [0-9.]+/, '');
    block.setAttribute('material', cleanMaterial);
    
    // Größe zurücksetzen
    block.setAttribute('animation__unhover', 
        'property: scale; to: 1 1 1; dur: 200; easing: easeInQuad');
}

// ===========================
// WORKSPACE MANAGEMENT
// ===========================

function addBlockToWorkspaceSimple(originalBlock) {
    const blockType = originalBlock.getAttribute('data-block-type');
    const blockCode = originalBlock.getAttribute('data-block-code');
    
    console.log(`📦 Füge Block hinzu: ${blockType} - ${blockCode}`);
    
    // Position im Workspace berechnen
    const workspacePosition = calculateWorkspacePosition();
    
    // Block-Kopie erstellen
    const blockCopy = createSimpleBlockCopy(originalBlock, workspacePosition);
    
    // Zur Szene hinzufügen
    document.querySelector('a-scene').appendChild(blockCopy);
    
    // Code zur Game-Logic hinzufügen
    if (window.VRCodeLab) {
        window.VRCodeLab.addBlockToWorkspace(originalBlock);
    }
    
    // Robot-Feedback
    if (window.VRCodeLab) {
        window.VRCodeLab.showRobotMessage(`Super! Du hast einen ${blockType}-Block hinzugefügt!`, 3000);
    }
    
    // Erfolgs-Animation
    createSuccessEffect(workspacePosition);
    
    // Workspace-Slot erhöhen
    SimpleInteractionState.currentWorkspaceSlot++;
}

function calculateWorkspacePosition() {
    const baseX = 1;
    const baseY = 0.8;
    const baseZ = -4;
    const yOffset = 0.4;
    
    return {
        x: baseX,
        y: baseY + (SimpleInteractionState.currentWorkspaceSlot * yOffset),
        z: baseZ
    };
}

function createSimpleBlockCopy(originalBlock, position) {
    const copy = originalBlock.cloneNode(true);
    
    // Neue ID und Klassen
    copy.id = `workspace-${originalBlock.id}-${Date.now()}`;
    copy.classList.add('workspace-block');
    copy.classList.remove('grabbable');
    
    // Position setzen
    copy.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
    
    // Erscheinungs-Animation
    copy.setAttribute('animation__appear', 
        'property: scale; from: 0 0 0; to: 1 1 1; dur: 500; easing: easeOutBack');
    
    // Material leicht anpassen für Workspace-Blöcke
    const material = copy.getAttribute('material');
    copy.setAttribute('material', material + '; emissiveIntensity: 0.1');
    
    return copy;
}

// ===========================
// VISUELLE EFFEKTE
// ===========================

function createClickEffect(block) {
    // Kurze Puls-Animation
    block.setAttribute('animation__click', 
        'property: scale; to: 1.3 1.3 1.3; dur: 150; dir: alternate; loop: 2; easing: easeOutQuad');
    
    // Glow-Effekt
    const material = block.getAttribute('material');
    block.setAttribute('material', material + '; emissiveIntensity: 0.8');
    
    setTimeout(() => {
        const cleanMaterial = material.replace(/; emissiveIntensity: [0-9.]+/, '');
        block.setAttribute('material', cleanMaterial);
    }, 300);
}

function createSuccessEffect(position) {
    // Kleine Partikel-Explosion
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const particle = document.createElement('a-sphere');
            particle.setAttribute('radius', '0.05');
            particle.setAttribute('color', '#00d4ff');
            particle.setAttribute('position', 
                `${position.x + (Math.random() - 0.5) * 0.5} ${position.y + 0.2} ${position.z + (Math.random() - 0.5) * 0.5}`);
            
            // Aufwärts-Animation
            particle.setAttribute('animation__rise', 
                'property: position; to: 0 4 -4; dur: 1500; easing: easeOutQuart');
            particle.setAttribute('animation__fade', 
                'property: material.opacity; to: 0; dur: 1500');
            
            document.querySelector('a-scene').appendChild(particle);
            
            // Partikel nach Animation entfernen
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1500);
        }, i * 50);
    }
}

// ===========================
// WORKSPACE RESET
// ===========================

function clearWorkspaceSimple() {
    // Alle Workspace-Blöcke entfernen
    const workspaceBlocks = document.querySelectorAll('.workspace-block');
    workspaceBlocks.forEach(block => {
        if (block.parentNode) {
            block.parentNode.removeChild(block);
        }
    });
    
    // Slot-Counter zurücksetzen
    SimpleInteractionState.currentWorkspaceSlot = 0;
    
    console.log('🧹 Workspace geleert (einfach)');
}

// ===========================
// LEVEL-BLOCKS MANAGEMENT
// ===========================

function showLevelBlocksSimple(requiredBlocks) {
    // Alle Blöcke verstecken
    document.querySelectorAll('.code-block').forEach(block => {
        block.setAttribute('visible', 'false');
    });
    
    // Nur benötigte Blöcke zeigen
    requiredBlocks.forEach(blockType => {
        const blocks = document.querySelectorAll(`[data-block-type="${blockType}"]`);
        blocks.forEach(block => {
            block.setAttribute('visible', 'true');
            
            // Erscheinungs-Animation
            block.setAttribute('animation__levelstart', 
                'property: scale; from: 0 0 0; to: 1 1 1; dur: 500; easing: easeOutBack');
        });
    });
    
    console.log('📦 Blöcke für Level angezeigt:', requiredBlocks);
}

// ===========================
// ÖFFENTLICHE API
// ===========================

// Automatische Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    // Kurze Verzögerung um sicherzustellen, dass A-Frame geladen ist
    setTimeout(initializeSimpleInteractions, 1000);
});

// Export für andere Module
window.SimpleInteractions = {
    initializeSimpleInteractions,
    addBlockToWorkspaceSimple,
    clearWorkspaceSimple,
    showLevelBlocksSimple,
    SimpleInteractionState
};