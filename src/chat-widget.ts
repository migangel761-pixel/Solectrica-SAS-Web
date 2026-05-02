import { GoogleGenAI } from "@google/genai";

// Chat Widget for Soléctrica using Gemini API
(function() {
    const SYSTEM_INSTRUCTION = `Eres Jessy, la asistente virtual experta de Soléctrica. Tu objetivo es ayudar a clientes comerciales e industriales a entender su consumo energético y cómo Soléctrica puede ayudarles a ahorrar mediante monitoreo IoT (JESSY), infraestructura eléctrica y energía solar. Eres profesional, técnica pero accesible, proyectas confianza y eficiencia. Siempre invitas al usuario a solicitar un diagnóstico gratuito si detectas interés en ahorrar. Si no conoces una respuesta, invita al usuario a dejar sus datos en el formulario de contacto.`;

    // Initialize Gemini API
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Styles
    const styles = `
        #chat-widget-container {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 1000;
            font-family: 'Inter', sans-serif;
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        #chat-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #DFBD21;
            color: #0A0F1F;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        }
        #chat-button:hover {
            transform: scale(1.1) rotate(5deg);
            box-shadow: 0 6px 25px rgba(223, 189, 33, 0.4);
        }
        #chat-window {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.25);
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid rgba(0,0,0,0.05);
            transform-origin: bottom right;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        #chat-window.active {
            display: flex;
            animation: chatAppear 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes chatAppear {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        #chat-header {
            background: #0A0F1F;
            color: white;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        #chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            background: #fcfcfd;
            scroll-behavior: smooth;
        }
        .message {
            max-width: 85%;
            padding: 12px 16px;
            border-radius: 16px;
            font-size: 14px;
            line-height: 1.5;
            position: relative;
            animation: messageFadeIn 0.3s ease forwards;
        }
        @keyframes messageFadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .message.bot {
            align-self: flex-start;
            background: #f1f2f4;
            color: #1a1d21;
            border-bottom-left-radius: 4px;
        }
        .message.user {
            align-self: flex-end;
            background: #DFBD21;
            color: #0A0F1F;
            border-bottom-right-radius: 4px;
        }
        .message.error {
            align-self: center;
            background: #fee2e2;
            color: #991b1b;
            font-size: 12px;
            border-radius: 8px;
            max-width: 90%;
            text-align: center;
        }
        #chat-input-container {
            padding: 16px;
            background: white;
            border-top: 1px solid #f0f0f0;
            display: flex;
            gap: 8px;
        }
        #chat-input {
            flex: 1;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 10px 16px;
            outline: none;
            font-size: 14px;
            transition: all 0.2s;
        }
        #chat-input:focus {
            border-color: #DFBD21;
            box-shadow: 0 0 0 3px rgba(223, 189, 33, 0.1);
        }
        #chat-submit {
            background: #DFBD21;
            border: none;
            border-radius: 12px;
            width: 42px;
            height: 42px;
            cursor: pointer;
            color: #0A0F1F;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        #chat-submit:hover {
            background: #e9c836;
            transform: translateY(-1px);
        }
        #chat-submit:disabled {
            background: #f3f4f6;
            color: #9ca3af;
            cursor: not-allowed;
            transform: none;
        }
        /* Typing Dots Animation */
        .typing-indicator {
            display: flex;
            gap: 4px;
            padding: 12px 16px;
            background: #f1f2f4;
            border-radius: 16px;
            border-bottom-left-radius: 4px;
            width: fit-content;
            margin-bottom: 12px;
            animation: messageFadeIn 0.3s ease forwards;
        }
        .typing-dot {
            width: 6px;
            height: 6px;
            background: #6b7280;
            border-radius: 50%;
            animation: dotWave 1.3s infinite ease-in-out;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotWave {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-4px); }
        }
    `;

    // Add styles to head
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Create Elements
    const container = document.createElement('div');
    container.id = 'chat-widget-container';
    container.innerHTML = `
        <div id="chat-window">
            <div id="chat-header">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 36px; height: 36px; background: #DFBD21; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(223, 189, 33, 0.3);">
                        <span style="font-weight: bold; font-size: 14px; color: #0A0F1F;">J</span>
                    </div>
                    <div>
                        <div style="font-weight: bold; font-size: 14px; letter-spacing: -0.01em;">Jessy AI</div>
                        <div style="font-size: 11px; color: #4ade80; display: flex; align-items: center; gap: 4px;">
                            <span style="width: 6px; height: 6px; background: #4ade80; border-radius: 50%;"></span>
                            Especialista Soléctrica
                        </div>
                    </div>
                </div>
                <button id="chat-close" style="background: none; border: none; color: white; opacity: 0.6; cursor: pointer; padding: 5px; transition: opacity 0.2s;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div id="chat-messages">
                <div class="message bot">¡Hola! 👋 Soy <b>Jessy</b>, tu asistente de Soléctrica. <br><br>¿Te gustaría saber cómo reducir tu factura de energía o necesitas información sobre nuestros proyectos solares?</div>
            </div>
            <div id="chat-input-container">
                <input type="text" id="chat-input" placeholder="Pregúntame lo que quieras...">
                <button id="chat-submit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        </div>
        <div id="chat-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
    `;
    document.body.appendChild(container);

    // Logic
    const chatButton = document.getElementById('chat-button') as HTMLDivElement;
    const chatWindow = document.getElementById('chat-window') as HTMLDivElement;
    const chatClose = document.getElementById('chat-close') as HTMLButtonElement;
    const chatInput = document.getElementById('chat-input') as HTMLInputElement;
    const chatSubmit = document.getElementById('chat-submit') as HTMLButtonElement;
    const chatMessages = document.getElementById('chat-messages') as HTMLDivElement;

    const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
            systemInstruction: SYSTEM_INSTRUCTION
        }
    });

    const toggleChat = () => {
        const isActive = chatWindow.classList.toggle('active');
        if (isActive) {
            chatInput.focus();
            scrollToBottom();
        }
    };

    chatButton.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);
    chatClose.addEventListener('mouseover', () => chatClose.style.opacity = '1');
    chatClose.addEventListener('mouseout', () => chatClose.style.opacity = '0.6');

    const scrollToBottom = () => {
        setTimeout(() => {
            chatMessages.scrollTo({
                top: chatMessages.scrollHeight,
                behavior: 'smooth'
            });
        }, 50);
    };

    const addMessage = (text: string, sender: 'bot' | 'user' | 'error') => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        if (sender === 'bot') {
            // Handle bold text and line breaks for better formatting
            msgDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
        } else {
            msgDiv.innerText = text;
        }
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    };

    const createTypingIndicator = () => {
        const div = document.createElement('div');
        div.className = 'typing-indicator';
        div.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        return div;
    };

    const sendMessage = async () => {
        const text = chatInput.value.trim();
        if (!text || chatSubmit.disabled) return;

        addMessage(text, 'user');
        chatInput.value = '';
        chatSubmit.disabled = true;

        // Add typing indicator
        const typingIndicator = createTypingIndicator();
        chatMessages.appendChild(typingIndicator);
        scrollToBottom();

        try {
            const result = await chat.sendMessage({
                message: text
            });
            
            typingIndicator.remove();
            chatSubmit.disabled = false;

            if (result.text) {
                addMessage(result.text, 'bot');
            } else {
                throw new Error("Empty response");
            }
        } catch (error) {
            console.error("Chat error:", error);
            typingIndicator.remove();
            chatSubmit.disabled = false;
            
            const errorMessage = (error instanceof Error && error.message.includes("API key")) 
                ? "Disculpa, el servicio está en mantenimiento. Inténtalo en un momento." 
                : "He tenido un problema al procesar tu mensaje. ¿Podrías volver a intentarlo?";
            
            addMessage(errorMessage, 'error');
        }
    };

    chatSubmit.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
})();
