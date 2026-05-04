let currentUser = null;
let currentLang = 'ru';
let map = null;
let mapMarkers = [];

function getUsers() {
    try {
        const data = localStorage.getItem('tk_users');
        return data ? JSON.parse(data) : {};
    } catch (e) {
        return {};
    }
}

function saveUsers(users) {
    localStorage.setItem('tk_users', JSON.stringify(users));
}

function getComplaints() {
    try {
        const data = localStorage.getItem('tk_complaints');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

function saveComplaints(list) {
    localStorage.setItem('tk_complaints', JSON.stringify(list));
}

const PLACES_VERSION = '2';

function getPlaces() {
    try {
        const data = localStorage.getItem('tk_places');
        const version = localStorage.getItem('tk_places_version');
        if (data && version === PLACES_VERSION) return JSON.parse(data);
    } catch (e) {}
    const defaults = [
        { id: 1, name: 'Парк Победы', lat: 55.8267, lng: 49.1033 },
        { id: 2, name: 'Кремлевская набережная', lat: 55.796, lng: 49.106 },
        { id: 3, name: 'Лесопарк Дубрава', lat: 55.812, lng: 49.185 },
        { id: 4, name: 'Озеро Кабан', lat: 55.798, lng: 49.132 },
        { id: 5, name: 'Улица Баумана', lat: 55.791, lng: 49.110 },
        { id: 6, name: 'Парк им. Горького', lat: 55.783, lng: 49.140 },
        { id: 7, name: 'Набережная Нижний Кабан', lat: 55.800, lng: 49.130 },
        { id: 8, name: 'Сквер у театра Камала', lat: 55.789, lng: 49.122 },
        { id: 9, name: 'Парк Урицкого', lat: 55.775, lng: 49.145 },
        { id: 10, name: 'Набережная Федоровского', lat: 55.805, lng: 49.115 }
    ];
    localStorage.setItem('tk_places', JSON.stringify(defaults));
    localStorage.setItem('tk_places_version', PLACES_VERSION);
    return defaults;
}

function savePlaces(list) {
    localStorage.setItem('tk_places', JSON.stringify(list));
}

// ====== UTILS ======
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = msg;
        setTimeout(() => { el.textContent = ''; }, 4000);
    }
}

