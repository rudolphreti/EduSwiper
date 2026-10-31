const editionModeBtn = document.getElementById('edition-mode-btn');
const editionModeSwitcherEl = document.querySelector(
  '#edit-mode-switcher input'
);
const editionModeCover = document.getElementById('edition-mode-cover');
const editionModeArr = [
  selectFontContainer,
  addCardsFromImageBottomContainer,
  croppAllContainer,
  wordListOperationsContainer,
  addImages.parentNode,
  saveProject.parentNode,
];
let editionModeOnStatus;

function editionModeOn() {
  editionModeOnStatus = true;
  editionModeCover.style.zIndex = '0';
  document.querySelectorAll('.remove-icon').forEach((el) => {
    el.style.display = 'inherit';
  });
  document.querySelectorAll('.change-img-btn').forEach((el) => {
    el.style.display = 'inherit';
  });
  editionModeArr.forEach((el) => {
    el.style.display = 'flex';
  });
  editionModeSwitcherEl.checked = true;
  updateLanguage();

  if (document.getElementById('ad-div') !== null) {
    document.getElementById('ad-div').style.display = 'none';
  }
}

function editionModeOff() {
  editionModeOnStatus = false;
  editionModeCover.style.zIndex = '2';
  document.querySelectorAll('.remove-icon').forEach((el) => {
    el.style.display = 'none';
  });
  document.querySelectorAll('.change-img-btn').forEach((el) => {
    el.style.display = 'none';
  });
  editionModeArr.forEach((el) => {
    el.style.display = 'none';
  });
  editionModeSwitcherEl.checked = false;
  updateLanguage();

  if (document.getElementById('ad-div') !== null) {
    document.getElementById('ad-div').style.display = 'flex';
  }
}

function editionModeSwitcher() {
  editionModeCover.style.zIndex === '0' ? editionModeOff() : editionModeOn();
}

editionModeSwitcherEl.addEventListener('click', editionModeSwitcher);
