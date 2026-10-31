//zła nazwa - powinno być cropping.js
function centerWithCroppingForEach() {
  instanceArray.forEach((el, i) => {
    cropperReset(el);
    centerWithCropping(el);
    switchTemplate(
      () => {
        //refa
        cardSet.cards[i].templatesData.ECO4onA4 = el.getCanvasData();
      },
      () => {
        //refa
        cardSet.cards[i].templatesData.CLASSIC2onA4 = el.getCanvasData();
      }
    );
  });
  // getCanvasDataFromAll();
}
function fitImagesToTheirContainers() {
  instanceArray.forEach((el, i) => {
    cropperReset(el);
    switchTemplate(
      () => {
        //refa
        cardSet.cards[i].templatesData.ECO4onA4 = el.getCanvasData();
      },
      () => {
        //refa
        cardSet.cards[i].templatesData.CLASSIC2onA4 = el.getCanvasData();
      }
    );
  });
  // getCanvasDataFromAll();
}

function centerWithCropping(x) {
  const imgNatHeight = x.imageData.naturalHeight;
  const imgNatWidth = x.imageData.naturalWidth;
  //tutaj jest stała wartość dla
  let ratio;

  if (imgNatHeight < imgNatWidth) {
    ratio = cardContainerWidth / imgNatHeight;
    x.zoomTo(ratio); //nie wiem dlaczego on nie kadruje domyślnie poprawnie i trzeba mnożyć przez 0.83
  } else {
    ratio = imgContainerHeight / imgNatWidth;
    x.zoomTo(ratio); //nie wiem dlaczego on nie kadruje domyślnie poprawnie i trzeba mnożyć przez 0.83
  }
}

function cropperReset(x) {
  x.reset();
  x.setCropBoxData({
    left: 0,
    top: 0,
    width: cardContainerWidth,
    height: imgContainerHeight,
  });
}

const croppAllBtn = document.getElementById('crop-all-btn');
const croppAllOptions = document.getElementById('crop-all-options');

// function showCroppAllOptions() {
//   if (croppAllBtn.style.display !== 'none') {
//     croppAllBtn.style.display = 'none';
//     croppAllOptions.style.display = 'flex';
//     croppAllContainer.classList.add('color-div');
//   }
// }

// croppAllBtn.addEventListener('click', showCroppAllOptions);

// function hideCroppAllOptions(e) {
//   var isClickInsideElement = croppAllContainer.contains(e.target);
//   if (!isClickInsideElement) {
//     croppAllBtn.style.display = 'inherit';
//     croppAllOptions.style.display = 'none';
//     croppAllContainer.classList.remove('color-div');
//   }
// }

// document.addEventListener('click', hideCroppAllOptions);

croppAllBtn.addEventListener('click', function () {
  showOptions(croppAllBtn, croppAllOptions, croppAllContainer);
});

document.addEventListener('click', function (e) {
  hideOptions(e, croppAllContainer, croppAllBtn, croppAllOptions);
});
