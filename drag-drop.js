/* ===========================
   VR CodeLab - Drag & Drop System
   Interaktionssystem für Code-Blöcke
   ===========================*/

// ===========================
// DRAG & DROP STATE
// ===========================

const DragDropState = {
    isDragging: false,
    currentDraggedBlock: null,
    dragOffset: { x: 0, y: 0, z: 0 },
    workspacePositions: [],
    snapThreshold: 0.5,
    originalPosition: null,
    ghostBlock: null
};

// Workspace-Raster für Snap-Funktionalität
const WORKSPACE_GRID = {
    startX: -1,
    startY: 0.6,
    startZ: -4,
    stepX: 0,
    stepY: 0.4,
    stepZ: 0,
    maxSlots: 10
};

// ===========================
// VR INTERAKTIONEN SETUP
// ===========================

function setupVRInteractions() {
    console.log('🎮 VR-Interaktionen werden eingerichtet...');
    
    // A-Frame Custom Components registrieren
    registerGrabComponent();
    registerWorkspaceComponent();
    
    // Event Listeners für alle Interaktionsarten
    setupMouseInteractions();
    setupTouchInteractions();
    setupVRControllerInteractions();
    
    // A-Frame spezifische Event Listeners
    setupAFrameInteractions();
    
    // Workspace-Positionen initialisieren
    initializeWorkspacePositions();
    
    console.log('✅ VR-Interaktionen bereit');
}

function setupAFrameInteractions() {
    // Warte bis A-Frame vollständig geladen ist
    const scene = document.querySelector('a-scene');
    
    if (scene.hasLoaded) {
        initializeAFrameEvents();
    } else {
        scene.addEventListener('loaded', initializeAFrameEvents);
    }
}

function initializeAFrameEvents() {
    // Alle grabbable Entities mit Event Listeners ausstatten
    const grabbableEntities = document.querySelectorAll('.grabbable');
    
    grabbableEntities.forEach(entity => {
        // Mouse Events
        entity.addEventListener('mousedown', handleAFrameMouseDown);
        entity.addEventListener('mouseup', handleAFrameMouseUp);
        
        // VR Controller Events
        entity.addEventListener('triggerdown', handleAFrameTriggerDown);
        entity.addEventListener('triggerup', handleAFrameTriggerUp);
        
        // Touch Events für Mobile
        entity.addEventListener('touchstart', handleAFrameTouchStart);
        entity.addEventListener('touchend', handleAFrameTouchEnd);
        
        console.log('📦 Event Listeners hinzugefügt für:', entity.id);
    });
}

function handleAFrameMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
    startDrag(event.target, null, event);
}

function handleAFrameMouseUp(event) {
    if (DragDropState.isDragging) {
        endDrag();
    }
}

function handleAFrameTriggerDown(event) {
    startDrag(event.target, event.detail.cursorEl);
}

function handleAFrameTriggerUp(event) {
    if (DragDropState.isDragging) {
        endDrag();
    }
}

function handleAFrameTouchStart(event) {
    event.preventDefault();
    const touch = event.touches[0];
    startDrag(event.target, null, touch);
}

function handleAFrameTouchEnd(event) {
    if (DragDropState.isDragging) {
        endDrag();
    }
}

// ===========================
// A-FRAME CUSTOM COMPONENTS
// ===========================

