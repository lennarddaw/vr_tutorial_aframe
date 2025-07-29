/* ===========================
   Emergency Click System
   Notfall-System für Block-Interaktionen
   ===========================*/

// Notfall-System das direkt auf DOM-Elemente zugreift
window.EmergencyClickSystem = {
    
    // Initialisierung des Notfall-Systems
    init: function() {
        console.log('🚨 Notfall-Click-System wird initialisiert...');
        
        // Warte bis DOM vollständig geladen ist
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(this.setupEmergencyClicks.bind(this), 100);
            });
        } else {
            this.setupEmergencyClicks();
        }
    },
    
    // Setup für Notfall-Clicks
    setupEmergencyClicks: function() {
        console.log('⚡ Setup für Notfall-Clicks...');
        
        // Alle möglichen Block-IDs
        const blockIds = [
            'var-block-1', 'var-block-2', 
            'func-block-1', 'func-block-2',
            'loop-block-1', 'condition-block-1'
        ];
        
        let foundBlocks = 0;
        
        blockIds.forEach(blockId => {
            const block = document.getElementById(blockId);
            if (block) {
                this.addEmergencyClickHandler(block);
                foundBlocks++;
                console.log(`✅ Notfall-Handler für ${blockId} hinzugefügt`);
            }
        });
        
        console.log(`🎯 ${foundBlocks} Blöcke mit Notfall-Handlern ausgestattet`);
        
        // Zusätzlich: Globaler Click-Handler
        this.setupGlobalClickHandler();
        
        // Test-Buttons für Debug erstellen
        this.createTestButtons();
    },
    
    // Notfall-Click-Handler für einzelne Blöcke
    addEmergencyClickHandler: function(block) {
        const handler = (event) => {
            console.log(`🔥 Notfall-Click auf ${block.id}`);
            this.handleEmergencyBlockClick(block);
            event.stopPropagation();
        };
        
        // Entferne alte Handler
        block.removeEventListener('click', handler);
        
        // Füge neue Handler hinzu
        block.addEventListener('click', handler);
        block.addEventListener('touchstart', handler);
        
        // Visueller Indikator
        this.addVisualIndicator(block);
    },
    
    // Globaler Click-Handler als Backup
    setupGlobalClickHandler: function() {
        document.addEventListener('click', (event) => {
            const target = event.target;
            
            // Prüfe ob Element oder Parent-Element ein Code-Block ist
            let element = target;
            while (element && element !== document) {
                if (element.id && (
                    element.id.includes('var-block') ||
                    element.id.includes('func-block') ||
                    element.id.includes('loop-block') ||
                    element.id.includes('condition-block')
                )) {
                    console.log(`🌍 Globaler Click erkannt auf ${element.id}`);
                    this.handleEmergencyBlockClick(element);
                    break;
                }
                element = element.parentElement;
            }
        });
        
        console.log('🌐 Globaler Click-Handler installiert');
    },
    
    // Handler für Block-Clicks
    handleEmergencyBlockClick: function(block) {
        const blockId = block.id;
        const blockType = this.getBlockType(blockId);
        const blockCode = this.getBlockCode(blockId);
        
        console.log(`📦 Block-Click: ${blockId} (${blockType})`);
        
        // Visuelles Feedback
        this.showClickFeedback(block);
        
        // Block zum Workspace hinzufügen
        this.addToWorkspace(blockType, blockCode);
        
        // Game-Logic informieren
        this.notifyGameLogic(blockType, blockCode);
    },
    
    // Block-Typ bestimmen
    getBlockType: function(blockId) {
        if (blockId.includes('var-')) return 'variable';
        if (blockId.includes('func-')) return 'function';
        if (blockId.includes('loop-')) return 'loop';
        if (blockId.includes('condition-')) return 'condition';
        return 'unknown';
    },
    
    // Block-Code bestimmen (EXAKTE ÜBEREINSTIMMUNG MIT HTML)
    getBlockCode: function(blockId) {
        const codeMap = {
            'var-block-1': 'let zahl = 5;',
            'var-block-2': 'let name = \'Schüler\';',
            'func-block-1': 'console.log(\'Hallo!\');',
            'func-block-2': 'alert(name);',
            'loop-block-1': 'for(let i = 0; i < 3; i++) {',
            'condition-block-1': 'if(zahl > 3) {'
        };
        
        return codeMap[blockId] || '// Code';
    },
    
    // Visuelles Feedback für Clicks
    showClickFeedback: function(block) {
        // CSS-Animation für Click-Feedback
        block.style.transition = 'transform 0.2s ease';
        block.style.transform = 'scale(1.2)';
        
        setTimeout(() => {
            block.style.transform = 'scale(1)';
        }, 200);
        
        // Farb-Flash
        const originalFilter = block.style.filter || '';
        block.style.filter = 'brightness(1.5) saturate(1.3)';
        
        setTimeout(() => {
            block.style.filter = originalFilter;
        }, 300);
    },
    
    // Block zum Workspace hinzufügen
    addToWorkspace: function(blockType, blockCode) {
        // Einfache Text-Anzeige im Code-Panel
        const codeOutput = document.getElementById('code-output');
        if (codeOutput) {
            const codeLine = document.createElement('div');
            codeLine.className = 'code-line';
            codeLine.textContent = blockCode;
            codeOutput.appendChild(codeLine);
            
            // Scroll nach unten
            codeOutput.scrollTop = codeOutput.scrollHeight;
        }
        
        console.log(`✅ Code hinzugefügt: ${blockCode}`);
    },
    
    // Game-Logic benachrichtigen
    notifyGameLogic: function(blockType, blockCode) {
        // Versuche das normale System zu benachrichtigen
        if (window.VRCodeLab && window.VRCodeLab.addBlockToWorkspace) {
            // Fake-Block-Element erstellen
            const fakeBlock = {
                getAttribute: function(attr) {
                    if (attr === 'data-block-type') return blockType;
                    if (attr === 'data-block-code') return blockCode;
                    return null;
                },
                id: `emergency-${blockType}-${Date.now()}`
            };
            
            window.VRCodeLab.addBlockToWorkspace(fakeBlock);
        }
        
        // Robot-Nachricht
        if (window.VRCodeLab && window.VRCodeLab.showRobotMessage) {
            window.VRCodeLab.showRobotMessage(`Super! ${blockType}-Block hinzugefügt!`);
        }
    },
    
    // Visueller Indikator für klickbare Blöcke
    addVisualIndicator: function(block) {
        block.style.cursor = 'pointer';
        block.style.border = '2px solid rgba(0, 212, 255, 0.5)';
        block.style.borderRadius = '5px';
        
        // Hover-Effekt
        block.addEventListener('mouseenter', () => {
            block.style.borderColor = 'rgba(0, 212, 255, 1)';
            block.style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.5)';
        });
        
        block.addEventListener('mouseleave', () => {
            block.style.borderColor = 'rgba(0, 212, 255, 0.5)';
            block.style.boxShadow = 'none';
        });
    },
    
    // Test-Buttons für Debug
    createTestButtons: function() {
        const testContainer = document.createElement('div');
        testContainer.id = 'emergency-test-buttons';
        testContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px;
            border-radius: 5px;
            z-index: 10000;
            color: white;
            font-family: monospace;
            font-size: 12px;
        `;
        
        testContainer.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">🚨 Notfall-Tests:</div>
            <button onclick="EmergencyClickSystem.testLevel(1)" style="margin: 1px; padding: 3px; font-size: 10px;">Level 1</button>
            <button onclick="EmergencyClickSystem.testLevel(2)" style="margin: 1px; padding: 3px; font-size: 10px;">Level 2</button>
            <button onclick="EmergencyClickSystem.testLevel(3)" style="margin: 1px; padding: 3px; font-size: 10px;">Level 3</button><br>
            <button onclick="EmergencyClickSystem.testBlock('var-block-1')" style="margin: 1px; padding: 3px; font-size: 10px;">Var 1</button>
            <button onclick="EmergencyClickSystem.testBlock('func-block-1')" style="margin: 1px; padding: 3px; font-size: 10px;">Func 1</button>
            <button onclick="EmergencyClickSystem.clearWorkspace()" style="margin: 1px; padding: 3px; font-size: 10px;">Clear</button><br>
            <button onclick="VRCodeLab.validateAllChallenges()" style="margin: 1px; padding: 3px; font-size: 10px;">Validate</button>
        `;
        
        document.body.appendChild(testContainer);
        
        console.log('🧪 Test-Buttons erstellt');
    },
    
    // Test-Funktion für manuelle Block-Aktivierung
    testBlock: function(blockId) {
        const block = document.getElementById(blockId);
        if (block) {
            console.log(`🧪 Teste Block: ${blockId}`);
            this.handleEmergencyBlockClick(block);
        } else {
            console.log(`❌ Block nicht gefunden: ${blockId}`);
        }
    },
    
    // Workspace leeren
    clearWorkspace: function() {
        const codeOutput = document.getElementById('code-output');
        if (codeOutput) {
            codeOutput.innerHTML = '<div class="code-line">// Dein Programm wird hier angezeigt</div>';
        }
        
        // Auch das Game-State zurücksetzen
        if (window.VRCodeLab && window.VRCodeLab.resetWorkspace) {
            window.VRCodeLab.resetWorkspace();
        }
        
        console.log('🧹 Workspace geleert (Notfall)');
    },
    
    // Level-Test für alle Blöcke eines Levels
    testLevel: function(levelNumber) {
        console.log(`🧪 Teste Level ${levelNumber} komplett...`);
        
        // Workspace erst leeren
        this.clearWorkspace();
        
        // Level-spezifische Blöcke simulieren
        const levelBlocks = {
            1: ['var-block-2', 'func-block-1'], // Hallo Welt
            2: ['var-block-1', 'condition-block-1', 'func-block-1'], // Zahlen-Check
            3: ['loop-block-1', 'func-block-1'], // Schleifen
            4: ['var-block-1', 'loop-block-1', 'condition-block-1', 'func-block-1'], // Alles kombiniert
            5: ['var-block-1', 'var-block-2', 'func-block-1'] // Freies Programmieren (3 Blöcke)
        };
        
        const blocksToTest = levelBlocks[levelNumber];
        if (blocksToTest) {
            blocksToTest.forEach((blockId, index) => {
                setTimeout(() => {
                    this.testBlock(blockId);
                }, index * 500); // Verzögerung zwischen Blöcken
            });
        } else {
            console.log(`❌ Keine Test-Blöcke für Level ${levelNumber} definiert`);
        }
    }
};

// Automatische Initialisierung
EmergencyClickSystem.init();

console.log('🚨 Notfall-Click-System geladen und bereit!');