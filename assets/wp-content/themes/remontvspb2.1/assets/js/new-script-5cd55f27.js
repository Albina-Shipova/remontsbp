var Optimy=new function(){function e(e,t){e=e||{},t=t||!1;return new function(){function a(){if(s=new IntersectionObserver(y,c),"object"==typeof f)if(f instanceof NodeList)for(var e=0;e<f.length;e++)d&&f[e]instanceof HTMLImageElement?(f[e].setAttribute("loading","lazy"),f[e].src=f[e].getAttribute(u)):s.observe(f[e]);else s.observe(f)}var s,c=e.options,u=e.attribute||"data-src",d=t&&l&&(void 0===e.loadingLazy||e.loadingLazy),f=e.targets||r.querySelectorAll(".lazy["+u+"]"),y=typeof e.callback===o?e.callback:t?n.imagesCallback(u):n.sourcesCallback;if(i)a();else{var b=r.createElement("script");b.src=n.polyfillLink,b.onload=function(){i=!0,a()},r.body.appendChild(b)}return s}}var n=this,t=window,r=document,o="function";n.polyfillLink="intersection-observer.min.js";var i=!1,l="loading"in HTMLImageElement.prototype;"IntersectionObserver"in t&&"IntersectionObserverEntry"in t&&"intersectionRatio"in t.IntersectionObserverEntry.prototype&&("isIntersecting"in t.IntersectionObserverEntry.prototype||Object.defineProperty(t.IntersectionObserverEntry.prototype,"isIntersecting",{get:function(){return this.intersectionRatio>0}}),i=!0);var a=[];n.loadSource=function(e,n,t){var i=typeof n.onload===o;t=void 0===t||t;if("link"===e?url=n.href:"script"===e&&(url=n.src),!~a.indexOf(url)){var l=r.createElement(e);for(var s in i||(n.onload=function(){console.log('"'+url+'" was successfully loaded')}),typeof n.onerror!==o&&(n.onerror=function(){console.error('"'+url+'" failed to load')}),n)Object.hasOwnProperty.call(n,s)&&(l[s]=n[s]);return r.body.appendChild(l),a.push(url),l}i&&t&&n.onload()},n.loadStyle=function(e,t){return n.loadSource("link",{href:e,onload:t,rel:"stylesheet",type:"text/css"})},n.loadScript=function(e,t,r){return n.loadSource("script",{src:e,onload:t,async:!!r})},n.lazyLoad=function(n){return e(n,!0)},n.obsLoad=function(n){return e(n)},n.imagesCallback=function(e){return function(n,t){for(var r=0;r<n.length;r++){var o=n[r].target,i=o.getAttribute(e);n[r].isIntersecting&&(o instanceof HTMLImageElement?(o.src=i,o.onload=function(){o.classList.add("obsloaded")}):(o.style.backgroundImage="url("+i+")",o.classList.add("obsloaded")),t.unobserve(o))}}},n.sourcesCallback=function(e,n){n=n||"";return function(t,r){for(var i=!1,l=0;l<t.length;l++)t[l].isIntersecting&&(i=!0,r.disconnect());i&&(console.log('"'+n+'" will be loaded'),typeof e===o&&e())}}};


var mediaQueryMobile = window.matchMedia('(max-width: 767.9px)');
var mediaQueryTablet = window.matchMedia('(max-width: 991.9px)');

