/* ===========================
   VR CodeLab - Game Logic
   Hauptlogik für das Programmier-Lernspiel
   ===========================*/

// ===========================
// SPIEL-ZUSTAND UND KONFIGURATION
// ===========================

const GameState = {
    currentLevel: 1,
    totalLevels: 5,
    score: 0,
    completedChallenges: [],
    currentCode: [],
    isRunning: false,
    robotMessages: []
};

// Level-Konfiguration mit progressiven Lernzielen (KORREKT UND LÖSBAR)
const LEVELS = {
    1: {
        title: "Erste Schritte: Variablen und Ausgabe",
        description: "Lerne wie Variablen funktionieren und wie du Text ausgeben kannst.",
        requiredBlocks: ["variable", "function"],
        challenges: [
            {
                id: "hello-world",
                title: "Hallo Welt!",
                description: "Erstelle dein erstes Programm: Verwende eine Variable und gib eine Nachricht aus.",
                hint: "Klicke zuerst auf 'let name = Schüler' und dann auf 'console.log(Hallo!)'.",
                expectedCode: ["let name = 'Schüler';", "console.log('Hallo!');"],
                availableBlocks: ["var-block-2", "func-block-1"], // Spezifische Blöcke für dieses Level
                successMessage: "Fantastisch! Du hast dein erstes Programm erstellt!"
            }
        ]
    },
    2: {
        title: "Entscheidungen treffen: If-Bedingungen",
        description: "Lerne wie Computer Entscheidungen treffen können.",
        requiredBlocks: ["variable", "condition", "function"],
        challenges: [
            {
                id: "number-check",
                title: "Zahlen-Check",
                description: "Erstelle ein Programm, das prüft ob eine Zahl groß genug ist.",
                hint: "Verwende 'let zahl = 5', dann 'if(zahl > 3)' und schließlich eine Ausgabe.",
                expectedCode: ["let zahl = 5;", "if(zahl > 3) {", "console.log('Hallo!');"],
                availableBlocks: ["var-block-1", "condition-block-1", "func-block-1"],
                successMessage: "Super! Du verstehst jetzt Bedingungen!"
            }
        ]
    },
    3: {
        title: "Wiederholungen: Schleifen",
        description: "Lerne wie du Code automatisch wiederholen lassen kannst.",
        requiredBlocks: ["loop", "function"],
        challenges: [
            {
                id: "counting",
                title: "Zählen mit Schleifen",
                description: "Erstelle eine Schleife, die eine Nachricht mehrmals ausgibt.",
                hint: "Verwende 'for(let i = 0; i < 3; i++)' und 'console.log(Hallo!)'.",
                expectedCode: ["for(let i = 0; i < 3; i++) {", "console.log('Hallo!');"],
                availableBlocks: ["loop-block-1", "func-block-1"],
                successMessage: "Excellent! Schleifen sparen viel Arbeit!"
            }
        ]
    },
    4: {
        title: "Kombinierte Konzepte",
        description: "Kombiniere alles was du gelernt hast.",
        requiredBlocks: ["variable", "condition", "loop", "function"],
        challenges: [
            {
                id: "complex-program",
                title: "Alles zusammen",
                description: "Erstelle ein Programm mit Variable, Schleife, Bedingung und Ausgabe.",
                hint: "Kombiniere: Variable → Schleife → Bedingung → Ausgabe. Nutze alle 4 Block-Typen!",
                expectedCode: ["let zahl = 5;", "for(let i = 0; i < 3; i++) {", "if(zahl > 3) {", "console.log('Hallo!');"],
                availableBlocks: ["var-block-1", "loop-block-1", "condition-block-1", "func-block-1"],
                successMessage: "Wow! Du bist ein echter Programmierer geworden!"
            }
        ]
    },
    5: {
        title: "Freies Programmieren",
        description: "Jetzt kannst du dein eigenes Programm erstellen!",
        requiredBlocks: ["variable", "condition", "loop", "function"],
        challenges: [
            {
                id: "free-coding",
                title: "Dein eigenes Programm",
                description: "Erstelle ein eigenes Programm mit mindestens 3 Code-Blöcken deiner Wahl.",
                hint: "Sei kreativ! Kombiniere die Blöcke wie du möchtest. Mindestens 3 Blöcke verwenden.",
                expectedCode: [], // Freies Programmieren - mindestens 3 Blöcke
                availableBlocks: ["var-block-1", "var-block-2", "func-block-1", "func-block-2", "loop-block-1", "condition-block-1"],
                minimumBlocks: 3, // Neues Kriterium für freies Programmieren
                successMessage: "Herzlichen Glückwunsch! Du hast das VR CodeLab abgeschlossen!"
            }
        ]
    }
};

