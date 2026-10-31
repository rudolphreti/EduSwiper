//do komponentu message
let opts = {
    lines: 13,
    length: 28,
    width: 14,
    radius: 42,
    scale: 1,
    corners: 1,
    color: 'grey',
    opacity: 0.25,
    rotate: 0,
    direction: 1,
    speed: 1,
    trail: 60,
    fps: 20,
    zIndex: 2e9,
    className: 'spinner',
    top: '50%',
    left: '50%',
    shadow: false,
    hwaccel: false,
    position: 'relative',
  },
  spinnerTarget = document.getElementById('spinner'),
  spinner = new Spinner(opts);

function spinnerDisplay(x) {
  //spinnerFitWindow();
  if (x === true) {
    spinner.spin(spinnerTarget);
    spinnerTarget.style.margin = '120px 0 120px 0';
  }
}

// function spinnerFitWindow() {
//   //przykrywa zawartość okna
//   //jednak zawartość okna nie zostaje przykryta od razu, dlaczego?
//   document.body.style.position = 'absolute';
//   document.body.style.overflow = 'hidden';
//   messageContainer.parentNode.style.position = 'absolute';
//   messageContainer.parentNode.style.height = '100%';
//   messageContainer.parentNode.style.width = '100%';
//   messageContainer.style.width = '100%';
//   messageContainer.style.height = '100%';
//   messageContainer.style.position = 'absolute';
//   messageContainer.style.backgroundColor = 'white';
//   messageContainer.style.zIndex = '1';
//   creating.style.position = 'absolute';
// }