document.addEventListener('DOMContentLoaded', function() {
    // Lazy load images
    // window.load_images();

    //initAccordion;
    initAccordion();
    /* Fix and fill header */
    const header = document.querySelector('.header__main');
    const headerFakeBlock = document.querySelector('.header__fake-block');

    if (header && headerFakeBlock) {
        window.addEventListener('resize', changeFakeHeaderHeight);
        window.addEventListener('scroll', fillHeader);

        changeFakeHeaderHeight();
        fixHeader();
        fillHeader();
    }

    /* MENU */
    /* button menu */
    const buttonMenu = document.querySelector('.js-button-main-menu');

    buttonMenu && buttonMenu.addEventListener('click', function() {
        const mainMenu = document.querySelector('.js-main-menu');

        mainMenu.classList.toggle('mobile-show');
        const opened = mainMenu.classList.contains('mobile-show');
        buttonMenu.setAttribute('aria-expanded', opened ? 'true' : 'false');

        // if (opened) {
        //     const now = Date.now();
        //     if (now - lastOpenTs > 800) { // анти-спам
        //       Toast.show('Двойной клик по пукту — переход', 3600);
        //       lastOpenTs = now;
        //     }
        //   } else {
        //     Toast.hide();
        //   }
    });

    function showSublistHintFirstLevel(currentItem, text = 'Двойной клик по пункту — переход', ms = 3600){
        const parentList = currentItem.closest('.main-menu__sublist, .main-menu__list');
        if (!parentList || !parentList.classList.contains('main-menu__list')) return;
      
        // чтобы не спамить одной и той же подсказкой
        if (currentItem.dataset.hintShown === '1') return;
      
        const sub = currentItem.querySelector(':scope > .main-menu__sublist');
        if (!sub) return;
      
        // создаём «шапку» подсказки сверху подменю (li для списков, div иначе)
        const isList = /^(UL|OL)$/i.test(sub.tagName);
        let hint = sub.querySelector(':scope > .main-menu__hint');
        if (!hint){
          hint = document.createElement(isList ? 'li' : 'div');
          hint.className = 'main-menu__hint';
          hint.setAttribute('role','status');
          hint.setAttribute('aria-live','polite');
          sub.insertBefore(hint, sub.firstChild);
        }
        hint.textContent = text;
        hint.classList.add('is-visible');
      
        currentItem.dataset.hintShown = '1';
      }
      

       
      // Тостер подсказка для мобильнго меню
        const Toast = (() => {
            let el, timer;
            function ensure(){
                if (el) return el;
                el = document.createElement('div');
                el.className = 'tap-toast';
                el.setAttribute('role','status');
                el.setAttribute('aria-live','polite');
                document.body.appendChild(el);
                return el;
            }
            const isMobileForToast = (() => {
                const hasMM = typeof window.matchMedia === 'function';
                const mqlCoarse = hasMM ? matchMedia('(pointer: coarse)') : null;
                const mqlWidth  = hasMM ? matchMedia('(max-width: 1024px)') : null;
    
                return () => (mqlCoarse?.matches || mqlWidth?.matches || window.innerWidth <= 1024);
            })();
            function show(msg='Двойной клик по пукту — переход', ms=3600){
                if (!isMobileForToast()) return; // только на мобайле
                const node = ensure();
                node.textContent = msg;
                node.classList.add('is-visible');
                clearTimeout(timer);
                timer = setTimeout(hide, ms);
            }
            function hide(){ el && el.classList.remove('is-visible'); }
            return { show, hide };
        })();

        let lastOpenTs = 0;


    /* menu sublists */
    const menuLists = document.querySelectorAll('.js-has-sublist');
    const menuListLinks = document.querySelectorAll('.js-has-sublist > .main-menu__sublist-link, .js-has-sublist > .main-menu__link');

    menuLists.forEach(function(element) {
        if (! mediaQueryTablet.matches) {
            element.addEventListener('mouseenter', moveMenuList);
            element.addEventListener('mouseleave', returnMenuListToInit);
        }
    });
    menuListLinks.forEach(function(element) {
        if (mediaQueryTablet.matches) {
            element.addEventListener('click', function(event) {
                // event.preventDefault();
                const target = event.target;
                const currentItem = target.closest('.js-has-sublist');
                const currentList = target.closest('.main-menu__sublist, .main-menu__list');
                
                if (! currentItem) {
                    return true;
                }

                if (! currentItem.classList.contains('active')) {

                    if (currentList) {
                        const activeElements = currentList.querySelectorAll('.active');
                        if (activeElements.length) {
                            activeElements.forEach(function(element) {
                                element.classList.remove('active');
                            });
                        }
                    }
                    console.log('current', currentItem)
                    currentItem.classList.add('active');
                    
                    // ⬇️ ПОКАЗАТЬ ПОДСКАЗКУ ТОЛЬКО ДЛЯ ПЕРВОЙ ВЛОЖЕННОСТИ
                    showSublistHintFirstLevel(currentItem, 'Двойной клик по пукту — переход', 36000);

                    event.preventDefault();
                    return false;
                }


                const href = (target.getAttribute('href') || '').trim(); // NEW
                const isPseudo = !href || href === '#' || href.startsWith('javascript:'); // NEW
                if (isPseudo) { // NEW
                    event.preventDefault();
                    return false;
                }
            });
        }
    });

    const menuSublists = document.querySelectorAll('.main-menu__sublist-item');

    function updateMenuEventListeners() {
        menuSublists.forEach(function(element) {
            element.removeEventListener('mouseover', setMenuListSameHeight);
            element.removeEventListener('mouseout', resetMenuListSameHeight);

            if (window.innerWidth > 991.9) {
                element.addEventListener('mouseover', setMenuListSameHeight);
                element.addEventListener('mouseout', resetMenuListSameHeight);
            }
        });
    }

    // Инициализация при загрузке
    updateMenuEventListeners();

    // Обновление при изменении размера окна
    window.addEventListener('resize', updateMenuEventListeners);

    /* /MENU */

    /* Input mask */
    // const inputTelElements = document.querySelectorAll('[type=tel]');
    const inputTelElements = document.querySelectorAll('[name="phone"]');

    if (inputTelElements.length){
        inputTelElements.forEach(input => {
            var phoneMask = IMask(input, {
                mask: '+{7} (000) 000-00-00',
                placeholderChar: '_',
                lazy: true,
            });
        });
    }

    /* Scroll to top */
    const linksWithAncors = document.querySelectorAll('a[href^="#"]');

    if (linksWithAncors.length) {
        linksWithAncors.forEach(element => {
            element.addEventListener('click', scrollToAnchor);
        });
    }

    /* callback position */
    const callbackFormElements = document.querySelectorAll('.callback-form');

    if (callbackFormElements.length) {
        window.addEventListener('resize', callbackFormPositionEvent);

        callbackFormPositionEvent();
    }

    /* more steps */
    const orderedListElement = document.querySelector('.ordered-list');
    const orderedListButtonElement = document.querySelector('.ordered-list__button-more');

    if (orderedListButtonElement) {
        orderedListButtonElement.addEventListener('click', function() {
            const orderListHiddenItems = orderedListElement.querySelectorAll('.ordered-list__item.hidden');
            orderListHiddenItems.forEach(element => {
                element.classList.remove('hidden');
            });
            orderedListButtonElement.style.display = 'none';
        });
    }

    /* SLIDERS */
    /* steps slider */
    /* country house images slider */
    /* design process cards slider */
    window.workStepsSlider = null;
    window.countryHouseImagesSlider = null;
    window.designProcessCardsSlider = null;
    window.implementaionStepsCardsSlider = null;

    mediaQueryMobile.addEventListener('change', event => {
        if (mediaQueryMobile.matches) {
            initStepsSlider();
            initCountryHouseImagesSlider();
            initDesignProcessCardsSlider();
            initImplementaionStepsCardsSlider();
        } else {
            destroyStepsSlider();
            destroyCountryHouseImagesSlider();
            destroyDesignProcessCardsSlider();
            destroyImplementaionStepsCardsSlider()
        }
    });

    if (mediaQueryMobile.matches) {
        initStepsSlider();
        initCountryHouseImagesSlider();
        initDesignProcessCardsSlider();
        initImplementaionStepsCardsSlider();
    }

    /* reviews slider */
    const reviewsItemsElement = document.querySelector('.reviews__slider');

    if (reviewsItemsElement) {
        const reviewsItemsSlider = new Swiper('.reviews__slider', {
            speed: 1000,
            slidesPerView: 1,
            spaceBetween: 12,
            loop: true,
            lazy: {
                loadPrevNext: true,
            },
            preloadImages: false,
            watchSlidesProgress: true,
            navigation: {
                nextEl: '.reviews-slider__next-slide',
                prevEl: '.reviews-slider__prev-slide',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                }
            }
        });
    }

    /* examples-ch slider */
    let examplesChSlider = null;

    function initExamplesChSwiper() {
        const screenWidth = window.innerWidth;

        if (screenWidth >= 992 && !examplesChSlider) {
            examplesChSlider = new Swiper('.examples-ch__slider', {
                slidesPerView: 1,
                spaceBetween: 120,
            });
        } else if (screenWidth < 992 && examplesChSlider) {
            examplesChSlider.destroy(true, true);
            examplesChSlider = null;
        }
    }

    window.addEventListener('load', initExamplesChSwiper);
    window.addEventListener('resize', initExamplesChSwiper);

    /* images sliders in examples-ch sliders */

    const examplesImagesElement = document.querySelectorAll('.examples-ch__images-slider');


    examplesImagesElement.forEach((slider, index) => {
        const uniqueClass = `examples-ch__images-slider--${index + 1}`;
        const nextBtnClass = `.examples-ch__slider-next-slide--${index + 1}`;

        new Swiper(`.${uniqueClass}`, {
            slidesPerView: 1,
            spaceBetween: 10,
            loop: true,
            navigation: {
                nextEl: nextBtnClass,
            },
        });
    });

    /* team slider */
    const teamItemsElement = document.querySelector('.team__slider');

    if (teamItemsElement) {
        let isSyncing = false;

        const teamItemsSlider = new Swiper('.team__slider', {
            slidesPerView: 1,
            spaceBetween: 200,
            navigation: {
                nextEl: '.team__slider-next-slide',
            },
            breakpoints: {
                992: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                }
            }
        });
        const teamFactsItemsSlider = new Swiper('.team-facts__slider', {
            slidesPerView: 1,
            spaceBetween: 200,
            breakpoints: {
                992: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                }
            }
        });
        const teamQuotesItemsSlider = new Swiper('.team-quotes__slider', {
            slidesPerView: 1,
            spaceBetween: 200,
            breakpoints: {
                992: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                }
            }
        });

        function syncSliders(sourceSlider, otherSliders) {
            sourceSlider.on('slideChange', () => {
                if (isSyncing) return;
                isSyncing = true;

                const index = sourceSlider.activeIndex;
                otherSliders.forEach(slider => slider.slideTo(index));

                isSyncing = false;
            });
        }

        syncSliders(teamItemsSlider, [teamFactsItemsSlider, teamQuotesItemsSlider]);
        syncSliders(teamFactsItemsSlider, [teamItemsSlider, teamQuotesItemsSlider]);
        syncSliders(teamQuotesItemsSlider, [teamItemsSlider, teamFactsItemsSlider]);
    }

    const leaderItemsElement = document.querySelector('.leader__slider');

    if (leaderItemsElement) {

        const leaderItemsElement = new Swiper('.leader__slider', {
            slidesPerView: 3,
            spaceBetween: 40,
            navigation: {
                nextEl: '.leader__slider-next-slide',
                prevEl: '.leader__slider-prev-slide'
            },
            breakpoints: {
                992: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                },
                768: {
                    slidesPerView: 2.5,
                    spaceBetween: 30,
                },
                575: {
                    slidesPerView: 2.2,
                    spaceBetween: 16,
                },
                480: {
                    slidesPerView: 1.7,
                    spaceBetween: 16,
                },
                375: {
                    slidesPerView: 1.3,
                    spaceBetween: 8,
                },
                320: {
                    slidesPerView: 1.3,
                    spaceBetween: 8,
                }
            }
        });

        // leaderItemsElement();
    }

    /* grateful clients slider */
    const clientsItemsElement = document.querySelector('.grateful-clients__slider');

    if (clientsItemsElement) {
        const clientsItemsSlider = new Swiper('.grateful-clients__slider', {
            slidesPerView: 1,
            spaceBetween: 190,
            navigation: {
                prevEl: '.grateful-clients__slider-prev-slide',
                nextEl: '.grateful-clients__slider-next-slide',
            }
        });
    }

    /* interested slider */
    const interestedItemsElement = document.querySelector('.interested__slider');

    if (interestedItemsElement) {
        const interestedItemsSlider = new Swiper('.interested__slider', {
            slidesPerView: 1,
            spaceBetween: 190,
            navigation: {
                nextEl: '.interested__slider-next-slide',
            },
            breakpoints: {
                992: {
                    slidesPerView: 3,
                    spaceBetween: 35,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                }
            }
        });
    }

    /* completed repair slider */
    let examplesCrSlider = null;

    function initCompletedRepairSlider() {
        const screenWidth = window.innerWidth;

        if (screenWidth <= 992 && !examplesCrSlider) {
            examplesCrSlider = new Swiper('.completed-repair__slider', {
                slidesPerView: 1,
                spaceBetween: 120,
            });
        } else if (screenWidth > 992 && examplesCrSlider) {
            examplesCrSlider.destroy(true, true);
            examplesCrSlider = null;
        }
    }

    window.addEventListener('load', initCompletedRepairSlider);
    window.addEventListener('resize', initCompletedRepairSlider);

    /* staff slider */
    const staffItemsElement = document.querySelector('.staff__slider');

    if (staffItemsElement) {
        const staffItemsSlider = new Swiper('.staff__slider', {
            slidesPerView: 1,
            spaceBetween: 10,
            navigation: {
                nextEl: '.staff__slider-next-slide',
            },
            breakpoints: {
                992: {
                    slidesPerView: 3,
                    spaceBetween: 65,
                },
                576: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                }
            }
        });
    }

    /* new staff slider */
    const newStaffItemsElement = document.querySelector('.new-turnkey-slider .staff__slider');

    if (newStaffItemsElement) {
        const staffItemsSlider = new Swiper('.staff__slider', {
            slidesPerView: 1,
            spaceBetween: 10,
            navigation: {
                nextEl: '.staff__slider-next-slide',
            },
            breakpoints: {
                992: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
                576: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                }
            }
        });
    }

    /* main completed objects slider */
    const coMainItemsElement = document.querySelector('.co-main__slider');

    if (coMainItemsElement) {
        const coMainItemsSlider = new Swiper('.co-main__slider', {
            slidesPerView: 1,
            spaceBetween: 100,
            loop: true,
            breakpoints: {
                992: {
                    slidesPerView: 2,
                    spaceBetween: 28,
                }
            }
        });
    }

    // Основной слайдер проектов
