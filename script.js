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
        // URL вашего Google Apps Script
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxdJnG84qTwxtKLUTDLrthTi3KLj2gTwR7pWkMte_gCUQL9KAyluNllbqO4txS1RfUI/exec';
        
        form.addEventListener('submit', async function(e) {
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

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Собираем данные формы
            const formData = {
                name: form.querySelector('#name').value.trim(),
                company: form.querySelector('#company').value.trim(),
                email: form.querySelector('#email').value.trim(),
                message: form.querySelector('#message').value.trim(),
                website: honeypot ? honeypot.value : '' // honeypot
            };

            // Показываем состояние загрузки
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;
            
            // Убираем предыдущие сообщения об ошибке
            const existingError = form.querySelector('.form-error');
            if (existingError) {
                existingError.remove();
            }

            try {
                // Отправляем данные
                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // Google Apps Script требует no-cors
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                // При no-cors мы не можем проверить response, но это нормально
                // Google Apps Script обработает запрос
                
                // Показываем успех
                submitBtn.textContent = '✓ Отправлено!';
                submitBtn.style.background = 'linear-gradient(135deg, #28c840, #4caf50)';
                
                // Сброс формы
                form.reset();
                
                // Восстановление кнопки через 3 секунды
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
                
            } catch (error) {
                // Обработка ошибки
                console.error('Ошибка отправки формы:', error);
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Показываем сообщение об ошибке
                const errorDiv = document.createElement('div');
                errorDiv.className = 'form-error';
                errorDiv.style.cssText = 'color: #e74c3c; font-size: 12px; margin-top: 8px; padding: 8px; border-radius: 6px; background: rgba(231, 76, 60, 0.1); border: 1px solid rgba(231, 76, 60, 0.3);';
                errorDiv.textContent = 'Ошибка отправки. Попробуйте позже или напишите на info@ignis-tech.ru';
                form.querySelector('.form-footer').appendChild(errorDiv);
                
                // Удаляем сообщение об ошибке через 5 секунд
                setTimeout(() => {
                    errorDiv.remove();
                }, 5000);
            }
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

