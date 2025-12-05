# Scam Simulator AI – Mobile PWA

## 📱 Descripción del Proyecto
Aplicación móvil **Progressive Web App (PWA)** que simula estafas digitales comunes en Ecuador mediante inteligencia artificial. La aplicación entrena a usuarios en la identificación y prevención de fraudes digitales a través de conversaciones interactivas con un modelo de lenguaje (Gemini/LLM) que actúa como estafador, adaptándose a datos del usuario (nombre, edad) y ofreciendo escenarios realistas en un entorno 100% seguro y educativo.

## 🎯 Objetivos

### Objetivo General
Desarrollar una aplicación móvil educativa que simule estafas digitales para entrenar a usuarios ecuatorianos en su identificación y prevención.

### Objetivos Específicos
- Crear una PWA con interfaz móvil intuitiva y responsiva
- Implementar al menos **5 escenarios de estafa comunes** en Ecuador
- Personalizar interacciones con nombre y edad del usuario
- Garantizar entorno seguro **sin almacenamiento de datos personales**
- Permitir reinicio y práctica de múltiples escenarios
- Integrar modelo de IA (Gemini) para conversaciones realistas

## 📊 Características Principales

### ✅ Qué hace
- **Personalización**: Solicita nombre y edad para adaptar lenguaje (ej: casual <40, respetuoso >50)
- **Escenarios Incluidos**:
  1. Familiar en apuros
  2. Phishing bancario
  3. Códigos de verificación falsos
  4. Lotería falsa
  5. Falso soporte técnico
- **Chat Interactivo**: IA responde dinámicamente siguiendo guiones adaptados
- **Feedback Educativo**: Pantalla de análisis post-simulación con:
  - Explicación de ingeniería social aplicada
  - "Banderas rojas" identificadas
  - Recomendaciones de seguridad específicas
- **Reinicio**: Botón para nuevas conversaciones
- **Modo PWA**: Instalable en dispositivos móviles

### ❌ Qué NO hace
- No realiza acciones maliciosas reales
- No almacena datos personales
- No es antivirus ni software de seguridad
- No evalúa con "ganaste/perdiste" (enfoque educativo)

## 🛠️ Tecnologías y Arquitectura

### Stack Técnico
- **Frontend**: PWA (HTML5, CSS3, JavaScript)
- **Framework CSS**: Tailwind CSS
- **Lógica Frontend**: JavaScript vanilla/ES6+
- **Integración IA**: Gemini API (u otro LLM)
- **Backend**: Serverless Functions (opcional para seguridad de API Key)
- **Hosting**: Plataforma estática (Netlify, Vercel, GitHub Pages)

### Arquitectura Propuesta
```
Usuario → PWA Frontend → [Opcional: Backend Proxy] → Gemini API
        ↓
  Service Worker (PWA)
        ↓
  Almacenamiento Local (solo sesión)
```

## 📱 Flujo de la Aplicación

1. **Pantalla Inicial**
   - Ingreso de nombre y edad
   - Breve introducción educativa

2. **Selección de Escenario**
   - Cards con los 5 tipos de estafa
   - Descripción breve de cada uno

3. **Simulación de Chat**
   - Interfaz tipo WhatsApp/Telegram
   - IA inicia conversación como estafador
   - Usuario responde libremente
   - Botón "Analizar y Detener" disponible

4. **Pantalla de Feedback**
   - Desglose educativo del escenario
   - Explicación de técnicas usadas
   - Consejos de prevención

5. **Reinicio o Nuevo Escenario**

## 🔒 Seguridad y Privacidad

- **Sin almacenamiento persistente**: Todos los datos se eliminan al cerrar la aplicación
- **API Key protegida**: Usar backend proxy o variables de entorno en despliegue
- **Contención de IA**: Prompts diseñados para limitar respuestas a rol de estafador
- **Certificado HTTPS**: Obligatorio para funcionalidades PWA

## 🚀 Metodología de Desarrollo

### Fase 1: MVP (Producto Mínimo Viable)
1. Interfaz de chat básica (PWA)
2. Integración con Gemini API (1 escenario)
3. Pantalla de feedback educativo
4. Funcionalidad de reinicio

### Fase 2: Escalabilidad
1. Implementar los 5 escenarios
2. Mejoras de UI/UX móvil
3. Sistema de puntuación educativa
4. Guía de seguridad estática

### Fase 3: Mejoras
1. Elementos multimedia (imágenes falsas)
2. Más escenarios
3. Estadísticas de aprendizaje
4. Modo "examen"

## 📋 Requisitos Técnicos

### Para Desarrollo
- Navegador moderno con soporte PWA
- Cuenta en Google AI Studio (Gemini API)
- Editor de código (VS Code recomendado)
- Node.js (para herramientas de build opcional)

### Para Usuarios
- Dispositivo móvil Android/iOS
- Conexión a Internet (para IA)
- Navegador compatible con PWA (Chrome, Safari, Edge)

## 🏗️ Estructura del Proyecto

```
scam-simulator-pwa/
├── index.html              # Punto de entrada PWA
├── manifest.json           # Configuración PWA
├── service-worker.js       # Service Worker para offline
├── css/
│   └── styles.css         # Estilos principales (Tailwind CDN)
├── js/
│   ├── app.js             # Lógica principal
│   ├── gemini-client.js   # Cliente para API Gemini
│   └── pwa-handler.js     # Manejo de instalación PWA
├── scenarios/             # Definición de escenarios
│   └── *.json            # Prompts y configuración por escenario
└── assets/               # Imágenes, iconos PWA
```

## 🧪 Pruebas y Validación

### Pruebas por Realizar
- ✅ Flujo de usuario completo
- ✅ Responsividad móvil
- ✅ Integración con Gemini API
- ✅ Funcionalidad offline básica (PWA)
- ✅ Seguridad (no almacenamiento de datos)
- ✅ Rendimiento en dispositivos móviles

### Métricas de Éxito
- Tiempo de interacción por sesión (>5 minutos)
- Número de escenarios completados por usuario
- Feedback positivo sobre realismo educativo
- Instalaciones PWA exitosas

## 🌟 Características PWA

- **Instalable**: Añadir a pantalla de inicio
- **Offline**: Funcionalidad básica sin conexión
- **Notificaciones push** (opcional futuro)
- **Actualizaciones automáticas**
- **Experiencia nativa** en móvil

## 📚 Recursos y Referencias

### Investigación Local
- [Alertas – EcuCERT de Arcotel](https://www.ecucert.gob.ec/alertas/)
- Estafas comunes reportadas en Ecuador
- Terminología y modismos locales

### Tecnológicos
- [Documentación Gemini API](https://ai.google.dev/)
- [Guía PWA de Google](https://web.dev/learn/pwa/)
- [Tailwind CSS](https://tailwindcss.com/)

## 👥 Equipo y Contribución

Proyecto desarrollado como parte del curso de Simulación/Programación Móvil de la Universidad Estatal de Bolívar.

**Integrantes iniciales:**
- Doménica Arias
- Mateo Ladino
- Josué Pintado
- Jennifer Alcivar
- Edison Aucatoma
- Gilson Yanez
- Sebastián Valverde
- Vicente Caizaguano
- Rimax Chela
- Rinna Muguicha

## 📄 Licencia

Proyecto educativo sin fines de lucro. Código abierto para fines académicos.

---

*"Conocimiento que protege: cada simulación es un paso hacia un Ecuador más seguro digitalmente."*