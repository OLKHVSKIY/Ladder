// Инициализация страницы заметок
document.addEventListener('DOMContentLoaded', () => {
    initNotesPage();
});

function initNotesPage() {
    // Обработчик клика на кнопку + в нижней навигации
    const addBtn = document.getElementById('add-task-btn') || document.querySelector('.nav-add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openNoteEditor();
        });
    }
    
    // Инициализация сайдбара
    setupSidebar();
    
    // Инициализация навигации
    setupNavigation();
    
    // Обработчик кнопки настроек
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            window.location.href = '/public/settings.html';
        });
    }
    
    // Загрузка сохраненных стикеров
    loadStickers();
    
    // Показываем пустое состояние, если стикеров нет
    updateEmptyState();
    
    // Обработчик изменения размера окна для адаптивности
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // При изменении размера окна можно автоматически выровнять стикеры
            // или просто обновить высоту контента
            updateContentHeight();
        }, 300);
    });
}

function openNoteEditor(stickerId = null) {
    // Проверяем, не открыт ли уже редактор
    if (document.getElementById('note-editor-overlay')) {
        return;
    }
    
    // Создаем overlay
    const overlay = document.createElement('div');
    overlay.id = 'note-editor-overlay';
    overlay.className = 'note-editor-overlay';
    
    // Создаем контейнер заметки
    const noteContainer = document.createElement('div');
    noteContainer.className = 'note-editor-container';
    noteContainer.id = 'note-editor-container';
    
    // Панель инструментов
    const toolbar = document.createElement('div');
    toolbar.className = 'note-toolbar';
    toolbar.innerHTML = `
        <div class="toolbar-group">
            <button class="toolbar-btn" data-command="bold" title="Жирный">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                </svg>
            </button>
            <button class="toolbar-btn" data-command="italic" title="Курсив">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="19" y1="4" x2="10" y2="4"></line>
                    <line x1="14" y1="20" x2="5" y2="20"></line>
                    <line x1="15" y1="4" x2="9" y2="20"></line>
                </svg>
            </button>
            <button class="toolbar-btn" data-command="underline" title="Подчеркнутый">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
                    <line x1="4" y1="21" x2="20" y2="21"></line>
                </svg>
            </button>
        </div>
        <div class="toolbar-group">
            <button class="toolbar-btn" data-command="formatBlock" data-value="h1" title="Заголовок 1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 4h12v4H6z"></path>
                    <path d="M6 12h12v4H6z"></path>
                    <path d="M6 20h12v4H6z"></path>
                </svg>
            </button>
            <button class="toolbar-btn" data-command="formatBlock" data-value="h2" title="Заголовок 2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 4h10v3H6z"></path>
                    <path d="M6 12h10v3H6z"></path>
                    <path d="M6 20h10v3H6z"></path>
                </svg>
            </button>
            <button class="toolbar-btn" data-command="insertUnorderedList" title="Маркированный список">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="4" cy="6" r="1.5"></circle>
                    <circle cx="4" cy="12" r="1.5"></circle>
                    <circle cx="4" cy="18" r="1.5"></circle>
                    <line x1="8" y1="6" x2="20" y2="6"></line>
                    <line x1="8" y1="12" x2="20" y2="12"></line>
                    <line x1="8" y1="18" x2="20" y2="18"></line>
                </svg>
            </button>
            <button class="toolbar-btn" data-command="insertOrderedList" title="Нумерованный список">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="4" y1="6" x2="20" y2="6"></line>
                    <line x1="4" y1="12" x2="20" y2="12"></line>
                    <line x1="4" y1="18" x2="20" y2="18"></line>
                </svg>
            </button>
        </div>
        <div class="toolbar-group">
            <button class="toolbar-btn" data-command="outdent" title="Уменьшить отступ">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="4" y1="12" x2="20" y2="12"></line>
                    <polyline points="8 8 4 12 8 16"></polyline>
                </svg>
            </button>
            <button class="toolbar-btn" data-command="indent" title="Увеличить отступ">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="4" y1="12" x2="20" y2="12"></line>
                    <polyline points="16 8 20 12 16 16"></polyline>
                </svg>
            </button>
        </div>
        <div class="toolbar-actions">
            <button class="toolbar-btn toolbar-btn-close" id="note-editor-close" title="Закрыть">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `;
    
    // Область редактирования
    const editor = document.createElement('div');
    editor.className = 'note-editor';
    editor.contentEditable = true;
    editor.setAttribute('data-placeholder', 'Начните писать...');
    
    // Загружаем содержимое стикера, если это редактирование
    if (stickerId) {
        const stickers = getStickers();
        const sticker = stickers.find(s => s.id === stickerId);
        if (sticker) {
            editor.innerHTML = sticker.content;
        }
    }
    
    // Ресайзер для изменения высоты
    const resizer = document.createElement('div');
    resizer.className = 'note-resizer';
    
    // Кнопка прикрепить/сохранить
    const attachBtn = document.createElement('button');
    attachBtn.className = 'note-attach-btn';
    const attachText = window.i18n ? (stickerId ? window.i18n.t('common.save') : window.i18n.t('notes.attach')) : (stickerId ? 'Сохранить' : 'Прикрепить');
    attachBtn.innerHTML = `
        <span>${attachText}</span>
    `;
    
    // Сохраняем stickerId в контейнере для использования в обработчиках
    noteContainer.dataset.stickerId = stickerId || '';
    
    // Собираем структуру
    noteContainer.appendChild(toolbar);
    noteContainer.appendChild(editor);
    noteContainer.appendChild(resizer);
    noteContainer.appendChild(attachBtn);
    overlay.appendChild(noteContainer);
    document.body.appendChild(overlay);
    
    // Анимация появления
    setTimeout(() => {
        overlay.classList.add('active');
        noteContainer.classList.add('active');
    }, 10);
    
    // Фокус на редактор
    editor.focus();
    
    // Обработчики событий
    setupNoteEditorHandlers(overlay, noteContainer, editor, toolbar, resizer, attachBtn, stickerId);
}

