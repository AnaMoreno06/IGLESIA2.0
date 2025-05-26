// 1. Animación al hacer clic en tarjetas
document.querySelectorAll('.tarjeta').forEach(tarjeta => {
  tarjeta.addEventListener('click', () => {
    tarjeta.classList.toggle('activa');
  });
});