function fileToBase64(file) {
    return new Promise((resolve) => {
        if (!file) { resolve(null); return; }
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// ====== LANGUAGE ======
const i18n = {
    ru: {
        landingLogo: 'Таза Казан',
        landingTitle: 'Добро пожаловать!',
        landingSubtitle: 'Чистая Казань',
        landingDesc1: 'Вместе мы сделаем наш город',
        landingDesc2: 'чище, зеленее и красивее!',
        landingDesc3: 'Сообщайте о мусоре и помогайте убирать.',
        landingStart: 'Начать',
        authTitle: 'Чистая Казань',
        authSubtitle: 'Вместе сделаем город чище',
        loginTab: 'Вход',
        registerTab: 'Регистрация',
        loginUsername: 'Логин',
        loginPassword: 'Пароль',
        loginBtn: 'Войти',
        regName: 'Имя',
        regLogin: 'Логин (латиницей)',
        regPassword: 'Пароль (минимум 4 символа)',
        regAvatar: 'Загрузить аватар',
        regBtn: 'Зарегистрироваться',
        backToLanding: 'Назад на главную',
        mainTitle: 'Чистая Казань',
        navReport: 'Сообщить',
        navVolunteer: 'Помочь',
        navProfile: 'Профиль',
        reportTitle: 'Сообщить о мусоре',
        placeLabel: 'Место',
        placeSelect: 'Выберите место',
        addPlace: 'Добавить своё место',
        typeLabel: 'Тип мусора',
        photoLabel: 'Фото (обязательно)',
        commentLabel: 'Комментарий',
        reportSubmit: 'Отправить заявку',
        volunteerTitle: 'Активные заявки',
        cleanupTitle: 'Подтвердить уборку',
        cleanupPhotoLabel: 'Фото после уборки (обязательно)',
        cleanupSubmit: 'Я убрал',
        addPlaceTitle: 'Добавить место',
        addPlaceName: 'Название места',
        addPlaceLat: 'Широта',
        addPlaceLng: 'Долгота',
        addPlaceSubmit: 'Добавить место',
        profileTitle: 'Мой профиль',
        saveName: 'Сохранить',
        labelReports: 'Заявок',
        labelCleanups: 'Уборок',
        labelRating: 'Рейтинг',
        galleryTitle: 'Мои уборки',
        changeAvatar: 'Изменить аватар',
        logout: 'Выйти из аккаунта',
        userProfileTitle: 'Профиль',
        userGalleryTitle: 'Уборки',
        searchPlaceholder: 'Поиск парка, сквера, набережной...',
        errorEmptyFields: 'Заполните все поля',
        errorLoginExists: 'Такой логин уже занят',
        errorLoginShort: 'Логин минимум 3 символа',
        errorPasswordShort: 'Пароль минимум 4 символа',
        errorWrongLogin: 'Неверный логин или пароль',
        errorSelectPlace: 'Выберите место',
        errorSelectType: 'Выберите тип мусора',
        errorAddPhoto: 'Добавьте фото',
        successRegistered: 'Регистрация успешна! Войдите',
        successLogin: 'Добро пожаловать',
        successReport: 'Заявка отправлена',
        successCleanup: 'Уборка подтверждена! +10 рейтинга',
        successPlaceAdded: 'Место добавлено'
    },
    tt: {
        landingLogo: 'Таза Казан',
        landingTitle: 'Рәхим итегез!',
        landingSubtitle: 'Чиста Казан',
        landingDesc1: 'Бергә без шәһәребезне',
        landingDesc2: 'чиста, яшел һәм матур итәчәкбез!',
        landingDesc3: 'Чүп-чар хакында хәбәр итегез һәм җыюга ярдәм итегез.',
        landingStart: 'Башлау',
        authTitle: 'Чиста Казан',
        authSubtitle: 'Бергә шәһәрне чистартырбыз',
        loginTab: 'Керү',
        registerTab: 'Теркәлү',
        loginUsername: 'Логин',
        loginPassword: 'Серсүз',
        loginBtn: 'Керү',
        regName: 'Исем',
        regLogin: 'Логин (латынча)',
        regPassword: 'Серсүз (минимум 4)',
        regAvatar: 'Аватар йөкләү',
        regBtn: 'Теркәлү',
        backToLanding: 'Артка',
        mainTitle: 'Чиста Казан',
        navReport: 'Хәбәр итү',
        navVolunteer: 'Ярдәм итү',
        navProfile: 'Профиль',
        reportTitle: 'Чүп-чар хакында',
        placeLabel: 'Урын',
        placeSelect: 'Урын сайлагыз',
        addPlace: 'Урын өстәү',
        typeLabel: 'Чүп-чар төре',
        photoLabel: 'Фото (кирәк)',
        commentLabel: 'Аңлатма',
        reportSubmit: 'Җибәрү',
        volunteerTitle: 'Актив заявкалар',
        cleanupTitle: 'Җыюны раслау',
        cleanupPhotoLabel: 'Җыюдан соң фото (кирәк)',
        cleanupSubmit: 'Җыйдым',
        addPlaceTitle: 'Урын өстәү',
        addPlaceName: 'Урын исеме',
        addPlaceLat: 'Киңлек',
        addPlaceLng: 'Озынлык',
        addPlaceSubmit: 'Өстәү',
        profileTitle: 'Минем профиль',
        saveName: 'Саклау',
        labelReports: 'Заявкалар',
        labelCleanups: 'Җыюлар',
        labelRating: 'Рейтинг',
        galleryTitle: 'Минем җыюлар',
        changeAvatar: 'Аватар алыштыру',
        logout: 'Чыгу',
        userProfileTitle: 'Профиль',
        userGalleryTitle: 'Җыюлар',
        searchPlaceholder: 'Парк, сквер эзләү...',
        errorEmptyFields: 'Барлык кырларны тутырыгыз',
        errorLoginExists: 'Бу логин бик кулланылды',
        errorLoginShort: 'Логин минимум 3 символ',
        errorPasswordShort: 'Серсүз минимум 4 символ',
        errorWrongLogin: 'Логин яки серсүз дөрес түгел',
        errorSelectPlace: 'Урын сайлагыз',
        errorSelectType: 'Төр сайлагыз',
        errorAddPhoto: 'Фото өстәгез',
        successRegistered: 'Теркәлү уңышлы! Керегез',
        successLogin: 'Рәхим итегез',
        successReport: 'Заявка җибәрелде',
        successCleanup: 'Җыю расланды! +10 рейтинг',
        successPlaceAdded: 'Урын өстәлде'
    },
    en: {
        landingLogo: 'Taza Kazan',
        landingTitle: 'Welcome!',
        landingSubtitle: 'Clean Kazan',
        landingDesc1: 'Together we will make our city',
        landingDesc2: 'cleaner, greener and more beautiful!',
        landingDesc3: 'Report trash and help clean up.',
        landingStart: 'Start',
        authTitle: 'Clean Kazan',
        authSubtitle: 'Let\'s make the city cleaner together',
        loginTab: 'Login',
        registerTab: 'Register',
        loginUsername: 'Username',
        loginPassword: 'Password',
        loginBtn: 'Sign In',
        regName: 'Name',
        regLogin: 'Username (latin)',
        regPassword: 'Password (min 4)',
        regAvatar: 'Upload avatar',
        regBtn: 'Register',
        backToLanding: 'Back to home',
        mainTitle: 'Clean Kazan',
        navReport: 'Report',
        navVolunteer: 'Help',
        navProfile: 'Profile',
        reportTitle: 'Report trash',
        placeLabel: 'Place',
        placeSelect: 'Select place',
        addPlace: 'Add your place',
        typeLabel: 'Trash type',
        photoLabel: 'Photo (required)',
        commentLabel: 'Comment',
        reportSubmit: 'Submit report',
        volunteerTitle: 'Active reports',
        cleanupTitle: 'Confirm cleanup',
        cleanupPhotoLabel: 'Photo after cleanup (required)',
        cleanupSubmit: 'I cleaned it',
        addPlaceTitle: 'Add place',
        addPlaceName: 'Place name',
        addPlaceLat: 'Latitude',
        addPlaceLng: 'Longitude',
        addPlaceSubmit: 'Add place',
        profileTitle: 'My profile',
        saveName: 'Save',
        labelReports: 'Reports',
        labelCleanups: 'Cleanups',
        labelRating: 'Rating',
        galleryTitle: 'My cleanups',
        changeAvatar: 'Change avatar',
        logout: 'Log out',
        userProfileTitle: 'Profile',
        userGalleryTitle: 'Cleanups',
        searchPlaceholder: 'Search park, square, embankment...',
        errorEmptyFields: 'Fill in all fields',
        errorLoginExists: 'This login is already taken',
        errorLoginShort: 'Login minimum 3 characters',
        errorPasswordShort: 'Password minimum 4 characters',
        errorWrongLogin: 'Wrong login or password',
        errorSelectPlace: 'Select a place',
        errorSelectType: 'Select trash type',
        errorAddPhoto: 'Add a photo',
        successRegistered: 'Registration successful! Sign in',
        successLogin: 'Welcome',
        successReport: 'Report submitted',
        successCleanup: 'Cleanup confirmed! +10 rating',
        successPlaceAdded: 'Place added'
    }
};

const typeLabels = {
    ru: { dump: 'Свалка', overflow: 'Переполненный бак', forest: 'Мусор в лесу', shore: 'Грязный берег', plastic: 'Пластиковый мусор', construction: 'Строительный мусор', other: 'Другое' },
    tt: { dump: 'Чүплек', overflow: 'Тулган контейнер', forest: 'Урманда чүп', shore: 'Батрык яр', plastic: 'Пластик чүп', construction: 'Төзелеш чүбе', other: 'Башка' },
    en: { dump: 'Dump', overflow: 'Overflowing bin', forest: 'Forest trash', shore: 'Dirty shore', plastic: 'Plastic trash', construction: 'Construction waste', other: 'Other' }
};

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('tk_lang', lang);
    const t = i18n[lang];
    if (!t) return;

    // Landing
    const logoText = document.getElementById('landingLogoText');
    if (logoText) logoText.textContent = t.landingLogo;
    
    const titleWords = document.querySelectorAll('#landingTitle .word');
    if (titleWords.length >= 2) {
        const words = t.landingTitle.split(' ');
        titleWords[0].textContent = words[0] || '';
        titleWords[1].textContent = words[1] || '';
    }
    
    const subWords = document.querySelectorAll('#landingSubtitle .word');
    if (subWords.length >= 2) {
        const words = t.landingSubtitle.split(' ');
        subWords[0].textContent = words[0] || '';
        subWords[1].textContent = words[1] || '';
    }
    
    const descLines = document.querySelectorAll('#landingDesc .line');
    if (descLines.length >= 3) {
        descLines[0].textContent = t.landingDesc1;
        descLines[1].textContent = t.landingDesc2;
        descLines[2].textContent = t.landingDesc3;
    }
    
    const startBtn = document.getElementById('landingStartBtn');
    if (startBtn) startBtn.innerHTML = '<span>🚀</span> ' + t.landingStart;

    // Auth
    const authTitle = document.getElementById('authTitle');
    if (authTitle) authTitle.textContent = t.authTitle;
    
    const authSubtitle = document.getElementById('authSubtitle');
    if (authSubtitle) authSubtitle.textContent = t.authSubtitle;
    
    const loginTab = document.getElementById('tabLogin');
    if (loginTab) loginTab.textContent = t.loginTab;
    
    const regTab = document.getElementById('tabRegister');
    if (regTab) regTab.textContent = t.registerTab;
    
    const loginUser = document.getElementById('loginUsername');
    if (loginUser) loginUser.placeholder = t.loginUsername;
    
    const loginPass = document.getElementById('loginPassword');
    if (loginPass) loginPass.placeholder = t.loginPassword;
    
    const regName = document.getElementById('regName');
    if (regName) regName.placeholder = t.regName;
    
    const regLogin = document.getElementById('regLogin');
    if (regLogin) regLogin.placeholder = t.regLogin;
    
    const regPass = document.getElementById('regPassword');
    if (regPass) regPass.placeholder = t.regPassword;
    
    const regBtn = document.getElementById('registerBtn');
    if (regBtn) regBtn.textContent = t.regBtn;
    
    const backBtn = document.getElementById('backToLanding');
    if (backBtn) backBtn.textContent = '← ' + t.backToLanding;

    // Main nav
    const navReport = document.getElementById('navReport');
    if (navReport) navReport.textContent = t.navReport;
    
    const navVolunteer = document.getElementById('navVolunteer');
    if (navVolunteer) navVolunteer.textContent = t.navVolunteer;
    
    const navProfile = document.getElementById('navProfile');
    if (navProfile) navProfile.textContent = t.navProfile;
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.placeholder = '🔍 ' + t.searchPlaceholder;

    // Update active lang buttons
    document.querySelectorAll('.lang-btn, .lang-mini-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === lang);
    });
}

// ====== AUTH ======
async function handleRegister(e) {
    e.preventDefault();
    const t = i18n[currentLang];

    const name = document.getElementById('regName').value.trim();
    const login = document.getElementById('regLogin').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;
    const avatarFile = document.getElementById('regAvatar').files[0];

    if (!name || !login || !password) {
        showError('regError', t.errorEmptyFields);
        return;
    }
    if (login.length < 3) {
        showError('regError', t.errorLoginShort);
        return;
    }
    if (password.length < 4) {
        showError('regError', t.errorPasswordShort);
        return;
    }

    const users = getUsers();
    if (users[login]) {
        showError('regError', t.errorLoginExists);
        return;
    }

    let avatar = null;
    if (avatarFile) {
        avatar = await fileToBase64(avatarFile);
    }

    users[login] = {
        login: login, name: name, password: password, avatar: avatar,
        reports: 0, cleanups: 0, rating: 0, cleanupList: []
    };
    saveUsers(users);

    showToast(t.successRegistered);
    document.getElementById('registerForm').reset();
    document.getElementById('regAvatarPreview').innerHTML = '👤';
    switchTab('login');
}

function handleLogin(e) {
    e.preventDefault();
    const t = i18n[currentLang];

    const login = document.getElementById('loginUsername').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    if (!login || !password) {
        showError('loginError', t.errorEmptyFields);
        return;
    }

    const users = getUsers();
    const user = users[login];

    if (!user || user.password !== password) {
        showError('loginError', t.errorWrongLogin);
        return;
    }

    currentUser = user;
    localStorage.setItem('tk_currentUser', JSON.stringify(user));

    showToast(t.successLogin + ', ' + user.name + '!');
    document.getElementById('loginForm').reset();
    enterApp();
}

function enterApp() {
    showScreen('mainScreen');
    initMap();
    updateHeader();
    updateBadge();
}

function updateHeader() {
    if (!currentUser) return;
    const nameEl = document.getElementById('headerUserName');
    const avatarEl = document.getElementById('headerAvatar');
    if (nameEl) nameEl.textContent = currentUser.name;
    if (avatarEl) {
        if (currentUser.avatar) {
            avatarEl.style.backgroundImage = 'url(' + currentUser.avatar + ')';
        } else {
            avatarEl.style.backgroundImage = '';
            avatarEl.style.background = 'linear-gradient(135deg, #c8e6c9, #a5d6a7)';
        }
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('tk_currentUser');
    closeAllModals();
    showScreen('landingScreen');
}

// ====== MAP ======
function initMap() {
    if (map) return;
    map = L.map('map', { zoomControl: false }).setView([55.79, 49.12], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    updateMapMarkers();
}

function updateMapMarkers() {
    if (!map) return;
    mapMarkers.forEach(m => map.removeLayer(m));
    mapMarkers = [];

    const complaints = getComplaints();
    const places = getPlaces();

    places.forEach(p => {
        const hasActive = complaints.find(c => c.placeId == p.id && c.status === 'active');
        const hasCleaned = complaints.find(c => c.placeId == p.id && c.status === 'cleaned');
        
        let color = '#4caf50';
        let fill = '#4caf50';
        let radius = 10;
        
        if (hasActive) {
            color = '#ff9800';
            fill = '#ff9800';
            radius = 14;
        } else if (hasCleaned) {
            fill = '#81c784';
        }

        const circle = L.circleMarker([p.lat, p.lng], {
            radius: radius, fillColor: fill, color: color, weight: 3,
            opacity: 1, fillOpacity: 0.7
        }).addTo(map);
        
        let popup = '<b>' + p.name + '</b>';
        if (hasActive) popup += '<br>🗑️ Есть жалоба';
        else if (hasCleaned) popup += '<br>✅ Убрано';
        else popup += '<br>✨ Чисто';
        
        circle.bindPopup(popup);
        circle.on('click', () => {
            circle.setStyle({ fillColor: '#ffeb3b', color: '#ffc107' });
            setTimeout(() => circle.setStyle({ fillColor: fill, color: color }), 1500);
            
            const complaint = complaints.find(c => c.placeId == p.id);
            if (complaint) showPlaceInfo(complaint);
        });
        
        mapMarkers.push(circle);
    });
}

// ====== REPORT ======
function updatePlaceSelect() {
    const select = document.getElementById('reportPlace');
    if (!select) return;
    const places = getPlaces();
    const t = i18n[currentLang];
    let html = '<option value="">' + (t.placeSelect || 'Выберите место') + '</option>';
    places.forEach(p => {
        html += '<option value="' + p.id + '">' + p.name + '</option>';
    });
    select.innerHTML = html;
}

async function handleReport(e) {
    e.preventDefault();
    const t = i18n[currentLang];

    const placeId = document.getElementById('reportPlace').value;
    const type = document.getElementById('reportType').value;
    const comment = document.getElementById('reportComment').value.trim();
    const photoFile = document.getElementById('reportPhoto').files[0];

    if (!placeId) { showToast(t.errorSelectPlace); return; }
    if (!type) { showToast(t.errorSelectType); return; }
    if (!photoFile) { showToast(t.errorAddPhoto); return; }

    const photo = await fileToBase64(photoFile);

    const complaint = {
        id: generateId(), placeId: placeId, type: type, comment: comment,
        photo: photo, status: 'active', author: currentUser.login,
        authorName: currentUser.name, authorAvatar: currentUser.avatar,
        date: new Date().toISOString(), cleanupPhoto: null
    };

    const complaints = getComplaints();
    complaints.push(complaint);
    saveComplaints(complaints);

    const users = getUsers();
    if (users[currentUser.login]) {
        users[currentUser.login].reports = (users[currentUser.login].reports || 0) + 1;
        users[currentUser.login].rating = (users[currentUser.login].rating || 0) + 5;
        saveUsers(users);
        currentUser = users[currentUser.login];
        localStorage.setItem('tk_currentUser', JSON.stringify(currentUser));
    }

    showToast(t.successReport);
    closeAllModals();
    updateMapMarkers();
    updateBadge();
}

// ====== CLEANUP ======
async function handleCleanup(e) {
    e.preventDefault();
    const t = i18n[currentLang];

    const id = document.getElementById('cleanupId').value;
    const photoFile = document.getElementById('cleanupPhoto').files[0];

    if (!photoFile) { showToast(t.errorAddPhoto); return; }

    const photo = await fileToBase64(photoFile);

    const complaints = getComplaints();
    const idx = complaints.findIndex(c => c.id === id);
    if (idx === -1) return;

    complaints[idx].status = 'cleaned';
    complaints[idx].cleanupPhoto = photo;
    complaints[idx].cleaner = currentUser.login;
    saveComplaints(complaints);

    const users = getUsers();
    if (users[currentUser.login]) {
        users[currentUser.login].cleanups = (users[currentUser.login].cleanups || 0) + 1;
        users[currentUser.login].rating = (users[currentUser.login].rating || 0) + 10;
        users[currentUser.login].cleanupList = users[currentUser.login].cleanupList || [];
        users[currentUser.login].cleanupList.push({
            placeId: complaints[idx].placeId, type: complaints[idx].type,
            beforePhoto: complaints[idx].photo, afterPhoto: photo,
            date: new Date().toISOString()
        });
        saveUsers(users);
        currentUser = users[currentUser.login];
        localStorage.setItem('tk_currentUser', JSON.stringify(currentUser));
    }

    showToast(t.successCleanup);
    closeAllModals();
    updateMapMarkers();
    updateBadge();
}

// ====== COMPLAINTS LIST ======
function renderComplaints() {
    const list = document.getElementById('complaintsList');
    if (!list) return;
    
    const complaints = getComplaints().filter(c => c.status === 'active');
    const places = getPlaces();
    const t = i18n[currentLang];

    if (complaints.length === 0) {
        list.innerHTML = '<div class="gallery-empty">Нет активных заявок</div>';
        return;
    }

    list.innerHTML = complaints.map(c => {
        const place = places.find(p => p.id == c.placeId);
        const typeName = typeLabels[currentLang][c.type] || c.type;
        const date = new Date(c.date).toLocaleDateString();
        return `
            <div class="complaint-card">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                    <span style="font-weight:700;color:#1b5e20;">${place ? place.name : '?'}</span>
                    <span style="font-size:11px;color:#888;">${date}</span>
                </div>
                <div style="font-size:12px;color:#ff9800;font-weight:600;margin-bottom:6px;">${typeName}</div>
                ${c.comment ? '<p style="font-size:13px;color:#555;margin-bottom:8px;">' + c.comment + '</p>' : ''}
                ${c.photo ? '<img src="' + c.photo + '" style="width:100%;max-height:180px;object-fit:cover;border-radius:14px;margin:10px 0;">' : ''}
                <div class="complaint-author" onclick="showUserProfile('${c.author}')">
                    <div class="author-avatar" style="${c.authorAvatar ? 'background-image:url(' + c.authorAvatar + ')' : ''}"></div>
                    <span class="author-name">${c.authorName || c.author}</span>
                </div>
                <button class="cleanup-action" onclick="openCleanup('${c.id}')">✅ ${t.cleanupSubmit}</button>
            </div>
        `;
    }).join('');
}

// ====== PROFILE ======
function openProfile() {
    if (!currentUser) return;
    const t = i18n[currentLang];

    const nameInput = document.getElementById('profileName');
    const loginText = document.getElementById('profileLogin');
    const avatarEl = document.getElementById('profileAvatar');
    
    if (nameInput) nameInput.value = currentUser.name || '';
    if (loginText) loginText.textContent = '@' + currentUser.login;
    
    if (avatarEl) {
        avatarEl.innerHTML = '';
        if (currentUser.avatar) {
            avatarEl.innerHTML = '<img src="' + currentUser.avatar + '" style="width:100%;height:100%;object-fit:cover;">';
        } else {
            avatarEl.textContent = '👤';
        }
    }

    document.getElementById('statReports').textContent = currentUser.reports || 0;
    document.getElementById('statCleanups').textContent = currentUser.cleanups || 0;
    document.getElementById('statRating').textContent = currentUser.rating || 0;

    const gallery = document.getElementById('galleryList');
    const cleanups = currentUser.cleanupList || [];
    const places = getPlaces();

    if (cleanups.length === 0) {
        gallery.innerHTML = '<div class="gallery-empty">Пока нет уборок</div>';
    } else {
        gallery.innerHTML = cleanups.map(cu => {
            const place = places.find(p => p.id == cu.placeId);
            const typeName = typeLabels[currentLang][cu.type] || cu.type;
            return `
                <div class="gallery-item">
                    <div class="gallery-place">${place ? place.name : '?'}</div>
                    <div class="gallery-type">${typeName}</div>
                    <div class="gallery-photos">
                        <div class="gallery-photo">
                            <img src="${cu.beforePhoto}" alt="before">
                            <div class="gallery-photo-label before">До</div>
                        </div>
                        <div class="gallery-photo">
                            <img src="${cu.afterPhoto}" alt="after">
                            <div class="gallery-photo-label after">После</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    openModal('profileModal');
}

function showUserProfile(login) {
    const users = getUsers();
    const user = users[login];
    if (!user) return;

    const nameEl = document.getElementById('userProfileName');
    const loginEl = document.getElementById('userProfileLogin');
    const avatarEl = document.getElementById('userProfileAvatar');
    
    if (nameEl) nameEl.textContent = user.name || user.login;
    if (loginEl) loginEl.textContent = '@' + user.login;
    
    if (avatarEl) {
        avatarEl.innerHTML = '';
        if (user.avatar) {
            avatarEl.innerHTML = '<img src="' + user.avatar + '" style="width:100%;height:100%;object-fit:cover;">';
        } else {
            avatarEl.textContent = '👤';
        }
    }

    document.getElementById('userStatReports').textContent = user.reports || 0;
    document.getElementById('userStatCleanups').textContent = user.cleanups || 0;
    document.getElementById('userStatRating').textContent = user.rating || 0;

    const gallery = document.getElementById('userGalleryList');
    const cleanups = user.cleanupList || [];
    const places = getPlaces();

    if (cleanups.length === 0) {
        gallery.innerHTML = '<div class="gallery-empty">Пока нет уборок</div>';
    } else {
        gallery.innerHTML = cleanups.map(cu => {
            const place = places.find(p => p.id == cu.placeId);
            const typeName = typeLabels[currentLang][cu.type] || cu.type;
            return `
                <div class="gallery-item">
                    <div class="gallery-place">${place ? place.name : '?'}</div>
                    <div class="gallery-type">${typeName}</div>
                    <div class="gallery-photos">
                        <div class="gallery-photo">
                            <img src="${cu.beforePhoto}" alt="before">
                            <div class="gallery-photo-label before">До</div>
                        </div>
                        <div class="gallery-photo">
                            <img src="${cu.afterPhoto}" alt="after">
                            <div class="gallery-photo-label after">После</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    openModal('userProfileModal');
}

// ====== PLACES ======
function handleAddPlace(e) {
    e.preventDefault();
    const t = i18n[currentLang];
    const name = document.getElementById('newPlaceName').value.trim();
    const lat = parseFloat(document.getElementById('newPlaceLat').value);
    const lng = parseFloat(document.getElementById('newPlaceLng').value);

    if (!name || isNaN(lat) || isNaN(lng)) {
        showToast('Заполните все поля');
        return;
    }

    const places = getPlaces();
    places.push({ id: generateId(), name: name, lat: lat, lng: lng });
    savePlaces(places);

    showToast(t.successPlaceAdded);
    document.getElementById('addPlaceForm').reset();
    closeAllModals();
    updatePlaceSelect();
}

function showPlaceInfo(complaint) {
    const places = getPlaces();
    const place = places.find(p => p.id == complaint.placeId);
    const t = i18n[currentLang];

    const titleEl = document.getElementById('placeInfoTitle');
    const statusEl = document.getElementById('placeInfoStatus');
    const detailsEl = document.getElementById('placeInfoDetails');
    
    if (titleEl) titleEl.textContent = place ? place.name : '?';
    if (statusEl) {
        statusEl.textContent = complaint.status === 'cleaned' ? '✅ Убрано' : '🗑️ Активно';
        statusEl.style.color = complaint.status === 'cleaned' ? '#4caf50' : '#ff9800';
    }

    const typeName = typeLabels[currentLang][complaint.type] || complaint.type;
    let html = '<p><strong>Тип:</strong> ' + typeName + '</p>';
    if (complaint.comment) html += '<p><strong>Комментарий:</strong> ' + complaint.comment + '</p>';
    html += '<p><strong>Автор:</strong> ' + (complaint.authorName || complaint.author) + '</p>';
    if (complaint.photo) html += '<img src="' + complaint.photo + '" style="width:100%;border-radius:12px;margin-top:10px;">';
    if (complaint.cleanupPhoto) {
        html += '<p style="margin-top:10px;color:#4caf50;font-weight:700;">✅ После уборки:</p>';
        html += '<img src="' + complaint.cleanupPhoto + '" style="width:100%;border-radius:12px;">';
    }
    if (detailsEl) detailsEl.innerHTML = html;

    openModal('placeInfoModal');
}

// ====== SEARCH ======
function handleSearch() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const results = document.getElementById('searchResults');
    const places = getPlaces();

    if (!query) {
        results.classList.remove('active');
        return;
    }

    const found = places.filter(p => p.name.toLowerCase().includes(query));
    if (found.length === 0) {
        results.classList.remove('active');
        return;
    }

    results.innerHTML = found.map(p =>
        '<div class="search-item" data-lat="' + p.lat + '" data-lng="' + p.lng + '">' + p.name + '</div>'
    ).join('');
    results.classList.add('active');

    results.querySelectorAll('.search-item').forEach(item => {
        item.addEventListener('click', () => {
            const lat = parseFloat(item.dataset.lat);
            const lng = parseFloat(item.dataset.lng);
            if (map) map.flyTo([lat, lng], 15);
            results.classList.remove('active');
            document.getElementById('searchInput').value = '';
        });
    });
}

// ====== MODALS ======
function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}

function openCleanup(id) {
    const complaints = getComplaints();
    const c = complaints.find(x => x.id === id);
    if (!c) return;
    const places = getPlaces();
    const place = places.find(p => p.id == c.placeId);
    
    const idInput = document.getElementById('cleanupId');
    const nameEl = document.getElementById('cleanupPlaceName');
    
    if (idInput) idInput.value = id;
    if (nameEl) nameEl.textContent = place ? place.name : '?';
    
    const preview = document.getElementById('cleanupPhotoPreview');
    const photoInput = document.getElementById('cleanupPhoto');
    if (preview) preview.innerHTML = '';
    if (photoInput) photoInput.value = '';
    
    openModal('cleanupModal');
}

function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.toggle('active', f.id === (tab === 'login' ? 'loginForm' : 'registerForm')));
}

function updateBadge() {
    const count = getComplaints().filter(c => c.status === 'active').length;
    const badge = document.getElementById('badgeCount');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// ====== AVATARS ======
function handleRegAvatar(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        const preview = document.getElementById('regAvatarPreview');
        if (preview) preview.innerHTML = '<img src="' + ev.target.result + '" style="width:100%;height:100%;object-fit:cover;">';
    };
    reader.readAsDataURL(file);
}

async function handleChangeAvatar(e) {
    const file = e.target.files[0];
    if (!file || !currentUser) return;
    const avatar = await fileToBase64(file);

    const users = getUsers();
    users[currentUser.login].avatar = avatar;
    saveUsers(users);
    currentUser = users[currentUser.login];
    localStorage.setItem('tk_currentUser', JSON.stringify(currentUser));

    updateHeader();
    openProfile();
    showToast('Аватар обновлён');
}

// ====== PHOTO PREVIEW ======
function handlePhotoPreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    if (!input || !preview) return;
    
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) { preview.innerHTML = ''; return; }
        const reader = new FileReader();
        reader.onload = (ev) => {
            preview.innerHTML = '<img src="' + ev.target.result + '" style="max-width:100%;max-height:160px;border-radius:12px;">';
        };
        reader.readAsDataURL(file);
    });
}

