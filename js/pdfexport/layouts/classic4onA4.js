// nowy szablon 4naA4

var classic4onA4;

function downloadClassic4onA4() {
  //refa zob.: 4inA4.js download()
  messageFn(`<p>Trwa tworzenie pliku PDF. ${waitingTime} 
  Przepraszamy, jeżeli proces trwa zbyt długo. 
  Pracujemy nad jego przyspieszeniem.</p>`);
  spinner.spin(spinnerTarget);
  spinnerTarget.style.margin = '120px 0 120px 0';
  setTimeout(() => {
    classic4onA4 = {
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
      compress: true,
      pageMargins: [12, 10, 12, 10],
      defaultStyle: {
        font: getFontForPDFOnAppStart(),
      },
      content: [],
      images: {},
    };
    classic4onA4Content();
    const pdf = createPdf(classic4onA4);

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

var classic4onA4tableContentIndex = 0;
function classic4onA4Content() {
  classic4onA4tableContentIndex = 0;
  for (let i = 0; i < instanceArray.length; i += 2) {
    Object.defineProperty(classic4onA4.images, 'image' + i, {
      value: instanceArray[i].getCroppedCanvas().toDataURL(),
    });

    classic4onA4.content.push({
      style: 'tableExample',
      alignment: 'center',
      table: {
        widths: [275, 275],
        heights: [225, 50, 50],
        body: [
          [
            {
              image: 'image' + i,
              width: 260 * 0.95,
              height: 227 * 0.95,
            },
            {
              image: 'image' + i,
              width: 260 * 0.95,
              height: 227 * 0.95,
              border: [true, true, true, false],
            },
          ],
          [
            {
              //w html divy .fit-txt-container.fit-txt-container-centering są o 90% mniejsze od .text-container
              //zatem trzeba w PDF tak samo to rozwiązać poprzez zagnieżdzenie tutaj jednokomórkowej tabeli
              text: instanceArray[i].container.nextSibling.nextSibling
                .childNodes[0].innerText, //refa!!!
              fontSize:
                parseInt(
                  instanceArray[i].container.nextSibling.nextSibling
                    .childNodes[0].childNodes[0].style.fontSize, //refa!!!
                  10
                ) * 0.7,
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
              fontSize:
                parseInt(
                  instanceArray[i].container.nextSibling.nextSibling
                    .childNodes[0].childNodes[0].style.fontSize, //refa!!!
                  10
                ) * 0.7,
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
            classic4onA4.content[0].table.heights
          );
          return 0;
        },
      },
    });

    // console.log('i === ' + i);
    // console.log('i + 1 === ' + (i + 1));
    // console.log('instanceArray.length - 1 === ' + (instanceArray.length - 1));

    if (instanceArray[i + 1] !== undefined) {
      // console.log(classic4onA4tableContentIndex);
      // console.log(
      //   classic4onA4.content[classic4onA4tableContentIndex].table.heights
      // );
      Object.defineProperty(classic4onA4.images, 'image' + (i + 1), {
        value: instanceArray[i + 1].getCroppedCanvas().toDataURL(),
      });
      classic4onA4.content[classic4onA4tableContentIndex].table.heights.push(
        225,
        50,
        50
      );
      classic4onA4.content[classic4onA4tableContentIndex].table.body.push(
        [
          {
            image: 'image' + (i + 1),
            width: 260 * 0.95,
            height: 227 * 0.95,
          },
          {
            image: 'image' + (i + 1),
            width: 260 * 0.95,
            height: 227 * 0.95,
            border: [true, true, true, false],
          },
        ],
        [
          {
            //w html divy .fit-txt-container.fit-txt-container-centering są o 90% mniejsze od .text-container
            //zatem trzeba w PDF tak samo to rozwiązać poprzez zagnieżdzenie tutaj jednokomórkowej tabeli
            text: instanceArray[i + 1].container.nextSibling.nextSibling
              .childNodes[0].innerText, //refa!!!
            fontSize:
              parseInt(
                instanceArray[i + 1].container.nextSibling.nextSibling
                  .childNodes[0].childNodes[0].style.fontSize, //refa!!!
                10
              ) * 0.7,
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
            text: instanceArray[i + 1].container.nextSibling.nextSibling
              .childNodes[0].innerText, //refa!!!
            fontSize:
              parseInt(
                instanceArray[i + 1].container.nextSibling.nextSibling
                  .childNodes[0].childNodes[0].style.fontSize, //refa!!!
                10
              ) * 0.7,
          },
          {
            border: [false, false, false, false],
            text: '',
          },
        ]
      );
    }
    // if (i === instanceArray.length - 1 || i + 1 === instanceArray.length - 1) {
    //   // classic4onA4.content[classic4onA4tableContentIndex].pageBreak = 'default';
    //   classic4onA4.content.push(endpage());
    // }
    // if (i + 1 === instanceArray.length - 1) {
    //   classic4onA4.content[classic4onA4tableContentIndex].pageBreak = 'default';
    // }
    classic4onA4tableContentIndex++;
  }
}
