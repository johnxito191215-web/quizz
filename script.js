/* ----- CONTROL DE PANTALLAS Y ELEMENTOS ----- */
const PIN_CORRECT = "1234";

const pageLogin  = document.getElementById('page-login');
const pageMenu   = document.getElementById('page-menu');
const pageQuizz  = document.getElementById('page-quizz');

const pinInput   = document.getElementById('pin');
const btnEnter   = document.getElementById('btn-enter');
const pinMsg     = document.getElementById('pin-msg');
const btnLogout  = document.getElementById('btn-logout');

const quizzTitle = document.getElementById('quizz-title');
const quizzForm  = document.getElementById('quizz-form');
const btnCalificar = document.getElementById('btn-calificar');
const btnBack    = document.getElementById('btn-back');

const resultBox      = document.getElementById('result');
const resultPercent  = document.getElementById('result-percent');
const correctCountEl = document.getElementById('correct-count');
const totalCountEl   = document.getElementById('total-count');

const openButtons = document.querySelectorAll('.open-quizz');


/* ----- VALIDAR PIN ----- */
btnEnter.addEventListener('click', () => {
  if (pinInput.value === PIN_CORRECT) {
    pinMsg.textContent = '';
    showMenu();
  } else {
    pinMsg.textContent = 'PIN incorrecto. Intente de nuevo.';
  }
});

btnLogout.addEventListener('click', () => {
  pinInput.value = '';
  showLogin();
});


/* -----------------------------------------------------
   DATOS: 5 PREGUNTAS POR MATERIA
----------------------------------------------------- */
const QUIZZ_DATA = {
  matematicas: [
    { q: "¿Cuánto es 12 × 3?", options: ["36","30","24","48"], answer: 0 },
    { q: "¿Resultado de 25 ÷ 5?", options: ["3","5","8","10"], answer: 1 },
    { q: "¿Valor de 9²?", options: ["18","81","27","72"], answer: 1 },
    { q: "¿(15 + 5) × 2?", options: ["40","50","20","60"], answer: 0 },
    { q: "¿Cuál es un número primo?", options: ["9","15","17","21"], answer: 2 }
  ],

  fisica: [
    { q: "Unidad de energía:", options: ["Newton","Joule","Watt","Pascal"], answer: 1 },
    { q: "La velocidad se mide en:", options: ["kg","m/s","N","J"], answer: 1 },
    { q: "F = m × a. ¿Qué representa F?", options: ["Fuerza","Energía","Potencia","Trabajo"], answer: 0 },
    { q: "Fuerza que nos atrae a la Tierra:", options: ["Magnetismo","Rozamiento","Gravedad","Tensión"], answer: 2 },
    { q: "Estado de la materia con forma y volumen definido:", options: ["Gas","Líquido","Plasma","Sólido"], answer: 3 }
  ],

  quimica: [
    { q: "Símbolo del Oxígeno:", options: ["O","Ox","Og","O2"], answer: 0 },
    { q: "pH menor a 7 indica:", options: ["Base","Ácido","Neutro","Sales"], answer: 1 },
    { q: "H2O corresponde a:", options: ["Agua","Hidrógeno","Oxígeno","Etanol"], answer: 0 },
    { q: "Proceso sólido → gas:", options: ["Fusión","Condensación","Sublimación","Evaporación"], answer: 2 },
    { q: "Cloruro de sodio es:", options: ["Alcohol","Sal","Gas","Metal"], answer: 1 }
  ],

  lenguaje: [
    { q: "Palabra aguda:", options: ["Césped","Canción","Árbol","Lápiz"], answer: 1 },
    { q: "¿Cuál es un verbo?", options: ["Rápido","Mesa","Correr","Azul"], answer: 2 },
    { q: "Sujeto de 'El perro ladra':", options: ["Perro","Ladra","El","Perro ladra"], answer: 0 },
    { q: "Sinónimo de 'feliz':", options: ["Contento","Triste","Frío","Fuerte"], answer: 0 },
    { q: "¿Qué es un adjetivo?", options: ["Acción","Cualidad","Objeto","Nombre"], answer: 1 }
  ]
};


/* ----- CAMBIO DE PANTALLAS ----- */
function showMenu(){
  pageLogin.classList.add('hidden');
  pageQuizz.classList.add('hidden');
  pageMenu.classList.remove('hidden');
  resultBox.classList.add('hidden');
}

function showLogin(){
  pageMenu.classList.add('hidden');
  pageQuizz.classList.add('hidden');
  pageLogin.classList.remove('hidden');
}


