// function addChangeImageBtns() {
//   // console.log('addChangeImageBtns');
//   if (preview.querySelectorAll('.img-drop-zone').length !== 0) {
//     document.querySelectorAll('.img-drop-zone').forEach((el) => {
//       el.remove();
//     });
//   }
//   document.querySelectorAll('.card-container').forEach((el, i) => {
//     const changeImageBtnInput = document.createElement('input');
//     const changeImageLabel = document.createElement('label');
//     const imgDropZone = document.createElement('div');
//     changeImageBtnInput.id = `change-img-input-id-${i}`;
//     changeImageBtnInput.classList.add('change-img-input');
//     changeImageBtnInput.type = 'file';
//     changeImageBtnInput.accept = '.jpg, .jpeg, .webp, .png, .svg, .gif';
//     changeImageBtnInput.style.display = 'none';
//     changeImageBtnInput.addEventListener('input', function () {
//       changeImg(this);
//     });
//     changeImageLabel.classList.add('change-img-btn');
//     changeImageLabel.htmlFor = `change-img-input-id-${i}`;

//     imgDropZone.classList.add('img-drop-zone');
//     imgDropZone.appendChild(changeImageBtnInput);
//     el.appendChild(changeImageLabel);
//     el.appendChild(imgDropZone);

//     imgDropZone.addEventListener('drop', (e) => {
//       // e.preventDefault();
//       if (e.dataTransfer.files.length && cardContainerOverStatus === true) {
//         changeImageBtnInput.files = e.dataTransfer.files;
//         changeImg(changeImageBtnInput);
//       }
//       imgDropZone.style.zIndex = 0;
//     });

//     imgDropZone.parentElement.addEventListener('dragover', (e) => {
//       imgDropZone.style.zIndex = 2;
//     });
//     imgDropZone.parentElement.addEventListener('dragleave', (e) => {
//       imgDropZone.style.zIndex = 0;
//     });
//   });
// }

// function changeImg(el, imageArg) {
//   const image = imageArg;
//   const cropperNumber = parseInt(image.id.match(/\d+/g)[0]);

//   instanceArray[cropperNumber].destroy();
//   readAndPreview(el.files[0]);

//   function readAndPreview(file) {
//     if (!/\.(jpe?g|png|gif|svg|webp|avif)$/i.test(file.name)) {
//       return alert(file.name + ' to plik o nieobsługiwanym formacie');
//     }
//     const reader = new FileReader();
//     reader.addEventListener('load', function () {
//       image.src = reader.result;
//       instanceArray[cropperNumber] = new Cropper(image, {
//         //wspólne parametry do jednego obiektu, zob.: templates.general, createCropperInstanceArray(image)
//         dragMode: 'move',
//         restore: false,
//         guides: false,
//         highlight: false,
//         cropBoxMovable: false,
//         cropBoxResizable: false,
//         toggleDragModeOnDblclick: false,
//         background: false,
//         modal: false,
//         center: true,
//       });
//       //   console.log(reader.result);
//     });
//     reader.readAsDataURL(file);
//   }
// }

function changeImg(readerArg, el, imgArg, status) {
  // nie wiem czemu, nie mogę dwóch ifów z previewAnduploadImage(image) uprościć za pomocą tej funkcji
  // pojawiają się błędy choć wydaje mi się, że wszystko robię dobrze
  readerArg.onloadend = function (e) {
    const changedImg = el.parentElement.querySelector('img');
    const cropperNumber = parseInt(changedImg.id.match(/\d+/g)[0]);
    instanceArray[cropperNumber].destroy();
    imgArg.src = e.target.result;
    changedImg.src = imgArg.src;
    instanceArray[cropperNumber] = new Cropper(changedImg, {
      //wspólne parametry do jednego obiektu, zob.: templates.general, createCropperInstanceArray(image)
      dragMode: 'move',
      restore: false,
      guides: false,
      highlight: false,
      cropBoxMovable: false,
      cropBoxResizable: false,
      toggleDragModeOnDblclick: false,
      background: false,
      modal: false,
      center: true,
    });
    status = false;
  };
}

let changeReferenceImgByPaste = false;
let addImg = false;
document.addEventListener('paste', function (evt) {
  // to musi iść do handleFiles
  if (document.querySelector(".card-container[active='true']") !== null) {
    changeReferenceImgByPaste = true;
    console.log('changeReferenceImgByPaste ' + changeReferenceImgByPaste);
  } else {
    // console.log(creatingBtn.getAttribute('active') === 'true');
    if (creatingBtn.getAttribute('active') === 'true') {
      addImg = true;
    }
  }

  // Get the data of clipboard
  const clipboardItems = evt.clipboardData.items;
  console.log(clipboardItems);
  const items = [].slice.call(clipboardItems).filter(function (item) {
    // Filter the image items only
    return item.type.indexOf('image') !== -1;
  });
  if (items.length === 0) {
    return;
  }

  const item = items[0];
  // Get the blob of image
  const blob = item.getAsFile();
  // console.log(blob);
  const array = [blob];
  handleFiles(array);
});
