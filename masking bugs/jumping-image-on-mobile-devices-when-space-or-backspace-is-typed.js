//na urządzeniach mobilnych pojawia się dziwny bug
//gdy ta klasa jest przypisana podczas wpisywania tekstu, obraz skacze gdy wprowadzana jest spacja lub backspace
// jest to związane z instrukcją CSS dla fit-txt-container:
// {
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }
//dlatego utworzyłem osobną klasę 'fit-txt-container-centering', którą usuwam przy onfocus, a przywracam przy onblure

function jumpingImageOnMobileDevicesWhenSpaceOrBackspaceIsTyped(el) {
  const className = 'fit-txt-container-centering';
  el.addEventListener('focus', function () {
    this.parentNode.classList.remove(className);

    this.style.width = 'unset';
    this.style.height = 'unset';
  });

  el.addEventListener('blur', function () {
    this.parentNode.classList.add(className);
    if (this.innerText === '') {
      this.style.width = '100%';
      this.style.height = '100%';
    }
  });
}
