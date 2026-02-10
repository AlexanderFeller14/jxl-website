export function createPointerTracker(target = window) {
  const state = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  };

  function onPointerMove(event) {
    const source = event.touches?.[0] || event;
    state.targetX = (source.clientX / window.innerWidth) * 2 - 1;
    state.targetY = -((source.clientY / window.innerHeight) * 2 - 1);
  }

  target.addEventListener('pointermove', onPointerMove, { passive: true });
  target.addEventListener('touchmove', onPointerMove, { passive: true });

  return {
    update(damping = 0.08) {
      state.x += (state.targetX - state.x) * damping;
      state.y += (state.targetY - state.y) * damping;
      return { x: state.x, y: state.y };
    },
    destroy() {
      target.removeEventListener('pointermove', onPointerMove);
      target.removeEventListener('touchmove', onPointerMove);
    }
  };
}
