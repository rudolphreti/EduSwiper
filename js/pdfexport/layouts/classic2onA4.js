// https://pdfmake.github.io/docs/0.1/document-definition-object/images/
// wykorzystując zmienne dla obrazu będziesz generował pliki o połowę mniejsze, po obrazy są podwójne
var classic2onA4;

function downloadClassic2onA4() {
  //refa zob.: 4inA4.js download()
  messageFn(`<p>Trwa tworzenie pliku PDF. ${waitingTime} 
  Przepraszamy, jeżeli proces trwa zbyt długo. 
  Pracujemy nad jego przyspieszeniem.</p>`);
  spinner.spin(spinnerTarget);
  spinnerTarget.style.margin = '120px 0 120px 0';
  setTimeout(() => {
    classic2onA4 = {
      //refa! ujednolicić dla wszystkich szablonów!
      header: {
        text: 'Plik utworzono na stronie www.eduswiper.com',
        alignment: 'center',
        margin: [0, 10, 20, 0],
        fontSize: 9,
      },
      footer: function (currentPage, pageCount) {
        return {
          text: 'Page ' + currentPage.toString() + ' of ' + pageCount,
          alignment: 'center',
          margin: [0, 20, 50, 0],
          fontSize: 9,
        };
      },
      pageSize: 'A4',
      pageOrientation: 'landscape',
      compress: true,
      pageMargins: [20, 15, 12, 10],
      defaultStyle: {
        font: getFontForPDFOnAppStart(),
      },
      content: [],
      images: {},
    };
    classic2onA4Content();
    const pdf = createPdf(classic2onA4);
    pdf.download(
      `${setTitle.innerText} (utworzono na stronie www.eduswiper.com).pdf`,
      function () {
        //message.innerHTML = '<p>Tworzenie pliku PDF zostało ukończone.</p>';
        messageFn(
          `<p>Tworzenie pliku PDF zostało ukończone. 
          Jest on gotowy do pobrania. Przepraszamy, jeżeli trwało to zbyt długo. 
          Pracujemy nad przyspieszeniem tego procesu. Zauważ, że plik PDF ma sporą objętość. 
          Można ją znacząco zmniejszyć dokonując kompresji za pomocą np. 
          <a href="https://documentcloud.adobe.com/link/acrobat/compress-pdf/">tej aplikacji</a>.
          Pracujemy nad tym, aby EduSwiper generował od razu pliki PDF o małej objętości. </p>`
        );
        spinner.stop();
        spinnerTarget.style.margin = '0';
      }
    );
  }, 20);
}

function classic2onA4Content() {
  // console.log(classic2onA4);
  for (let i = 0; i < instanceArray.length; i++) {
    Object.defineProperty(classic2onA4.images, 'image' + [i], {
      value: instanceArray[i].getCroppedCanvas().toDataURL(),
    });
    classic2onA4.content.push({
      style: 'tableExample',
      alignment: 'center',
      table: {
        widths: [390, 390],
        heights: [325, 65, 65],
        body: [
          [
            {
              image: 'image' + i,
              width: 380,
              height: 310,
            },
            {
              border: [true, true, true, false],
              image: 'image' + i,
              width: 380,
              height: 310,
            },
          ],
          [
            {
              //w html divy .fit-txt-container.fit-txt-container-centering są o 90% mniejsze od .text-container
              //zatem trzeba w PDF tak samo to rozwiązać poprzez zagnieżdzenie tutaj jednokomórkowej tabeli
              text: instanceArray[i].container.nextSibling.nextSibling
                .childNodes[0].innerText, //refa!!!
              fontSize: parseInt(
                instanceArray[i].container.nextSibling.nextSibling.childNodes[0]
                  .childNodes[0].style.fontSize, //refa!!!
                10
              ),
            },
            {
              border: [true, false, true, true],
              text: '',
            },
          ],
          [
            {
              //w html divy .fit-txt-container.fit-txt-container-centering są o 90% mniejsze od .text-container
              //zatem trzeba w PDF tak samo to rozwiązać poprzez zagnieżdzenie tutaj jednokomórkowej tabeli
              text: instanceArray[i].container.nextSibling.nextSibling
                .childNodes[0].innerText, //refa!!!
              fontSize: parseInt(
                instanceArray[i].container.nextSibling.nextSibling.childNodes[0]
                  .childNodes[0].style.fontSize, //refa!!!
                10
              ),
            },
            {
              border: [false, false, false, false],
              text: '',
            },
          ],
        ],
      },
      pageBreak: 'after',
      layout: {
        paddingTop: function (index, node) {
          applyVerticalAlignment(
            node,
            index,
            ['center', 'center'],
            classic2onA4.content[0].table.heights
          );
          return 0;
        },
      },
    });
    // if (i === instanceArray.length - 1) {
    //   // classic2onA4.content[i].pageBreak = 'default';
    //   classic2onA4.content.push(endpage());
    // }
  }
}