try {
    const projectsItemsSliderTurnkey = new Swiper('.projects__items-slider-turnkey', {
        speed: 1000,
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        lazy: {
            loadPrevNext: true,
        },
        preloadImages: false,
        watchSlidesProgress: true,
        navigation: {
            nextEl: '.projects__item-slider-next-slide',
            prevEl: '.projects__item-slider-prev-slide',
        },
        breakpoints: {
            768: {
                slidesPerView: 1,
                spaceBetween: 0,
            }
        }
    });
} catch(err) {
    console.log(err)
}

// Слайдеры изображений
try {
    const projectItems = document.querySelectorAll('.projects__item-wrapper');
    
    projectItems.forEach((item, index) => {
        const imageSlider = item.querySelector('.projects__slider');
        const nextButton = item.querySelector('.projects__slider-next-slide');
        
        if (imageSlider) {
            // Создаем уникальный класс для каждого слайдера
            imageSlider.classList.add(`projects__slider-${index}`);
            if (nextButton) {
                nextButton.classList.add(`projects__slider-next-${index}`);
            }
            
            new Swiper(`.projects__slider-${index}`, {
                slidesPerView: 1,
                spaceBetween: 10,
                loop: true,
                navigation: {
                    nextEl: `.projects__slider-next-${index}`,
                },
            });
        }
    });
} catch (err) {
    console.log(err);
}

    /* work steps rt sliders */
    const workStepsRtElement = document.querySelector('.work-steps-rt__slider');

    if (workStepsRtElement) {
        const workStepsRtItemsSlider = new Swiper('.work-steps-rt__slider', {
            slidesPerView: 1,
            spaceBetween: 25,
            breakpoints: {
                991: {
                    slidesPerView: 2,
                    spaceBetween: 25,
                },
                1199: {
                    slidesPerView: 3,
                    spaceBetween: 25,
                }
            }
        });
    }
    /* /SLIDERS */

    /* Reviews: more text */
    const reviewsItems = document.querySelectorAll('.reviews__item');

    reviewsItems.forEach(function(element) {
        if (element.scrollHeight > element.clientHeight) {
            element.classList.add('more');

            const buttonMore = document.createElement('div');

            buttonMore.classList.add('.reviews-item_text-more');
            buttonMore.onclick = showMoreReviewText;

            element.appendChild(buttonMore);
        }
    });

    /* Modals: open/close */
    // Open modal
    document.querySelectorAll('.js-open-modal-btn').forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal-target');
            const modal = document.querySelector(modalId);
            if (modal) {
                modal.classList.add('active');
                document.documentElement.style.overflow = 'hidden';

                var modal_active = jQuery('.modal.active');
                jQuery('.modal-form-content, .modal__content>.modal__title, .modal__content>.modal__text', modal_active).show();
                jQuery('.modal-form-success', modal_active).hide();

                jQuery('.js-modal-form-callback-error', modal_active).html('').hide();
                jQuery('.error', modal_active).removeClass('error');
            }
        });
    });

    // Close modal by button
    document.querySelectorAll('[data-modal-close]').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.documentElement.style.overflow = 'auto';
                // document.body.style.overflow = 'auto';
                document.body.style.overflowX = 'hidden';
            }
        });
    });

    // Close modal by not content
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                // document.body.style.overflow = 'auto';
                document.documentElement.style.overflow = 'auto';
                document.body.style.overflowX = 'hidden';
            }
        });
    });
});

