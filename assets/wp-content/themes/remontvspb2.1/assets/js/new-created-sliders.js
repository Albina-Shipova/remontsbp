document.addEventListener("DOMContentLoaded", function () {
    // Храним ссылки на слайдеры вне функций
    let reviewsItemsSliderHome;
    let whyItemsSlider;
    let infoCardSlider;
    let infoCardSliderNew;

    function initSliders() {
        const screenWidth = window.innerWidth;

        if (!reviewsItemsSliderHome) {
            reviewsItemsSliderHome = new Swiper('.reviews__slider-turnkey', {
                speed: 1000,
                slidesPerView: 1.2,
                spaceBetween: 12,
                loop: true,
                lazy: { loadPrevNext: true },
                preloadImages: false,
                watchSlidesProgress: true,
                navigation: {
                    nextEl: '.reviews-slider__next-slide',
                    prevEl: '.reviews-slider__prev-slide',
                },
                breakpoints: {
                    991: { slidesPerView: 3, spaceBetween: 30 },
                    768: { slidesPerView: 2.4, spaceBetween: 30 },
                    575: { slidesPerView: 1.8, spaceBetween: 16 },
                    480: { slidesPerView: 1.3, spaceBetween: 16 },
                }
            });
        }

        // 2. Слайдер "Почему РВТ" (только для мобилок)
        let whyItemsElement = document.querySelector('.why-rvt__items--mobile');
        if (whyItemsElement) {
            if (screenWidth <= 768) {
                // Создаем только если еще не создан
                if (!whyItemsSlider) {
                    whyItemsSlider = new Swiper(whyItemsElement, {
                        speed: 1000,
                        slidesPerView: 1.2,
                        spaceBetween: 12,
                        loop: false,
                        breakpoints: {
                            768: { slidesPerView: 2, spaceBetween: 30 }
                        }
                    });
                }
            } else {
                // Если экран стал больше 768 — уничтожаем слайдер
                if (whyItemsSlider) {
                    if (typeof whyItemsSlider.destroy === 'function') {
                        whyItemsSlider.destroy(true, true);
                    }
                    whyItemsSlider = null;
                }
            }
        }

        let infoCardsItemsElement = document.querySelector('.info-cards__grid--mobile');
        if (infoCardsItemsElement) {
            if (screenWidth <= 768) {
                if (!infoCardSlider) {
                    infoCardSlider = new Swiper(infoCardsItemsElement, {
                        speed: 1000,
                        slidesPerView: 1.2,
                        spaceBetween: 12,
                        loop: false,
                        breakpoints: {
                            768: { slidesPerView: 2, spaceBetween: 30 }
                        }
                    });
                }
            } else {
                if (infoCardSlider) {
                    if (typeof infoCardSlider.destroy === 'function') {
                        infoCardSlider.destroy(true, true);
                    }
                    infoCardSlider = null;
                }
            }
        }

        let infoCardsItemsElementNew = document.querySelector('.info-cards__grid--new');
        if (infoCardsItemsElement) {
            if (!infoCardSliderNew) {
                infoCardSlider = new Swiper(infoCardsItemsElement, {
                    speed: 1000,
                    slidesPerView: 1.15,
                    spaceBetween: 12,
                    loop: false,
                    navigation: {
                        nextEl: '.info-cards__next-slide',
                        prevEl: '.info-cards__prev-slide',
                    },
                    breakpoints: {
                        1024: { slidesPerView: 3.2, spaceBetween: 34 },
                        768: { slidesPerView: 2.4, spaceBetween: 30 },
                        575: { slidesPerView: 1.8, spaceBetween: 16 },
                        480: { slidesPerView: 1.3, spaceBetween: 16 },
                    }
                });
            }
        }
    }

    // Запускаем при загрузке
    initSliders();

    // Запускаем при ресайзе с небольшой задержкой (debounce), чтобы не спамить ошибками
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initSliders, 200);
    });

    const btn = document.getElementById('toggleButton');
    const text = document.getElementById('textBlock');

    if (btn && text) {
        btn.addEventListener('click', function() {
            const isCollapsed = text.classList.contains('is-collapsed');
            
            if (isCollapsed) {
                text.classList.remove('is-collapsed');
                btn.textContent = 'Скрыть текст';
            } else {
                text.classList.add('is-collapsed');
                btn.textContent = 'Показать полностью';
                
                // Опционально: плавно скроллим к заголовку при закрытии, чтобы не потеряться
                text.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    const counters = document.querySelectorAll(".company-stat__number");
    const statsSection = document.querySelector('.company-stats'); // Сохраняем секцию в переменную
  
    // Проверяем, есть ли и счетчики, и сама секция на странице
    if (counters.length > 0 && statsSection) {
        const speed = 40;

        const animateCounters = () => {
            counters.forEach(counter => {
                const target = +counter.dataset.target.replace(/\D/g, '');
                const unit = counter.textContent.replace(/[0-9]/g, '').trim();
                
                const count = () => {
                    const current = +counter.innerText.replace(/\D/g, '');
                    const inc = Math.ceil(target / speed) || 1; // Защита от деления на 0
                    
                    if (current < target) {
                        counter.innerText = (current + inc) + unit;
                        setTimeout(count, 30);
                    } else {
                        counter.innerText = target.toLocaleString() + unit;
                    }
                };
                count();
            });
        };

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                animateCounters();
                observer.disconnect();
            }
        }, { threshold: 0.5 });

        // Теперь мы уверены, что statsSection — это Element, а не null
        observer.observe(statsSection);
    }

    const tabs = document.querySelectorAll('.portfolio-turnkey__tabs-heading .nav-btn');
    const panes = document.querySelectorAll('.portfolio-turnkey__tab-pane');

    if (tabs.length > 0 && panes.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-tab');

                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                panes.forEach(pane => {
                    if (pane.id === targetId) {
                        pane.style.display = 'block';
                        pane.classList.add('active');
                        
                        // Находим все swiper-container внутри открытого таба
                        const sliders = pane.querySelectorAll('swiper-container');
                        sliders.forEach(slider => {
                            // Метод 1: Если swiper уже есть, обновляем его
                            if (slider.swiper) {
                                slider.swiper.update();
                            }
                            
                            // Метод 2: Форсируем пересчет размеров через небольшую задержку
                            setTimeout(() => {
                                slider.swiper.update();
                            }, 50);
                        });
                    } else {
                        pane.style.display = 'none';
                        pane.classList.remove('active');
                    }
                });
            });
        });
    }
    
});