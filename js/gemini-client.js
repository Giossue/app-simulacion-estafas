class GeminiClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = null;
        this.history = [];
    }

    setSystemPrompt(prompt) {
        this.history = [
            {
                role: "user",
                parts: [{ text: prompt }]
            },
            {
                role: "model",
                parts: [{ text: "Entendido. Empezaré la simulación ahora." }]
            }
        ];
    }

    async resolveModelUrl() {
        if (this.baseUrl) return this.baseUrl;

        try {
            console.log("Detecting available models...");
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`);
            if (!response.ok) throw new Error("Failed to list models");
            
            const data = await response.json();
            const models = data.models || [];
            
            // Priority list of models to look for
            const preferences = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-latest'];
            let selectedModel = null;

            // Try to find a preferred model
            for (const pref of preferences) {
                const match = models.find(m => m.name.includes(pref) && m.supportedGenerationMethods.includes('generateContent'));
                if (match) {
                    selectedModel = match.name;
                    break;
                }
            }

            // Fallback: any model with 'gemini' and 'generateContent'
            if (!selectedModel) {
                const fallback = models.find(m => m.name.includes('gemini') && m.supportedGenerationMethods.includes('generateContent'));
                if (fallback) selectedModel = fallback.name;
            }

            if (!selectedModel) {
                throw new Error("No compatible Gemini model found for this API Key.");
            }

            console.log(`Auto-selected model: ${selectedModel}`);
            // Ensure we don't double prefix if the API returns 'models/...'
            const modelName = selectedModel.startsWith('models/') ? selectedModel : `models/${selectedModel}`;
            this.baseUrl = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent`;
            
        } catch (error) {
            console.error("Model resolution failed, using default fallback:", error);
            // Absolute fallback
            this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        }
        
        return this.baseUrl;
    }

    async sendMessage(message) {
        this.history.push({
            role: "user",
            parts: [{ text: message }]
        });

        const url = await this.resolveModelUrl();

        try {
            const response = await fetch(`${url}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: this.history
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Gemini API Detailed Error:', errorData);
                throw new Error(errorData.error?.message || 'Error en la API de Gemini');
            }

            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;

            this.history.push({
                role: "model",
                parts: [{ text: text }]
            });

            return text;
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    }

    async analyzeChat(scenarioContext) {
        const analysisPrompt = `
            Analiza la conversación anterior. El usuario estaba participando en una simulación de estafa tipo: "${scenarioContext}".
            
            Provee un feedback educativo en formato HTML simple (sin markdown, usa <b>, <ul>, <li>, <p>).
            Estructura la respuesta así:
            1. <p><b>Veredicto:</b> [¿El usuario cayó o se defendió bien?]</p>
            2. <p><b>Banderas Rojas (Red Flags):</b></p> <ul>[Lista de señales de estafa que aparecieron]</ul>
            3. <p><b>Consejo de Seguridad:</b> [Recomendación clave para evitar esto en la vida real]</p>
            
            Sé directo y educativo.
        `;

        const analysisHistory = [...this.history, {
            role: "user",
            parts: [{ text: analysisPrompt }]
        }];

        const url = await this.resolveModelUrl();

        try {
            const response = await fetch(`${url}?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: analysisHistory })
            });
            
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            return "No se pudo generar el análisis. Error de conexión.";
        }
    }
}
