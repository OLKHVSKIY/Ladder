// Импортируем конфигурацию Yandex GPT API
import { YANDEX_GPT_CONFIG, getYandexGptApiUrl } from '../config/yandex-gpt-config.js';
import { createTask } from '../modules/tasks.js';

// API ключи не нужны на фронтенде - используется бэкенд прокси
// Ключи хранятся в .env файле и используются только на сервере
const YANDEX_MODELS = YANDEX_GPT_CONFIG.MODELS;

// Состояние создания задачи (для клиентской логики)
let taskCreationState = null;

// Инициализация страницы чата
document.addEventListener('DOMContentLoaded', () => {
    initChatPage();
});

function initChatPage() {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const chatMessages = document.getElementById('chat-messages');
    
    // API ключи хранятся на сервере в .env файле
    // Фронтенд использует бэкенд прокси на localhost:8001
    
    // Инициализация сайдбара
    setupSidebar();
    
    // Инициализация навигации
    setupNavigation();
    
    // Загрузка истории чата
    loadChatHistory();
    
    // Автоматическое изменение высоты textarea
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = `${Math.min(chatInput.scrollHeight, 120)}px`;
    });
    
    // Отправка сообщения по Enter (Shift+Enter для новой строки)
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Отправка по клику на кнопку
    sendBtn.addEventListener('click', sendMessage);
    
    // Функция отправки сообщения
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message || sendBtn.disabled) return;
        
        // Проверяем, является ли это запросом на создание задачи или заметки
        const lowerMessage = message.toLowerCase();
        const hasActionWord = lowerMessage.includes('создай') || 
                             lowerMessage.includes('сделай') || 
                             lowerMessage.includes('напиши') || 
                             lowerMessage.includes('добавь');
        const hasTaskWord = lowerMessage.includes('задач');
        const hasNoteWord = lowerMessage.includes('заметк') && !lowerMessage.includes('задач');
        const isTaskCreationRequest = hasActionWord && hasTaskWord;
        const isNoteCreationRequest = hasActionWord && hasNoteWord;
        
        console.log('Checking task creation request:', { 
            message, 
            lowerMessage, 
            hasActionWord, 
            hasTaskWord, 
            isTaskCreationRequest 
        });
        
        // Если это запрос на создание задачи, проверяем историю ДО сохранения сообщения
        let shouldIntercept = false;
        if (isTaskCreationRequest) {
            const chatHistoryBefore = JSON.parse(localStorage.getItem('chat_history') || '[]');
            console.log('Chat history before:', chatHistoryBefore);
            
            const hasDescriptionQuestion = chatHistoryBefore.some(msg => 
                msg.role === 'assistant' && 
                (msg.text.toLowerCase().includes('будет ли описание') || 
                 msg.text.toLowerCase().includes('описание у задачи') ||
                 msg.text.toLowerCase().includes('будет ли описание у'))
            );
            const hasPriorityQuestion = chatHistoryBefore.some(msg => 
                msg.role === 'assistant' && 
                msg.text.toLowerCase().includes('приоритет')
            );
            
            console.log('Has description question:', hasDescriptionQuestion);
            console.log('Has priority question:', hasPriorityQuestion);
            
            // Если нет ни вопроса про описание, ни вопроса про приоритет - это первое сообщение
            if (!hasDescriptionQuestion && !hasPriorityQuestion) {
                shouldIntercept = true;
                console.log('Should intercept: TRUE - это первое сообщение о создании задачи');
            } else {
                console.log('Should intercept: FALSE - уже был диалог');
            }
        } else {
            console.log('Not a task creation request');
        }
        
        // Обрабатываем создание заметки (просто текст, без даты и приоритета)
        if (isNoteCreationRequest) {
            // Извлекаем текст заметки из сообщения
            let noteText = '';
            const noteMatch = message.match(/(?:создай|сделай|напиши|добавь)\s+заметку\s+(.+)/i);
            if (noteMatch) {
                noteText = noteMatch[1].trim();
            } else {
                // Если не нашли паттерн, берем все после "заметку"
                const simpleMatch = message.split(/заметку/i);
                if (simpleMatch.length > 1) {
                    noteText = simpleMatch.slice(1).join(' ').trim();
                }
            }
            
            if (noteText) {
                // Добавляем сообщение пользователя
                addMessage('user', message);
                chatInput.value = '';
                chatInput.style.height = 'auto';
                
                // Создаем заметку
                await createNoteFromChat(noteText);
                sendBtn.disabled = false;
                chatInput.focus();
                return;
            }
        }
        
        // Добавляем сообщение пользователя
        addMessage('user', message);
        chatInput.value = '';
        chatInput.style.height = 'auto';
        
        // Если нужно перехватить, делаем это сразу и ВЫХОДИМ из функции
        if (shouldIntercept) {
            console.log('🚨 ПЕРЕХВАТЫВАЕМ создание задачи - задаем вопрос про описание');
            
            // Извлекаем дату и название из сообщения
            const dateMatch = message.match(/(\d{1,2})\s*(декабря|января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября)/i);
            let dateText = null;
            if (dateMatch) {
                const day = parseInt(dateMatch[1]);
                const monthName = dateMatch[2];
                dateText = `${day} ${monthName}`;
            }
            
            // Извлекаем название задачи
            let title = '';
            const titleMatch = message.match(/(?:создай|сделай|напиши|добавь)\s+(?:задачу|заметку)\s+на\s+[^:\-]+\s*[:\-]\s*(.+)/i);
            if (titleMatch) {
                title = titleMatch[1].trim();
            } else {
                const simpleMatch = message.match(/(?:создай|сделай|напиши|добавь)\s+(?:задачу|заметку)[:\s]+(.+)/i);
                if (simpleMatch) {
                    title = simpleMatch[1].trim();
                    // Убираем дату из названия, если она там есть
                    title = title.replace(/\d{1,2}\s*(декабря|января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября)/i, '').trim();
                    title = title.replace(/^на\s+[^:\-]+\s*[:\-]\s*/i, '').trim();
                }
            }
            
            // Инициализируем состояние создания задачи
            taskCreationState = {
                step: 'description', // Следующий шаг - вопрос про описание
                date: dateText,
                title: title,
                description: null,
                priority: null
            };
            
            console.log('Task creation state initialized:', taskCreationState);
            
            addMessage('assistant', 'Будет ли описание у задачи?');
            sendBtn.disabled = false;
            chatInput.focus();
            return; // ВАЖНО: выходим из функции, не отправляя запрос к AI
        }
        
        // Обрабатываем ответы пользователя в процессе создания задачи
        if (taskCreationState) {
            const lower = message.toLowerCase().trim();
            
            // Если ожидаем ответ на вопрос про описание
            if (taskCreationState.step === 'description') {
                // Проверяем отрицательные ответы
                const negativePatterns = [
                    /^нет\s*$/i,
                    /^нет\s+не\s+будет/i,
                    /^не\s+будет/i,
                    /^без\s+описания/i,
                    /^описания\s+не\s+будет/i,
                    /^не\s+нужно/i,
                    /^не\s+требуется/i
                ];
                
                // Проверяем положительные ответы
                const positivePatterns = [
                    /^да\s*$/i,
                    /^да\s+будет/i,
                    /^будет/i,
                    /^нужно/i,
                    /^требуется/i
                ];
                
                const isNegative = negativePatterns.some(pattern => pattern.test(lower));
                const isPositive = positivePatterns.some(pattern => pattern.test(lower));
                
                if (isNegative) {
                    // Описание не нужно - переходим к приоритету
                    taskCreationState.description = '';
                    taskCreationState.step = 'priority';
                    console.log('Negative answer - moving to priority step');
                    addMessage('assistant', 'Какой приоритет у задачи? 1, 2 или 3?');
                    sendBtn.disabled = false;
                    chatInput.focus();
                    return;
                } else if (isPositive) {
                    // Описание нужно - спрашиваем про описание
                    taskCreationState.step = 'description_text';
                    console.log('Positive answer - asking for description text');
                    addMessage('assistant', 'Что вы хотите добавить в описание?');
                    sendBtn.disabled = false;
                    chatInput.focus();
                    return;
                }
            }
            
            // Если ожидаем текст описания
            if (taskCreationState.step === 'description_text') {
                taskCreationState.description = message.trim();
                taskCreationState.step = 'priority';
                console.log('Description received - moving to priority step');
                addMessage('assistant', 'Какой приоритет у задачи? 1, 2 или 3?');
                sendBtn.disabled = false;
                chatInput.focus();
                return;
            }
            
            // Если ожидаем приоритет
            if (taskCreationState.step === 'priority') {
                const priorityMatch = message.match(/([123])/);
                if (priorityMatch) {
                    taskCreationState.priority = parseInt(priorityMatch[1]);
                    console.log('Priority received - creating task:', taskCreationState);
                    
                    // Создаем задачу
                    if (taskCreationState.date && taskCreationState.title) {
                        await createTaskFromChat(
                            taskCreationState.date,
                            taskCreationState.title,
                            taskCreationState.description || '',
                            taskCreationState.priority
                        );
                        taskCreationState = null; // Сбрасываем состояние
                        sendBtn.disabled = false;
                        chatInput.focus();
                        return;
                    }
                }
            }
        }
        
        // Показываем индикатор загрузки
        const loadingId = addLoadingMessage();
        
        // Отключаем кнопку отправки
        sendBtn.disabled = true;
        
        try {
            // API ключи хранятся на сервере в .env файле
            // Фронтенд использует бэкенд прокси на localhost:8001
            
            // Получаем контекст (задачи и заметки)
            const context = await getContext(message);
            
            // Получаем историю сообщений из localStorage
            // Исключаем текущее сообщение, так как оно еще не сохранено
            const chatHistory = JSON.parse(localStorage.getItem('chat_history') || '[]');
            
            // Формируем массив сообщений для API
            const messages = [
                {
                    role: 'system',
                    content: context
                }
            ];
            
            // Добавляем историю диалога (последние 10 сообщений для контекста)
            const recentHistory = chatHistory.slice(-10);
            recentHistory.forEach(msg => {
                messages.push({
                    role: msg.role,
                    content: msg.text
                });
            });
            
            // Добавляем текущее сообщение пользователя (оно еще не в истории)
            messages.push({
                role: 'user',
                content: message
            });
            
            console.log('Sending messages to API:', messages.map(m => ({ role: m.role, content: m.content.substring(0, 50) + '...' })));
            
            // Отправляем запрос к Yandex GPT (пробуем разные модели)
            let response;
            let lastError;
            let success = false;
            
            // Используем прокси через бэкенд для обхода CORS
            // Пробуем модели по очереди
            for (const model of YANDEX_MODELS) {
                try {
                    // Используем простой прокси-сервер (порт 8001) или бэкенд (порт 8000)
                    // Простой прокси запускается через: python yandex-gpt-proxy.py
                    const apiUrl = 'http://localhost:8001/api/ai/yandex-gpt/chat';
                    
                    const requestBody = {
                        model: model,
                        messages: messages,
                        temperature: 0.7,
                        max_tokens: 2000
                    };
                    
                    const headers = {
                        'Content-Type': 'application/json'
                    };
                    
                    response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(requestBody)
                    });
                    
                    if (response.ok) {
                        success = true;
                        break; // Успешно, выходим из цикла
                    } else {
                        const errorText = await response.text();
                        let errorData;
                        try {
                            errorData = JSON.parse(errorText);
                        } catch {
                            errorData = { error: errorText };
                        }
                        lastError = { status: response.status, data: errorData, model };
                        console.log(`Модель ${model} недоступна (${response.status}), пробуем следующую...`);
                    }
                } catch (err) {
                    lastError = { error: err, model };
                    console.log(`Ошибка с моделью ${model}:`, err);
                }
            }
            
            if (!success || !response || !response.ok) {
                const errorMsg = lastError?.data?.error?.message || lastError?.data?.message || lastError?.error?.message || 'Не удалось подключиться к API';
                console.error('API Error Details:', lastError);
                throw new Error(`HTTP error! status: ${lastError?.status || 'unknown'}. ${errorMsg}`);
            }
            
            const data = await response.json();
            let assistantMessage = '';
            
            // Парсим ответ от Yandex GPT API
            // Пробуем OpenAI-совместимый формат (API Gateway)
            if (data.choices && data.choices[0] && data.choices[0].message) {
                assistantMessage = data.choices[0].message.content;
            } 
            // Пробуем формат Yandex GPT API
            else if (data.result && data.result.alternatives && data.result.alternatives[0]) {
                assistantMessage = data.result.alternatives[0].message.text;
            } 
            // Альтернативный формат ответа
            else if (data.alternatives && data.alternatives[0] && data.alternatives[0].message) {
                assistantMessage = data.alternatives[0].message.text;
            } else {
                console.error('Unexpected Yandex GPT API response:', data);
                throw new Error('Неверный формат ответа от Yandex GPT API');
            }
            
            // Удаляем индикатор загрузки
            removeLoadingMessage(loadingId);

            // Проверяем, пытается ли AI создать задачу без прохождения всех шагов
            const lowerMessage = message.toLowerCase();
            const isTaskCreationRequest = (lowerMessage.includes('создай') || lowerMessage.includes('сделай') || lowerMessage.includes('напиши') || lowerMessage.includes('добавь')) && 
                                         (lowerMessage.includes('задач') || lowerMessage.includes('заметк'));
            
            // Если это запрос на создание задачи и AI пытается создать задачу
            if (isTaskCreationRequest && assistantMessage.includes('CREATE_TASK:')) {
                // Получаем историю ДО сохранения текущего сообщения (оно еще не сохранено)
                const chatHistory = JSON.parse(localStorage.getItem('chat_history') || '[]');
                
                // Проверяем, был ли задан вопрос про описание в истории
                const hasDescriptionQuestion = chatHistory.some(msg => 
                    msg.role === 'assistant' && 
                    (msg.text.toLowerCase().includes('будет ли описание') || 
                     msg.text.toLowerCase().includes('описание у задачи') ||
                     msg.text.toLowerCase().includes('будет ли описание у'))
                );
                
                // Проверяем, был ли задан вопрос про приоритет
                const hasPriorityQuestion = chatHistory.some(msg => 
                    msg.role === 'assistant' && 
                    msg.text.toLowerCase().includes('приоритет')
                );
                
                // Если не было вопроса про описание И не было вопроса про приоритет - значит это первое сообщение
                if (!hasDescriptionQuestion && !hasPriorityQuestion) {
                    // AI пытается создать задачу без вопроса про описание - перехватываем
                    console.log('AI пытается создать задачу без вопроса про описание, перехватываем');
                    console.log('Chat history:', chatHistory);
                    addMessage('assistant', 'Будет ли описание у задачи?');
                    sendBtn.disabled = false;
                    chatInput.focus();
                    return;
                }
            }

            // Проверяем, нужно ли выполнить действие (создать задачу и т.д.)
            const actionResult = await handleAction(message, assistantMessage);
            
            // Если задача была создана, не показываем ответ нейросети
            if (actionResult) {
                sendBtn.disabled = false;
                chatInput.focus();
                return;
            }
            
            // Убираем технические команды из ответа для пользователя
            if (!assistantMessage.includes('CREATE_TASK:')) {
                const cleanMessage = assistantMessage.replace(/CREATE_TASK:[^:]+:[^:]+:[^:]*:\d+/g, '').trim();
                if (cleanMessage) {
                    addMessage('assistant', cleanMessage);
                }
            } else {
                // Если есть команда CREATE_TASK, но задача не была создана (возможно ошибка), показываем сообщение
                const cleanMessage = assistantMessage.replace(/CREATE_TASK:[^:]+:[^:]+:[^:]*:\d+/g, '').trim();
                if (cleanMessage) {
                    addMessage('assistant', cleanMessage);
                }
            }
            
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
            removeLoadingMessage(loadingId);
            addMessage('assistant', 'Извините, произошла ошибка. Попробуйте еще раз.');
        } finally {
            sendBtn.disabled = false;
            chatInput.focus();
        }
    }
    
    // Добавление сообщения в чат
    function addMessage(role, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'chat-message-avatar';
        avatar.textContent = role === 'user' ? 'Я' : 'AI';
        
        const content = document.createElement('div');
        content.className = 'chat-message-content';
        content.textContent = text;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Сохраняем в историю
        saveChatMessage(role, text);
        
        return messageDiv;
    }
    
    // Добавление индикатора загрузки
    function addLoadingMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message assistant';
        messageDiv.id = 'loading-message';
        
        const avatar = document.createElement('div');
        avatar.className = 'chat-message-avatar';
        avatar.textContent = 'AI';
        
        const content = document.createElement('div');
        content.className = 'chat-message-content loading';
        
        const dots = document.createElement('div');
        dots.className = 'chat-loading-dots';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'chat-loading-dot';
            dots.appendChild(dot);
        }
        content.appendChild(dots);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return 'loading-message';
    }
    
    // Удаление индикатора загрузки
    function removeLoadingMessage(id) {
        const loadingMsg = document.getElementById(id);
        if (loadingMsg) {
            loadingMsg.remove();
        }
    }
    
    // Получение контекста (задачи и заметки)
    async function getContext(userMessage = '') {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const stickers = JSON.parse(localStorage.getItem('notes_stickers') || '[]');
        
        // Получаем текущую дату и неделю
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() + 1); // Понедельник
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        
        const lastWeekStart = new Date(weekStart);
        lastWeekStart.setDate(weekStart.getDate() - 7);
        const lastWeekEnd = new Date(weekStart);
        lastWeekEnd.setDate(weekStart.getDate() - 1);
        lastWeekEnd.setHours(23, 59, 59, 999);
        
        // Фильтруем задачи текущей недели
        const thisWeekTasks = tasks.filter(task => {
            if (!task.due_date) return false;
            const taskDate = new Date(task.due_date);
            return taskDate >= weekStart && taskDate <= weekEnd;
        });
        
        const thisWeekCompleted = thisWeekTasks.filter(t => t.completed).length;
        
        // Фильтруем задачи прошлой недели
        const lastWeekTasks = tasks.filter(task => {
            if (!task.due_date) return false;
            const taskDate = new Date(task.due_date);
            return taskDate >= lastWeekStart && taskDate <= lastWeekEnd;
        });
        
        const lastWeekCompleted = lastWeekTasks.filter(t => t.completed).length;
        
        // Получаем текущий месяц
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        monthStart.setHours(0, 0, 0, 0);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        monthEnd.setHours(23, 59, 59, 999);
        
        // Фильтруем задачи текущего месяца
        const thisMonthTasks = tasks.filter(task => {
            if (!task.due_date) return false;
            const taskDate = new Date(task.due_date);
            return taskDate >= monthStart && taskDate <= monthEnd;
        });
        
        const thisMonthCompleted = thisMonthTasks.filter(t => t.completed).length;
        
        // Получаем прошлый месяц
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        lastMonthStart.setHours(0, 0, 0, 0);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        lastMonthEnd.setHours(23, 59, 59, 999);
        
        // Фильтруем задачи прошлого месяца
        const lastMonthTasks = tasks.filter(task => {
            if (!task.due_date) return false;
            const taskDate = new Date(task.due_date);
            return taskDate >= lastMonthStart && taskDate <= lastMonthEnd;
        });
        
        const lastMonthCompleted = lastMonthTasks.filter(t => t.completed).length;
        
        // Получаем текущую дату для проверки
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
        
        // Получаем текущий язык интерфейса
        const currentLang = localStorage.getItem('language') || 'ru';
        const languageInstructions = {
            'ru': 'Ты - умный ассистент для управления задачами и заметками. ВСЕГДА отвечай ТОЛЬКО на русском языке.',
            'en': 'You are a smart assistant for managing tasks and notes. ALWAYS respond ONLY in English.',
            'es': 'Eres un asistente inteligente para gestionar tareas y notas. SIEMPRE responde SOLO en español.'
        };
        const baseInstruction = languageInstructions[currentLang] || languageInstructions['ru'];
        
        // Формируем контекст для нейросети
        let context = `${baseInstruction}

ВАЖНО: "ЗАДАЧА" и "ЗАМЕТКА" - это РАЗНЫЕ вещи!

ЗАДАЧА:
- Привязана к конкретной дате
- Имеет название, описание (опционально) и приоритет (1, 2 или 3)
- Формат создания: CREATE_TASK:дата:название:описание:приоритет

ЗАМЕТКА:
- Это просто стикер с текстом
- НЕ имеет даты, описания и приоритета
- Формат создания: CREATE_NOTE:текст заметки
- Пример: если пользователь говорит "создай заметку подарить маме подарок", создай заметку с текстом "подарить маме подарок"

СТРОГИЙ АЛГОРИТМ СОЗДАНИЯ ЗАДАЧИ (ВЫПОЛНЯЙ СТРОГО ПО ПОРЯДКУ, НЕ ПРОПУСКАЙ ШАГИ!):

ШАГ 1: Пользователь пишет "создай/сделай/напиши задачу на [дата] - [название]"
  - Если пользователь просит создать "ЗАМЕТКУ" (без даты) - это заметка, создай её сразу командой CREATE_NOTE:текст
  - Если пользователь просит создать "ЗАДАЧУ" (с датой) - извлеки дату и название из сообщения
  - ОБЯЗАТЕЛЬНО задай ТОЛЬКО ОДИН вопрос: "Будет ли описание у задачи?"
  - ЗАПРЕЩЕНО создавать задачу на этом шаге!
  - ЗАПРЕЩЕНО задавать другие вопросы!
  - ЗАПРЕЩЕНО пропускать этот вопрос!

ШАГ 2: Пользователь отвечает про описание
  - Если ответ отрицательный (нет, не будет, без описания, не нужно, не требуется и т.д.) → СРАЗУ переходи к ШАГУ 3 (спроси про приоритет)
  - Если ответ положительный (да, будет, нужно, требуется и т.д.) → СРАЗУ спроси "Что вы хотите добавить в описание?" и дождись ответа пользователя с описанием, затем переходи к ШАГУ 3
  - КРИТИЧЕСКИ ВАЖНО: Если в истории диалога пользователь УЖЕ ответил "да" или "будет" на вопрос про описание, НЕ спрашивай снова "Будет ли описание?"! Сразу спроси "Что вы хотите добавить в описание?"

ШАГ 3: Спроси про приоритет
  - Задай вопрос: "Какой приоритет у задачи? 1, 2 или 3?"
  - Дождись ответа пользователя
  - ЗАПРЕЩЕНО создавать задачу до получения ответа!

ШАГ 4: Создай задачу
  - После получения приоритета (1, 2 или 3) СРАЗУ создай задачу командой: CREATE_TASK:дата:название:описание:приоритет
  - Если приоритет не указан, используй 1
  - Если описание не было (пользователь сказал "нет"), оставь его пустым (два двоеточия подряд: ::)

КРИТИЧЕСКИ ВАЖНО:
- ВСЕГДА начинай с вопроса "Будет ли описание у задачи?" - НИКОГДА не пропускай этот шаг!
- Задавай ТОЛЬКО ОДИН вопрос за раз и дожидайся ответа
- НИКОГДА не задавай несколько вопросов сразу!
- НИКОГДА не создавай задачу сразу после первого сообщения пользователя!
- НИКОГДА не повторяй один и тот же вопрос!
- ДАТА: Если год не указан, используй текущий год (${new Date().getFullYear()})
- ДАТА: НЕЛЬЗЯ создавать задачи в прошлом! Сегодня: ${todayStr}. Если пользователь указал дату в прошлом, скажи: "Нельзя создавать задачи в прошлом. Укажите дату сегодня или в будущем."
- Приоритет должен быть ЧИСЛОМ: 1, 2 или 3
- Формат CREATE_TASK: дата:название:описание:приоритет (пример: CREATE_TASK:27 декабря:собрать лего::2)
- Если описание пустое, используй формат: CREATE_TASK:27 декабря:собрать лего::2 (два двоеточия подряд между названием и приоритетом)
   
2. Анализировать задачи и статистику. Отвечай подробно и дружелюбно.
3. Отвечать на вопросы о задачах и заметках.

СТАТИСТИКА ЗАДАЧ:
- Текущая неделя: ${thisWeekTasks.length} задач (выполнено: ${thisWeekCompleted})
- Прошлая неделя: ${lastWeekTasks.length} задач (выполнено: ${lastWeekCompleted})
- Текущий месяц: ${thisMonthTasks.length} задач (выполнено: ${thisMonthCompleted})
- Прошлый месяц: ${lastMonthTasks.length} задач (выполнено: ${lastMonthCompleted})

ВАЖНО: Когда пользователь спрашивает про "месяц" или "в этом месяце", используй статистику ТЕКУЩЕГО МЕСЯЦА (${thisMonthTasks.length} задач), а не недели!
Когда пользователь спрашивает про "неделю" или "на этой неделе", используй статистику ТЕКУЩЕЙ НЕДЕЛИ (${thisWeekTasks.length} задач).

Статистика:
- Всего задач: ${tasks.length}
- Выполнено задач: ${tasks.filter(t => t.completed).length}
- Задач на этой неделе: ${thisWeekTasks.length}
- Выполнено на этой неделе: ${thisWeekCompleted}
- Выполнено на прошлой неделе: ${lastWeekCompleted}
- Разница: ${thisWeekCompleted - lastWeekCompleted}

Текущие задачи пользователя:\n`;
        
        if (tasks.length > 0) {
            tasks.forEach((task, index) => {
                const dueDate = task.due_date ? new Date(task.due_date).toLocaleDateString('ru-RU') : 'не указана';
                context += `${index + 1}. ${task.title}${task.description ? ' - ' + task.description : ''} (Дата: ${dueDate}, Выполнено: ${task.completed ? 'да' : 'нет'})\n`;
            });
        } else {
            context += 'Нет задач\n';
        }
        
        context += '\nТекущие заметки:\n';
        if (stickers.length > 0) {
            stickers.forEach((sticker, index) => {
                const content = sticker.content.replace(/<[^>]*>/g, '').substring(0, 100);
                context += `${index + 1}. ${content}${sticker.content.length > 100 ? '...' : ''}\n`;
            });
        } else {
            context += 'Нет заметок\n';
        }
        
        context += `\nВажно: 
- Если пользователь просит создать ЗАДАЧУ (с датой), веди диалог с уточнениями. После получения всех данных используй формат CREATE_TASK:дата:название:описание:приоритет
- Если пользователь просит создать ЗАМЕТКУ (без даты), создай её сразу командой CREATE_NOTE:текст заметки (без вопросов про описание и приоритет!)
- Текущий год: ${new Date().getFullYear()}. Если пользователь указал дату без года (например, "28 декабря"), всегда используй текущий год (${new Date().getFullYear()})
- Формат даты в CREATE_TASK должен быть понятным (например, "28 декабря" или "28 декабря 2025"), но если год не указан, система автоматически использует текущий год`;
        
        return context;
    }
    
    // Обработка действий (создание задачи и т.д.)
    async function handleAction(userMessage, assistantMessage) {
        // Проверяем, нужно ли создать заметку
        if (assistantMessage.includes('CREATE_NOTE:')) {
            const match = assistantMessage.match(/CREATE_NOTE:(.+)/);
            if (match) {
                const noteText = match[1].trim();
                await createNoteFromChat(noteText);
                return true; // Действие выполнено
            }
        }
        
        // Проверяем, нужно ли создать задачу
        if (assistantMessage.includes('CREATE_TASK:')) {
            // Более гибкий regex для обработки null или пустых значений
            const match = assistantMessage.match(/CREATE_TASK:([^:]+):([^:]+):([^:]*):([^:\n]+)/);
            if (match) {
                const date = match[1].trim();
                const title = match[2].trim();
                const description = match[3].trim() || '';
                let priority = match[4].trim();
                
                // Обрабатываем приоритет
                if (priority.toLowerCase() === 'null' || priority === '' || priority === 'не требуется') {
                    priority = 1; // Приоритет по умолчанию
                } else {
                    priority = parseInt(priority) || 1;
                }
                
                await createTaskFromChat(date, title, description, priority);
                return true; // Действие выполнено
            }
        }
        
        return false;
    }
    
    // Парсинг даты из текста
    function parseDate(dateText) {
        const now = new Date();
        const currentYear = now.getFullYear();
        
        // Пытаемся распарсить дату
        const dateMatch = dateText.match(/(\d{1,2})\s*(декабря|января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября)/i);
        if (dateMatch) {
            const day = parseInt(dateMatch[1]);
            const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
            const month = monthNames.findIndex(m => m.toLowerCase() === dateMatch[2].toLowerCase());
            if (month !== -1) {
                return new Date(currentYear, month, day);
            }
        }
        
        return null;
    }
    
    // Создание заметки из чата
    async function createNoteFromChat(text) {
        try {
            // Получаем стикеры из localStorage
            const stickersJson = localStorage.getItem('notes_stickers');
            const stickers = stickersJson ? JSON.parse(stickersJson) : [];
            
            // Создаем новый стикер
            const stickerId = Date.now();
            const sticker = {
                id: stickerId,
                content: text,
                color: '#FFEB3B', // Желтый по умолчанию
                height: 200,
                locked: false,
                position: {
                    x: Math.random() * 300 + 20,
                    y: Math.random() * 400 + 100
                }
            };
            
            // Сохраняем в localStorage
            stickers.push(sticker);
            localStorage.setItem('notes_stickers', JSON.stringify(stickers));
            
            // Показываем сообщение об успехе
            addMessage('assistant', `✅ Заметка создана: "${text}"`);
            
            console.log('Note created successfully:', sticker);
        } catch (error) {
            console.error('Error creating note:', error);
            addMessage('assistant', '❌ Ошибка при создании заметки. Попробуйте еще раз.');
        }
    }
    
    // Создание задачи из чата
    async function createTaskFromChat(dateText, title, description, priority) {
        try {
            // Очищаем название от лишних частей
            let cleanTitle = title.trim();
            // Убираем возможные префиксы типа "на 29 декабря - " или "на 29 декабря: "
            cleanTitle = cleanTitle.replace(/^на\s+\d{1,2}\s+[а-яё]+\s*[:\-]\s*/i, '').trim();
            
            console.log('Creating task:', { dateText, title: cleanTitle, description, priority });
            
            // Парсим дату
            console.log('Parsing date:', dateText);
            const date = parseDate(dateText);
            if (!date) {
                console.error('Failed to parse date:', dateText);
                addMessage('assistant', '❌ Не удалось распознать дату. Попробуйте еще раз.');
                return;
            }
            
            // Проверяем, что дата правильно распарсена
            console.log('Parsed date:', date, 'Day:', date.getDate(), 'Month:', date.getMonth() + 1, 'Year:', date.getFullYear());
            
            // Извлекаем ожидаемый день и месяц из исходного текста
            const dateMatch = dateText.match(/(\d{1,2})\s*(декабря|января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября)/i);
            if (!dateMatch) {
                console.error('Failed to extract date from text:', dateText);
                addMessage('assistant', '❌ Не удалось распознать дату. Попробуйте еще раз.');
                return;
            }
            
            const expectedDay = parseInt(dateMatch[1]);
            const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
            const monthIndex = monthNames.findIndex(m => m.toLowerCase() === dateMatch[2].toLowerCase());
            
            if (monthIndex === -1) {
                console.error('Failed to find month:', dateMatch[2]);
                addMessage('assistant', '❌ Не удалось распознать месяц. Попробуйте еще раз.');
                return;
            }
            
            // Используем ожидаемые значения напрямую, чтобы избежать проблем с часовыми поясами
            const year = date.getFullYear();
            const month = monthIndex + 1; // Месяц в формате 1-12
            const day = expectedDay;
            
            // Форматируем дату напрямую, без использования методов Date, которые могут сдвинуть дату
            const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            // Проверяем, что дата не в прошлом
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const taskDate = new Date(year, monthIndex, expectedDay);
            taskDate.setHours(0, 0, 0, 0);
            
            if (taskDate < today) {
                addMessage('assistant', '❌ Нельзя создавать задачи в прошлом. Укажите дату сегодня или в будущем.');
                return;
            }
            
            console.log('Task data:', { formattedDate, expectedDay, month, year, cleanTitle, description, priority });
            
            // Проверяем, что описание не содержит отрицательных ответов (это был ответ на вопрос, а не описание)
            let cleanDescription = description;
            const negativePatterns = [
                /^нет\s*$/i,
                /^нет\s+не\s+будет/i,
                /^не\s+будет/i,
                /^без\s+описания/i,
                /^описания\s+не\s+будет/i,
                /^не\s+нужно/i,
                /^не\s+требуется/i
            ];
            
            if (cleanDescription) {
                const trimmedDesc = cleanDescription.trim();
                const isNegative = negativePatterns.some(pattern => pattern.test(trimmedDesc));
                if (isNegative) {
                    cleanDescription = '';
                    console.log('Cleaned description - removed negative answer');
                }
            }
            
            // Создаем задачу
            const taskData = {
                title: cleanTitle,
                description: cleanDescription || '',
                priority: priority || 1,
                due_date: formattedDate,
                completed: false
            };
            
            const newTask = await createTask(taskData);
            console.log('Task created successfully:', newTask);
            
            // Проверяем, что задача действительно сохранена
            const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            const foundTask = savedTasks.find(t => t.id === newTask.id);
            console.log('Tasks in localStorage:', savedTasks.length);
            console.log('Created task found in storage:', foundTask);
            
            if (!foundTask) {
                console.error('ERROR: Task was not saved to localStorage!');
                addMessage('assistant', '❌ Ошибка: задача не была сохранена. Попробуйте еще раз.');
                return;
            }
            
            // Показываем уведомление с правильной датой (используем очищенное описание)
            const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
            const descriptionText = cleanDescription ? `\n📝 Описание: ${cleanDescription}` : '';
            addMessage('assistant', `✅ Задача создана на ${dateStr}: "${cleanTitle}"${descriptionText}\n🎯 Приоритет: ${priority}`);
            
            // Обновляем статистику в панели приветствия, если она есть
            if (window.greetingPanel) {
                window.greetingPanel.updateStats();
            }
            
            // Если мы на странице задач, обновляем список задач
            if (window.location.pathname.includes('tasks.html')) {
                // Перезагружаем страницу задач, чтобы показать новую задачу
                // Или можно вызвать функцию обновления, если она доступна
                setTimeout(() => {
                    if (window.loadTasksForDate) {
                        const currentDate = new Date(formattedDate);
                        window.loadTasksForDate(currentDate);
                    } else {
                        // Если функция недоступна, просто перезагружаем страницу
                        window.location.reload();
                    }
                }, 500);
            }
        } catch (error) {
            console.error('Ошибка при создании задачи:', error);
            addMessage('assistant', '❌ Произошла ошибка при создании задачи. Попробуйте еще раз.');
        }
    }
    
    // Сохранение сообщения в историю
    function saveChatMessage(role, text) {
        const history = JSON.parse(localStorage.getItem('chat_history') || '[]');
        history.push({ role, text, timestamp: Date.now() });
        // Храним последние 100 сообщений
        if (history.length > 100) {
            history.shift();
        }
        localStorage.setItem('chat_history', JSON.stringify(history));
    }
    
    // Загрузка истории чата
    function loadChatHistory() {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        // Очищаем контейнер перед загрузкой истории
        chatMessages.innerHTML = '';
        
        const history = JSON.parse(localStorage.getItem('chat_history') || '[]');
        history.forEach(msg => {
            // Добавляем сообщение напрямую, без сохранения в историю (чтобы избежать дублирования)
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${msg.role}`;
            
            const avatar = document.createElement('div');
            avatar.className = 'chat-message-avatar';
            avatar.textContent = msg.role === 'user' ? 'Я' : 'AI';
            
            const content = document.createElement('div');
            content.className = 'chat-message-content';
            content.textContent = msg.text;
            
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(content);
            
            chatMessages.appendChild(messageDiv);
        });
        
        // Прокручиваем вниз после загрузки
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Очистка истории чата
    function clearChatHistory() {
        localStorage.removeItem('chat_history');
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
        console.log('История чата очищена');
    }
    
    // Инициализация сайдбара
    function setupSidebar() {
    const burgerMenu = document.getElementById('burger-menu');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    if (burgerMenu && sidebarOverlay) {
        burgerMenu.addEventListener('click', () => {
            sidebarOverlay.classList.toggle('active');
            document.body.classList.toggle('sidebar-open');
        });
        
        sidebarOverlay.addEventListener('click', (e) => {
            if (e.target === sidebarOverlay) {
                sidebarOverlay.classList.remove('active');
                document.body.classList.remove('sidebar-open');
            }
        });
        
        // Обработка действий сайдбара
        const sidebarItems = sidebarOverlay.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                handleSidebarAction(action);
            });
        });
    }
}

    function handleSidebarAction(action) {
        switch (action) {
            case 'chat':
                window.location.href = '/public/chat.html';
                break;
            case 'tasks':
                window.location.href = '/public/tasks.html';
                break;
            case 'info':
                console.log('Информация');
                break;
            case 'support':
                console.log('Поддержка');
                break;
            case 'suggest':
                console.log('Предложить идею');
                break;
            case 'about':
                console.log('О нас');
                break;
        }
    }
    
    // Инициализация навигации
    function setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item[data-page]');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                if (page === 'tasks') {
                    window.location.href = '/public/tasks.html';
                } else if (page === 'notes') {
                    window.location.href = '/public/notes.html';
                } else if (page === 'gpt') {
                    window.location.href = '/public/gpt-plan.html';
                } else if (page === 'plan') {
                    console.log('План - страница в разработке');
                }
            });
        });
    }
}

