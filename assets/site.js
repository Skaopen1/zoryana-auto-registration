// Zoryana Auto Registration static site JS
// - Accessible responsive navigation
// - Active nav state
// - Contact form validation + webhook submission

(function () {
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  // Active nav
  const navLinks = document.querySelectorAll('[data-nav] a');
  navLinks.forEach((a) => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === path) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });

  // Mobile nav toggle
  const nav = document.querySelector('[data-nav]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open', !expanded);
    });

    navLinks.forEach((a) => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Contact form
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const statusEl = document.querySelector('[data-form-status]');
  const submitBtn = form.querySelector('button[type="submit"]');

  function getWebhookUrl() {
    const fromData = (form.getAttribute('data-webhook-url') || '').trim();
    const fromConfig = (window.__ZORYANA_CONFIG__ && window.__ZORYANA_CONFIG__.webhookUrl) || '';
    return fromData || fromConfig;
  }

  function setStatus(text, kind) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.className = `form-status ${kind || ''}`.trim();
    if (!kind) statusEl.style.display = 'none';
  }

  function setFieldError(field, message) {
    const group = field.closest('.field');
    if (!group) return;
    let errorEl = group.querySelector('.error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'error';
      errorEl.setAttribute('aria-live', 'polite');
      group.appendChild(errorEl);
    }

    const errorId = `${field.id || field.name}-error`;
    errorEl.id = errorId;
    errorEl.textContent = message || '';

    if (message) {
      group.classList.add('invalid');
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', errorId);
    } else {
      group.classList.remove('invalid');
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    }
  }

  function validateForm() {
    let firstInvalid = null;

    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const service = form.querySelector('#service');
    const message = form.querySelector('#message');

    const rules = [
      [name, () => (!name.value.trim() ? 'Please enter your name.' : '')],
      [email, () => {
        const value = email.value.trim();
        if (!value) return 'Please enter your email.';
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        return ok ? '' : 'Please enter a valid email address.';
      }],
      [service, () => (!service.value.trim() ? 'Please select a service.' : '')],
      [message, () => (message.value.trim().length < 10 ? 'Please share a bit more detail (at least 10 characters).' : '')],
    ];

    rules.forEach(([field, getError]) => {
      if (!field) return;
      const error = getError();
      setFieldError(field, error);
      if (error && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  ['input', 'change', 'blur'].forEach((evt) => {
    form.addEventListener(evt, (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.matches('input, select, textarea')) return;
      if (target.closest('.field.invalid')) validateForm();
    }, true);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('', '');

    const webhookUrl = getWebhookUrl();

    if (!validateForm()) {
      setStatus('Please fix the highlighted fields and try again.', 'error');
      return;
    }

    if (!webhookUrl || webhookUrl.includes('REPLACE_ME')) {
      setStatus('Form is not connected yet. Add the webhook URL in contact.html (data-webhook-url) or window.__ZORYANA_CONFIG__.webhookUrl.', 'error');
      return;
    }

    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    payload.timestamp = new Date().toISOString();
    payload.source = location.href;

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      setStatus('Sending your request…', 'ok');

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Bad response');
      form.reset();
      form.querySelectorAll('.field').forEach((f) => f.classList.remove('invalid'));
      form.querySelectorAll('input,select,textarea').forEach((f) => {
        f.removeAttribute('aria-invalid');
        f.removeAttribute('aria-describedby');
      });
      form.querySelectorAll('.error').forEach((el) => (el.textContent = ''));

      setStatus('Sent! We will get back to you shortly.', 'ok');
    } catch (err) {
      setStatus('Something went wrong sending your message. Please call (909) 480-1061 or email theshoegod100@gmail.com.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send';
      }
    }
  });
})();