/* accordion */
function initAccordion(container = document) {
    const accordionButtons = document.querySelectorAll('.accordion-header');

    if (accordionButtons.length) {
        accordionButtons.forEach(button => {
            button.addEventListener('click', accordionToggle);
        });
    }
}

function fixHeader() {
    const header = document.querySelector('.header__main');
    const headerFakeBlock = document.querySelector('.header__fake-block');

    header.classList.add('fixed');
    headerFakeBlock.classList.add('showed');
}

function fillHeader() {
    const header = document.querySelector('.header__main');
    const filledClass = 'filled';

    if (window.scrollY > 0) {
        header.classList.add(filledClass);
    } else {
        header.classList.remove(filledClass);
    }
}

function changeFakeHeaderHeight() {
    const header = document.querySelector('.header__main');
    const headerFakeBlock = document.querySelector('.header__fake-block');

    headerFakeBlock.style.height = header.clientHeight + 'px';
}

function showOrHideMenuSublist() {
    const sublist = this.querySelector('.main-menu__sublist');
    const classActive = 'active';

    if (! sublist.classList.contains(classActive)) {
        sublist.classList.add(classActive);
    } else {
        sublist.classList.remove(classActive);
    }
}

function setMenuListSameHeight() {
    const parentSublist = this.closest('.main-menu__sublist');
    const sublist = this.querySelector('.main-menu__sublist');

    if (! parentSublist || ! sublist) {
        return;
    }

    if (sublist.clientHeight > parentSublist.clientHeight) {
        parentSublist.style.height = sublist.clientHeight + 'px';
    }
}

