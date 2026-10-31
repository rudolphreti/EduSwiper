const saveImagesAsZipEl = document.getElementById('save-images-as-zip');

function saveImagesAsZip() {
  spinnerDisplay(true);
  messageFn(`Trwa pobieranie pliku ZIP z obrazami...`);
  setTimeout(() => {
    var zip = new JSZip();
    preview.querySelectorAll('.img-container').forEach((el) => {
      let base64Content = el.querySelector('img').src;
      // base64 encoded data doesn't contain commas
      let base64ContentArray = base64Content.split(',');

      // base64 content cannot contain whitespaces but nevertheless skip if there are!
      let mimeType = base64ContentArray[0].match(
        /[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/
      )[0];
      // console.log(mimeType.replace('image/', ''));

      // base64 encoded data - pure
      let base64Data = base64ContentArray[1];

      // console.log('base64Content: ', base64Content);
      // console.log('mimeType: ', mimeType);
      // console.log('base64Data: ', base64Data);

      zip.file(
        `${el.parentElement.innerText}.${mimeType.replace('image/', '')}`,
        base64Data,
        {
          base64: true,
        }
      );
    });

    zip
      .generateAsync({
        type: 'blob',
      })
      .then(function (content) {
        // see FileSaver.js
        saveAs(content, `${setTitle.innerText}.zip`);
        spinner.stop();
        spinnerTarget.style.margin = '0';
        messageFn(`Pobieranie pliku ZIP z obrazami zakończyło się sukcesem!`);
      });
  }, 500);
}