function setupNoteEditorHandlers(overlay, container, editor, toolbar, resizer, attachBtn, stickerId = null) {
    // Закрытие редактора
    const closeBtn = toolbar.querySelector('#note-editor-close');
    closeBtn.addEventListener('click', () => {
        closeNoteEditor(overlay);
    });
    
    // Закрытие при клике на overlay
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeNoteEditor(overlay);
        }
    });
    
    // Обработчик кнопки "Прикрепить"/"Сохранить"
    attachBtn.addEventListener('click', () => {
        const content = editor.innerHTML.trim();
        if (!content || content === '<br>') {
            alert('Введите текст заметки');
            return;
        }
        
        if (stickerId) {
            // Обновляем существующий стикер
            const stickers = getStickers();
            const stickerIndex = stickers.findIndex(s => s.id === stickerId);
            if (stickerIndex !== -1) {
                stickers[stickerIndex].content = content;
                
                // Обновляем стикер в DOM
                const stickerElement = document.querySelector(`[data-sticker-id="${stickerId}"]`);
                if (stickerElement) {
                    const contentElement = stickerElement.querySelector('.sticker-content');
                    if (contentElement) {
                        contentElement.innerHTML = content;
                        // Пересчитываем высоту
                        setTimeout(() => {
                            const contentHeight = contentElement.scrollHeight;
                            const headerHeight = stickerElement.querySelector('.sticker-header').offsetHeight;
                            const resizerHeight = stickerElement.querySelector('.sticker-resizer')?.offsetHeight || 0;
                            const totalHeight = Math.max(150, contentHeight + headerHeight + resizerHeight);
                            stickers[stickerIndex].height = totalHeight;
                            stickerElement.style.height = `${totalHeight}px`;
                            saveStickers(stickers);
                            updateContentHeight();
                        }, 50);
                    }
                } else {
                    // Если элемент не найден, просто сохраняем
                    saveStickers(stickers);
                }
            }
        } else {
            // Создаем новый стикер
            createSticker(content);
        }
        
        // Закрываем редактор
        closeNoteEditor(overlay);
        
        // Очищаем редактор
        editor.innerHTML = '';
    });
    
    // Обработчики кнопок панели инструментов
    const toolbarBtns = toolbar.querySelectorAll('.toolbar-btn:not(.toolbar-btn-close)');
    toolbarBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const command = btn.dataset.command;
            const value = btn.dataset.value;
            
            document.execCommand(command, false, value);
            editor.focus();
        });
    });
    
    // Ресайзер для изменения высоты
    let isResizing = false;
    let startY = 0;
    let startHeight = 0;
    
    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        startY = e.clientY;
        startHeight = container.offsetHeight;
        document.body.style.cursor = 'ns-resize';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        
        const deltaY = e.clientY - startY;
        const newHeight = Math.max(300, Math.min(800, startHeight + deltaY));
        container.style.height = `${newHeight}px`;
    });
    
    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
        }
    });
    
    // Touch события для мобильных устройств
    resizer.addEventListener('touchstart', (e) => {
        isResizing = true;
        startY = e.touches[0].clientY;
        startHeight = container.offsetHeight;
        e.preventDefault();
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isResizing) return;
        
        const deltaY = e.touches[0].clientY - startY;
        const newHeight = Math.max(300, Math.min(800, startHeight + deltaY));
        container.style.height = `${newHeight}px`;
        e.preventDefault();
    });
    
    document.addEventListener('touchend', () => {
        if (isResizing) {
            isResizing = false;
        }
    });
}

