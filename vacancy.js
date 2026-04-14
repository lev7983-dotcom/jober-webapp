const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

const content = document.getElementById('vacancyContent');
const contactBtn = document.getElementById('contactBtn');

// Получаем ID вакансии из параметров
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

let vacancy = null;

async function loadVacancy() {
    try {
        const response = await fetch(`https://lev7983-dotcom.github.io/jober-webapp/vacancies.json`);
        const vacancies = await response.json();
        vacancy = vacancies.find(v => v.id == id);
        
        if (vacancy) {
            renderVacancy();
        } else {
            content.innerHTML = '<div class="loading">Вакансия не найдена</div>';
        }
    } catch (e) {
        content.innerHTML = '<div class="loading">Ошибка загрузки</div>';
    }
}

function renderVacancy() {
    tg.MainButton.hide();
    
    content.innerHTML = `
        ${vacancy.photo ? `<img class="vacancy-full-photo" src="${vacancy.photo}" alt="${vacancy.title}">` : ''}
        
        <h1 class="vacancy-full-title">${vacancy.title}</h1>
        <div class="vacancy-full-company">${vacancy.company}</div>
        
        <div class="vacancy-full-salary">${vacancy.salary}</div>
        
        <div class="vacancy-details">
            <div class="detail-item">
                <span class="detail-icon">📍</span>
                <span class="detail-text">${vacancy.location}</span>
            </div>
            <div class="detail-item">
                <span class="detail-icon">🕐</span>
                <span class="detail-text">${vacancy.schedule || 'Не указан'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-icon">📂</span>
                <span class="detail-text">${vacancy.category || 'Не указана'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-icon">⭐</span>
                <span class="detail-text">Опыт: ${vacancy.experience || 'Не указан'}</span>
            </div>
        </div>
        
        <div class="vacancy-description">
            <h3>Описание</h3>
            <p>${vacancy.description || 'Нет описания'}</p>
        </div>
    `;
    
    contactBtn.onclick = () => {
        tg.showPopup({
            title: 'Контакты',
            message: `📞 Телефон: ${vacancy.phone || 'Не указан'}\n\nСвяжитесь с работодателем напрямую.`,
            buttons: [{ type: 'close' }]
        });
    };
}

loadVacancy();
