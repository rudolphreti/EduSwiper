document.querySelectorAll('.card-container').forEach((el) => {
  const container = document.createElement('div');
  container.classList.add('refrence-container');
  container.appendChild(el);
  document.getElementById('preview').appendChild(container);
});

const swappable = new Swappable.default(
  document.querySelectorAll('.refrence-container'),
  {
    draggable: '.card-container',
  }
);

swappable.on('drag:stop', (e) =>
  // execute your drop action: e.originalSource on lastOver
  console.log('drag:stop')
);
