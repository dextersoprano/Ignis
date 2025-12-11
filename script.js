// Автообновление года в футере
document.getElementById("year").textContent = new Date().getFullYear();

// Мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.getElementById('main-nav');
    const navLinks = nav.querySelectorAll('a');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('active');
        });

        // Закрытие меню при клике на ссылку
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Закрытие меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                nav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Smooth scroll для кнопок с data-scroll-to
    document.querySelectorAll('[data-scroll-to]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-scroll-to');
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Обработка формы
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Проверка honeypot поля
            const honeypot = form.querySelector('input[name="website"]');
            if (honeypot && honeypot.value) {
                return; // Бот обнаружен, не отправляем
            }

            // Валидация формы
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Здесь можно добавить отправку на сервер
            // Например: fetch('/api/contact', { method: 'POST', body: new FormData(form) })
            
            // Временное сообщение об успехе
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправлено!';
            submitBtn.disabled = true;
            
            // Сброс формы через 3 секунды
            setTimeout(() => {
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        });
    }

    // Обновление scroll offsets для секций
    function updateScrollOffsets() {
        const sections = document.querySelectorAll("section[id]");
        const viewportH = window.innerHeight;

        sections.forEach(sec => {
            const rect = sec.getBoundingClientRect();
            const secHeight = rect.height;

            // Центр секции = центр экрана
            const offset = (viewportH / 2) - (secHeight / 2);

            // scroll-margin-top работает только с положительными значениями
            sec.style.scrollMarginTop = Math.max(offset, 0) + "px";
        });
    }

    // Пересчёт при загрузке и ресайзе
    window.addEventListener("load", updateScrollOffsets);
    window.addEventListener("resize", updateScrollOffsets);
});