function resetMenuListSameHeight() {
    const parentSublist = this.closest('.main-menu__sublist');

    if (! parentSublist) {
        return;
    }

    parentSublist.style.height = '';
}

function moveMenuList() {
    const currentList = this.closest('.main-menu__sublist');
    const mainMenu = document.querySelector('.main-menu');
    const mainMenuRect = mainMenu.getBoundingClientRect();

    const sublist = this.querySelector('.main-menu__sublist');
    const sublistRect = sublist.getBoundingClientRect();

    if (! currentList || ! sublist) {
        return;
    }

    let diffMargin = sublistRect.right - mainMenuRect.right;

    if (diffMargin > 0) {
        currentList.style.transform = 'translateX(-' + diffMargin + 'px)';
    }
}

function returnMenuListToInit() {
    const currentList = this.closest('.main-menu__sublist');

    if (! currentList) {
        return;
    }

    currentList.style.transform = '';
}

function scrollToAnchor() {
    const href = this.getAttribute('href');
    const element = document.querySelector(href);
    let headerHeight = 0;
    let scrollTo = 0;

    if (! element) {
        return;
    }

    const elementOffsetTop = element.offsetTop;
    const header = document.querySelector('.js-header-fixed');

    scrollTo = elementOffsetTop;

    if (header) {
        headerHeight = header.clientHeight;

        if (scrollTo - headerHeight > 0) {
            scrollTo -= headerHeight;
        }
    }

    animateScrollTop(scrollTo, 2000);

    return false;
}

function animateScrollTop(destination, duration) {
    var duration = duration || 400;

    switch (duration) {
        case 'fast':
            duration = 200;
            break;
        case 'slow':
            duration = 600;
            break;
    }

    var requestAnimationFrame = window.requestAnimationFrame;
    var scrollingElement = document.scrollingElement;
    var scrollTop = scrollingElement.scrollTop;

    if (scrollTop === destination) return;

    var cosParameter = (scrollTop - destination) / 2;

    let scrollCount = 0, oldTimestamp = null;

    function step(newTimestamp) {
        if (oldTimestamp !== null) {
            // if duration is 0 scrollCount will be Infinity
            scrollCount += Math.PI * (newTimestamp - oldTimestamp) / duration;

            if (scrollCount >= Math.PI) return scrollingElement.scrollTop = destination;

            scrollingElement.scrollTop = scrollTop - cosParameter * (1 - Math.cos(scrollCount));
        }

        oldTimestamp = newTimestamp;

        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

function accordionToggle(event) {
    const parentElement = this.closest('.accordion-item');
    const container = parentElement.parentElement;

    container.querySelectorAll('.accordion-item').forEach(function(item) {
        if (item !== parentElement) item.classList.remove('active');
    });

    parentElement.classList.toggle('active');
}

function callbackFormPositionEvent() {
    const callbackFormElements = document.querySelectorAll('.callback-form');

    if (callbackFormElements.length) {
        callbackFormElements.forEach(element => {
            callbackFormPosition(element);
        });
    }
}

function initStepsSlider() {
    if (! workStepsSlider || workStepsSlider.destroyed) {
        workStepsSlider = new Swiper('.work-steps__slider', {
            speed: 1000,
            slidesPerView: 1.125,
            spaceBetween: 13,
        });
    }
}
function destroyStepsSlider() {
    if (workStepsSlider && workStepsSlider.destroyed) {
        workStepsSlider.destroy();
    }
}

function initCountryHouseImagesSlider() {
    if (! countryHouseImagesSlider || countryHouseImagesSlider.destroyed) {
        countryHouseImagesSlider = new Swiper('.country-house__slider', {
            speed: 1000,
            slidesPerView: 1.25,
            spaceBetween: 22,
        });
    }
}
function destroyCountryHouseImagesSlider() {
    if (countryHouseImagesSlider && countryHouseImagesSlider.destroyed) {
        countryHouseImagesSlider.destroy();
    }
}

function initDesignProcessCardsSlider() {
    if (! designProcessCardsSlider || designProcessCardsSlider.destroyed) {
        designProcessCardsSlider = new Swiper('.design-process__slider', {
            speed: 1000,
            slidesPerView: 1.125,
            spaceBetween: 42,
        });
    }
}
function destroyDesignProcessCardsSlider() {
    if (designProcessCardsSlider && designProcessCardsSlider.destroyed) {
        designProcessCardsSlider.destroy();
    }
}
function initImplementaionStepsCardsSlider() {
    if (! implementaionStepsCardsSlider || implementaionStepsCardsSlider.destroyed) {
        implementaionStepsCardsSlider = new Swiper('.implementation-steps__slider', {
            slidesPerView: 1,
            spaceBetween: 42,
        });
    }
}
function destroyImplementaionStepsCardsSlider() {
    if (implementaionStepsCardsSlider && implementaionStepsCardsSlider.destroyed) {
        implementaionStepsCardsSlider.destroy();
    }
}

function callbackFormPosition(element) {
    if (!element) return;
    const elementHeight = element.clientHeight;
    const previousElement = element.previousElementSibling;
    let heightOnTop;
    let percentOnTop = 2.5;

    if (window.screen.width < 768) {
        percentOnTop = 4;
    }

    heightOnTop = elementHeight / percentOnTop;

    previousElement && (previousElement.style.paddingBottom = '');

    const previousElementComputedStyle = previousElement && window.getComputedStyle(previousElement);
    const previousElementPaddingBottom =previousElementComputedStyle && previousElementComputedStyle.getPropertyValue('padding-bottom');
    let paddingBottom = 0;

    if (previousElementPaddingBottom) {
        paddingBottom = parseInt(previousElementPaddingBottom);
    }

    previousElement && (previousElement.style.paddingBottom = paddingBottom + heightOnTop + 'px');
    element.style.marginTop = -heightOnTop + 'px';
}

function showMoreReviewText() {
}

// lazyload for images
try {
    window.load_images = () => {
        setTimeout(function () {
            $("body")
                .find("img[data-src]")
                .each(function () {
                    var src = $(this).attr("data-src");
                    var srcset = $(this).attr("data-srcset");
                    var classes = $(this).attr("class");
                    var alt = $(this).attr("alt");
                    var title = $(this).attr("title");
                    if (src) {
                        var img = new Image();
                        $(img).hide();
                        $(img).on("load", function () {
                            $(this).fadeIn(400);
                            $(img).parents(".bg").addClass("loaded");
    
                            setTimeout(function () {
                                $(img).addClass("transition");
                            }, 400);
                        });
                        (srcset && srcset.length) > 3
                            ? $(img).attr("srcset", srcset)
                            : $();
                        $(img).attr("src", src);
                        $(img).attr("alt", alt);
                        $(img).attr("title", title);
                        $(img).addClass(classes);
                        $(this).replaceWith(img);
                    }
                });
        }, 150);
    };
} catch(err) {
    console.error("Error in lazyload for images: ", err);
}


//swipers
function initCompleteSwipers() {
    // Инициализация внутренних галерей в карточках
    document.querySelectorAll('.complete__gallery-slider').forEach((slider, index) => {
      if (!slider.classList.contains('swiper-initialized')) {
        new Swiper(slider, {
          navigation: {
            nextEl: `.swiper-button-next-${index}`,
          },
          slidesPerView: 1,
          spaceBetween: 5,
          loop: true,
        });
      }
    });
  
    // Инициализация общего свайпера на мобилке
    const container = document.querySelector('.complete__items');
    let completeItemsSwiper = container?.swiper || null;
  
    function initMobileCompleteSwiper() {
        if (!container) return;
      const isMobile = window.innerWidth <= 767;
  
      if (isMobile && !completeItemsSwiper) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('swiper-wrapper');
  
        const items = Array.from(container.children);
        items.forEach((item) => {
          item.classList.add('swiper-slide');
          wrapper.appendChild(item);
        });
  
        container.classList.add('swiper');
        container.appendChild(wrapper);
  
        completeItemsSwiper = new Swiper(container, {
          slidesPerView: 1,
          spaceBetween: 20,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
        });
      }
  
      if (!isMobile && completeItemsSwiper) {
        completeItemsSwiper.destroy(true, true);
        completeItemsSwiper = null;
  
        const wrapper = container.querySelector('.swiper-wrapper');
        if (wrapper) {
          const slides = Array.from(wrapper.children);
          slides.forEach((slide) => {
            slide.classList.remove('swiper-slide');
            container.appendChild(slide);
          });
          wrapper.remove();
        }
  
        container.classList.remove('swiper');
        const pagination = container.querySelector('.swiper-pagination');
        if (pagination) pagination.remove();
      }
    }
  
    window.addEventListener('resize', initMobileCompleteSwiper);
    initMobileCompleteSwiper();
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    // Инициализация свайперов при загрузке страницы
    initCompleteSwipers();
  });


  jQuery(document).ready(function($) {
    $('.steps-tab').on('click', function() {
        var type = $(this).data('type');

        // активный таб
        $('.steps-tab').removeClass('active');
        $(this).addClass('active');

        // показываем контент нужного типа
        $('.steps-tab-content').removeClass('active').hide();
        $('.steps-tab-content[data-type="' + type + '"]').addClass('active').fadeIn(200);
    });
});

