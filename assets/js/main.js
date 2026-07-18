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

// ===================== ADD TO CALENDAR ===================== //
(function () {
  const btn = document.getElementById('addToCalendarBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Larissa e Cauê//Casamento//PT-BR',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'UID:larissa-caue-casamento-24042027@laricasacomocaue',
      'DTSTAMP:20260718T120000Z',
      'DTSTART:20270424T190000Z',
      'DTEND:20270425T030000Z',
      'SUMMARY:Casamento de Larissa & Cauê',
      'DESCRIPTION:Cerimônia às 16h no Rancho Santa Maria. Chegue com uns 15 minutos de antecedência — a entrada é pontual.',
      'LOCATION:Rancho Santa Maria - Alameda dos Gerânios\\, Condomínio Jardim Cinco Lagos\\, Pirucaia\\, Mairiporã/SP',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'casamento-larissa-caue.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
  if (!copyBtn || !pixKey) return;

  copyBtn.addEventListener('click', () => copyToClipboard(pixKey.dataset.code, copyBtn));
})();

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.textContent;
    btn.textContent = 'Copiado!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 1800);
  });
}

// ===================== PIX MODAL ===================== //
(function () {
  const overlay = document.getElementById('pixModalOverlay');
  const closeBtn = document.getElementById('pixModalClose');
  const titleEl = document.getElementById('pixModalTitle');
  const priceEl = document.getElementById('pixModalPrice');
  const qrEl = document.getElementById('pixModalQr');
  const noteEl = document.getElementById('pixModalNote');
  const hintEl = document.getElementById('pixModalHint');
  const modalKey = document.getElementById('pixModalKey');
  const modalCopyBtn = document.getElementById('pixModalCopyBtn');
  const giftBtns = document.querySelectorAll('[data-pix-btn]');
  if (!overlay) return;

  function openModal(btn) {
    const card = btn.closest('.gift-card');
    const title = card.querySelector('.gift-title').textContent;
    const price = card.querySelector('.gift-price').textContent;
    const amount = btn.getAttribute('data-amount');

    titleEl.textContent = title;
    priceEl.textContent = price;

    if (amount) {
      qrEl.src = `assets/img/pix/qrcode-pix${amount}.png`;
      qrEl.alt = `QR Code PIX de ${price}`;
      qrEl.hidden = false;
      noteEl.hidden = true;
      hintEl.hidden = false;
    } else {
      qrEl.hidden = true;
      noteEl.hidden = false;
      hintEl.hidden = true;
    }

    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.hidden = true;
    document.body.style.overflow = '';
  }

  giftBtns.forEach((btn) => btn.addEventListener('click', () => openModal(btn)));
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) closeModal();
  });
  modalCopyBtn.addEventListener('click', () => copyToClipboard(modalKey.dataset.code, modalCopyBtn));
})();
