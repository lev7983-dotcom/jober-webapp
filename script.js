const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

const state = {
    photos: [],
    maxPhotos: 1
};

const photoGrid = document.getElementById('photoGrid');
const photoInput = document.getElementById('photoInput');
const addPhotoBtn = document.getElementById('addPhotoBtn');
const form = document.getElementById('vacancyForm');

addPhotoBtn.addEventListener('click', () => {
    if (state.photos.length >= state.maxPhotos) {
        tg.showAlert('Можно загрузить только 1 фото');
        return;
    }
    photoInput.click();
});

photoInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        if (file.size > 200 * 1024) {
            tg.showAlert('Файл больше 200KB. Сожмите фото.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            state.photos.push(e.target.result);
            renderPhotos();
        };
        reader.readAsDataURL(file);
    });
    photoInput.value = '';
});

function renderPhotos() {
    photoGrid.innerHTML = '';
    state.photos.forEach((photo, index) => {
        const div = document.createElement('div');
        div.className = 'photo-item';
        
        const img = document.createElement('img');
        img.src = photo;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = () => {
            state.photos.splice(index, 1);
            renderPhotos();
        };
        
        div.appendChild(img);
        div.appendChild(removeBtn);
        photoGrid.appendChild(div);
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const data = {
        action: 'create_vacancy',
        title: document.getElementById('title').value,
        company: document.getElementById('company').value,
        salary: document.getElementById('salary').value,
        location: document.getElementById('location').value,
        schedule: document.getElementById('schedule').value,
        category: document.getElementById('category').value,
        experience: document.getElementById('experience').value,
        description: document.getElementById('description').value,
        phone: document.getElementById('phone').value,
        photo: state.photos[0] || null
    };
    
    tg.sendData(JSON.stringify(data));
    tg.close();
});