try {
    const partnersHomeSlider = new Swiper('.home-partners__wrapper--swiper', {
        slidesPerView: 1.2,
        spaceBetween: 20,
        breakpoints: {
            991: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 1.5,
                spaceBetween: 20,
            }
        }
    });
} catch (err) {
    console.log(err)
}
try {
    const swiperConfig = {
        speed: 1000,
        spaceBetween: 20,
        loop: false,
        freeMode: true,
        freeModeMomentum: false,
        lazy: { loadPrevNext: true },
        preloadImages: false,
        watchSlidesProgress: true,
        breakpoints: {
            1360: { slidesPerView: 3 },
            1200: { slidesPerView: 2.5 },
            1024: { slidesPerView: 2.2 },
            768:  { slidesPerView: 1.8, spaceBetween: 24, autoHeight: false },
            480:  { slidesPerView: 1.1, spaceBetween: 12 },
            300:  { slidesPerView: 1.1, spaceBetween: 8, autoHeight: true },
        }
    };

    // Первые два — обычный конфиг
    new Swiper('.newhome-steps-swiper-0', swiperConfig);
    new Swiper('.newhome-steps-swiper-1', swiperConfig);

    // Третий — переопределяем нужный брейкпоинт
    new Swiper('.newhome-steps-swiper-2', {
        ...swiperConfig,
        breakpoints: {
            ...swiperConfig.breakpoints,
            1360: { slidesPerView: 2 },
            1200: { slidesPerView: 2 },
            1024: { slidesPerView: 2 },
            768:  { slidesPerView: 1.8, spaceBetween: 24, autoHeight: false },
            480:  { slidesPerView: 1.1, spaceBetween: 12 },
            300:  { slidesPerView: 1.1, spaceBetween: 8, autoHeight: true },
        }
    });

} catch(err) {
    console.log(err);
}
//checkbox acceptance checked
document.addEventListener('DOMContentLoaded', function() {
    const checkbox = document.querySelector('.wpcf7-acceptance input[type="checkbox"]');
    if (checkbox) checkbox.checked = true;
});


jQuery(function($) {
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 300) {
            $('.to_top').fadeIn();
        } else {
            $('.to_top').fadeOut();
        }
    });

    $('.to_top').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 600);
    });

});

/* --- Новая форма. Callback --- */

