// Модуль интернационализации (i18n)
// Поддержка русского, английского и испанского языков

const translations = {
    ru: {
        // Общие
        'common.back': 'Назад',
        'common.save': 'Сохранить',
        'common.cancel': 'Отмена',
        'common.delete': 'Удалить',
        'common.edit': 'Редактировать',
        'common.rename': 'Переименовать',
        'common.close': 'Закрыть',
        'common.add': 'Добавить',
        'common.settings': 'Настройки',
        'common.menu': 'Меню',
        
        // Задачи
        'tasks.title': 'Задачи',
        'tasks.add': 'Добавить задачу',
        'tasks.empty': 'Нет задач на эту дату',
        'tasks.completed': 'Выполнено',
        'tasks.today': 'Сегодня у вас',
        'tasks.priority': 'Приоритет',
        'tasks.description': 'Описание',
        'tasks.date': 'Дата',
        'tasks.create': 'Создать задачу',
        'tasks.edit': 'Редактировать задачу',
        'tasks.delete': 'Удалить задачу',
        'tasks.deleteConfirm': 'Удалить задачу?',
        'tasks.rename': 'Переименовать задачу',
        
        // Заметки
        'notes.title': 'Заметки',
        'notes.add': 'Добавить заметку',
        'notes.empty': 'Добавьте стикер с заметкой',
        'notes.attach': 'Прикрепить',
        'notes.edit': 'Редактировать',
        'notes.delete': 'Удалить',
        'notes.color': 'Цвет',
        'notes.lock': 'Заблокировать',
        'notes.unlock': 'Разблокировать',
        'notes.align': 'Выровнять',
        
        // План
        'plan.title': 'План',
        'plan.createGoal': 'Создайте новую цель',
        'plan.createGoalSubtitle': 'Введите название цели, чтобы начать планирование',
        'plan.create': 'Создать',
        'plan.goalPlaceholder': 'Например: Подготовка к марафону',
        'plan.editing': 'Редактирование',
        'plan.saved': 'Сохранен',
        'plan.save': 'Сохранить',
        'plan.editGoal': 'Редактировать цель',
        'plan.deleteGoal': 'Удалить цель',
        'plan.back': 'Вернуться к списку планов',
        'plan.savePlan': 'Сохранить план',
        'plan.deleteConfirm': 'Удалить цель и все связанные данные?',
        'plan.addDate': 'Добавить дату',
        'plan.addTask': 'Добавить задачу',
        'plan.selectDate': 'Выберите дату',
        'plan.taskName': 'Название задачи',
        'plan.priority': 'Приоритет',
        'plan.priorityHigh': 'Высокий',
        'plan.priorityMedium': 'Средний',
        'plan.priorityLow': 'Низкий',
        'plan.savedPlans': 'Список планов',
        'plan.createNew': 'Создать',
        'plan.empty': 'Создайте первую цель для начала планирования',
        'plan.deleteDate': 'Удалить дату',
        'plan.deleteDateConfirm': 'Удалить дату и все задачи в ней?',
        'plan.deleteTask': 'Удалить задачу',
        'plan.deleteTaskConfirm': 'Удалить задачу?',
        'plan.dates': 'дат',
        'plan.tasks': 'задач',
        'plan.date': 'дата',
        'plan.task': 'задача',
        'plan.taskPlural1': 'задачи',
        'plan.taskPlural2': 'задач',
        'plan.datePlural1': 'даты',
        'plan.datePlural2': 'дат',
        
        // Чат
        'chat.title': 'Чат с AI',
        'chat.placeholder': 'Введите сообщение...',
        'chat.send': 'Отправить',
        'chat.you': 'Я',
        'chat.ai': 'AI',
        'chat.loading': 'Загрузка...',
        'chat.error': 'Ошибка при отправке сообщения',
        
        // GPT План
        'gpt.title': 'GPT План',
        'gpt.description': 'Создайте план проекта с помощью нейросети. Опишите вашу цель, и AI разобьет её на шаги и задачи.',
        'gpt.planName': 'Название плана',
        'gpt.goalDescription': 'Описание цели',
        'gpt.startDate': 'С какого дня начинать план?',
        'gpt.daysCount': 'На сколько дней разбить план?',
        'gpt.weekends': 'Выходные дни',
        'gpt.mon': 'Пн',
        'gpt.tue': 'Вт',
        'gpt.wed': 'Ср',
        'gpt.thu': 'Чт',
        'gpt.fri': 'Пт',
        'gpt.sat': 'Сб',
        'gpt.sun': 'Вс',
        'gpt.generate': 'Сгенерировать',
        'gpt.generating': 'Генерация плана...',
        'gpt.edit': 'Редактировать',
        'gpt.save': 'Сохранить',
        'gpt.regenerate': 'Сгенерировать еще',
        'common.continue': 'Продолжить',
        
        // Настройки
        'settings.title': 'Настройки',
        'settings.profile': 'Профиль',
        'settings.name': 'Имя',
        'settings.nameDesc': 'Как к вам обращаться',
        'settings.enterName': 'Введите имя',
        'settings.email': 'Email',
        'settings.emailDesc': 'Для уведомлений',
        'settings.changePhoto': 'Изменить фото',
        'settings.appearance': 'Внешний вид',
        'settings.theme': 'Тема',
        'settings.themeDesc': 'Светлая или темная',
        'settings.themeLight': 'Светлая',
        'settings.themeDark': 'Темная',
        'settings.language': 'Язык',
        'settings.languageDesc': 'Язык интерфейса',
        'settings.notifications': 'Уведомления',
        'settings.notificationsDesc': 'Получать уведомления о задачах',
        'settings.emailNotifications': 'Email уведомления',
        'settings.emailNotificationsDesc': 'Получать уведомления на email',
        'settings.about': 'О приложении',
        'settings.version': 'Версия',
        'settings.save': 'Сохранить изменения',
        'settings.saved': 'Сохранено!',
        
        // Сайдбар
        'sidebar.chat': 'Чат с AI',
        'sidebar.tasks': 'Задачи',
        'sidebar.info': 'Информация',
        'sidebar.support': 'Поддержка',
        'sidebar.suggest': 'Предложить идею',
        'sidebar.about': 'О нас',
        
        // Навигация
        'nav.tasks': 'Задачи',
        'nav.notes': 'Заметки',
        'nav.plan': 'План',
        'nav.gpt': 'GPT',
        
        // Приветствие
        'greeting.morning': 'Доброе утро',
        'greeting.day': 'Добрый день',
        'greeting.evening': 'Добрый вечер',
        'greeting.night': 'Доброй ночи',
        'greeting.today': 'Сегодня у вас',
        'greeting.completed': 'Выполнено',
        
        // Модальные окна
        'modal.newTheme': 'Новая тема',
        'modal.editTheme': 'Редактировать тему',
        'modal.newSubtheme': 'Новая подтема',
        'modal.editSubtheme': 'Редактировать подтему',
        'modal.themeName': 'Название темы',
        'modal.subthemeName': 'Название подтемы',
        'modal.enterThemeName': 'Введите название темы',
        'modal.enterSubthemeName': 'Введите название подтемы',
        'modal.deleteTheme': 'Удалить тему',
        'modal.deleteThemeConfirm': 'Удалить тему и все её подтемы?',
        'modal.deleteSubtheme': 'Удалить подтему',
        'modal.deleteSubthemeConfirm': 'Удалить подтему?',
        
        // Статистика
        'stats.total': 'Всего тем',
        'stats.completed': 'Выполнено',
        'stats.inProgress': 'В процессе',
        'stats.progress': 'Прогресс',
        
        // Дни недели
        'weekday.mon': 'Пн',
        'weekday.tue': 'Вт',
        'weekday.wed': 'Ср',
        'weekday.thu': 'Чт',
        'weekday.fri': 'Пт',
        'weekday.sat': 'Сб',
        'weekday.sun': 'Вс',
        
        // Месяцы
        'month.january': 'Январь',
        'month.february': 'Февраль',
        'month.march': 'Март',
        'month.april': 'Апрель',
        'month.may': 'Май',
        'month.june': 'Июнь',
        'month.july': 'Июль',
        'month.august': 'Август',
        'month.september': 'Сентябрь',
        'month.october': 'Октябрь',
        'month.november': 'Ноябрь',
        'month.december': 'Декабрь'
    },
    en: {
        // Common
        'common.back': 'Back',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.rename': 'Rename',
        'common.close': 'Close',
        'common.add': 'Add',
        'common.settings': 'Settings',
        'common.menu': 'Menu',
        
        // Tasks
        'tasks.title': 'Tasks',
        'tasks.add': 'Add task',
        'tasks.empty': 'No tasks for this date',
        'tasks.completed': 'Completed',
        'tasks.today': 'Today you have',
        'tasks.priority': 'Priority',
        'tasks.description': 'Description',
        'tasks.date': 'Date',
        'tasks.create': 'Create task',
        'tasks.edit': 'Edit task',
        'tasks.delete': 'Delete task',
        'tasks.deleteConfirm': 'Delete task?',
        'tasks.rename': 'Rename task',
        
        // Notes
        'notes.title': 'Notes',
        'notes.add': 'Add note',
        'notes.empty': 'Add a note sticker',
        'notes.attach': 'Attach',
        'notes.edit': 'Edit',
        'notes.delete': 'Delete',
        'notes.color': 'Color',
        'notes.lock': 'Lock',
        'notes.unlock': 'Unlock',
        'notes.align': 'Align',
        
        // Plan
        'plan.title': 'Plan',
        'plan.createGoal': 'Create a new goal',
        'plan.createGoalSubtitle': 'Enter the goal name to start planning',
        'plan.create': 'Create',
        'plan.goalPlaceholder': 'For example: Marathon training',
        'plan.editing': 'Editing',
        'plan.saved': 'Saved',
        'plan.save': 'Save',
        'plan.editGoal': 'Edit goal',
        'plan.deleteGoal': 'Delete goal',
        'plan.back': 'Back to plans list',
        'plan.savePlan': 'Save plan',
        'plan.deleteConfirm': 'Delete goal and all related data?',
        'plan.addDate': 'Add date',
        'plan.addTask': 'Add task',
        'plan.selectDate': 'Select date',
        'plan.taskName': 'Task name',
        'plan.priority': 'Priority',
        'plan.priorityHigh': 'High',
        'plan.priorityMedium': 'Medium',
        'plan.priorityLow': 'Low',
        'plan.savedPlans': 'Plans list',
        'plan.createNew': 'Create',
        'plan.empty': 'Create your first goal to start planning',
        'plan.deleteDate': 'Delete date',
        'plan.deleteDateConfirm': 'Delete date and all tasks in it?',
        'plan.deleteTask': 'Delete task',
        'plan.deleteTaskConfirm': 'Delete task?',
        'plan.dates': 'dates',
        'plan.tasks': 'tasks',
        'plan.date': 'date',
        'plan.task': 'task',
        'plan.taskPlural1': 'tasks',
        'plan.taskPlural2': 'tasks',
        'plan.datePlural1': 'dates',
        'plan.datePlural2': 'dates',
        
        // Chat
        'chat.title': 'Chat with AI',
        'chat.placeholder': 'Type a message...',
        'chat.send': 'Send',
        'chat.you': 'Me',
        'chat.ai': 'AI',
        'chat.loading': 'Loading...',
        'chat.error': 'Error sending message',
        
        // GPT Plan
        'gpt.title': 'GPT Plan',
        'gpt.description': 'Create a project plan with AI. Describe your goal, and AI will break it down into steps and tasks.',
        'gpt.planName': 'Plan name',
        'gpt.goalDescription': 'Goal description',
        'gpt.startDate': 'What day to start the plan?',
        'gpt.daysCount': 'How many days to split the plan?',
        'gpt.weekends': 'Weekend days',
        'gpt.mon': 'Mon',
        'gpt.tue': 'Tue',
        'gpt.wed': 'Wed',
        'gpt.thu': 'Thu',
        'gpt.fri': 'Fri',
        'gpt.sat': 'Sat',
        'gpt.sun': 'Sun',
        'gpt.generate': 'Generate',
        'gpt.generating': 'Generating plan...',
        'gpt.edit': 'Edit',
        'gpt.save': 'Save',
        'gpt.regenerate': 'Generate again',
        'common.continue': 'Continue',
        
        // Settings
        'settings.title': 'Settings',
        'settings.profile': 'Profile',
        'settings.name': 'Name',
        'settings.nameDesc': 'How to address you',
        'settings.enterName': 'Enter name',
        'settings.email': 'Email',
        'settings.emailDesc': 'For notifications',
        'settings.changePhoto': 'Change photo',
        'settings.appearance': 'Appearance',
        'settings.theme': 'Theme',
        'settings.themeDesc': 'Light or dark',
        'settings.themeLight': 'Light',
        'settings.themeDark': 'Dark',
        'settings.language': 'Language',
        'settings.languageDesc': 'Interface language',
        'settings.notifications': 'Notifications',
        'settings.notificationsDesc': 'Receive task notifications',
        'settings.emailNotifications': 'Email notifications',
        'settings.emailNotificationsDesc': 'Receive email notifications',
        'settings.about': 'About',
        'settings.version': 'Version',
        'settings.save': 'Save changes',
        'settings.saved': 'Saved!',
        
        // Sidebar
        'sidebar.chat': 'Chat with AI',
        'sidebar.tasks': 'Tasks',
        'sidebar.info': 'Info',
        'sidebar.support': 'Support',
        'sidebar.suggest': 'Suggest idea',
        'sidebar.about': 'About us',
        
        // Navigation
        'nav.tasks': 'Tasks',
        'nav.notes': 'Notes',
        'nav.plan': 'Plan',
        'nav.gpt': 'GPT',
        
        // Greeting
        'greeting.morning': 'Good morning',
        'greeting.day': 'Good afternoon',
        'greeting.evening': 'Good evening',
        'greeting.night': 'Good night',
        'greeting.today': 'Today you have',
        'greeting.completed': 'Completed',
        
        // Modals
        'modal.newTheme': 'New theme',
        'modal.editTheme': 'Edit theme',
        'modal.newSubtheme': 'New subtheme',
        'modal.editSubtheme': 'Edit subtheme',
        'modal.themeName': 'Theme name',
        'modal.subthemeName': 'Subtheme name',
        'modal.enterThemeName': 'Enter theme name',
        'modal.enterSubthemeName': 'Enter subtheme name',
        'modal.deleteTheme': 'Delete theme',
        'modal.deleteThemeConfirm': 'Delete theme and all its subthemes?',
        'modal.deleteSubtheme': 'Delete subtheme',
        'modal.deleteSubthemeConfirm': 'Delete subtheme?',
        
        // Statistics
        'stats.total': 'Total themes',
        'stats.completed': 'Completed',
        'stats.inProgress': 'In progress',
        'stats.progress': 'Progress',
        
        // Weekdays
        'weekday.mon': 'Mon',
        'weekday.tue': 'Tue',
        'weekday.wed': 'Wed',
        'weekday.thu': 'Thu',
        'weekday.fri': 'Fri',
        'weekday.sat': 'Sat',
        'weekday.sun': 'Sun',
        
        // Months
        'month.january': 'January',
        'month.february': 'February',
        'month.march': 'March',
        'month.april': 'April',
        'month.may': 'May',
        'month.june': 'June',
        'month.july': 'July',
        'month.august': 'August',
        'month.september': 'September',
        'month.october': 'October',
        'month.november': 'November',
        'month.december': 'December'
    },
    es: {
        // Común
        'common.back': 'Atrás',
        'common.save': 'Guardar',
        'common.cancel': 'Cancelar',
        'common.delete': 'Eliminar',
        'common.edit': 'Editar',
        'common.rename': 'Renombrar',
        'common.close': 'Cerrar',
        'common.add': 'Añadir',
        'common.settings': 'Configuración',
        'common.menu': 'Menú',
        
        // Tareas
        'tasks.title': 'Tareas',
        'tasks.add': 'Añadir tarea',
        'tasks.empty': 'No hay tareas para esta fecha',
        'tasks.completed': 'Completado',
        'tasks.today': 'Hoy tienes',
        'tasks.priority': 'Prioridad',
        'tasks.description': 'Descripción',
        'tasks.date': 'Fecha',
        'tasks.create': 'Crear tarea',
        'tasks.edit': 'Editar tarea',
        'tasks.delete': 'Eliminar tarea',
        'tasks.deleteConfirm': '¿Eliminar tarea?',
        'tasks.rename': 'Renombrar tarea',
        
        // Notas
        'notes.title': 'Notas',
        'notes.add': 'Añadir nota',
        'notes.empty': 'Añade una nota con pegatina',
        'notes.attach': 'Adjuntar',
        'notes.edit': 'Editar',
        'notes.delete': 'Eliminar',
        'notes.color': 'Color',
        'notes.lock': 'Bloquear',
        'notes.unlock': 'Desbloquear',
        'notes.align': 'Alinear',
        
        // Plan
        'plan.title': 'Plan',
        'plan.createGoal': 'Crea un nuevo objetivo',
        'plan.createGoalSubtitle': 'Introduce el nombre del objetivo para comenzar a planificar',
        'plan.create': 'Crear',
        'plan.goalPlaceholder': 'Por ejemplo: Entrenamiento para maratón',
        'plan.editing': 'Editando',
        'plan.saved': 'Guardado',
        'plan.save': 'Guardar',
        'plan.editGoal': 'Editar objetivo',
        'plan.deleteGoal': 'Eliminar objetivo',
        'plan.back': 'Volver a la lista de planes',
        'plan.savePlan': 'Guardar plan',
        'plan.deleteConfirm': '¿Eliminar objetivo y todos los datos relacionados?',
        'plan.addDate': 'Añadir fecha',
        'plan.addTask': 'Añadir tarea',
        'plan.selectDate': 'Seleccionar fecha',
        'plan.taskName': 'Nombre de la tarea',
        'plan.priority': 'Prioridad',
        'plan.priorityHigh': 'Alta',
        'plan.priorityMedium': 'Media',
        'plan.priorityLow': 'Baja',
        'plan.savedPlans': 'Lista de planes',
        'plan.createNew': 'Crear',
        'plan.empty': 'Crea tu primer objetivo para comenzar a planificar',
        'plan.deleteDate': 'Eliminar fecha',
        'plan.deleteDateConfirm': '¿Eliminar fecha y todas las tareas en ella?',
        'plan.deleteTask': 'Eliminar tarea',
        'plan.deleteTaskConfirm': '¿Eliminar tarea?',
        'plan.dates': 'fechas',
        'plan.tasks': 'tareas',
        'plan.date': 'fecha',
        'plan.task': 'tarea',
        'plan.taskPlural1': 'tareas',
        'plan.taskPlural2': 'tareas',
        'plan.datePlural1': 'fechas',
        'plan.datePlural2': 'fechas',
        
        // Chat
        'chat.title': 'Chat con IA',
        'chat.placeholder': 'Escribe un mensaje...',
        'chat.send': 'Enviar',
        'chat.you': 'Yo',
        'chat.ai': 'IA',
        'chat.loading': 'Cargando...',
        'chat.error': 'Error al enviar mensaje',
        
        // Plan GPT
        'gpt.title': 'Plan GPT',
        'gpt.description': 'Crea un plan de proyecto con IA. Describe tu objetivo y la IA lo dividirá en pasos y tareas.',
        'gpt.planName': 'Nombre del plan',
        'gpt.goalDescription': 'Descripción del objetivo',
        'gpt.startDate': '¿Desde qué día comenzar el plan?',
        'gpt.daysCount': '¿En cuántos días dividir el plan?',
        'gpt.weekends': 'Días de fin de semana',
        'gpt.mon': 'Lun',
        'gpt.tue': 'Mar',
        'gpt.wed': 'Mié',
        'gpt.thu': 'Jue',
        'gpt.fri': 'Vie',
        'gpt.sat': 'Sáb',
        'gpt.sun': 'Dom',
        'gpt.generate': 'Generar',
        'gpt.generating': 'Generando plan...',
        'gpt.edit': 'Editar',
        'gpt.save': 'Guardar',
        'gpt.regenerate': 'Generar de nuevo',
        'common.continue': 'Continuar',
        
        // Configuración
        'settings.title': 'Configuración',
        'settings.profile': 'Perfil',
        'settings.name': 'Nombre',
        'settings.nameDesc': 'Cómo dirigirse a ti',
        'settings.enterName': 'Introduce el nombre',
        'settings.email': 'Email',
        'settings.emailDesc': 'Para notificaciones',
        'settings.changePhoto': 'Cambiar foto',
        'settings.appearance': 'Apariencia',
        'settings.theme': 'Tema',
        'settings.themeDesc': 'Claro u oscuro',
        'settings.themeLight': 'Claro',
        'settings.themeDark': 'Oscuro',
        'settings.language': 'Idioma',
        'settings.languageDesc': 'Idioma de la interfaz',
        'settings.notifications': 'Notificaciones',
        'settings.notificationsDesc': 'Recibir notificaciones de tareas',
        'settings.emailNotifications': 'Notificaciones por email',
        'settings.emailNotificationsDesc': 'Recibir notificaciones por email',
        'settings.about': 'Acerca de',
        'settings.version': 'Versión',
        'settings.save': 'Guardar cambios',
        'settings.saved': '¡Guardado!',
        
        // Barra lateral
        'sidebar.chat': 'Chat con IA',
        'sidebar.tasks': 'Tareas',
        'sidebar.info': 'Información',
        'sidebar.support': 'Soporte',
        'sidebar.suggest': 'Sugerir idea',
        'sidebar.about': 'Sobre nosotros',
        
        // Navegación
        'nav.tasks': 'Tareas',
        'nav.notes': 'Notas',
        'nav.plan': 'Plan',
        'nav.gpt': 'GPT',
        
        // Saludo
        'greeting.morning': 'Buenos días',
        'greeting.day': 'Buenas tardes',
        'greeting.evening': 'Buenas tardes',
        'greeting.night': 'Buenas noches',
        'greeting.today': 'Hoy tienes',
        'greeting.completed': 'Completado',
        
        // Modales
        'modal.newTheme': 'Nuevo tema',
        'modal.editTheme': 'Editar tema',
        'modal.newSubtheme': 'Nueva subtema',
        'modal.editSubtheme': 'Editar subtema',
        'modal.themeName': 'Nombre del tema',
        'modal.subthemeName': 'Nombre de la subtema',
        'modal.enterThemeName': 'Introduce el nombre del tema',
        'modal.enterSubthemeName': 'Introduce el nombre de la subtema',
        'modal.deleteTheme': 'Eliminar tema',
        'modal.deleteThemeConfirm': '¿Eliminar tema y todas sus subtemas?',
        'modal.deleteSubtheme': 'Eliminar subtema',
        'modal.deleteSubthemeConfirm': '¿Eliminar subtema?',
        
        // Estadísticas
        'stats.total': 'Total de temas',
        'stats.completed': 'Completado',
        'stats.inProgress': 'En progreso',
        'stats.progress': 'Progreso',
        
        // Días de la semana
        'weekday.mon': 'Lun',
        'weekday.tue': 'Mar',
        'weekday.wed': 'Mié',
        'weekday.thu': 'Jue',
        'weekday.fri': 'Vie',
        'weekday.sat': 'Sáb',
        'weekday.sun': 'Dom',
        
        // Meses
        'month.january': 'Enero',
        'month.february': 'Febrero',
        'month.march': 'Marzo',
        'month.april': 'Abril',
        'month.may': 'Mayo',
        'month.june': 'Junio',
        'month.july': 'Julio',
        'month.august': 'Agosto',
        'month.september': 'Septiembre',
        'month.october': 'Octubre',
        'month.november': 'Noviembre',
        'month.december': 'Diciembre'
    }
};