function registerGrabComponent() {
    // Prüfe ob A-Frame verfügbar ist
    if (typeof AFRAME === 'undefined') {
        console.log('⏳ A-Frame noch nicht geladen, warte...');
        setTimeout(registerGrabComponent, 100);
        return;
    }
    
    AFRAME.registerComponent('grab-system', {
        schema: {
            hand: { type: 'string', default: 'right' }
        },
        
        init: function() {
            this.onTriggerDown = this.onTriggerDown.bind(this);
            this.onTriggerUp = this.onTriggerUp.bind(this);
            this.onGripDown = this.onGripDown.bind(this);
            
            this.el.addEventListener('triggerdown', this.onTriggerDown);
            this.el.addEventListener('triggerup', this.onTriggerUp);
            this.el.addEventListener('gripdown', this.onGripDown);
        },
        
        onTriggerDown: function(event) {
            const intersectedEl = this.el.components.raycaster.intersectedEls[0];
            if (intersectedEl && intersectedEl.classList.contains('grabbable')) {
                startDrag(intersectedEl, this.el);
            }
        },
        
        onTriggerUp: function(event) {
            if (DragDropState.isDragging) {
                endDrag();
            }
        },
        
        onGripDown: function(event) {
            // Alternative Griff-Geste
            this.onTriggerDown(event);
        }
    });
}

function registerWorkspaceComponent() {
    // Prüfe ob A-Frame verfügbar ist
    if (typeof AFRAME === 'undefined') {
        console.log('⏳ A-Frame noch nicht geladen, warte...');
        setTimeout(registerWorkspaceComponent, 100);
        return;
    }
    
    AFRAME.registerComponent('workspace', {
        init: function() {
            this.el.classList.add('drop-zone');
            
            this.el.addEventListener('mouseenter', function() {
                if (DragDropState.isDragging) {
                    this.setAttribute('material', 'color: #34495e; emissive: #00d4ff; emissiveIntensity: 0.3');
                }
            });
            
            this.el.addEventListener('mouseleave', function() {
                this.setAttribute('material', 'color: #2c3e50; emissive: #000000; emissiveIntensity: 0');
            });
        }
    });
}

// ===========================
// MAUS-INTERAKTIONEN
// ===========================

function setupMouseInteractions() {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

function handleMouseDown(event) {
    // Prüfe ob es ein A-Frame Element ist
    const target = event.target;
    
    // Suche nach dem nächsten A-Frame Entity mit grabbable class
    let blockElement = target;
    while (blockElement && !blockElement.hasAttribute('mixin')) {
        if (blockElement.classList && blockElement.classList.contains('grabbable')) {
            break;
        }
        blockElement = blockElement.parentElement;
    }
    
    // Wenn kein grabbable Element gefunden, prüfe A-Frame Entities
    if (!blockElement || !blockElement.classList.contains('grabbable')) {
        // Für A-Frame Entities
        const aframeTarget = target.closest('a-entity');
        if (aframeTarget && aframeTarget.classList.contains('grabbable')) {
            blockElement = aframeTarget;
        } else {
            return;
        }
    }
    
    event.preventDefault();
    startDrag(blockElement, null, event);
}

function handleMouseMove(event) {
    if (!DragDropState.isDragging || !DragDropState.currentDraggedBlock) {
        return;
    }
    
    updateDragPosition(event);
}

function handleMouseUp(event) {
    if (DragDropState.isDragging) {
        endDrag();
    }
}

// ===========================
// TOUCH-INTERAKTIONEN
// ===========================

function setupTouchInteractions() {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
}

function handleTouchStart(event) {
    event.preventDefault();
    
    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element && element.classList.contains('grabbable')) {
        startDrag(element, null, touch);
    }
}

function handleTouchMove(event) {
    event.preventDefault();
    
    if (DragDropState.isDragging && event.touches.length > 0) {
        updateDragPosition(event.touches[0]);
    }
}

function handleTouchEnd(event) {
    event.preventDefault();
    
    if (DragDropState.isDragging) {
        endDrag();
    }
}

// ===========================
// VR CONTROLLER INTERAKTIONEN
// ===========================

function setupVRControllerInteractions() {
    // Wird durch die grab-system Komponente gehandhabt
    console.log('🎮 VR Controller Events registriert');
}

// ===========================
// DRAG LOGIK
// ===========================

