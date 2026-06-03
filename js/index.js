document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container-right');
    const track = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    const btnPrev = document.querySelector('.slider-btn--prev');
    const btnNext = document.querySelector('.slider-btn--next');

    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // Функция для точного расчёта ширины слайда вместе с его отступами
    const getStepWidth = () => {
        if (!slides.length) return 0;
        const slideWidth = slides[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(track).gap) || 0;
        return slideWidth + gap;
    };

    // Плавное обновление позиции трека
    function updateSliderPosition() {
        const step = getStepWidth();
        currentTranslate = -currentIndex * step;
        prevTranslate = currentTranslate;

        track.style.transform = `translateX(${currentTranslate}px)`;
        updateButtonsState();
    }

    // Блокировка кнопок на крайних слайдах
    function updateButtonsState() {
        if (btnPrev && btnNext) {
            btnPrev.disabled = currentIndex === 0;
            // -2 означает, что мы останавливаемся, когда на экране остаётся пара последних слайдов
            btnNext.disabled = currentIndex >= slides.length - 2;
        }
    }

    // --- ОБРАБОТКА КЛИКОВ ПО КНОПКАМ ---
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            if (currentIndex < slides.length - 2) {
                currentIndex++;
                track.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
                updateSliderPosition();
            }
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                track.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
                updateSliderPosition();
            }
        });
    }

    // --- ОБРАБОТКА МЫШИ И СВАЙПОВ ---
    container.addEventListener('mousedown', dragStart);
    container.addEventListener('touchstart', dragStart, { passive: true });

    window.addEventListener('mousemove', dragMove);
    window.addEventListener('touchmove', dragMove, { passive: true });

    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        isDragging = true;
        startX = getPositionX(e);
        // Отключаем transition во время перетаскивания, чтобы трек шёл ровно за пальцем/курсором
        track.style.transition = 'none';
    }

    function dragMove(e) {
        if (!isDragging) return;
        const currentX = getPositionX(e);
        const movedBy = currentX - startX;

        currentTranslate = prevTranslate + movedBy;

        // Ограничители скролла "резиновые края"
        const maxScroll = -(slides.length - 2) * getStepWidth();
        if (currentTranslate > 50) currentTranslate = 50;
        if (currentTranslate < maxScroll - 50) currentTranslate = maxScroll - 50;

        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;

        // Возвращаем плавную инерцию
        track.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';

        const movedBy = currentTranslate - prevTranslate;
        const threshold = 80; // Расстояние свайпа в px для смены слайда

        if (movedBy < -threshold && currentIndex < slides.length - 2) {
            currentIndex++;
        } else if (movedBy > threshold && currentIndex > 0) {
            currentIndex--;
        }

        updateSliderPosition();
    }

    function getPositionX(e) {
        return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    }

    // Корректный пересчёт позиций при ресайзе окна браузера
    window.addEventListener('resize', () => {
        track.style.transition = 'none';
        updateSliderPosition();
    });

    // Первичный запуск логики
    updateSliderPosition();
});


// video
