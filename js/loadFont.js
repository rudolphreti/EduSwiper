const fontInput = document.getElementById('font-input');
let initialDocumentFonts = document.fonts;
let customFont;
let customFontData;

fontInput.addEventListener('input', async () => {
  if (customFont !== undefined) document.fonts.delete(customFont); // wtf?

  customFontData = await fontInput.files[0].arrayBuffer();
  customFont = new FontFace('Moja czcionka', customFontData);

  await customFont.load();
  document.fonts.add(customFont);
  addCustomFontToSelectList();
  changeFontSizeForEach(setFontSize.value);
});

function base64convert(files) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = e.target.result;
    pdfMake.vfs.myFont = data.replace(
      /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,/,
      ''
    );
    cardSet.customFont = data;
  };
  reader.readAsDataURL(files[0]);
}

let optionElement;
function addCustomFontToSelectList() {
  if (optionElement !== undefined) {
    optionElement.remove();
  }
  optionElement = document.createElement('option');
  optionElement.innerHTML = 'Moja czcionka';
  selectFont.appendChild(optionElement);
  changeFont('Moja czcionka');
  selectFont.value = 'Moja czcionka';
}

// function addFontToDocument(dataArg) { // zjakiegoś powodu nie działa
//   font = new FontFace('Moja czcionka', dataArg);
//   await font.load();
//   document.fonts.add(font);
// }

function loadFontInputClick() {
  fontInput.click(); //wszystkie tego typu funkcje mogłyby być w jednej
}

fontInput.nextElementSibling.addEventListener('click', loadFontInputClick);
