//nazwa pliku nieładna, powinno być po prostu cropper-functions
let instanceArray = []; //nazwa tej tablicy powinna brzmieć cropperInstanceArray

function createCropperInstanceArray(image) {
  //refa pod kątem szablonów z prostokątnym obrazem
  instanceArray.push(
    new Cropper(image, {
      //wspólne parametry do jednego obiektu, zon.: templates.general
      dragMode: 'move',
      restore: false,
      guides: false,
      highlight: false,
      cropBoxMovable: false,
      cropBoxResizable: false,
      toggleDragModeOnDblclick: false,
      background: false,
      modal: false,
      center: true, //to chyba tylko gdy tworzone są na podstawie załadoanych plików obrazów

      ready() {
        if (loadingProjectFromfile === true) {
          // console.log(loadingFileIndex + 1);
          //refa
          if (loadingFileIndex + 1 === cardSet.cards.length) {
            selectTemplate.value = cardSet.template;
            cardSetCreatingEnd(
              true,
              cardSet.title,
              `Załadowany zestaw składa się z ${instanceArray.length} kart.`,
              cardSet.fontType
            );
            loadingFileIndex = 0;
            selectTemplateFromDropDownList();
            dividingLineIfEco(selectTemplate);
          } else loadingFileIndex++;

          this.addEventListener('cropmove', function () {
            //to się chyba niepotrzebnie powtarza w js\cropper-app-functions.js
            //refa
            //sczytywane są dane poprzedniej pozycji, a nie bieżącej
            //setTimeout jest tutaj rozwiązaniem tymczasowym
            setTimeout(() => {
              getTemplatesData(this);
            }, 500);
          });
          this.addEventListener('zoom', function () {
            //refa
            //to się chyba niepotrzebnie powtarza w js\cropper-app-functions.js
            setTimeout(() => {
              getTemplatesData(this);
            }, 500);
          });
        } else {
          centerWithCropping(this.cropper);

          if (loadingFileIndex + 1 === filesLength) {
            // fitTxtContainerEvents();
            // console.log(readerFileIndex);
            // console.log(filesLength);

            // console.log(instanceArray.length - filesLength);
            // console.log(instanceArray.slice(instanceArray.length - filesLength));

            //czy nie dałoby się ujednolicić tego z (loadingFileIndex === cardSet.cards.length)?
            cardSet.cards = [];
            instanceArray.forEach((el) => {
              cardSet.cards.push({
                templatesData: {
                  //to jest trochę głupawe,
                  ECO4onA4: el.getCanvasData(),
                  CLASSIC2onA4: el.getCanvasData(),
                },
              });
            });
            loadingFileIndex = 0;
          } else loadingFileIndex++;
          this.addEventListener('cropmove', function () {
            //sczytywane są dane poprzedniej pozycji, a nie bieżącej
            //setTimeout jest tutaj rozwiązaniem tymczasowym
            setTimeout(() => {
              getTemplatesData(this);
            }, 500);
          });
          this.addEventListener('zoom', function () {
            setTimeout(() => {
              getTemplatesData(this);
            }, 500);
          });
          this.cropper.setCropBoxData({
            //refa
            left: 0,
            top: 0,
            width: this.cropper.getContainerData().width,
            height: this.cropper.getContainerData().height,
          });
        }
        // console.log(loadingFileIndex);}
      },
    })
  );
}
