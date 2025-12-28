// Страница настроек
document.addEventListener('DOMContentLoaded', () => {
    initSettingsPage();
});

function initSettingsPage() {
    // Кнопка назад
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = '/public/tasks.html';
        });
    }
    
    // Инициализация переключателей
    initToggles();
    
    // Загрузка текущих настроек
    loadSettings();
    
    // Сохранение настроек
    const saveBtn = document.getElementById('save-settings-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveSettings);
    }
    
    // Навигация
    setupNavigation();
}

function initToggles() {
    const toggles = document.querySelectorAll('.setting-toggle');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
        });
    });
}

function loadSettings() {
    // Загрузка настроек из localStorage или API
    const savedName = localStorage.getItem('user_name') || '';
    const savedEmail = localStorage.getItem('user_email') || '';
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedLanguage = localStorage.getItem('language') || 'ru';
    const savedNotifications = localStorage.getItem('notifications') === 'true';
    const savedEmailNotifications = localStorage.getItem('email_notifications') === 'true';
    
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    const themeSelect = document.getElementById('theme-select');
    const languageSelect = document.getElementById('language-select');
    const notificationsToggle = document.getElementById('notifications-toggle');
    const emailNotificationsToggle = document.getElementById('email-notifications-toggle');
    
    if (nameInput) nameInput.value = savedName;
    if (emailInput) emailInput.value = savedEmail;
    if (themeSelect) themeSelect.value = savedTheme;
    if (languageSelect) languageSelect.value = savedLanguage;
    if (notificationsToggle && savedNotifications) notificationsToggle.classList.add('active');
    if (emailNotificationsToggle && savedEmailNotifications) emailNotificationsToggle.classList.add('active');
}

async function saveSettings() {
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    const themeSelect = document.getElementById('theme-select');
    const languageSelect = document.getElementById('language-select');
    const notificationsToggle = document.getElementById('notifications-toggle');
    const emailNotificationsToggle = document.getElementById('email-notifications-toggle');
    
    const settings = {
        name: nameInput?.value || '',
        email: emailInput?.value || '',
        theme: themeSelect?.value || 'light',
        language: languageSelect?.value || 'ru',
        notifications: notificationsToggle?.classList.contains('active') || false,
        email_notifications: emailNotificationsToggle?.classList.contains('active') || false
    };
    
    // Сохранение в localStorage
    localStorage.setItem('user_name', settings.name);
    localStorage.setItem('user_email', settings.email);
    localStorage.setItem('theme', settings.theme);
    localStorage.setItem('language', settings.language);
    localStorage.setItem('notifications', settings.notifications.toString());
    localStorage.setItem('email_notifications', settings.email_notifications.toString());
    
    // Применяем новый язык
    if (window.i18n) {
        window.i18n.setLanguage(settings.language);
    }
    
    // TODO: Отправка на сервер
    // try {
    //     await fetch('/api/settings', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(settings)
    //     });
    // } catch (error) {
    //     console.error('Error saving settings:', error);
    // }
    
    // Показ уведомления об успешном сохранении
    const saveBtn = document.getElementById('save-settings-btn');
    if (saveBtn) {
        const originalText = saveBtn.textContent;
        saveBtn.textContent = window.i18n ? window.i18n.t('settings.saved') : 'Сохранено!';
        saveBtn.style.background = '#28a745';
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.background = '';
        }, 2000);
    }
    
    // Применяем переводы без перезагрузки страницы
    if (window.i18n) {
        window.i18n.applyTranslations();
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
            }
        });
    });
    
    const addTaskBtn = document.getElementById('add-task-btn');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            window.location.href = '/public/tasks.html';
        });
    }
}