// Robot-Nachrichten für verschiedene Situationen
const ROBOT_MESSAGES = {
    welcome: "Hallo! Ich bin CodeBot, dein Programmier-Lehrer. Lass uns zusammen programmieren lernen!",
    levelStart: "Bereit für Level {level}? Lass uns {concept} lernen!",
    blockPlaced: "Gut gemacht! Du hast einen {blockType}-Block platziert.",
    correctSequence: "Perfect! Die Reihenfolge stimmt!",
    wrongSequence: "Hmm, versuche es nochmal. Schau dir die Aufgabe genau an.",
    levelComplete: "Fantastisch! Level {level} abgeschlossen. Du wirst immer besser!",
    gameComplete: "Unglaublich! Du hast alle Level geschafft! Du bist jetzt bereit für echtes Programmieren!",
    hint: "Tipp: {hint}",
    encouragement: [
        "Du machst das großartig!",
        "Weiter so!",
        "Du lernst schnell!",
        "Das ist der Geist eines Programmierers!",
        "Excellent work!"
    ]
};

// ===========================
// SPIEL-INITIALISIERUNG
// ===========================

function initializeGame() {
    console.log('🚀 VR CodeLab startet...');
    
    // Loading Screen ausblenden
    setTimeout(() => {
        hideLoadingScreen();
        showWelcomeMessage();
        startLevel(1);
    }, 3000);
    
    // Event Listeners einrichten
    setupEventListeners();
    
    // Interaktionssystem initialisieren
    if (window.SimpleInteractions) {
        window.SimpleInteractions.initializeSimpleInteractions();
    }
    
    console.log('✅ Spiel initialisiert');
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('hidden');
    
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
}

function setupEventListeners() {
    // UI-Button Events
    const runCodeBtn = document.getElementById('run-code-btn');
    const resetCodeBtn = document.getElementById('reset-code-btn');
    const helpBtn = document.getElementById('help-btn');
    const settingsBtn = document.getElementById('settings-btn');
    
    runCodeBtn.addEventListener('click', executeCode);
    resetCodeBtn.addEventListener('click', resetWorkspace);
    helpBtn.addEventListener('click', toggleInstructions);
    settingsBtn.addEventListener('click', showSettings);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
}

// ===========================
// LEVEL-MANAGEMENT
// ===========================

function startLevel(levelNumber) {
    if (levelNumber > GameState.totalLevels) {
        completeGame();
        return;
    }
    
    GameState.currentLevel = levelNumber;
    const level = LEVELS[levelNumber];
    
    console.log(`🎯 Starte Level ${levelNumber}: ${level.title}`);
    
    // UI aktualisieren
    updateLevelDisplay();
    updateTaskDescription(level);
    resetWorkspace();
    
    // Robot-Nachricht
    const message = ROBOT_MESSAGES.levelStart
        .replace('{level}', levelNumber)
        .replace('{concept}', level.title.split(':')[1] || level.title);
    
    showRobotMessage(message);
    
    // Level-spezifische Blöcke aktivieren
    showLevelBlocks(level.requiredBlocks);
}

function updateLevelDisplay() {
    const levelElement = document.getElementById('current-level');
    levelElement.textContent = GameState.currentLevel;
}