jQuery('body').on('keyup', '.js-modal-form-callback input', function(event){
    if (jQuery(this).val() == '') return;
    jQuery(this).removeClass('error');
    var form = jQuery(this).closest('form');
    jQuery('.js-modal-form-callback-error', form).html('').hide();
});

jQuery('body').on('click', '.js-modal-form-callback-btn', function(event){
    event.preventDefault();

    var form = jQuery(this).closest('form');

    var loading = jQuery('.modal-form__button-wrapper', form);
    var errorDiv = jQuery('.js-modal-form-callback-error', form);

    if (loading.hasClass('loading')) return;

    errorDiv.html('').hide();
    jQuery('.error', form).removeClass('error');
    loading.removeClass('loading');

    var nameInput = form.find('input[name="name"]');
    var phoneInput = form.find('input[name="phone"]');

    var name = nameInput.val();
    var phone = phoneInput.val();

    if (name == '' || phone == '') {
        errorDiv.html('Одно или несколько полей содержат ошибочные данные. Пожалуйста, проверьте их и попробуйте ещё раз.').fadeIn(100);
        if (name == '') {
            setTimeout(function(){
                nameInput.addClass('error');
            }, 100);
        }
        if (phone == '') {
            setTimeout(function(){
                phoneInput.addClass('error');
            }, 100);
        }
        return false;
    }

    var agree = form.find('input[name="agree"]:checked');
    if (agree.length == 0) {
        errorDiv.html('Необходимо согласиться с правилами политики конфиденциальности и дать согласие на обработку персональных данных').fadeIn(100);
        return false;
    }

    data = form.serialize()+'&method=callback';

    loading.addClass('loading');

    jQuery.ajax({
        url: "/wp-content/themes/remontvspb2.1/senders/send-new.php",
        data: data,
        method: 'POST'
    }).done(function (response) {
        if (response == 1) {
            var modal_active = jQuery('.modal.active');
            jQuery('.modal-form-content', modal_active).hide();
            jQuery('.modal-form-success', modal_active).fadeIn(200);
            jQuery('.modal__content>.modal__title, .modal__content>.modal__text', modal_active).hide();
            jQuery('.modal-form__input', form).val('');
            reachGoal('form_callback');
            window.location.href = '/spasibo/';
        }
        else {
            errorDiv.html(response).fadeIn(100);
        }
        loading.removeClass('loading');
    });
});

/* --- Новая форма. Calculator Modal --- */

jQuery('body').on('keyup', '.js-form-calculator-modal input', function(event){
    if (jQuery(this).val() == '') return;
    jQuery(this).removeClass('error');
    var form = jQuery(this).closest('form');
    jQuery('.js-form-calculator-modal-error', form).html('').hide();
});

jQuery('body').on('click', '.js-form-calculator-modal-btn', function(event){
    event.preventDefault();

    var form = jQuery(this).closest('form');

    var loading = jQuery('.modal-form__button-wrapper', form);
    var errorDiv = jQuery('.js-form-calculator-modal-error', form);

    if (loading.hasClass('loading')) return;

    errorDiv.html('').hide();
    jQuery('.error', form).removeClass('error');
    loading.removeClass('loading');

    var nameInput = form.find('input[name="name"]');
    var phoneInput = form.find('input[name="phone"]');

    var name = nameInput.val();
    var phone = phoneInput.val();

    if (name == '' || phone == '') {
        errorDiv.html('Одно или несколько полей содержат ошибочные данные. Пожалуйста, проверьте их и попробуйте ещё раз.').fadeIn(100);
        if (name == '') {
            setTimeout(function(){
                nameInput.addClass('error');
            }, 100);
        }
        if (phone == '') {
            setTimeout(function(){
                phoneInput.addClass('error');
            }, 100);
        }
        return false;
    }

    var agree = form.find('input[name="agree"]:checked');
    if (agree.length == 0) {
        errorDiv.html('Необходимо согласиться с правилами политики конфиденциальности и дать согласие на обработку персональных данных').fadeIn(100);
        return false;
    }

    data = form.serialize()+'&method=calculator_modal';

    var fields = jQuery('.calculator-hidden-fields');
    if (fields.length) {
        jQuery('input', fields).each(function(){
            var field = jQuery(this).attr('name');
            var value = jQuery(this).val();
            data += '&'+field+'='+value;
        });
    }

    loading.addClass('loading');

    jQuery.ajax({
        url: "/wp-content/themes/remontvspb2.1/senders/send-new.php",
        data: data,
        method: 'POST'
    }).done(function (response) {
        if (response == 1) {
            var modal_active = jQuery('.modal.active');
            jQuery('.modal-form-content', modal_active).hide();
            jQuery('.modal-form-success', modal_active).fadeIn(200);
            jQuery('.modal__content>.modal__title, .modal__content>.modal__text', modal_active).hide();
            jQuery('.modal-form__input', form).val('');
            reachGoal('form_calculator_modal');
            window.location.href = '/spasibo/';
        }
        else {
            errorDiv.html(response).fadeIn(100);
        }
        loading.removeClass('loading');
    });
});


/* --- Новая форма. Calculator Small --- */

jQuery('body').on('keyup', '.js-form-calculator-small input', function(event){
    if (jQuery(this).val() == '') return;
    jQuery(this).removeClass('error');
    var form = jQuery(this).closest('form');
    jQuery('.js-form-calculator-small-error', form).html('').hide();
});

