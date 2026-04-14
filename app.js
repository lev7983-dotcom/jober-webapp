const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Элементы
const vacanciesList = document.getElementById('vacanciesList');
const createScreen = document.getElementById('createScreen');
const backBtn = document.getElementById('backBtn');
const closeCreateBtn = document.getElementById('closeCreateBtn');
const closeAppBtn = document.getElementById('closeAppBtn');
const categoryBtns = document.querySelectorAll('.category-btn');
const form = document.getElementById('vacancyForm');
const photoGrid = document.getElementById('photoGrid');
const photoInput = document.getElementById('photoInput');
const addPhotoBtn = document.getElementById('addPhotoBtn');

let currentCategory = 'all';
let vacancies = [];
let photo = null;

// Закрыть приложение
if (closeAppBtn) closeAppBtn.addEventListener('click', () => tg.close());
if (closeCreateBtn) closeCreateBtn.addEventListener('click', () => tg.close());

// Навигация
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        const label = this.querySelector('.nav-label')?.textContent;
        
        if (label === 'Разместить') {
            e.preventDefault();
            createScreen.style.display = 'block';
            document.querySelector('.app').style.display = 'none';
            document.querySelector('.bottom-nav').style.display = 'none';
        } else if (label === 'Главная') {
            // уже на главной
        } else if (label === 'Вакансии') {
            // уже в вакансиях
        } else {
            e.preventDefault();
            tg.showAlert('Раздел в разработке');
        }
        
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// Кнопка Назад
if (backBtn) {
    backBtn.addEventListener('click', () => {
        createScreen.style.display = 'none';
        document.querySelector('.app').style.display = 'block';
        document.querySelector('.bottom-nav').style.display = 'flex';
    });
}

// Загрузка вакансий
async function loadVacancies() {
    try {
        const response = await fetch('https://lev7983-dotcom.github.io/jober-webapp/vacancies.json');
        vacancies = await response.json();
        renderVacancies(vacancies);
    } catch (e) {
        vacanciesList.innerHTML = '<div class="loading">Нет вакансий</div>';
    }
}

// Категории
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        filterVacancies();
    });
});

function filterVacancies() {
    const filtered = currentCategory === 'all' 
        ? vacancies 
        : vacancies.filter(v => v.category === currentCategory);
    renderVacancies(filtered);
}

function renderVacancies(list) {
    if (!list || list.length === 0) {
        vacanciesList.innerHTML = '<div class="loading">Нет вакансий в этой категории</div>';
        return;
    }
    
    vacanciesList.innerHTML = list.map(v => `
        <div class="vacancy-card" onclick="showVacancy(${v.id})">
            ${v.photo ? `<img class="vacancy-photo" src="${v.photo}" alt="${v.title}">` : ''}
            <div class="vacancy-info">
                <div class="vacancy-title">${v.title}</div>
                <div class="vacancy-company">${v.company}</div>
                <div class="vacancy-salary">${v.salary}</div>
                <div class="vacancy-location">📍 ${v.location}</div>
            </div>
        </div>
    `).join('');
}

window.showVacancy = function(id) {
    window.location.href = `vacancy.html?id=${id}`;
};

// Фото
if (addPhotoBtn) {
    addPhotoBtn.addEventListener('click', () => photoInput.click());
}

if (photoInput) {
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 200 * 1024) {
                tg.showAlert('Файл больше 200KB. Сожмите фото.');
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                photo = e.target.result;
                renderPhoto();
            };
            reader.readAsDataURL(file);
        }
        photoInput.value = '';
    });
}

function renderPhoto() {
    if (!photoGrid) return;
    if (!photo) {
        photoGrid.innerHTML = '';
        return;
    }
    photoGrid.innerHTML = `
        <div class="photo-item">
            <img src="${photo}" alt="Фото">
            <button class="remove" onclick="removePhoto()">×</button>
        </div>
    `;
}

window.removePhoto = function() {
    photo = null;
    renderPhoto();
};

// Отправка формы
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('title')?.value;
        const company = document.getElementById('company')?.value;
        const salary = document.getElementById('salary')?.value;
        const location = document.getElementById('location')?.value;
        const description = document.getElementById('description')?.value;
        const phone = document.getElementById('phone')?.value;
        const category = document.getElementById('category')?.value;
        
        if (!title || !company || !salary || !location || !description || !phone || !category) {
            tg.showAlert('Заполните все обязательные поля (включая категорию)');
            return;
        }
        
        const data = {
            action: 'create_vacancy',
            title: title,
            company: company,
            salary: salary,
            location: location,
            schedule: document.getElementById('schedule')?.value || '',
            category: category,
            experience: document.getElementById('experience')?.value || '',
            description: description,
            phone: phone,
            photo: photo || ''
        };
        
        tg.sendData(JSON.stringify(data));
    });
}

loadVacancies();
