// Конфигурация Yandex GPT API
export const YANDEX_GPT_CONFIG = {
    // API ключ от Yandex GPT (получить можно в Yandex Cloud Console)
    // Инструкция: https://yandex.cloud/ru/docs/ai-studio/operations/get-api-key
    // Обычно это строка вида: AQVNxxxxxxxxxxxxx
    API_KEY: process.env.YANDEX_GPT_API_KEY || '', // API ключ из переменной окружения
    
    // Folder ID в Yandex Cloud
    FOLDER_ID: process.env.YANDEX_GPT_FOLDER_ID || '', // Folder ID из переменной окружения
    
    // Endpoint для Yandex GPT через API Gateway
    API_GATEWAY_URL: 'https://d5d8m7tvs8ntcons5qr8.hsvi2zuh.apigw.yandexcloud.net',
    
    // Прямой endpoint для Yandex GPT (если не используете API Gateway)
    BASE_URL: 'https://llm.api.cloud.yandex.net',
    
    // Модели Yandex GPT
    MODELS: [
        'yandexgpt-lite',
        'yandexgpt',
        'yandexgpt-pro'
    ]
};

// Функция для получения URL API Yandex GPT
export function getYandexGptApiUrl(modelName = 'yandexgpt-lite', useGateway = true) {
    // Используем API Gateway для обхода CORS
    if (useGateway && YANDEX_GPT_CONFIG.API_GATEWAY_URL) {
        // Пробуем OpenAI-совместимый формат
        return `${YANDEX_GPT_CONFIG.API_GATEWAY_URL}/v1/chat/completions`;
    } else {
        // Прямой API (будет заблокирован CORS в браузере)
        return `${YANDEX_GPT_CONFIG.BASE_URL}/foundationModels/v1/completion`;
    }
}