jQuery('body').on('click', '.js-form-calculator-small-btn', function(event){
    event.preventDefault();

    var form = jQuery(this).closest('form');

    var loading = jQuery('.calc-form-button-wrap', form);
    var errorDiv = jQuery('.js-form-calculator-small-error', form);

    if (loading.hasClass('loading')) return;

    errorDiv.html('').hide();
    jQuery('.error', form).removeClass('error');
    loading.removeClass('loading');

    var nameInput = form.find('input[name="name"]');
    var phoneInput = form.find('input[name="phone"]');

    var name = nameInput.val();
    var phone = phoneInput.val();

    if (name == '' || phone == '') {
        errorDiv.html('Одно или несколько полей содержат ошибочные данные. Пожалуйста, проверьте их и попробуйте ещё раз.').fadeIn(100);
        if (name == '') {
            setTimeout(function(){
                nameInput.addClass('error');
            }, 100);
        }
        if (phone == '') {
            setTimeout(function(){
                phoneInput.addClass('error');
            }, 100);
        }
        return false;
    }

    data = form.serialize()+'&method=calculator_small';

    loading.addClass('loading');

    jQuery.ajax({
        url: "/wp-content/themes/remontvspb2.1/senders/send-new.php",
        data: data,
        method: 'POST'
    }).done(function (response) {
        //console.log(response);
        if (response == 1) {
            //jQuery('.calc__form-input', form).val('');
            reachGoal('form_calculator_small');
            window.location.href = '/spasibo/';
        }
        else {
            errorDiv.html(response).fadeIn(100);
        }
        loading.removeClass('loading');
    });
});

jQuery('body').on('click', '.js-form-calculator-modal-close', function(event){
    var modal_active = jQuery('.modal.active');

    jQuery('.modal__button-close', modal_active).trigger('click');

    jQuery('.modal-form-content, .modal__content>.modal__title, .modal__content>.modal__text', modal_active).show();
    jQuery('.modal-form-success', modal_active).hide();
});

/* --- Новая форма. Calculator --- */

jQuery('body').on('keyup', '.js-form-calculator input', function(event){
    if (jQuery(this).val() == '') return;
    jQuery(this).removeClass('error');
    var form = jQuery(this).closest('form');
    jQuery('.js-form-calculator-error', form).html('').hide();
});

jQuery('body').on('click', '.js-form-calculator-btn', function(event){
    event.preventDefault();

    var form = jQuery(this).closest('form');

    var loading = jQuery('.calc-form-button-wrap', form);
    var errorDiv = jQuery('.js-form-calculator-error', form);

    if (loading.hasClass('loading')) return;

    errorDiv.html('').hide();
    jQuery('.error', form).removeClass('error');
    loading.removeClass('loading');

    var nameInput = form.find('input[name="name"]');
    var phoneInput = form.find('input[name="phone"]');

    var name = nameInput.val();
    var phone = phoneInput.val();

    if (name == '' || phone == '') {
        errorDiv.html('Одно или несколько полей содержат ошибочные данные. Пожалуйста, проверьте их и попробуйте ещё раз.').fadeIn(100);
        if (name == '') {
            setTimeout(function(){
                nameInput.addClass('error');
            }, 100);
        }
        if (phone == '') {
            setTimeout(function(){
                phoneInput.addClass('error');
            }, 100);
        }
        return false;
    }

    data = form.serialize()+'&method=calculator';

    loading.addClass('loading');

    jQuery.ajax({
        url: "/wp-content/themes/remontvspb2.1/senders/send-new.php",
        data: data,
        method: 'POST'
    }).done(function (response) {
        //console.log(response);
        if (response == 1) {
            //jQuery('.calc__form-input', form).val('');
            reachGoal('form_calculator');
            window.location.href = '/spasibo/';
        }
        else {
            errorDiv.html(response).fadeIn(100);
        }
        loading.removeClass('loading');
    });
});

/* --- Новая форма. Remont --- */

jQuery('body').on('keyup', '.js-form-remont input', function(event){
    if (jQuery(this).val() == '') return;
    jQuery(this).removeClass('error');
    var form = jQuery(this).closest('form');
    jQuery('.js-form-remont-error', form).html('').hide();
});

jQuery('body').on('click', '.js-form-remont-btn', function(event){
    event.preventDefault();

    var form = jQuery(this).closest('form');

    var loading = jQuery('.form-remont-btn-wrapper', form);
    var errorDiv = jQuery('.js-form-remont-error', form);

    if (loading.hasClass('loading')) return;

    errorDiv.html('').hide();
    jQuery('.error', form).removeClass('error');
    loading.removeClass('loading');

    var nameInput = form.find('input[name="name"]');
    var phoneInput = form.find('input[name="phone"]');

    var name = nameInput.val();
    var phone = phoneInput.val();

    if (name == '' || phone == '') {
        errorDiv.html('Одно или несколько полей содержат ошибочные данные. Пожалуйста, проверьте их и попробуйте ещё раз.').fadeIn(100);
        if (name == '') {
            setTimeout(function(){
                nameInput.addClass('error');
            }, 100);
        }
        if (phone == '') {
            setTimeout(function(){
                phoneInput.addClass('error');
            }, 100);
        }
        return false;
    }

    data = form.serialize()+'&method=remont';

    loading.addClass('loading');

    jQuery.ajax({
        url: "/wp-content/themes/remontvspb2.1/senders/send-new.php",
        data: data,
        method: 'POST'
    }).done(function (response) {
        //console.log(response);
        if (response == 1) {
            reachGoal('form_remont');
            //jQuery('.modal-form__input', form).val('');
            window.location.href = '/spasibo/';
        }
        else {
            errorDiv.html(response).fadeIn(100);
        }
        loading.removeClass('loading');
    });
});

jQuery('body').on('click', '.js-modal-form-callback-close', function(event){
    var modal_active = jQuery('.modal.active');

    jQuery('.modal__button-close', modal_active).trigger('click');

    jQuery('.modal-form-content, .modal__content>.modal__title, .modal__content>.modal__text', modal_active).show();
    jQuery('.modal-form-success', modal_active).hide();
});

/* --- Цели --- */

function reachGoal(name) {
    try {
        if (typeof ym === 'function') {
            ym(105452444, 'reachGoal', name);
        }
    } catch (e) {}
}

/* --- // --- */