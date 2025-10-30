// Variable global para guardar el listener de Escape
let currentEscListener = null;

// --- Funciones de Utilidad y Cierre ---

function closeZoom() {
  const zoomedElement = document.querySelector(".zoomed");
  if (zoomedElement) {
    zoomedElement.removeEventListener('click', closeZoom); 
    zoomedElement.remove();
  }
  document.body.classList.remove("no-hover", "no-scroll");
  
  if (currentEscListener) {
    document.removeEventListener("keydown", currentEscListener);
    currentEscListener = null;
  }
}

function openModal(project) {
  closeZoom(); 
  document.getElementById("modal-" + project).style.display = "block";
}

function closeModal(project) {
  closeZoom();
  document.getElementById("modal-" + project).style.display = "none";
}

window.onclick = function (event) {
  let modals = document.getElementsByClassName("modal");
  for (let modal of modals) {
    if (event.target === modal) {
      closeZoom(); 
      modal.style.display = "none";
    }
  }
};

// --- Función de Zoom (Activada por el Delegador de Eventos) ---

function toggleZoom(img) {
  const existingZoomed = document.querySelector(".zoomed");

  // 1. CERRAR
  if (existingZoomed) {
    closeZoom();
    return;
  }
  
  // 2. ABRIR
  const clone = img.cloneNode();
  clone.classList.add("zoomed");
  
  document.body.appendChild(clone);
  document.body.classList.add("no-hover", "no-scroll");

  // Definir listener de escape
  currentEscListener = (e) => {
    if (e.key === "Escape") closeZoom();
  };
  
  // Asignar el listener de clic al clon para cerrarlo
  clone.addEventListener("click", closeZoom); 
  
  document.addEventListener("keydown", currentEscListener);
}


// --- INICIALIZACIÓN Y DELEGACIÓN DE EVENTOS (Máxima Estabilidad) ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Escuchar clics en el BODY para manejar el zoom de forma centralizada
    document.body.addEventListener('click', (e) => {
        
        // 1. Zoom: Revisa si el clic fue en una imagen dentro de la galería
        const img = e.target.closest('.gallery-grid img');
        
        if (img) {
            // Detenemos la propagación si fue un clic para abrir zoom.
            e.stopPropagation(); 
            toggleZoom(img);
        }
        
        // 2. Aislamiento: Evita que un clic en el contenido del modal lo cierre
        if (e.target.closest('.modal-content')) {
             e.stopPropagation();
        }
    });

    // Lógica de scroll suave
    document.querySelectorAll('.navbar a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 60, behavior: "smooth" });
            }
        });
    });
});