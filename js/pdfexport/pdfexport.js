//żeby przyspieszyć mozna byłoby zmniejszać rozmiary przyciętych obrazów do 300x300
//https://fengyuanchen.github.io/compressorjs/

const downloadPdf = document.getElementById('download-pdf');

pdfMake.fonts = {
  calibri: {
    normal: 'calibri.ttf',
  },
  centuryGothic: {
    normal: 'GOTHIC.ttf',
  },
  times1: {
    normal: 'times1.ttf',
  },
  myFont: {
    normal: 'myFont',
  },
};

function getFontForPDFOnAppStart() {
  //chyba nazwa zła, powinno być po prostu getFontForPDF
  switch (selectFont.value) {
    case 'Calibri':
      return 'calibri';
    case 'Times':
      return 'times1';
    case 'Century Gothic':
      return 'centuryGothic';
    case 'Moja czcionka':
      return 'myFont';
  }
}

function downloadPdfFn() {
  switch (selectTemplate.value) {
    case '4onA4ECO':
      download4inA4();
      break;
    case '2onA4':
      downloadClassic2onA4();
      break;
    case '4onA4classic':
      downloadClassic4onA4();
      break;
  }
}