function closeNoteEditor(overlay) {
    overlay.classList.remove('active');
    const container = overlay.querySelector('.note-editor-container');
    if (container) {
        container.classList.remove('active');
    }
    
    setTimeout(() => {
        overlay.remove();
    }, 300);
}

function setupSidebar() {
    const burgerMenu = document.getElementById('burger-menu');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    if (burgerMenu && sidebarOverlay) {
        burgerMenu.addEventListener('click', () => {
            const isActive = sidebarOverlay.classList.toggle('active');
            burgerMenu.classList.toggle('active');
            if (isActive) {
                document.body.classList.add('sidebar-open');
            } else {
                document.body.classList.remove('sidebar-open');
            }
        });
        
        sidebarOverlay.addEventListener('click', (e) => {
            if (e.target === sidebarOverlay) {
                sidebarOverlay.classList.remove('active');
                burgerMenu.classList.remove('active');
                document.body.classList.remove('sidebar-open');
            }
        });
        
        const sidebarItems = sidebarOverlay.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const action = item.dataset.action;
                handleSidebarAction(action);
                sidebarOverlay.classList.remove('active');
                burgerMenu.classList.remove('active');
                document.body.classList.remove('sidebar-open');
            });
        });
    }
    
    function handleSidebarAction(action) {
        switch(action) {
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
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            if (page === 'gpt') {
                window.location.href = '/public/gpt-plan.html';
            } else if (page === 'tasks') {
                window.location.href = '/public/tasks.html';
            } else if (page === 'notes') {
                // Уже на странице заметок
                return;
            } else if (page === 'plan') {
                window.location.href = '/public/plan.html';
            }
        });
    });
}

// Создание стикера
function createSticker(content) {
    const stickerId = Date.now();
    const mainContent = document.querySelector('.main-content');
    const contentRect = mainContent ? mainContent.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
    
    const sticker = {
        id: stickerId,
        content: content,
        color: '#FFEB3B', // Желтый по умолчанию
        height: 200, // Высота по умолчанию
        locked: false, // Заблокирован ли стикер
        position: {
            x: Math.random() * Math.min(300, contentRect.width - 300) + 20,
            y: (mainContent ? mainContent.scrollTop : 0) + Math.random() * Math.min(400, contentRect.height - 300) + 100
        }
    };
    
    // Сохраняем в localStorage
    saveSticker(sticker);
    
    // Отображаем на странице
    renderSticker(sticker);
    
    // Обновляем состояние пустого экрана
    updateEmptyState();
}

// Сохранение стикера
function saveSticker(sticker) {
    const stickers = getStickers();
    stickers.push(sticker);
    localStorage.setItem('notes_stickers', JSON.stringify(stickers));
}

// Получение всех стикеров
function getStickers() {
    const stickersJson = localStorage.getItem('notes_stickers');
    return stickersJson ? JSON.parse(stickersJson) : [];
}

