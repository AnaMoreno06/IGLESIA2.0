




document.addEventListener("DOMContentLoaded", () => {
  const secciones = document.querySelectorAll(".tariff-section");

  secciones.forEach((seccion, index) => {
    seccion.style.opacity = "0";
    seccion.style.transform = "translateY(20px)";
    seccion.style.animation = `fadeInUp 0.6s ease-out forwards`;
    seccion.style.animationDelay = `${index * 0.3}s`;
  });
});


