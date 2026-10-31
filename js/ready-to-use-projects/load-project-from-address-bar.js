function loadSetFromURL(url) {
  // lepiej load-project-from-address-bar()
  destroyAll(); //potrzebne to w ogóle?
  messageFn(
    `<p>Trwa otwieranie pliku projektu. Potrwa to w zależności od ilości obrazów i ich rozmiarów, jak również szybkości komputera i połączenia z Internetem.</p>`
  );
  spinnerDisplay(true);
  hideNeedlessElementsBeforeCreatingCards();
  if (ytVideo !== null) {
    ytVideo.remove();
  }
  // console.log(url);
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      cardSet = data;
      createProjectFromJSON();
      cardSet.setUploadedOnServer = true;
    });
}

function loadSetFromUrlIfParamInAddressBar() {
  // lepiej load-project-if-param-in-address-bar()
  var url_string = window.location.href;
  var url = new URL(url_string);
  var param = url.searchParams.get('ready-to-use-set');
  console.log(param);

  if (param !== null) {
    window.removeEventListener('DOMContentLoaded', mainMenuInit);
    mainMenuInit();
    loadingProjectFromfile = true;
    loadSetFromURL(param);
    mainMenuSwitch(creatingBtn, examplesBtn, creating, examples);
    //ta funkcja spowoduje, że do pdf zostanie dopisany adres załadowanego na serwer pliku
  }
}

window.addEventListener('DOMContentLoaded', loadSetFromUrlIfParamInAddressBar);