// Глобальная переменная для отслеживания текущего максимального z-index
let maxStickerZIndex = 1;

// Функция для определения, является ли цвет темным
function isDarkColor(color) {
    // Конвертируем hex в RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Вычисляем яркость по формуле YIQ
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Если яркость меньше 128, цвет темный
    return brightness < 128;
}

// Функция для обновления цвета текста в зависимости от фона
function updateTextColor(stickerElement, backgroundColor) {
    const stickerContent = stickerElement.querySelector('.sticker-content');
    if (stickerContent) {
        if (isDarkColor(backgroundColor)) {
            stickerContent.style.color = '#FFFFFF';
        } else {
            stickerContent.style.color = '#000000';
        }
    }
}

// Отображение стикера
function renderSticker(sticker) {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    const stickerElement = document.createElement('div');
    stickerElement.className = 'note-sticker';
    stickerElement.dataset.stickerId = sticker.id;
    stickerElement.style.backgroundColor = sticker.color;
    // Высота автоматическая на основе содержимого
    if (sticker.height && sticker.height !== 200) {
        stickerElement.style.height = `${sticker.height}px`;
    } else {
        stickerElement.style.height = 'auto';
        stickerElement.style.minHeight = '150px';
    }
    stickerElement.style.left = `${sticker.position.x}px`;
    stickerElement.style.top = `${sticker.position.y}px`;
    stickerElement.style.zIndex = maxStickerZIndex++;
    
    // Применяем состояние блокировки (по умолчанию false, если не указано)
    if (sticker.locked === undefined) {
        sticker.locked = false;
    }
    if (sticker.locked) {
        stickerElement.classList.add('sticker-locked');
    }
    
    // Обновляем высоту контента, чтобы можно было прокрутить до всех стикеров
    updateContentHeight();
    
    stickerElement.innerHTML = `
        <div class="sticker-header">
            <div class="sticker-controls">
                <button class="sticker-btn sticker-color-btn" title="Изменить цвет">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                </button>
                <button class="sticker-btn sticker-edit-btn" title="Редактировать">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="sticker-btn sticker-lock-btn" title="Зафиксировать стикер">
                    <svg class="lock-icon ${sticker.locked ? 'locked' : ''}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <!-- Открытый замочек (по умолчанию для незаблокированных) -->
                        <g class="lock-open-group" style="${sticker.locked ? 'display: none;' : 'display: block;'}">
                            <rect class="lock-body-open" x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path class="lock-shackle-open" d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </g>
                        <!-- Закрытый замочек (для заблокированных) -->
                        <g class="lock-closed-group" style="${sticker.locked ? 'display: block;' : 'display: none;'}">
                            <rect class="lock-body-closed" x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <circle class="lock-shackle-closed" cx="12" cy="16" r="3"></circle>
                        </g>
                    </svg>
                </button>
                <button class="sticker-btn sticker-align-btn" title="Выровнять стикеры">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="3" y1="3" x2="21" y2="3"></line>
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="21" x2="21" y2="21"></line>
                    </svg>
                </button>
                <button class="sticker-btn sticker-delete-btn" title="Удалить">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        </div>
        <div class="sticker-content">${sticker.content}</div>
        <div class="sticker-resizer"></div>
    `;
    
    mainContent.appendChild(stickerElement);
    
    // Устанавливаем начальный цвет текста
    updateTextColor(stickerElement, sticker.color || '#FFEB3B');
    
    // Высота автоматическая на основе содержимого (если не задана вручную)
    if (sticker.height && sticker.height !== 200) {
        stickerElement.style.height = `${sticker.height}px`;
    } else {
        stickerElement.style.height = 'auto';
        stickerElement.style.minHeight = '150px';
    }
    
    // Обработчики для стикера
    setupStickerHandlers(stickerElement, sticker);
    
    // Обновляем высоту после рендеринга, если она автоматическая
    if (!sticker.height || sticker.height === 200) {
        setTimeout(() => {
            const contentHeight = stickerElement.querySelector('.sticker-content').scrollHeight;
            const headerHeight = stickerElement.querySelector('.sticker-header').offsetHeight;
            const resizerHeight = stickerElement.querySelector('.sticker-resizer')?.offsetHeight || 0;
            const totalHeight = contentHeight + headerHeight + resizerHeight;
            if (totalHeight > 150) {
                sticker.height = totalHeight;
                stickerElement.style.height = `${totalHeight}px`;
                updateSticker(sticker);
            }
        }, 100);
    }
}

