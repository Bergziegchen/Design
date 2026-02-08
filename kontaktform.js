document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('kontaktForm');
    const csrfInput = document.getElementById('csrfToken');
    const captchaLabel = document.getElementById('captchaLabel');
    const captchaInput = document.getElementById('captcha_input');
    const statusBox = document.getElementById('status-message');
    const submitBtn = document.getElementById('submitBtn');

    let submitController = null;

    // --- 1️⃣ STATUS-MANAGEMENT (Screenreader-freundlich) ---
    const showStatus = (msg, type = 'info') => {
        statusBox.textContent = msg;
        statusBox.className = `msg-${type}`;

        if (type === 'error') {
            statusBox.setAttribute('role', 'alert');
            statusBox.setAttribute('aria-live', 'assertive');
            statusBox.setAttribute('tabindex', '-1');
            statusBox.focus({ preventScroll: true });
        } else {
            statusBox.setAttribute('role', 'status');
            statusBox.setAttribute('aria-live', 'polite');
            statusBox.removeAttribute('tabindex');
        }
    };

    // --- 2️⃣ FORM INITIALISIERUNG (CSRF + CAPTCHA) ---
    const initForm = async () => {
        try {
            const res = await fetch('../kontaktform.php', {
                credentials: 'same-origin'
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const contentType = res.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
                throw new Error('Ungültige Serverantwort');
            }

            const data = await res.json();

            csrfInput.value = data.csrf;
            captchaLabel.textContent =
                `Sicherheitsfrage: Was ist ${data.captcha.n1} + ${data.captcha.n2}?`;
            captchaInput.value = '';

        } catch (err) {
            showStatus(
                'Fehler beim Laden der Sicherheitsfrage. Bitte Seite neu laden.',
                'error'
            );
            console.error('InitForm Error:', err);
        }
    };

    initForm();

    // --- 3️⃣ REAL-TIME VALIDATION ---
    form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', () => {
            field.removeAttribute('aria-invalid');
        });
    });

    // --- 4️⃣ SUBMIT HANDLER (Async + abort-sicher) ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Client-side Validierung
        const invalidFields = form.querySelectorAll(':invalid');
        if (invalidFields.length) {
            showStatus('Bitte korrigieren Sie die markierten Felder.', 'error');
            invalidFields.forEach(f =>
                f.setAttribute('aria-invalid', 'true')
            );
            invalidFields[0].focus();
            return;
        }

        // Vorherigen Request abbrechen
        if (submitController) {
            submitController.abort();
        }
        submitController = new AbortController();

        submitBtn.disabled = true;
        form.setAttribute('aria-busy', 'true');
        showStatus('Nachricht wird übertragen…', 'info');

        try {
            const res = await fetch('../kontaktform.php', {
                method: 'POST',
                body: new FormData(form),
                credentials: 'same-origin',
                signal: submitController.signal
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const contentType = res.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
                throw new Error('Ungültige Serverantwort');
            }

            const data = await res.json();

            if (data.status === 'success') {
                showStatus(data.message, 'success');
                form.reset();

                // Fokus sauber zurücksetzen
                const firstField = form.querySelector(
                    'input:not([type=hidden]):not(.honeypot), textarea:not(.honeypot)'
                );
                firstField?.focus({ preventScroll: true });

            } else {
                showStatus(data.message || 'Serverseitiger Fehler.', 'error');
            }

            await initForm();

        } catch (err) {
            if (err.name !== 'AbortError') {
                showStatus(
                    'Verbindungsfehler. Bitte versuchen Sie es später erneut.',
                    'error'
                );
                console.error('Submit Error:', err);
            }
        } finally {
            submitBtn.disabled = false;
            form.removeAttribute('aria-busy');
        }
    });
});