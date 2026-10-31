const wordListOperationsContainer = document.getElementById(
    'word-list-operations'
  ),
  wordListOperationsOptions = document.getElementById(
    'word-list-operations-options'
  ),
  wordListOperationsBtn = document.getElementById('word-list-operations-btn'),
  copyTxtListToClipboard = document.getElementById(
    'copy-txt-list-to-clipboard'
  ),
  wordsListToInput = document.getElementById('words-list-to-input'),
  wordsListToInputContainer = document.getElementById(
    'words-list-to-input-container'
  );

let wordsArray = [],
  wordsList;

function copyTxtListToClipBoard() {
  wordsArray = [];
  wordsArray[0] = setTitle.innerText;
  document.querySelectorAll('.textFitted').forEach((el) => {
    wordsArray.push(el.innerText);
    wordsList = wordsArray.join('\n');
  });
  navigator.clipboard.writeText(wordsList);
}

function pasteTxtList() {
  if (wordsListToInput.getElementsByTagName('textarea')[0].value !== '') {
    const txtArray = wordsListToInput
      .getElementsByTagName('textarea')[0]
      .value.split('\n');
    const elArray = [];
    elArray.push(setTitle);
    document.querySelectorAll('.textFitted').forEach((el, i) => {
      elArray.push(el);
    });
    elArray.forEach((el, i) => {
      if (txtArray[i] !== undefined) {
        el.innerText = txtArray[i];
      }
    });
    changeFontSizeForEach(setFontSize.value);
  }
}

// function pasteTxtListTxtAreaSwitch() {
//   if (wordsListToInput.style.display === 'flex') {
//     wordsListToInputContainer.querySelector('button span').innerText =
//       'Wprowadź słowa z listy do zestawu...';
//     wordsListToInput.style.display = 'none';
//     wordsListToInput.setAttribute('recent-displayed', 'false');
//   } else {
//     wordsListToInput.style.display = 'flex';
//     wordsListToInputContainer.querySelector('button span').innerText =
//       'Ukryj pole listy...';
//     wordsListToInput.setAttribute('recent-displayed', 'true');
//   }

//   updateLanguage();
// }

wordListOperationsBtn.addEventListener('click', function () {
  showOptions(
    wordListOperationsBtn,
    wordListOperationsOptions,
    wordListOperationsContainer
  );
  wordsListToInput.style.display = 'flex';
  wordsListToInput.classList.add('color-div');
});

document.addEventListener('click', function (e) {
  var isClickInsideTxtArea = wordsListToInput.contains(e.target);

  if (!isClickInsideTxtArea) {
    hideOptions(
      e,
      wordListOperationsContainer,
      wordListOperationsBtn,
      wordListOperationsOptions
    );
  }
});

function hideTxtListTxtArea(e) {
  var isClickInsidewordListOperationsContainer =
    wordListOperationsContainer.contains(e.target);
  var isClickInsideTxtArea = wordsListToInput.contains(e.target);

  // console.log(!isClickInsideTxtArea);
  // console.log(!isClickInsidewordListOperationsContainer);
  // console.log(wordListOperationsBtn.style.display === 'none');
  if (!isClickInsideTxtArea && !isClickInsidewordListOperationsContainer) {
    wordsListToInput.style.display = 'none';
  }
}

document.addEventListener('click', hideTxtListTxtArea);
