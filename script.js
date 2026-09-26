//Datos
const CALC_TYPES = [
  { id: 'muro', label: 'Calcular muro de ladrillo' },
  { id: 'viga', label: 'Calcular viga de hormigón' },
  { id: 'columna', label: 'Calcular columnas de hormigón' },
  { id: 'contrapiso', label: 'Calcular contrapisos' },
  { id: 'techo', label: 'Calcular techo' },
  { id: 'piso', label: 'Calcular pisos' },
  { id: 'pintura', label: 'Calcular pintura' },
];

const MURO_COEF = {
  20: { cemento: 10.6, arena: 0.082, ladrillos: 70 },
  30: { cemento: 15.2, arena: 0.1147, ladrillos: 120 },
};

let currentUser = '';
let thicknessSel = 30;

// Navegación
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
}

function login() {
  const user = document.getElementById('login-user').value.trim();
  const pass = document.getElementById('login-pass').value;
  const err = document.getElementById('login-error');
  if (!user || !pass) {
    err.textContent = 'Completá usuario y contraseña.';
    return;
  }
  err.textContent = '';
  currentUser = user;
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

function renderMenu() {
  const list = document.getElementById('menu-list');
  list.innerHTML = '';
  CALC_TYPES.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.onclick = () => openCalc(c.id, i + 1, c.label);
    div.innerHTML = `<div class="left"><span class="num">${i + 1}</span><span class="label">${c.label}</span></div><span class="chev">&gt;</span>`;
    list.appendChild(div);
  });
  const exit = document.createElement('div');
  exit.className = 'menu-item exit';
  exit.onclick = () => showScreen('login');
  exit.innerHTML = `<div class="left"><span class="num">${CALC_TYPES.length + 1}</span><span class="label">Salir</span></div>`;
  list.appendChild(exit);
}

// Calculadoras
function openCalc(id, optionNumber, label) {
  document.getElementById('calc-title').textContent = label;
  document.getElementById('calc-subtitle').textContent = 'Opción ' + optionNumber + ' del menú principal';
  const body = document.getElementById('calc-body');

  if (id === 'muro') {
    thicknessSel = 30;
    body.innerHTML = `
      <label>Espesor del muro</label>
      <div class="thickness">
        <button id="thick-20" onclick="selectThickness(20)">20 cm</button>
        <button id="thick-30" class="selected" onclick="selectThickness(30)">30 cm ✓</button>
      </div>
      <label for="muro-largo">Largo del muro (m)</label>
      <input id="muro-largo" placeholder="Ej: 5.5" inputmode="decimal">
      <label for="muro-alto">Alto del muro (m)</label>
      <input id="muro-alto" placeholder="Ej: 2.6" inputmode="decimal">
      <div class="error" id="muro-error"></div>
      <button class="btn" onclick="calcMuro()">Calcular</button>
      <div id="muro-result"></div>
    `;
  } else {
    body.innerHTML = `
      <p class="sub">Esta calculadora todavía está en desarrollo. Probá "Calcular muro de ladrillo" para ver el cálculo completo.</p>
    `;
  }
  showScreen('calc');
}

function selectThickness(v) {
  thicknessSel = v;
  document.getElementById('thick-20').classList.toggle('selected', v === 20);
  document.getElementById('thick-30').classList.toggle('selected', v === 30);
  document.getElementById('thick-20').textContent = v === 20 ? '20 cm ✓' : '20 cm';
  document.getElementById('thick-30').textContent = v === 30 ? '30 cm ✓' : '30 cm';
}

function calcMuro() {
  const largo = parseFloat(document.getElementById('muro-largo').value);
  const alto = parseFloat(document.getElementById('muro-alto').value);
  const err = document.getElementById('muro-error');
  const resultDiv = document.getElementById('muro-result');
  if (!largo || !alto || largo <= 0 || alto <= 0) {
    err.textContent = 'Ingresá largo y alto válidos.';
    resultDiv.innerHTML = '';
    return;
  }
  err.textContent = '';
  const superficie = largo * alto;
  const coef = MURO_COEF[thicknessSel];
  const cemento = superficie * coef.cemento;
  const arena = superficie * coef.arena;
  const ladrillos = Math.round(superficie * coef.ladrillos);

  resultDiv.innerHTML = `
    <div class="result-box">
      <h3>Resultado</h3>
      <div class="result-row"><span>Superficie</span><b>${superficie.toFixed(2)} m2</b></div>
      <div class="result-row"><span>Cemento necesario</span><b>${cemento.toFixed(2)} kg</b></div>
      <div class="result-row"><span>Arena necesaria</span><b>${arena.toFixed(2)} m3</b></div>
      <div class="result-row"><span>Ladrillos</span><b>${ladrillos} unid.</b></div>
    </div>
  `;
}