// Функция для поднятия стикера наверх (как окна в macOS)
function bringStickerToFront(stickerElement) {
    // Убираем класс у всех стикеров
    document.querySelectorAll('.note-sticker').forEach(sticker => {
        sticker.classList.remove('bring-to-front');
        // Сбрасываем z-index на начальный, кроме текущего
        if (sticker !== stickerElement) {
            sticker.style.zIndex = '1';
        }
    });
    
    // Поднимаем текущий стикер (но не выше z-index хедера 3001)
    stickerElement.classList.add('bring-to-front');
    const newZIndex = Math.min(maxStickerZIndex++, 50); // Максимум 50, чтобы быть под хедером
    stickerElement.style.zIndex = newZIndex;
}

// Обработчики для стикера
function setupStickerHandlers(stickerElement, sticker) {
    // Поднятие стикера наверх при клике (как окна в macOS)
    stickerElement.addEventListener('mousedown', (e) => {
        // Не поднимаем при клике на кнопки
        if (e.target.closest('.sticker-btn')) return;
        bringStickerToFront(stickerElement);
    });
    
    stickerElement.addEventListener('touchstart', (e) => {
        if (e.target.closest('.sticker-btn')) return;
        bringStickerToFront(stickerElement);
    });
    
    // Изменение цвета через палитру
    const colorBtn = stickerElement.querySelector('.sticker-color-btn');
    
    colorBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Закрываем другие открытые палитры
        document.querySelectorAll('.color-picker-popup').forEach(popup => {
            popup.remove();
        });
        
        // Получаем позицию кнопки
        const btnRect = colorBtn.getBoundingClientRect();
        
        // Предустановленные цвета
        const presetColors = [
            '#FFEB3B', '#FF9800', '#F44336', '#E91E63',
            '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
            '#00BCD4', '#4CAF50', '#8BC34A', '#CDDC39',
            '#795548', '#607D8B', '#000000', '#FFFFFF'
        ];
        
        // Создаем кастомную палитру
        const colorPicker = document.createElement('div');
        colorPicker.className = 'color-picker-popup';
        colorPicker.style.position = 'fixed';
        colorPicker.style.zIndex = '10000';
        colorPicker.style.visibility = 'hidden'; // Скрываем для измерения
        
        // Создаем сетку цветов
        const colorGrid = document.createElement('div');
        colorGrid.className = 'color-picker-grid';
        presetColors.forEach(color => {
            const colorItem = document.createElement('div');
            colorItem.className = 'color-picker-item';
            colorItem.style.backgroundColor = color;
            if (color === '#FFFFFF') {
                colorItem.style.border = '1px solid #E0E0E0';
            }
            colorItem.title = color;
            colorItem.addEventListener('click', () => {
                sticker.color = color;
                stickerElement.style.backgroundColor = color;
                updateTextColor(stickerElement, color);
                updateSticker(sticker);
                colorPicker.remove();
            });
            colorGrid.appendChild(colorItem);
        });
        
        colorPicker.appendChild(colorGrid);
        document.body.appendChild(colorPicker);
        
        // Получаем реальные размеры палитры
        const pickerWidth = colorPicker.offsetWidth;
        const pickerHeight = colorPicker.offsetHeight;
        
        // Вычисляем позицию с учетом границ экрана
        let left = btnRect.left;
        let top = btnRect.bottom + 8;
        
        // Проверяем правую границу
        if (left + pickerWidth > window.innerWidth - 10) {
            left = window.innerWidth - pickerWidth - 10;
        }
        
        // Проверяем левую границу
        if (left < 10) {
            left = 10;
        }
        
        // Проверяем нижнюю границу
        if (top + pickerHeight > window.innerHeight - 10) {
            // Если не помещается снизу, показываем сверху
            top = btnRect.top - pickerHeight - 8;
            // Если и сверху не помещается, прижимаем к верхней границе
            if (top < 10) {
                top = 10;
            }
        }
        
        // Устанавливаем финальную позицию и делаем видимой
        colorPicker.style.left = `${left}px`;
        colorPicker.style.top = `${top}px`;
        colorPicker.style.visibility = 'visible';
        
        // Закрываем при клике вне палитры
        setTimeout(() => {
            document.addEventListener('click', function closePicker(e) {
                if (!colorPicker.contains(e.target) && e.target !== colorBtn) {
                    colorPicker.remove();
                    document.removeEventListener('click', closePicker);
                }
            });
        }, 0);
    });
    
    // Редактирование стикера
    const editBtn = stickerElement.querySelector('.sticker-edit-btn');
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openNoteEditor(sticker.id);
    });
    
    // Устанавливаем начальный цвет текста
    updateTextColor(stickerElement, sticker.color || '#FFEB3B');
    
    // Изменение размера через перетаскивание нижнего угла
    const resizer = stickerElement.querySelector('.sticker-resizer');
    
    let isResizing = false;
    let startY = 0;
    let startHeight = 0;
    
    const startResize = (e) => {
        if (sticker.locked) return; // Нельзя изменять размер заблокированного стикера
        isResizing = true;
        startY = e.clientY || e.touches[0].clientY;
        startHeight = stickerElement.offsetHeight;
        document.body.style.cursor = 'ns-resize';
        stickerElement.style.cursor = 'ns-resize';
        e.preventDefault();
    };
    
    const doResize = (e) => {
        if (!isResizing) return;
        const currentY = e.clientY || e.touches[0].clientY;
        const deltaY = currentY - startY;
        const newHeight = Math.max(150, Math.min(600, startHeight + deltaY));
        sticker.height = newHeight;
        stickerElement.style.height = `${newHeight}px`;
        updateSticker(sticker);
        updateContentHeight();
        e.preventDefault();
    };
    
    const stopResize = () => {
        isResizing = false;
        document.body.style.cursor = '';
        stickerElement.style.cursor = sticker.locked ? 'default' : 'grab';
    };
    
    resizer.addEventListener('mousedown', startResize);
    resizer.addEventListener('touchstart', startResize);
    document.addEventListener('mousemove', doResize);
    document.addEventListener('touchmove', doResize);
    document.addEventListener('mouseup', stopResize);
    document.addEventListener('touchend', stopResize);
    
    // Блокировка/разблокировка стикера
    const lockBtn = stickerElement.querySelector('.sticker-lock-btn');
    const lockIcon = lockBtn.querySelector('.lock-icon');
    const lockOpenGroup = lockIcon.querySelector('.lock-open-group');
    const lockClosedGroup = lockIcon.querySelector('.lock-closed-group');
    
    // Устанавливаем начальное состояние иконки
    updateLockIcon(sticker.locked);
    
    function updateLockIcon(locked) {
        if (locked) {
            // Показываем закрытый замочек с анимацией
            lockOpenGroup.style.display = 'none';
            lockClosedGroup.style.display = 'block';
            lockIcon.classList.add('locked');
        } else {
            // Показываем открытый замочек с анимацией
            lockOpenGroup.style.display = 'block';
            lockClosedGroup.style.display = 'none';
            lockIcon.classList.remove('locked');
        }
    }
    
    lockBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sticker.locked = !sticker.locked;
        
        if (sticker.locked) {
            // Блокируем стикер
            stickerElement.classList.add('sticker-locked');
            stickerElement.style.cursor = 'default';
            // Отключаем перетаскивание
            stickerHeader.style.cursor = 'default';
        } else {
            // Разблокируем стикер
            stickerElement.classList.remove('sticker-locked');
            stickerElement.style.cursor = 'grab';
            stickerHeader.style.cursor = 'grab';
        }
        
        // Анимируем изменение иконки
        updateLockIcon(sticker.locked);
        
        // Сохраняем состояние
        updateSticker(sticker);
    });
    
    // Выравнивание стикеров
    const alignBtn = stickerElement.querySelector('.sticker-align-btn');
    alignBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        alignAllStickers();
    });
    
    // Удаление
    const deleteBtn = stickerElement.querySelector('.sticker-delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Удалить заметку?')) {
            deleteSticker(sticker.id);
            stickerElement.remove();
            updateContentHeight();
            updateEmptyState(); // Обновляем состояние пустого экрана
        }
    });
    
    // Перетаскивание стикера
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let stickerStartX = 0;
    let stickerStartY = 0;
    
    const stickerHeader = stickerElement.querySelector('.sticker-header');
    
    // Устанавливаем курсор в зависимости от состояния блокировки
    if (sticker.locked) {
        stickerElement.style.cursor = 'default';
        stickerHeader.style.cursor = 'default';
    } else {
        stickerElement.style.cursor = 'grab';
        stickerHeader.style.cursor = 'grab';
    }
    
    const handleMouseMove = (e) => {
        if (!isDragging || sticker.locked) return; // Не перетаскиваем заблокированный стикер
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;
        
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;
        
        // Вычисляем новую позицию относительно контента
        const newX = stickerStartX + deltaX;
        const newY = stickerStartY + deltaY;
        
        sticker.position.x = newX;
        sticker.position.y = newY;
        stickerElement.style.left = `${newX}px`;
        stickerElement.style.top = `${newY}px`;
        updateSticker(sticker);
        updateContentHeight();
    };
    
    const handleMouseUp = () => {
        if (isDragging) {
            isDragging = false;
            stickerElement.style.cursor = '';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
    };
    
    stickerHeader.addEventListener('mousedown', (e) => {
        if (e.target.closest('.sticker-btn') || sticker.locked) return; // Не перетаскиваем заблокированный стикер
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;
        
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        const rect = stickerElement.getBoundingClientRect();
        const contentRect = mainContent.getBoundingClientRect();
        
        // Позиция относительно контента с учетом скролла
        stickerStartX = rect.left - contentRect.left;
        stickerStartY = rect.top - contentRect.top + mainContent.scrollTop;
        
        stickerElement.style.cursor = 'grabbing';
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        e.preventDefault();
    });
}