/* ----- ABRIR UN QUIZZ ----- */
openButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const subject = btn.dataset.subject;
    openQuizz(subject);
  });
});

function openQuizz(subject){
  const data = QUIZZ_DATA[subject];
  quizzTitle.textContent = subject.charAt(0).toUpperCase() + subject.slice(1) + " - quizz";

  // Renderiza las preguntas primero
  renderQuestions(data);

  // Aseguramos que el formulario esté en el inicio (por si quedó scroll interno)
  if (quizzForm) {
    quizzForm.scrollTop = 0;
  }

  // Mostramos la sección de quizz
  pageMenu.classList.add('hidden');
  pageQuizz.classList.remove('hidden');
  resultBox.classList.add('hidden');

  // Forzamos el scroll de la ventana al tope del quizz para que las 5 preguntas se vean
  // usamos setTimeout(…,0) para esperar que el repaint ocurra y evitar condiciones de carrera
  setTimeout(() => {
    // Si el navegador soporta scrollIntoView con opciones, lo usamos
    if (pageQuizz && pageQuizz.scrollIntoView) {
      try {
        pageQuizz.scrollIntoView({ behavior: 'auto', block: 'start' });
      } catch (e) {
        // fallback
        window.scrollTo(0, 0);
      }
    } else {
      window.scrollTo(0, 0);
    }
    // Por si acaso, llevamos también el foco al formulario
    if (quizzForm && quizzForm.firstElementChild) {
      const firstQ = quizzForm.firstElementChild;
      if (firstQ && firstQ.querySelector('input')) {
        firstQ.querySelector('input').focus();
      }
    }
  }, 0);
}


/* ----- RENDER DE PREGUNTAS (dinámico) ----- */
function renderQuestions(questions){
  quizzForm.innerHTML = "";

  questions.forEach((item, qi) => {
    const qDiv = document.createElement("div");
    qDiv.className = "question";

    // Texto de la pregunta
    const qText = document.createElement('div');
    qText.className = 'q-text';
    qText.textContent = `${qi + 1}. ${item.q}`;
    qDiv.appendChild(qText);

    // Opciones
    const opts = document.createElement("div");
    opts.className = "options";

    item.options.forEach((opt, oi) => {
      const lbl = document.createElement("label");
      lbl.className = "option";
      lbl.setAttribute('data-q', qi);
      lbl.setAttribute('data-o', oi);

      // Input radio + circulo + texto
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `q${qi}`;
      input.value = `${oi}`;

      const circle = document.createElement('span');
      circle.className = 'circle';
      circle.setAttribute('aria-hidden', 'true');

      const spanText = document.createElement('span');
      spanText.className = 'opt-text';
      spanText.textContent = opt;

      lbl.appendChild(input);
      lbl.appendChild(circle);
      lbl.appendChild(spanText);

      // Evento para seleccionar y marcar visualmente
      lbl.addEventListener("click", (e) => {
        opts.querySelectorAll(".option").forEach(o => o.classList.remove("selected"));
        lbl.classList.add("selected");
        input.checked = true;
      });

      opts.appendChild(lbl);
    });

    qDiv.appendChild(opts);
    quizzForm.appendChild(qDiv);
  });

  // Aseguramos espacio entre preguntas (pequeño retardo para repaint)
  setTimeout(() => {
    // opcional: asegurar que no haya scroll interno ocultando las primeras preguntas
    if (quizzForm.parentElement) {
      quizzForm.parentElement.scrollTop = 0;
    }
  }, 0);
}


/* ----- VOLVER AL MENÚ ----- */
btnBack.addEventListener('click', () => {
  showMenu();
  // llevamos la vista al tope del documento al volver
  setTimeout(()=> window.scrollTo(0,0), 0);
});


/* ----- CALIFICAR ----- */
btnCalificar.addEventListener('click', () => {
  const questionDivs = [...quizzForm.querySelectorAll('.question')];
  const total = questionDivs.length || 0;
  let correct = 0;

  const subject = quizzTitle.textContent.split(" - ")[0].toLowerCase();

  questionDivs.forEach((qDiv, qi) => {
    const selected = qDiv.querySelector('input[type="radio"]:checked');
    if (selected) {
      const chosen = parseInt(selected.value, 10);
      if (chosen === QUIZZ_DATA[subject][qi].answer) {
        correct++;
      }
    }
  });

  const percent = total ? Math.round((correct / total) * 100) : 0;

  resultPercent.textContent = percent;
  correctCountEl.textContent = correct;
  totalCountEl.textContent = total;
  resultBox.classList.remove('hidden');

  // Después de calificar, llevamos al usuario al resultado visible
  setTimeout(() => {
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 150);
});