function startDrag(blockElement, controller, inputEvent) {
    if (DragDropState.isDragging) {
        return; // Bereits am Ziehen
    }
    
    console.log('🟢 Drag gestartet:', blockElement.id);
    
    DragDropState.isDragging = true;
    DragDropState.currentDraggedBlock = blockElement;
    
    // Original Position speichern
    const position = blockElement.getAttribute('position');
    DragDropState.originalPosition = {
        x: position.x,
        y: position.y,
        z: position.z
    };
    
    // Ghost-Block erstellen (Kopie für visuelles Feedback)
    createGhostBlock(blockElement);
    
    // Block visuell hervorheben
    highlightDraggedBlock(blockElement);
    
    // Haptic Feedback für VR
    if (controller && controller.components['haptic']) {
        controller.components.haptic.pulse(0.5, 100);
    }
    
    // Drag-Offset berechnen
    if (inputEvent) {
        calculateDragOffset(blockElement, inputEvent);
    }
    
    // Robot-Feedback
    if (window.VRCodeLab) {
        window.VRCodeLab.showRobotMessage("Super! Ziehe den Block in den Arbeitsbereich.", 3000);
    }
}

function updateDragPosition(inputEvent) {
    if (!DragDropState.isDragging || !DragDropState.currentDraggedBlock) {
        return;
    }
    
    // Für A-Frame Entities: Position nur während Drag in moderaten Grenzen ändern
    const currentPos = DragDropState.currentDraggedBlock.getAttribute('position');
    const camera = document.querySelector('[camera]');
    
    // Sanfte Bewegung basierend auf Maus-Delta
    const rect = document.querySelector('a-scene').getBoundingClientRect();
    const mouseX = (inputEvent.clientX - rect.left) / rect.width;
    const mouseY = (inputEvent.clientY - rect.top) / rect.height;
    
    // Begrenzte Bewegung um die ursprüngliche Position
    const newPosition = {
        x: DragDropState.originalPosition.x + (mouseX - 0.5) * 2,
        y: DragDropState.originalPosition.y + (0.5 - mouseY) * 1,
        z: DragDropState.originalPosition.z
    };
    
    // Position aktualisieren
    DragDropState.currentDraggedBlock.setAttribute('position', 
        `${newPosition.x} ${newPosition.y} ${newPosition.z}`);
    
    // Snap-Vorschau
    updateSnapPreview(newPosition);
}

function endDrag() {
    if (!DragDropState.isDragging || !DragDropState.currentDraggedBlock) {
        return;
    }
    
    console.log('🔴 Drag beendet');
    
    const draggedBlock = DragDropState.currentDraggedBlock;
    const dropPosition = findDropPosition();
    
    if (dropPosition) {
        // Erfolgreich im Workspace platziert
        placeBlockInWorkspace(draggedBlock, dropPosition);
    } else {
        // Zurück zur ursprünglichen Position
        returnBlockToOriginalPosition(draggedBlock);
    }
    
    // Cleanup
    cleanupDrag();
}

// ===========================
// HILFSFUNKTIONEN
// ===========================

function createGhostBlock(originalBlock) {
    const ghost = originalBlock.cloneNode(true);
    ghost.id = 'ghost-' + originalBlock.id;
    ghost.classList.add('ghost-block');
    ghost.setAttribute('material', 'transparent: true; opacity: 0.5');
    ghost.setAttribute('position', originalBlock.getAttribute('position'));
    
    DragDropState.ghostBlock = ghost;
    document.querySelector('a-scene').appendChild(ghost);
}

function highlightDraggedBlock(blockElement) {
    const material = blockElement.getAttribute('material');
    blockElement.setAttribute('material', material + '; emissiveIntensity: 0.5');
    
    // Glow-Effekt
    blockElement.setAttribute('animation__glow', 
        'property: material.emissiveIntensity; to: 0.8; dur: 500; dir: alternate; loop: true');
}

function calculateDragOffset(blockElement, inputEvent) {
    const blockPosition = blockElement.getAttribute('position');
    const worldPosition = screenTo3D(inputEvent);
    
    DragDropState.dragOffset = {
        x: blockPosition.x - worldPosition.x,
        y: blockPosition.y - worldPosition.y,
        z: blockPosition.z - worldPosition.z
    };
}