// Обновление стикера в localStorage
function updateSticker(sticker) {
    const stickers = getStickers();
    const index = stickers.findIndex(s => s.id === sticker.id);
    if (index !== -1) {
        stickers[index] = sticker;
        localStorage.setItem('notes_stickers', JSON.stringify(stickers));
    }
}

// Удаление стикера
function deleteSticker(stickerId) {
    const stickers = getStickers();
    const filtered = stickers.filter(s => s.id !== stickerId);
    localStorage.setItem('notes_stickers', JSON.stringify(filtered));
    updateContentHeight();
    
    // Обновляем состояние пустого экрана
    updateEmptyState();
}

// Обновление высоты контента для возможности прокрутки до всех стикеров
function updateContentHeight() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    const stickers = mainContent.querySelectorAll('.note-sticker');
    if (stickers.length === 0) {
        mainContent.style.minHeight = 'calc(100vh - 160px)';
        return;
    }
    
    let maxBottom = 0;
    const viewportHeight = window.innerHeight;
    const headerHeight = 60;
    const minViewportHeight = viewportHeight - headerHeight - 100; // Минимальная высота видимой области
    
    stickers.forEach(sticker => {
        const rect = sticker.getBoundingClientRect();
        const contentRect = mainContent.getBoundingClientRect();
        const relativeTop = rect.top - contentRect.top + mainContent.scrollTop;
        const bottom = relativeTop + rect.height;
        if (bottom > maxBottom) {
            maxBottom = bottom;
        }
    });
    
    // Устанавливаем минимальную высоту контента, чтобы можно было прокрутить до всех стикеров
    const minHeight = Math.max(
        minViewportHeight,
        maxBottom + 100 // Добавляем отступ снизу
    );
    mainContent.style.minHeight = `${minHeight}px`;
}

