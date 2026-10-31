const destroyAllEl = document.getElementById('destroy-all');

function destroyAll() {
  //dodać argumenty do funkcji hideNeedlessElementsBeforeCreatingCards(), zmienić jej nazwę na needlessElementsBeforeCreatingCards()
  //dodać tę funkcję z odpowiednimi argumentami do destroyAll()
  instanceArray = [];
  preview.innerHTML = '';
  setTitle.innerHTML = '';
  messageFn('');
  cardSet = '';
  document.getElementById('set-container').style.borderBottom = '0px';
  dd = {
    //potrzebne to w ogóle?
    pageSize: 'A4',
    compress: true,
    pageMargins: [10, 10, 10, 10],
    defaultStyle: {
      font: getFontForPDFOnAppStart(),
    },
    content: [
      tableContent('after'),
      { text: '', pageBreak: 'after' },
      tableContent(),
    ],
  };
}
