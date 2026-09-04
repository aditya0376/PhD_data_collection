'use strict';

const MC_A_TEXT = {
  a: 'How the price is shared among the people involved',
  b: 'Which stages of the journey had been checked',
  c: 'Only the ingredients and the price',
  d: 'That the product was made in the same district where it is sold'
};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const cell = parseInt(params.get('cell'), 10);

  if (!cell || !window.CELLS[cell]) {
    document.getElementById('title').textContent = 'Invalid cell';
    return;
  }

  const c = window.CELLS[cell];
  const correct = window.MC_CORRECT[cell];

  document.getElementById('title').textContent = `Preview — Cell ${cell}: ${c.name}`;
  renderStimulus(cell, document.getElementById('stimulus'));
  document.getElementById('mc-a').textContent = MC_A_TEXT[correct.mc_a];
  document.getElementById('mc-b').textContent = correct.mc_b;
});
