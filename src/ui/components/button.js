function attachMagnet(el) {
  const strength = Number(el.dataset.magnetStrength || 18);
  const reset = () => {
    el.style.transform = 'translate3d(0, 0, 0)';
  };

  const move = (event) => {
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate3d(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px, 0)`;
  };

  el.addEventListener('pointermove', move);
  el.addEventListener('pointerleave', reset);
  el.addEventListener('blur', reset);
}

export function initMagneticButtons(scope = document) {
  const buttons = scope.querySelectorAll('.magnetic');
  buttons.forEach((button) => attachMagnet(button));
}