function updateTaskDescription(level) {
    const taskPanel = document.getElementById('task-description');
    const challenge = level.challenges[0]; // Erst mal nur eine Challenge pro Level
    
    taskPanel.innerHTML = `
        <h4>${challenge.title}</h4>
        <p>${challenge.description}</p>
        <div class="challenge-hint">
            💡 <strong>Tipp:</strong> ${challenge.hint}
        </div>
    `;
}

function showLevelBlocks(requiredBlocks) {
    const currentLevel = LEVELS[GameState.currentLevel];
    const challenge = currentLevel.challenges[0];
    
    console.log('📦 Zeige Blöcke für Level', GameState.currentLevel);
    
    // Alle Blöcke verstecken
    document.querySelectorAll('.code-block').forEach(block => {
        block.setAttribute('visible', 'false');
    });
    
    // Spezifische Blöcke für Challenge anzeigen (falls definiert)
    if (challenge.availableBlocks) {
        console.log('🎯 Spezifische Blöcke für Challenge:', challenge.availableBlocks);
        
        challenge.availableBlocks.forEach(blockId => {
            const block = document.getElementById(blockId);
            if (block) {
                block.setAttribute('visible', 'true');
                
                // Erscheinungs-Animation
                block.setAttribute('animation__levelstart', 
                    'property: scale; from: 0 0 0; to: 1 1 1; dur: 500; easing: easeOutBack');
                
                console.log(`✅ Block angezeigt: ${blockId}`);
            } else {
                console.log(`❌ Block nicht gefunden: ${blockId}`);
            }
        });
    } else {
        // Fallback: Alle Blöcke des Typs anzeigen
        console.log('📦 Fallback: Zeige alle Blöcke vom Typ:', requiredBlocks);
        
        requiredBlocks.forEach(blockType => {
            const blocks = document.querySelectorAll(`[data-block-type="${blockType}"]`);
            blocks.forEach(block => {
                block.setAttribute('visible', 'true');
                
                // Erscheinungs-Animation
                block.setAttribute('animation__levelstart', 
                    'property: scale; from: 0 0 0; to: 1 1 1; dur: 500; easing: easeOutBack');
            });
        });
    }
}

// ===========================
// CODE-BLOCK MANAGEMENT
// ===========================

function addBlockToWorkspace(blockElement) {
    const blockType = blockElement.getAttribute('data-block-type');
    const blockCode = blockElement.getAttribute('data-block-code');
    
    // Block zum aktuellen Code hinzufügen
    GameState.currentCode.push(blockCode);
    
    console.log(`📦 Block hinzugefügt: ${blockType} - ${blockCode}`);
    
    // UI aktualisieren
    updateCodeDisplay();
    
    // Robot-Feedback
    const message = ROBOT_MESSAGES.blockPlaced.replace('{blockType}', blockType);
    showRobotMessage(message);
    
    // Prüfen ob Challenge gelöst
    checkChallengeCompletion();
    
    // Visuelles Feedback
    createBlockPlacementEffect(blockElement);
}

function updateCodeDisplay() {
    const codeOutput = document.getElementById('code-output');
    
    if (GameState.currentCode.length === 0) {
        codeOutput.innerHTML = '<div class="code-line">// Dein Programm wird hier angezeigt</div>';
        return;
    }
    
    const codeHTML = GameState.currentCode
        .map(line => `<div class="code-line">${escapeHtml(line)}</div>`)
        .join('');
    
    codeOutput.innerHTML = codeHTML;
}

function executeCode() {
    if (GameState.currentCode.length === 0) {
        showRobotMessage("Erstelle erst ein Programm, bevor du es ausführst!");
        return;
    }
    
    console.log('▶️ Code wird ausgeführt:', GameState.currentCode);
    
    // Animation für ausgeführten Code
    animateCodeExecution();
    
    // Simuliere Code-Ausführung
    const output = simulateCodeExecution(GameState.currentCode);
    showExecutionResult(output);
    
    // Score erhöhen
    GameState.score += 10;
    updateScoreDisplay();
}

