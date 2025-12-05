// State
const state = {
    user: { name: '', age: '' },
    apiKey: localStorage.getItem('gemini_api_key') || '',
    scenarios: [],
    currentScenario: null,
    gemini: null
};

// DOM Elements
const screens = {
    onboarding: document.getElementById('onboardingScreen'),
    scenarios: document.getElementById('scenarioScreen'),
    chat: document.getElementById('chatScreen'),
    feedback: document.getElementById('feedbackScreen'),
    modal: document.getElementById('apiKeyModal')
};

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
    checkApiKey();
    await loadScenarios();
    setupEventListeners();
});

function checkApiKey() {
    if (!state.apiKey) {
        screens.modal.classList.remove('hidden-screen');
    } else {
        state.gemini = new GeminiClient(state.apiKey);
    }
}

async function loadScenarios() {
    try {
        const response = await fetch('scenarios/scenarios.json');
        state.scenarios = await response.json();
        renderScenarios();
    } catch (error) {
        console.error('Error loading scenarios:', error);
    }
}

function renderScenarios() {
    const list = document.getElementById('scenariosList');
    list.innerHTML = state.scenarios.map(scenario => `
        <div class="glass p-4 rounded-xl cursor-pointer hover:bg-slate-700/50 transition border border-slate-700 hover:border-blue-500/50" onclick="startScenario('${scenario.id}')">
            <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-white">${scenario.title}</h3>
                <span class="text-xs px-2 py-1 rounded bg-slate-800 text-${getDifficultyColor(scenario.difficulty)}-400 border border-slate-600">
                    ${scenario.difficulty}
                </span>
            </div>
            <p class="text-sm text-gray-400">${scenario.description}</p>
        </div>
    `).join('');
}

function getDifficultyColor(diff) {
    if (diff === 'Baja') return 'green';
    if (diff === 'Media') return 'yellow';
    return 'red';
}

function setupEventListeners() {
    // API Key
    document.getElementById('saveApiKeyBtn').addEventListener('click', () => {
        const key = document.getElementById('apiKeyInput').value.trim();
        if (key) {
            state.apiKey = key;
            localStorage.setItem('gemini_api_key', key);
            state.gemini = new GeminiClient(key);
            screens.modal.classList.add('hidden-screen');
        }
    });

    // Onboarding
    document.getElementById('startBtn').addEventListener('click', () => {
        const name = document.getElementById('userName').value.trim();
        const age = document.getElementById('userAge').value.trim();
        
        if (name && age) {
            state.user = { name, age };
            switchScreen('scenarios');
        } else {
            alert('Por favor completa tu nombre y edad.');
        }
    });

    // Settings (Clear API Key)
    document.getElementById('settingsBtn').addEventListener('click', () => {
        if(confirm('¿Quieres borrar tus datos y la API Key?')) {
            localStorage.clear();
            location.reload();
        }
    });

    // Chat
    document.getElementById('chatForm').addEventListener('submit', handleChatSubmit);
    document.getElementById('backToScenariosBtn').addEventListener('click', () => switchScreen('scenarios'));
    document.getElementById('analyzeBtn').addEventListener('click', endSimulation);
    
    // Feedback
    document.getElementById('restartBtn').addEventListener('click', () => switchScreen('scenarios'));
}

function switchScreen(screenName) {
    Object.values(screens).forEach(el => el.classList.add('hidden-screen'));
    screens[screenName].classList.remove('hidden-screen');
}

async function startScenario(id) {
    state.currentScenario = state.scenarios.find(s => s.id === id);
    if (!state.currentScenario) return;

    // UI Setup
    document.getElementById('chatTitle').innerText = state.currentScenario.title;
    document.getElementById('chatMessages').innerHTML = '';
    switchScreen('chat');

    // Initialize Gemini
    const systemPrompt = `${state.currentScenario.system_prompt} 
    El usuario se llama ${state.user.name} y tiene ${state.user.age} años. 
    Adapta tu lenguaje a su edad. 
    IMPORTANTE: Mantén respuestas cortas (máximo 2-3 oraciones) como en un chat real.`;
    
    state.gemini.setSystemPrompt(systemPrompt);

    // Initial message from "Scammer"
    showTypingIndicator();
    try {
        // Trigger the AI to start (we send an empty "start" signal invisible to user or just ask it to generate the opener)
        // Actually, better to just ask it to generate the first message based on the prompt.
        // We can simulate this by sending a hidden "Hola" or just asking the model to start.
        // Let's try sending a hidden instruction as the first user message to kickstart it.
        const startMsg = await state.gemini.sendMessage("(Inicia la conversación ahora actuando tu rol. Saluda a la víctima.)");
        removeTypingIndicator();
        addMessage(startMsg, 'bot');
    } catch (error) {
        removeTypingIndicator();
        console.error("Start Scenario Error:", error);
        addMessage(`Error: ${error.message}. Revisa la consola (F12) para más detalles.`, 'bot');
    }
}

async function handleChatSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';

    showTypingIndicator();
    try {
        const response = await state.gemini.sendMessage(text);
        removeTypingIndicator();
        addMessage(response, 'bot');
    } catch (error) {
        removeTypingIndicator();
        addMessage("Error: " + error.message, 'bot');
    }
}

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `chat-bubble chat-${sender} slide-up`;
    div.innerText = text;
    
    const container = document.getElementById('chatMessages');
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
    const div = document.createElement('div');
    div.id = 'typingIndicator';
    div.className = 'chat-bubble chat-bot typing-indicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    document.getElementById('chatMessages').appendChild(div);
}

function removeTypingIndicator() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
}

async function endSimulation() {
    const btn = document.getElementById('analyzeBtn');
    const originalText = btn.innerText;
    btn.innerText = "Analizando...";
    btn.disabled = true;

    try {
        const feedback = await state.gemini.analyzeChat(state.currentScenario.title);
        document.getElementById('feedbackContent').innerHTML = feedback; // Using innerHTML as we asked for HTML tags
        switchScreen('feedback');
    } catch (error) {
        alert("Error al analizar: " + error.message);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}
