// ---------- Configuración de calculadoras ----------
// Cada entrada define los campos del formulario y la fórmula de cálculo.
// Los coeficientes son estimaciones estándar de obra, con fines didácticos.
const CALC_CONFIGS = {
  muro: {
    label: 'Calcular muro de ladrillo',
    fields: [
      { id: 'espesor', type: 'thickness', options: [20, 30], label: 'Espesor del muro' },
      { id: 'largo', label: 'Largo del muro (m)', placeholder: 'Ej: 5.5' },
      { id: 'alto', label: 'Alto del muro (m)', placeholder: 'Ej: 2.6' },
    ],
    compute(v) {
      const coef = { 20: { cemento: 10.6, arena: 0.082, ladrillos: 70 }, 30: { cemento: 15.2, arena: 0.1147, ladrillos: 120 } }[v.espesor];
      const superficie = v.largo * v.alto;
      return [
        ['Superficie', superficie, 'm2'],
        ['Cemento necesario', superficie * coef.cemento, 'kg'],
        ['Arena necesaria', superficie * coef.arena, 'm3'],
        ['Ladrillos', Math.round(superficie * coef.ladrillos), 'unid.'],
      ];
    },
  },
  viga: {
    label: 'Calcular viga de hormigón',
    fields: [
      { id: 'largo', label: 'Largo de la viga (m)', placeholder: 'Ej: 4' },
      { id: 'ancho', label: 'Ancho de la viga (m)', placeholder: 'Ej: 0.2' },
      { id: 'alto', label: 'Alto de la viga (m)', placeholder: 'Ej: 0.3' },
    ],
    compute(v) {
      const vol = v.largo * v.ancho * v.alto;
      return [
        ['Volumen de hormigón', vol, 'm3'],
        ['Cemento necesario', vol * 350, 'kg'],
        ['Arena necesaria', vol * 0.5, 'm3'],
        ['Grava necesaria', vol * 0.8, 'm3'],
      ];
    },
  },
  columna: {
    label: 'Calcular columnas de hormigón',
    fields: [
      { id: 'ancho', label: 'Ancho de columna (m)', placeholder: 'Ej: 0.3' },
      { id: 'largo', label: 'Profundidad de columna (m)', placeholder: 'Ej: 0.3' },
      { id: 'alto', label: 'Altura de columna (m)', placeholder: 'Ej: 2.6' },
      { id: 'cantidad', label: 'Cantidad de columnas', placeholder: 'Ej: 4' },
    ],
    compute(v) {
      const vol = v.ancho * v.largo * v.alto * v.cantidad;
      return [
        ['Volumen total', vol, 'm3'],
        ['Cemento necesario', vol * 350, 'kg'],
        ['Arena necesaria', vol * 0.5, 'm3'],
        ['Grava necesaria', vol * 0.8, 'm3'],
      ];
    },
  },
  contrapiso: {
    label: 'Calcular contrapisos',
    fields: [
      { id: 'area', label: 'Área a cubrir (m2)', placeholder: 'Ej: 30' },
      { id: 'espesor', label: 'Espesor (cm)', placeholder: 'Ej: 8' },
    ],
    compute(v) {
      const vol = v.area * (v.espesor / 100);
      return [
        ['Volumen de hormigón', vol, 'm3'],
        ['Cemento necesario', vol * 300, 'kg'],
        ['Arena necesaria', vol * 0.6, 'm3'],
        ['Ripio necesario', vol * 0.6, 'm3'],
      ];
    },
  },
  techo: {
    label: 'Calcular techo',
    fields: [
      { id: 'area', label: 'Área del techo (m2)', placeholder: 'Ej: 40' },
    ],
    compute(v) {
      return [
        ['Tejas necesarias', Math.ceil(v.area * 11), 'unid.'],
        ['Listones (correas)', v.area * 2, 'ml'],
        ['Clavos', v.area * 0.05, 'kg'],
      ];
    },
  },
  piso: {
    label: 'Calcular pisos',
    fields: [
      { id: 'area', label: 'Área a cubrir (m2)', placeholder: 'Ej: 25' },
      { id: 'baldosa', label: 'Tamaño de baldosa (m2 c/u)', placeholder: 'Ej: 0.36' },
    ],
    compute(v) {
      const baldosas = Math.ceil((v.area * 1.05) / v.baldosa);
      return [
        ['Baldosas necesarias', baldosas, 'unid.'],
        ['Pegante', v.area * 5, 'kg'],
        ['Fragua', v.area * 0.5, 'kg'],
      ];
    },
  },
  pintura: {
    label: 'Calcular pintura',
    fields: [
      { id: 'area', label: 'Área a pintar (m2)', placeholder: 'Ej: 60' },
      { id: 'manos', label: 'Número de manos', placeholder: 'Ej: 2' },
    ],
    compute(v) {
      return [
        ['Pintura necesaria', (v.area * v.manos) / 10, 'litros'],
      ];
    },
  },
};

const MENU_ORDER = ['muro', 'viga', 'columna', 'contrapiso', 'techo', 'piso', 'pintura'];
let thicknessSel = null;

