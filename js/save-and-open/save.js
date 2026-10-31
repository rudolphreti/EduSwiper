// zła nazwa pliku, powinno być "save-project"

const saveProject = document.getElementById('save-project');

// function card(canvasDataArg, imgDataUriArg, wordArg) {
//   //napisać ładne nazwy argumentów
//   //funkcja powinna nazywać się exportCardDataToJSON()
//   return {
//     imgDataUri: imgDataUriArg,
//     word: wordArg,
//   };
// }

function updateCardSetObject() {
  cardSet.version = 'Prototype_k3d_v3_2templates';
  cardSet.title = setTitle.textContent;
  cardSet.fontType = document.getElementById('select-font').value;
  cardSet.baseFontSize = setFontSize.value;
  cardSet.template = selectTemplate.value;

  instanceArray.forEach((el, i) => {
    // console.log(i);
    cardSet.cards[i].imgDataUri = el.originalUrl;
    cardSet.cards[i].word =
      el.cropper.parentElement.nextSibling.nextSibling.innerText;
  });
}

document //być może tutaj w ogóle nie potrzeba biblioteki, a kluczowy okazuje się blob
  .getElementById('save-project')
  .addEventListener('click', function () {
    updateCardSetObject();
    saveAs(
      new Blob([JSON.stringify(cardSet)], {
        type: 'text/eduswiper;charset=utf-8',
      }),
      `${setTitle.textContent
        .replace(/ /g, '-')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ł/g, 'l')}.esw`
    );
  });