// ====== INIT ======
document.addEventListener('DOMContentLoaded', () => {
    // Load language
    const savedLang = localStorage.getItem('tk_lang') || 'ru';
    setLang(savedLang);

    // Load user
    const savedUser = localStorage.getItem('tk_currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            const users = getUsers();
            if (users[currentUser.login]) {
                currentUser = users[currentUser.login];
            }
        } catch (e) {
            currentUser = null;
        }
    }

    // Landing buttons
    document.getElementById('landingStartBtn').addEventListener('click', () => {
        showScreen('authScreen');
        switchTab('login');
    });
    document.getElementById('landingLoginBtn').addEventListener('click', () => {
        showScreen('authScreen');
        switchTab('login');
    });
    document.getElementById('landingRegisterBtn').addEventListener('click', () => {
        showScreen('authScreen');
        switchTab('register');
    });

    // Back to landing
    document.getElementById('backToLanding').addEventListener('click', () => {
        showScreen('landingScreen');
    });

    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Lang switch
    document.querySelectorAll('.lang-btn, .lang-mini-btn').forEach(btn => {
        btn.addEventListener('click', () => setLang(btn.dataset.lang));
    });

    // Auth forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);

    // Avatar
    document.getElementById('regAvatar').addEventListener('change', handleRegAvatar);
    document.getElementById('changeAvatarBtn').addEventListener('click', () => {
        document.getElementById('changeAvatarInput').click();
    });
    document.getElementById('changeAvatarInput').addEventListener('change', handleChangeAvatar);

    // Bottom nav
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'report') {
                updatePlaceSelect();
                const form = document.getElementById('reportForm');
                if (form) form.reset();
                const preview = document.getElementById('reportPhotoPreview');
                if (preview) preview.innerHTML = '';
                document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
                const typeInput = document.getElementById('reportType');
                if (typeInput) typeInput.value = '';
                openModal('reportModal');
            } else if (action === 'volunteer') {
                renderComplaints();
                openModal('volunteerModal');
            } else if (action === 'profile') {
                openProfile();
            }
        });
    });

    // Close modals
    document.querySelectorAll('.closeModal').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    document.querySelectorAll('.modal').forEach(m => {
        m.addEventListener('click', (e) => {
            if (e.target === m) closeAllModals();
        });
    });

    // Report
    document.getElementById('reportForm').addEventListener('submit', handleReport);
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            const typeInput = document.getElementById('reportType');
            if (typeInput) typeInput.value = btn.dataset.type;
        });
    });
    document.getElementById('openAddPlaceBtn').addEventListener('click', () => {
        closeAllModals();
        openModal('addPlaceModal');
    });

    // Cleanup
    document.getElementById('cleanupForm').addEventListener('submit', handleCleanup);

    // Add place
    document.getElementById('addPlaceForm').addEventListener('submit', handleAddPlace);

    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Photo previews
    handlePhotoPreview('reportPhoto', 'reportPhotoPreview');
    handlePhotoPreview('cleanupPhoto', 'cleanupPhotoPreview');

    // Profile
    document.getElementById('saveProfileName').addEventListener('click', () => {
        const newName = document.getElementById('profileName').value.trim();
        if (!newName || !currentUser) return;
        const users = getUsers();
        users[currentUser.login].name = newName;
        saveUsers(users);
        currentUser = users[currentUser.login];
        localStorage.setItem('tk_currentUser', JSON.stringify(currentUser));
        updateHeader();
        showToast('Имя сохранено');
    });

    document.getElementById('logoutBtn').addEventListener('click', logout);

    // User chip
    document.getElementById('userChip').addEventListener('click', openProfile);

    // If already logged in, go to app
    if (currentUser) {
        enterApp();
    }
});