function simulateCodeExecution(codeLines) {
    // Einfache Simulation der Code-Ausführung
    const output = [];
    const variables = {};
    
    for (let line of codeLines) {
        if (line.includes('let ') && line.includes('=')) {
            // Variable deklaration
            const varName = line.match(/let (\w+)/)?.[1];
            const varValue = line.match(/= (.+);/)?.[1];
            if (varName && varValue) {
                variables[varName] = varValue.replace(/'/g, '');
                output.push(`Variable ${varName} erstellt`);
            }
        } else if (line.includes('console.log')) {
            // Console output
            const content = line.match(/console\.log\((.+)\)/)?.[1];
            if (content) {
                if (variables[content]) {
                    output.push(variables[content]);
                } else {
                    output.push(content.replace(/'/g, ''));
                }
            }
        } else if (line.includes('alert')) {
            // Alert
            const content = line.match(/alert\((.+)\)/)?.[1];
            if (content) {
                output.push(`Alert: ${variables[content] || content.replace(/'/g, '')}`);
            }
        } else if (line.includes('for(')) {
            // Schleife
            output.push('Schleife wird ausgeführt...');
        } else if (line.includes('if(')) {
            // Bedingung
            output.push('Bedingung wird geprüft...');
        }
    }
    
    return output;
}

function showExecutionResult(output) {
    // Erstelle Ergebnis-Panel
    const resultPanel = document.createElement('div');
    resultPanel.className = 'execution-result';
    resultPanel.innerHTML = `
        <h4>📋 Ausgabe:</h4>
        ${output.map(line => `<div class="output-line">${escapeHtml(line)}</div>`).join('')}
    `;
    
    // Temporär anzeigen
    document.body.appendChild(resultPanel);
    
    setTimeout(() => {
        resultPanel.remove();
    }, 3000);
}

// ===========================
// CHALLENGE-SYSTEM
// ===========================

function checkChallengeCompletion() {
    const currentLevel = LEVELS[GameState.currentLevel];
    const challenge = currentLevel.challenges[0];
    
    console.log('🔍 Prüfe Challenge-Completion für Level', GameState.currentLevel);
    console.log('📝 Aktueller Code:', GameState.currentCode);
    console.log('🎯 Erwarteter Code:', challenge.expectedCode);
    
    // Freies Programmieren (Level 5)
    if (challenge.expectedCode.length === 0) {
        const minimumBlocks = challenge.minimumBlocks || 3;
        if (GameState.currentCode.length >= minimumBlocks) {
            console.log('✅ Freies Programmieren abgeschlossen!');
            completeChallenge(challenge);
        } else {
            console.log(`⏳ Noch ${minimumBlocks - GameState.currentCode.length} Blöcke benötigt`);
        }
        return;
    }
    
    // Prüfe ob erwarteter Code erfüllt ist (flexibel)
    const isComplete = challenge.expectedCode.every(expectedLine => {
        const found = GameState.currentCode.some(codeLine => {
            // Entferne Whitespace und Semikolons für flexibleren Vergleich
            const cleanExpected = expectedLine.replace(/[;\s]/g, '');
            const cleanActual = codeLine.replace(/[;\s]/g, '');
            const matches = cleanActual.includes(cleanExpected) || cleanExpected.includes(cleanActual);
            
            if (matches) {
                console.log(`✅ Match gefunden: "${codeLine}" erfüllt "${expectedLine}"`);
            }
            
            return matches;
        });
        
        if (!found) {
            console.log(`❌ Fehlender Code: "${expectedLine}"`);
        }
        
        return found;
    });
    
    if (isComplete) {
        console.log('🎉 Challenge abgeschlossen!');
        completeChallenge(challenge);
    } else {
        console.log('⏳ Challenge noch nicht vollständig');
        
        // Hilfreiche Hinweise geben
        showProgressHint(challenge);
    }
}

function showProgressHint(challenge) {
    const missingBlocks = challenge.expectedCode.filter(expectedLine => {
        return !GameState.currentCode.some(codeLine => {
            const cleanExpected = expectedLine.replace(/[;\s]/g, '');
            const cleanActual = codeLine.replace(/[;\s]/g, '');
            return cleanActual.includes(cleanExpected) || cleanExpected.includes(cleanActual);
        });
    });
    
    if (missingBlocks.length > 0) {
        const nextBlock = missingBlocks[0];
        showRobotMessage(`Du brauchst noch: "${nextBlock}". ${challenge.hint}`, 4000);
    }
}

function completeChallenge(challenge) {
    console.log(`✅ Challenge abgeschlossen: ${challenge.id}`);
    
    // Challenge als abgeschlossen markieren
    GameState.completedChallenges.push(challenge.id);
    
    // Erfolgs-Animation
    createSuccessEffect();
    
    // Robot-Nachricht
    showRobotMessage(challenge.successMessage);
    
    // Score erhöhen
    GameState.score += 50;
    updateScoreDisplay();
    
    // Nächstes Level nach kurzer Verzögerung
    setTimeout(() => {
        completeLevel();
    }, 3000);
}

function completeLevel() {
    const message = ROBOT_MESSAGES.levelComplete.replace('{level}', GameState.currentLevel);
    showRobotMessage(message);
    
    // Progress-Steps aktualisieren
    updateProgressSteps();
    
    // Nächstes Level
    setTimeout(() => {
        startLevel(GameState.currentLevel + 1);
    }, 2000);
}

function updateProgressSteps() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.classList.remove('active');
        if (index < GameState.currentLevel - 1) {
            step.classList.add('completed');
        } else if (index === GameState.currentLevel - 1) {
            step.classList.add('active');
        }
    });
}

