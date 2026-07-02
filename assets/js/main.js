// ===================== NAV MOBILE ===================== //
(function () {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ===================== COUNTDOWN ===================== //
(function () {
  const target = new Date('2027-04-24T16:00:00-03:00').getTime();
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');
  if (!daysEl) return;

  const pad = (n) => String(n).padStart(2, '0');

  function tick() {
    let diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000); diff -= d * 86400000;
    const h = Math.floor(diff / 3600000); diff -= h * 3600000;
    const m = Math.floor(diff / 60000); diff -= m * 60000;
    const s = Math.floor(diff / 1000);

    daysEl.textContent = String(d);
    hoursEl.textContent = pad(h);
    minsEl.textContent = pad(m);
    secsEl.textContent = pad(s);
  }

  tick();
  setInterval(tick, 1000);
})();

// ===================== RSVP FORM ===================== //
(function () {
  const RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxKExJv5ZMbzNsPzjnzDxjqNBOjjtwgEfOiKzMHGE5BP9EBzP36ddLepUZkSI174yiF/exec';

  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const goingInput = document.getElementById('goingInput');
  const decBtn = document.getElementById('decBtn');
  const incBtn = document.getElementById('incBtn');
  const guestsVal = document.getElementById('guestsVal');
  const guestsInput = document.getElementById('guestsInput');
  const form = document.getElementById('rsvpForm');
  const feedback = document.getElementById('rsvpFeedback');
  if (!form) return;

  let guests = 1;

  function setGoing(value) {
    goingInput.value = value;
    btnYes.classList.toggle('active-yes', value === 'yes');
    btnNo.classList.toggle('active-no', value === 'no');
  }

  btnYes.addEventListener('click', () => setGoing('yes'));
  btnNo.addEventListener('click', () => setGoing('no'));

  function updateGuests() {
    guestsVal.textContent = String(guests);
    guestsInput.value = String(guests);
  }

  incBtn.addEventListener('click', () => {
    guests = Math.min(9, guests + 1);
    updateGuests();
  });
  decBtn.addEventListener('click', () => {
    guests = Math.max(1, guests - 1);
    updateGuests();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    if (!nome) {
      feedback.textContent = 'Por favor, preencha seu nome.';
      feedback.style.color = '#BE7F55';
      return;
    }
    if (!goingInput.value) {
      feedback.textContent = 'Conta pra gente se você vai poder vir!';
      feedback.style.color = '#BE7F55';
      return;
    }

    const submitBtn = form.querySelector('.rsvp-submit');
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';
    feedback.textContent = '';

    const payload = {
      nome,
      comparecera: goingInput.value,
      acompanhantes: guestsInput.value,
      recado: form.recado.value.trim(),
    };

    try {
      await fetch(RSVP_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      feedback.textContent = `Obrigado, ${nome}! Sua confirmação foi registrada com carinho. 🌿`;
      feedback.style.color = '#5B6A46';
      form.reset();
      setGoing('');
      guests = 1;
      updateGuests();
    } catch (err) {
      feedback.textContent = 'Não conseguimos enviar agora. Tente novamente em instantes.';
      feedback.style.color = '#BE7F55';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
})();

// ===================== FAQ ACCORDION ===================== //
(function () {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const sign = item.querySelector('.faq-sign');

    question.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';

      items.forEach((other) => {
        other.setAttribute('data-open', 'false');
        other.querySelector('.faq-sign').textContent = '+';
      });

      if (!isOpen) {
        item.setAttribute('data-open', 'true');
        sign.textContent = '−';
      }
    });
  });
})();

// ===================== PIX COPY ===================== //
(function () {
  const copyBtn = document.getElementById('pixCopyBtn');
  const pixKey = document.getElementById('pixKey');
  const giftBtns = document.querySelectorAll('[data-pix-btn]');
  if (!copyBtn || !pixKey) return;

  function copyKey() {
    const text = pixKey.textContent.trim();
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = 'Copiado!';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.textContent = 'Copiar';
        copyBtn.classList.remove('copied');
      }, 1800);
    });
  }

  copyBtn.addEventListener('click', copyKey);
  giftBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      document.getElementById('presentes').scrollIntoView({ behavior: 'smooth', block: 'end' });
      copyKey();
    });
  });
})();
