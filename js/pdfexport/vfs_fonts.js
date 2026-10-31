//czcionka times jest już w bibliotece, znaleźć sosób jak się do niej dostać
this.pdfMake = this.pdfMake || {};
this.pdfMake.vfs = {
  myFont: '',
  'times1.ttf': '',
  'GOTHIC.ttf': '',
  'calibri.ttf': '',
};

var fontData;
function getFont(file) {
  if (this.pdfMake.vfs[`${file}.ttf`] === '') {
    // console.log('getFont');
    url = `fonts/${file}.txt`;
    fetch(url)
      .then((response) => response.text())
      .then((responseData) => {
        this.pdfMake.vfs[`${file}.ttf`] = responseData;
      })
      .catch((error) => console.warn(error));
  }
}