// ===========================
// ROBOT-LEHRER SYSTEM
// ===========================

function showRobotMessage(message, duration = 5000) {
    const robotSpeech = document.getElementById('robot-speech');
    
    robotSpeech.setAttribute('value', message);
    
    // Speech Bubble Animation
    robotSpeech.setAttribute('animation__popup', 
        'property: scale; from: 0 0 0; to: 1 1 1; dur: 300; easing: easeOutBack');
    
    console.log(`🤖 Robot sagt: ${message}`);
    
    // Auto-hide nach Duration
    setTimeout(() => {
        robotSpeech.setAttribute('animation__hide', 
            'property: scale; to: 0.8 0.8 0.8; dur: 200');
    }, duration);
}

function showWelcomeMessage() {
    showRobotMessage(ROBOT_MESSAGES.welcome, 8000);
}

function showRandomEncouragement() {
    const messages = ROBOT_MESSAGES.encouragement;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showRobotMessage(randomMessage, 3000);
}

// ===========================
// UTILITY FUNKTIONEN
// ===========================

function resetWorkspace() {
    GameState.currentCode = [];
    updateCodeDisplay();
    
    // Einfaches Interaktionssystem workspace leeren
    if (window.SimpleInteractions) {
        window.SimpleInteractions.clearWorkspaceSimple();
    }
    
    // Zusätzlich alle workspace-block Elemente entfernen
    const workspaceBlocks = document.querySelectorAll('.workspace-block');
    workspaceBlocks.forEach(block => block.remove());
    
    showRobotMessage("Arbeitsbereich zurückgesetzt. Lass uns von vorne anfangen!");
}