// Создание элемента пустого состояния
function createEmptyState() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    // Проверяем, не существует ли уже элемент пустого состояния
    let emptyState = mainContent.querySelector('.empty-state');
    if (!emptyState) {
        emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <div class="empty-state-text">Добавьте стикер с заметкой</div>
        `;
        // Устанавливаем стили сразу, чтобы избежать визуального "перемещения"
        emptyState.style.position = 'absolute';
        emptyState.style.top = '0';
        emptyState.style.left = '0';
        emptyState.style.right = '0';
        emptyState.style.bottom = '0';
        emptyState.style.display = 'flex';
        emptyState.style.alignItems = 'center';
        emptyState.style.justifyContent = 'center';
        emptyState.style.width = '100%';
        emptyState.style.height = '100%';
        emptyState.style.padding = '40px 20px';
        emptyState.style.pointerEvents = 'none';
        emptyState.style.zIndex = '1';
        mainContent.appendChild(emptyState);
    }
    return emptyState;
}

// Обновление видимости пустого состояния
function updateEmptyState() {
    const stickers = getStickers();
    const emptyState = createEmptyState();
    if (!emptyState) return;
    
    if (stickers.length === 0) {
        emptyState.style.display = 'flex';
    } else {
        emptyState.style.display = 'none';
    }
}

// Функция выравнивания всех стикеров
function alignAllStickers() {
    const stickers = getStickers();
    const stickerElements = document.querySelectorAll('.note-sticker');
    if (stickers.length === 0) return;
    
    // Определяем количество столбцов в зависимости от ширины экрана
    let columns = 1;
    if (window.innerWidth >= 1024) {
        columns = 3; // ПК
    } else if (window.innerWidth >= 768) {
        columns = 2; // Планшет
    } else {
        columns = 1; // Телефон
    }
    
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    const padding = 20;
    const gap = 20;
    const stickerWidth = 340;
    const availableWidth = mainContent.offsetWidth - (padding * 2);
    
    // Вычисляем ширину столбца и начальную позицию
    let columnWidth, startX;
    if (columns === 1) {
        // Один столбец - стикер по центру
        columnWidth = Math.min(stickerWidth, availableWidth);
        startX = padding + (availableWidth - columnWidth) / 2;
    } else {
        // Несколько столбцов
        columnWidth = (availableWidth - (gap * (columns - 1))) / columns;
        startX = padding;
    }
    
    // Сортируем стикеры по ID для стабильного порядка
    const sortedStickers = Array.from(stickerElements).sort((a, b) => {
        return parseInt(a.dataset.stickerId) - parseInt(b.dataset.stickerId);
    });
    
    // Распределяем стикеры по столбцам
    const columnHeights = new Array(columns).fill(padding);
    
    sortedStickers.forEach((stickerElement, index) => {
        const column = index % columns;
        let x;
        
        if (columns === 1) {
            // Один столбец - по центру
            x = startX;
        } else {
            // Несколько столбцов
            x = startX + column * (columnWidth + gap);
        }
        
        const y = columnHeights[column];
        
        // Обновляем позицию
        stickerElement.style.left = `${x}px`;
        stickerElement.style.top = `${y}px`;
        stickerElement.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Обновляем высоту столбца (используем реальную высоту стикера)
        const stickerHeight = stickerElement.offsetHeight || stickerElement.scrollHeight || 200;
        columnHeights[column] += stickerHeight + gap;
        
        // Обновляем позицию в данных стикера
        const stickerId = parseInt(stickerElement.dataset.stickerId);
        const sticker = stickers.find(s => s.id === stickerId);
        if (sticker) {
            sticker.position.x = x;
            sticker.position.y = y;
            updateSticker(sticker);
        }
    });
    
    // Убираем transition после анимации
    setTimeout(() => {
        sortedStickers.forEach(stickerElement => {
            stickerElement.style.transition = '';
        });
    }, 400);
    
    updateContentHeight();
}

// Загрузка всех стикеров при инициализации
function loadStickers() {
    const stickers = getStickers();
    stickers.forEach(sticker => {
        // Убеждаемся, что поле locked установлено (по умолчанию false)
        if (sticker.locked === undefined) {
            sticker.locked = false;
            updateSticker(sticker); // Сохраняем обновленное состояние
        }
        renderSticker(sticker);
    });
    // Обновляем высоту после загрузки всех стикеров
    setTimeout(() => {
        updateContentHeight();
        updateEmptyState(); // Обновляем состояние пустого экрана
    }, 100);
}