// ---------- Navegación ----------
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
}

// ---------- Autenticación (simulada en el navegador) ----------
function login() {
  const user = document.getElementById('login-user').value.trim();
  const pass = document.getElementById('login-pass').value;
  const err = document.getElementById('login-error');
  if (!user || !pass) {
    err.textContent = 'Completá usuario y contraseña.';
    return;
  }
  err.textContent = '';
  document.getElementById('menu-greeting').textContent = 'Hola, ' + user;
  renderMenu();
  showScreen('menu');
}

function register() {
  const name = document.getElementById('reg-name').value.trim();
  const user = document.getElementById('reg-user').value.trim();
  const pass = document.getElementById('reg-pass').value;
  const pass2 = document.getElementById('reg-pass2').value;
  const err = document.getElementById('register-error');
  if (!name || !user || !pass || !pass2) {
    err.textContent = 'Completá todos los campos.';
    return;
  }
  if (pass.length < 6) {
    err.textContent = 'La contraseña debe tener al menos 6 caracteres.';
    return;
  }
  if (pass !== pass2) {
    err.textContent = 'Las contraseñas no coinciden.';
    return;
  }
  err.textContent = '';
  document.getElementById('login-user').value = user;
  showScreen('login');
}

function recoverUser() {
  const contact = document.getElementById('recover-contact').value.trim();
  const err = document.getElementById('recover-error');
  const msg = document.getElementById('recover-msg');
  if (!contact) {
    err.textContent = 'Ingresá tu usuario o correo registrado.';
    msg.textContent = '';
    return;
  }
  err.textContent = '';
  msg.textContent = 'Si el dato coincide con una cuenta registrada, vas a recibir instrucciones para recuperar tu acceso.';
}

// ---------- Menú ----------
function renderMenu() {
  const list = document.getElementById('menu-list');
  list.innerHTML = '';
  MENU_ORDER.forEach((id, i) => {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.onclick = () => openCalc(id, i + 1);
    div.innerHTML = `<div class="left"><span class="num">${i + 1}</span><span class="label">${CALC_CONFIGS[id].label}</span></div><span class="chev">&gt;</span>`;
    list.appendChild(div);
  });
  const exit = document.createElement('div');
  exit.className = 'menu-item exit';
  exit.onclick = () => showScreen('login');
  exit.innerHTML = `<div class="left"><span class="num">${MENU_ORDER.length + 1}</span><span class="label">Salir</span></div>`;
  list.appendChild(exit);
}

// ---------- Motor genérico de calculadoras ----------
function openCalc(id, optionNumber) {
  const config = CALC_CONFIGS[id];
  document.getElementById('calc-title').textContent = config.label;
  document.getElementById('calc-subtitle').textContent = 'Opción ' + optionNumber + ' del menú principal';
  const body = document.getElementById('calc-body');
  thicknessSel = null;

  let html = '';
  config.fields.forEach(f => {
    if (f.type === 'thickness') {
      thicknessSel = f.options[0];
      html += `<label>${f.label}</label><div class="thickness">`;
      f.options.forEach((opt, i) => {
        html += `<button id="thick-${opt}" class="${i === 0 ? 'selected' : ''}" onclick="selectThickness(${opt})">${opt} cm${i === 0 ? ' ✓' : ''}</button>`;
      });
      html += `</div>`;
    } else {
      html += `<label for="f-${f.id}">${f.label}</label><input id="f-${f.id}" placeholder="${f.placeholder}" inputmode="decimal">`;
    }
  });
  html += `<div class="error" id="calc-error"></div>
    <button class="btn" onclick="runCalc('${id}')">Calcular</button>
    <div id="calc-result"></div>`;
  body.innerHTML = html;
  showScreen('calc');
}

function selectThickness(v) {
  thicknessSel = v;
  document.querySelectorAll('.thickness button').forEach(btn => {
    const val = parseInt(btn.id.replace('thick-', ''));
    btn.classList.toggle('selected', val === v);
    btn.textContent = val === v ? val + ' cm ✓' : val + ' cm';
  });
}

function runCalc(id) {
  const config = CALC_CONFIGS[id];
  const err = document.getElementById('calc-error');
  const resultDiv = document.getElementById('calc-result');
  const values = {};
  let valid = true;

  config.fields.forEach(f => {
    if (f.type === 'thickness') {
      values[f.id] = thicknessSel;
    } else {
      const num = parseFloat(document.getElementById('f-' + f.id).value);
      if (!num || num <= 0) valid = false;
      values[f.id] = num;
    }
  });

  if (!valid) {
    err.textContent = 'Completá todos los campos con valores válidos.';
    resultDiv.innerHTML = '';
    return;
  }
  err.textContent = '';

  const rows = config.compute(values);
  let html = '<div class="result-box"><h3>Resultado</h3>';
  rows.forEach(([label, value, unit]) => {
    html += `<div class="result-row"><span>${label}</span><b>${value.toFixed(2)} ${unit}</b></div>`;
  });
  html += '</div>';
  resultDiv.innerHTML = html;
}