function updateScoreDisplay() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = GameState.score;
    
    // Score-Animation
    scoreElement.style.transform = 'scale(1.2)';
    setTimeout(() => {
        scoreElement.style.transform = 'scale(1)';
    }, 200);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function createSuccessEffect() {
    // Partikel-Effekt für Erfolg
    const particleContainer = document.getElementById('success-particles');
    particleContainer.setAttribute('visible', 'true');
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const particle = document.createElement('a-sphere');
            particle.setAttribute('radius', '0.1');
            particle.setAttribute('color', `hsl(${120 + Math.random() * 60}, 100%, 60%)`);
            particle.setAttribute('position', `${(Math.random() - 0.5) * 6} 3 ${-4 + (Math.random() - 0.5) * 3}`);
            particle.setAttribute('animation', 
                'property: position; to: 0 5 -4; dur: 2000; easing: easeOutQuart');
            particle.setAttribute('animation__fade', 
                'property: material.opacity; to: 0; dur: 2000; easing: easeInQuart');
            
            particleContainer.appendChild(particle);
            
            setTimeout(() => particle.remove(), 2000);
        }, i * 50);
    }
    
    setTimeout(() => {
        particleContainer.setAttribute('visible', 'false');
    }, 3000);
}

function createBlockPlacementEffect(blockElement) {
    // Visueller Effekt beim Platzieren von Blöcken
    blockElement.setAttribute('animation__place', 
        'property: material.emissiveIntensity; to: 0.8; dur: 300; dir: alternate; loop: 2');
}

// ===========================
// EVENT HANDLERS
// ===========================

function handleKeyboard(event) {
    switch (event.key.toLowerCase()) {
        case 'h':
            toggleInstructions();
            break;
        case 'r':
            if (event.ctrlKey) {
                resetWorkspace();
            }
            break;
        case 'enter':
            if (event.ctrlKey) {
                executeCode();
            }
            break;
        case 'escape':
            // Vollbild verlassen oder Panel schließen
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            break;
    }
}

function toggleInstructions() {
    const instructionsPanel = document.getElementById('instructions-panel');
    instructionsPanel.classList.toggle('collapsed');
}

function showSettings() {
    // Einfache Einstellungen
    alert('Einstellungen werden in einer zukünftigen Version verfügbar sein!');
}

function animateCodeExecution() {
    const codeLines = document.querySelectorAll('.code-line');
    codeLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.backgroundColor = 'rgba(0, 212, 255, 0.3)';
            setTimeout(() => {
                line.style.backgroundColor = '';
            }, 500);
        }, index * 300);
    });
}

function completeGame() {
    console.log('🎉 Spiel abgeschlossen!');
    
    showRobotMessage(ROBOT_MESSAGES.gameComplete, 10000);
    
    // Feuerwerk-Effekt
    createGameCompletionEffect();
    
    // Ergebnis anzeigen
    setTimeout(() => {
        showFinalResults();
    }, 5000);
}

function createGameCompletionEffect() {
    // Großes Feuerwerk für Spielabschluss
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const particle = document.createElement('a-sphere');
            particle.setAttribute('radius', '0.15');
            particle.setAttribute('color', `hsl(${Math.random() * 360}, 100%, 60%)`);
            particle.setAttribute('position', `${(Math.random() - 0.5) * 10} 6 ${-4 + (Math.random() - 0.5) * 6}`);
            particle.setAttribute('animation', 
                'property: position; to: 0 0 -4; dur: 3000; easing: easeInQuart');
            particle.setAttribute('animation__fade', 
                'property: material.opacity; to: 0; dur: 3000');
            
            document.querySelector('a-scene').appendChild(particle);
            
            setTimeout(() => particle.remove(), 3000);
        }, i * 100);
    }
}

function showFinalResults() {
    const resultHTML = `
        <div class="final-results">
            <h2>🎉 Herzlichen Glückwunsch! 🎉</h2>
            <p>Du hast VR CodeLab erfolgreich abgeschlossen!</p>
            <div class="stats">
                <div class="stat">
                    <span class="stat-value">${GameState.score}</span>
                    <span class="stat-label">Punkte erreicht</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${GameState.totalLevels}</span>
                    <span class="stat-label">Level abgeschlossen</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${GameState.completedChallenges.length}</span>
                    <span class="stat-label">Herausforderungen gemeistert</span>
                </div>
            </div>
            <p><strong>Du bist jetzt bereit für echtes Programmieren!</strong></p>
            <button onclick="restartGame()" class="action-btn primary">Nochmal spielen</button>
        </div>
    `;
    
    const resultPanel = document.createElement('div');
    resultPanel.className = 'final-results-overlay';
    resultPanel.innerHTML = resultHTML;
    document.body.appendChild(resultPanel);
}

