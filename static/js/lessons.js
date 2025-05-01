document.addEventListener('DOMContentLoaded', () => {
    // Delegate clicks on all .btn-play buttons
    document.getElementById('language-lessons').addEventListener('click', e => {
      if (!e.target.classList.contains('btn-play')) return;
      const audioSrc = e.target.dataset.audio;
      if (!audioSrc) return;
      const audio = new Audio(audioSrc);
      audio.play().catch(console.error);
    });
  });
  