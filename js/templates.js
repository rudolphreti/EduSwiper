const selectTemplate = document.getElementById('select-template');
const root = document.querySelector(':root');
let cardContainerWidth;
let imgContainerHeight;

function switchTemplate(eco, classic) {
  switch (selectTemplate.value) {
    case '4onA4ECO':
      eco();
      break;
    case '2onA4':
      classic();
      break;
    case '4onA4classic':
      classic();
      break;
  }
}

function getTemplatesData(thisImage) {
  switchTemplate(
    () => {
      //refa
      cardSet.cards[
        parseInt(thisImage.id.match(/\d+/g))
      ].templatesData.ECO4onA4 = thisImage.cropper.getCanvasData();
    },
    () => {
      //refa
      cardSet.cards[
        parseInt(thisImage.id.match(/\d+/g))
      ].templatesData.CLASSIC2onA4 = thisImage.cropper.getCanvasData();
    }
  );
}

function setCardMeasures(
  cardContainerWidthArg,
  textContainerHeightArg,
  imgContainerHeightArg
) {
  root.style.setProperty(
    '--card-container-width',
    `${cardContainerWidthArg}px`
  );
  root.style.setProperty(
    '--text-container-height',
    `${textContainerHeightArg}px`
  );
  root.style.setProperty(
    '--img-container-height',
    `${imgContainerHeightArg}px`
  );

  imgContainerHeight = imgContainerHeightArg;
  cardContainerWidth = cardContainerWidthArg;
}

const templates = {
  general(cardMeasuresCallback) {
    //przydałby się tutaj spinner, bo jak jest dużo obrazów to trzeba długo czekać
    cardMeasuresCallback();
    instanceArray.forEach((el) => {
      el.destroy();
    });
    document.querySelectorAll('.img-container img').forEach((el, i) => {
      // console.log(i + 1);
      // console.log(cardSet.cards.length);
      instanceArray[i] = new Cropper(el, {
        // a może wyczyścić tablicę i dać tutaj push?
        dragMode: 'move',
        restore: false,
        guides: false,
        highlight: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: false,
        background: false,
        modal: false,
        ready() {
          switchTemplate(
            () => {
              instanceArray[i].setCanvasData(
                cardSet.cards[i].templatesData.ECO4onA4
              );
            },
            () => {
              instanceArray[i].setCanvasData(
                cardSet.cards[i].templatesData.CLASSIC2onA4
              );
            }
          );

          if (
            // cardSet.version === 'Prototype_k3d_v3_2templates' &&
            i + 1 ===
            cardSet.cards.length
          ) {
            changeFontSizeForEach(setFontSize.value);
            fitTxtContainerEvents();
          }
          // if (cardSet.version === 'Prototype_k3d_v2') {
          //   cardSet.cards[i].templatesData = {
          //     ECO4onA4: cardSet.cards[i].canvasData,
          //     CLASSIC2onA4: cardSet.cards[i].canvasData,
          //   };
          //   instanceArray[i].setCanvasData(cardSet.cards[i].canvasData);
          //   if (i + 1 === cardSet.cards.length) {
          //     cardSet.version = 'Prototype_k3d_v3_2templates';
          //     changeFontSizeForEach(setFontSize.value);
          //   }
          // }
          // if (
          //   i + 1 === cardSet.cards.length &&
          //   loadingProjectFromfile === true
          // ) {
          //   fitTxtContainerEvents();
          //   loadingProjectFromfile = false;
          // }

          this.cropper.setCropBoxData({
            //refa
            left: 0,
            top: 0,
            width: this.cropper.getContainerData().width,
            height: this.cropper.getContainerData().height,
          });
        },
      });
    });
  },
  set: {
    eco() {
      templates.general(() => {
        setCardMeasures(278, 120, 240);
      });
    },
    classic() {
      templates.general(() => {
        setCardMeasures(390, 65, 325);
      });
    },
  },
};

function selectTemplateFromDropDownList() {
  // console.log('selectTemplateFromDropDownList');
  switchTemplate(
    () => {
      templates.set.eco();
    },
    () => {
      templates.set.classic();
    }
  );
}

window.addEventListener('DOMContentLoaded', () => {
  switchTemplate(
    () => {
      setCardMeasures(278, 120, 240);
    },
    () => {
      setCardMeasures(390, 65, 325);
    }
  );
});

function dividingLineIfEco(el) {
  if (el.value === '4onA4ECO') {
    controlCardDivision.parentElement.style.display = 'initial';
  } else {
    controlCardDivision.parentElement.style.display = 'none';
  }
}