function restartGame() {
    location.reload();
}

// ===========================
// SPIEL STARTEN
// ===========================

// Warten bis DOM und A-Frame geladen sind
document.addEventListener('DOMContentLoaded', function() {
    console.log('📚 VR CodeLab wird geladen...');
    
    // A-Frame Scene geladen?
    const scene = document.querySelector('a-scene');
    if (scene.hasLoaded) {
        initializeGame();
    } else {
        scene.addEventListener('loaded', initializeGame);
    }
});

// ===========================
// TEST UND VALIDIERUNG
// ===========================

function validateAllChallenges() {
    console.log('🧪 Validiere alle Challenges...');
    
    let allValid = true;
    
    Object.keys(LEVELS).forEach(levelNum => {
        const level = LEVELS[levelNum];
        const challenge = level.challenges[0];
        
        console.log(`\n📋 Level ${levelNum}: ${challenge.title}`);
        console.log(`📝 Erwarteter Code:`, challenge.expectedCode);
        
        if (challenge.availableBlocks) {
            console.log(`🎯 Verfügbare Blöcke:`, challenge.availableBlocks);
            
            // Prüfe ob alle erwarteten Code-Teile durch verfügbare Blöcke erfüllbar sind
            const canSolve = challenge.expectedCode.every(expectedCode => {
                return challenge.availableBlocks.some(blockId => {
                    const block = document.getElementById(blockId);
                    if (block) {
                        const blockCode = block.getAttribute('data-block-code');
                        const cleanExpected = expectedCode.replace(/[;\s]/g, '');
                        const cleanActual = blockCode.replace(/[;\s]/g, '');
                        return cleanActual.includes(cleanExpected) || cleanExpected.includes(cleanActual);
                    }
                    return false;
                });
            });
            
            if (canSolve) {
                console.log(`✅ Level ${levelNum} ist lösbar`);
            } else {
                console.log(`❌ Level ${levelNum} ist NICHT lösbar`);
                allValid = false;
            }
        } else {
            console.log(`⚠️ Level ${levelNum} hat keine spezifischen availableBlocks`);
        }
    });
    
    if (allValid) {
        console.log(`\n🎉 Alle Challenges sind korrekt und lösbar!`);
    } else {
        console.log(`\n❌ Es gibt unlösbare Challenges!`);
    }
    
    return allValid;
}

function testSolveLevel(levelNumber) {
    console.log(`🧪 Teste Level ${levelNumber}...`);
    
    const level = LEVELS[levelNumber];
    const challenge = level.challenges[0];
    
    if (!challenge.availableBlocks) {
        console.log('❌ Keine spezifischen Blöcke definiert');
        return;
    }
    
    // Simuliere das Hinzufügen aller benötigten Blöcke
    GameState.currentCode = [];
    
    challenge.availableBlocks.forEach(blockId => {
        const block = document.getElementById(blockId);
        if (block) {
            const blockCode = block.getAttribute('data-block-code');
            GameState.currentCode.push(blockCode);
            console.log(`➕ Block hinzugefügt: ${blockCode}`);
        }
    });
    
    console.log('📝 Finaler Code:', GameState.currentCode);
    
    // Teste Challenge-Completion
    checkChallengeCompletion();
}

// Export für andere Module
window.VRCodeLab = {
    GameState,
    addBlockToWorkspace,
    executeCode,
    resetWorkspace,
    showRobotMessage,
    // Test-Funktionen
    validateAllChallenges,
    testSolveLevel
};