// Получение текущего языка
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'ru';
}

// Установка языка
function setLanguage(lang) {
    if (translations[lang]) {
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        applyTranslations();
        return true;
    }
    return false;
}

// Получение перевода
function t(key, params = {}) {
    const lang = getCurrentLanguage();
    let translation = translations[lang]?.[key] || translations['ru']?.[key] || key;
    
    // Замена параметров
    Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
    });
    
    return translation;
}

// Применение переводов ко всем элементам с data-i18n
function applyTranslations() {
    // Обрабатываем элементы с data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const attr = element.getAttribute('data-i18n');
        
        // Проверяем, является ли это атрибутом в формате [attrName]key
        if (attr && attr.startsWith('[') && attr.includes(']')) {
            const match = attr.match(/\[(\w+)\](.+)/);
            if (match) {
                const attrName = match[1];
                const key = match[2];
                element.setAttribute(attrName, t(key));
                return; // Пропускаем обычную обработку
            }
        }
        
        // Обычная обработка текста
        const translation = t(attr);
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            if (element.placeholder !== undefined) {
                element.placeholder = translation;
            } else {
                element.value = translation;
            }
        } else if (element.tagName === 'OPTION') {
            element.textContent = translation;
        } else if (element.hasAttribute('title')) {
            element.title = translation;
        } else if (element.hasAttribute('aria-label')) {
            element.setAttribute('aria-label', translation);
        } else {
            element.textContent = translation;
        }
    });
    
    // Обрабатываем элементы с data-i18n-placeholder
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
    
    // Обновление заголовка страницы
    const pageTitle = document.querySelector('[data-i18n-title]');
    if (pageTitle) {
        const titleKey = pageTitle.getAttribute('data-i18n-title');
        document.title = t(titleKey) + ' - Ladder';
    }
}

// Инициализация i18n
function initI18n() {
    const lang = getCurrentLanguage();
    document.documentElement.lang = lang;
    applyTranslations();
    
    // Показываем контент после применения переводов
    document.body.classList.add('i18n-ready');
    
    // Слушаем изменения языка
    window.addEventListener('storage', (e) => {
        if (e.key === 'language') {
            applyTranslations();
        }
    });
}

// Экспорт для использования в других модулях
export { t, setLanguage, getCurrentLanguage, applyTranslations, initI18n };

if (typeof window !== 'undefined') {
    window.i18n = {
        t,
        setLanguage,
        getCurrentLanguage,
        applyTranslations,
        initI18n
    };
}

// Автоматическая инициализация при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initI18n, 100); // Небольшая задержка для загрузки всех элементов
    });
} else {
    setTimeout(initI18n, 100);
}