function screenTo3D(inputEvent, camera) {
    // Vereinfachte 2D zu 3D Konvertierung für Demo
    const rect = document.querySelector('a-scene').getBoundingClientRect();
    const x = ((inputEvent.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((inputEvent.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Projiziere auf Z-Ebene des Workspace
    return {
        x: x * 4, // Skalierung anpassen
        y: y * 2 + 1.5, // Höhe anpassen
        z: -4 // Workspace Z-Position
    };
}

function findDropPosition() {
    const draggedPosition = DragDropState.currentDraggedBlock.getAttribute('position');
    
    // Prüfe ob im Workspace-Bereich
    const workspaceBounds = {
        minX: -1,
        maxX: 5,
        minY: 0.3,
        maxY: 2.5,
        minZ: -5,
        maxZ: -3
    };
    
    if (draggedPosition.x >= workspaceBounds.minX && 
        draggedPosition.x <= workspaceBounds.maxX &&
        draggedPosition.y >= workspaceBounds.minY && 
        draggedPosition.y <= workspaceBounds.maxY &&
        draggedPosition.z >= workspaceBounds.minZ && 
        draggedPosition.z <= workspaceBounds.maxZ) {
        
        // Finde nächste verfügbare Workspace-Position
        return getNextWorkspacePosition();
    }
    
    return null;
}

function getNextWorkspacePosition() {
    const usedPositions = DragDropState.workspacePositions.filter(pos => pos.occupied);
    const availablePosition = DragDropState.workspacePositions.find(pos => !pos.occupied);
    
    if (availablePosition) {
        availablePosition.occupied = true;
        return availablePosition;
    }
    
    // Neue Position erstellen wenn kein Platz
    const newPosition = {
        x: WORKSPACE_GRID.startX,
        y: WORKSPACE_GRID.startY + (usedPositions.length * WORKSPACE_GRID.stepY),
        z: WORKSPACE_GRID.startZ,
        occupied: true,
        index: usedPositions.length
    };
    
    DragDropState.workspacePositions.push(newPosition);
    return newPosition;
}

function placeBlockInWorkspace(blockElement, position) {
    // Block-Kopie erstellen (Original bleibt verfügbar)
    const blockCopy = createBlockCopy(blockElement);
    blockCopy.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
    
    // Platzierungs-Animation
    blockCopy.setAttribute('animation__place', 
        'property: scale; from: 1.2 1.2 1.2; to: 1 1 1; dur: 300; easing: easeOutBack');
    
    // Zur Workspace hinzufügen
    document.querySelector('#main-platform').appendChild(blockCopy);
    
    // Zum Code hinzufügen
    if (window.VRCodeLab) {
        window.VRCodeLab.addBlockToWorkspace(blockElement);
    }
    
    // Erfolgs-Effekt
    createPlacementEffect(position);
    
    console.log('✅ Block im Workspace platziert:', blockElement.id);
}

function createBlockCopy(originalBlock) {
    const copy = originalBlock.cloneNode(true);
    copy.id = 'workspace-' + originalBlock.id + '-' + Date.now();
    copy.classList.add('workspace-block');
    copy.classList.remove('grabbable'); // Workspace-Blöcke sind nicht mehr grabbable
    
    // Visuelles Feedback für platzierte Blöcke
    const material = copy.getAttribute('material');
    copy.setAttribute('material', material + '; emissiveIntensity: 0.1');
    
    return copy;
}

function returnBlockToOriginalPosition(blockElement) {
    const originalPos = DragDropState.originalPosition;
    
    // Zurück-Animation
    blockElement.setAttribute('animation__return', 
        `property: position; to: ${originalPos.x} ${originalPos.y} ${originalPos.z}; dur: 500; easing: easeOutQuart`);
    
    console.log('↩️ Block zur ursprünglichen Position zurückgekehrt');
}

function cleanupDrag() {
    // Ghost-Block entfernen
    if (DragDropState.ghostBlock) {
        DragDropState.ghostBlock.remove();
        DragDropState.ghostBlock = null;
    }
    
    // Highlight entfernen
    if (DragDropState.currentDraggedBlock) {
        const material = DragDropState.currentDraggedBlock.getAttribute('material');
        DragDropState.currentDraggedBlock.setAttribute('material', 
            material.replace('; emissiveIntensity: 0.5', ''));
        DragDropState.currentDraggedBlock.removeAttribute('animation__glow');
    }
    
    // State zurücksetzen
    DragDropState.isDragging = false;
    DragDropState.currentDraggedBlock = null;
    DragDropState.originalPosition = null;
    DragDropState.dragOffset = { x: 0, y: 0, z: 0 };
}

function updateSnapPreview(currentPosition) {
    const snapPosition = findNearestSnapPosition(currentPosition);
    
    if (snapPosition && DragDropState.ghostBlock) {
        DragDropState.ghostBlock.setAttribute('position', 
            `${snapPosition.x} ${snapPosition.y} ${snapPosition.z}`);
        DragDropState.ghostBlock.setAttribute('visible', 'true');
    } else if (DragDropState.ghostBlock) {
        DragDropState.ghostBlock.setAttribute('visible', 'false');
    }
}

function findNearestSnapPosition(position) {
    let nearestPosition = null;
    let minDistance = DragDropState.snapThreshold;
    
    DragDropState.workspacePositions.forEach(workspacePos => {
        if (!workspacePos.occupied) {
            const distance = Math.sqrt(
                Math.pow(position.x - workspacePos.x, 2) +
                Math.pow(position.y - workspacePos.y, 2) +
                Math.pow(position.z - workspacePos.z, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                nearestPosition = workspacePos;
            }
        }
    });
    
    return nearestPosition;
}

function createPlacementEffect(position) {
    // Platzierungs-Partikel
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const particle = document.createElement('a-sphere');
            particle.setAttribute('radius', '0.05');
            particle.setAttribute('color', '#00d4ff');
            particle.setAttribute('position', 
                `${position.x + (Math.random() - 0.5) * 0.5} ${position.y + 0.3} ${position.z + (Math.random() - 0.5) * 0.5}`);
            particle.setAttribute('animation', 
                'property: position; to: 0 3 -4; dur: 1000; easing: easeOutQuart');
            particle.setAttribute('animation__fade', 
                'property: material.opacity; to: 0; dur: 1000');
            
            document.querySelector('a-scene').appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }, i * 50);
    }
}

function initializeWorkspacePositions() {
    DragDropState.workspacePositions = [];
    
    for (let i = 0; i < WORKSPACE_GRID.maxSlots; i++) {
        DragDropState.workspacePositions.push({
            x: WORKSPACE_GRID.startX,
            y: WORKSPACE_GRID.startY + (i * WORKSPACE_GRID.stepY),
            z: WORKSPACE_GRID.startZ,
            occupied: false,
            index: i
        });
    }
    
    console.log('📍 Workspace-Positionen initialisiert:', DragDropState.workspacePositions.length);
}

// ===========================
// ÖFFENTLICHE API
// ===========================

function clearWorkspace() {
    // Alle Workspace-Blöcke entfernen
    const workspaceBlocks = document.querySelectorAll('.workspace-block');
    workspaceBlocks.forEach(block => block.remove());
    
    // Positionen freigeben
    DragDropState.workspacePositions.forEach(pos => pos.occupied = false);
    
    console.log('🧹 Workspace geleert');
}

function getWorkspaceBlocks() {
    return Array.from(document.querySelectorAll('.workspace-block'));
}

// Export für andere Module
window.DragDropSystem = {
    setupVRInteractions,
    clearWorkspace,
    getWorkspaceBlocks,
    DragDropState
};