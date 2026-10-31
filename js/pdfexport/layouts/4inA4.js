let dd;

const tableContent = function (pageBreakArg) {
  return {
    alignment: 'center',
    table: {
      widths: [278, 278],
      heights: [],
      dontBreakRows: true,
      body: [],
    },
    layout: {
      hLineWidth: function (i, node) {
        return i === 0 || i === node.table.body.length ? 1 : 1;
      },
      vLineWidth: function (i, node) {
        return i === 0 || i === node.table.widths.length ? 1 : 1;
      },
      // hLineColor: function (i, node) {
      //   return 'black';
      // },
      // vLineColor: function (i, node) {
      //   return 'black';
      // },
      // hLineStyle: function (i, node) {
      //   return { dash: { length: 1, space: 4 } };
      // },
      // vLineStyle: function (i, node) {
      //   return { dash: { length: 1, space: 4 } };
      // },
    },
    pageBreak: pageBreakArg,
  };
};

function createPDFTable(tableContentIndex, imgBorderBottom, textBorderTop) {
  //to ma być składnik obiektu "4inA4"
  for (let i = 0; i < instanceArray.length; i += 2) {
    Object.defineProperty(dd.images, 'image' + i, {
      value: instanceArray[i].getCroppedCanvas().toDataURL(),
    });
    dd.content[tableContentIndex].table.heights.push(278, 120);
    dd.content[tableContentIndex].table.body.push(
      [
        {
          image: 'image' + i,
          width: 263,
          height: 263,
          border: [true, true, true, imgBorderBottom],
        },
      ],
      [
        {
          //w html divy .fit-txt-container.fit-txt-container-centering są o 90% mniejsze od .text-container
          //zatem trzeba w PDF tak samo to rozwiązać poprzez zagnieżdzenie tutaj jednokomórkowej tabeli
          text: instanceArray[i].container.nextSibling.nextSibling.childNodes[0]
            .innerText, //refa!!!
          fontSize: parseInt(
            instanceArray[i].container.nextSibling.nextSibling.childNodes[0]
              .childNodes[0].style.fontSize, //refa!!!
            10
          ),
          border: [true, textBorderTop, true, true],
        },
      ]
    );
    if (instanceArray[i + 1] !== undefined) {
      Object.defineProperty(dd.images, 'image' + (i + 1), {
        value: instanceArray[i + 1].getCroppedCanvas().toDataURL(),
      });
      dd.content[tableContentIndex].table.body[i].push({
        image: 'image' + (i + 1),
        width: 263,
        height: 263,
        border: [true, true, true, imgBorderBottom],
      });
      dd.content[tableContentIndex].table.body[i + 1].push({
        //w html divy .fit-txt-container.fit-txt-container-centering są o 90% mniejsze od .text-container
        //zatem trzeba w PDF tak samo to rozwiązać poprzez zagnieżdzenie tutaj jednokomórkowej tabeli
        text: instanceArray[i + 1].container.nextSibling.nextSibling
          .childNodes[0].innerText, //refa!!!
        fontSize: parseInt(
          instanceArray[i + 1].container.nextSibling.nextSibling.childNodes[0]
            .childNodes[0].style.fontSize, //refa!!!
          10
        ),
        border: [true, textBorderTop, true, true],
      });
    } else {
      dd.content[tableContentIndex].table.body[i].push({
        text: `W tym szablonie na jedną kartkę A4 przypadają 4 karty. Żeby było ekonomicznie, liczba kart w zestawie powinna być podzielna przez 4. Liczba kart w tym zestawie to ${instanceArray.length}.`,
      });
      dd.content[tableContentIndex].table.body[i + 1].push({
        text: '---',
      });
    }
  }

  dd.content[tableContentIndex].layout.paddingTop = function (index, node) {
    applyVerticalAlignment(
      node,
      index,
      ['center', 'center'],
      dd.content[tableContentIndex].table.heights
    );
    return 0;
  };
}

function download4inA4() {
  //refa zob.: classic2onA4.js.js download()

  //zła nazwa zmiennej, powinno być "4inA4"

  dd = {
    // nie wiem dlaczego, ale trzeba to znowu deklarować!!!!!!
    //wykonaj test: naciśnij pobieranie PDF, anuluj i znowu pobierz PDF, powinno działac;
    //wykonaj to samo, ale z dd = ddInit (wartość przypisana do consta); nie wiadomo dlaczego zmienia się wartość consta!!!!!
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
    pageMargins: [10, 10, 10, 10],
    defaultStyle: {
      font: getFontForPDFOnAppStart(),
    },
    content: [
      tableContent('after'),
      { text: '', pageBreak: 'after' },
      tableContent('after'),
      //endpage(),
    ],
    images: {},
  };
  messageFn(`<p>Trwa tworzenie pliku PDF. ${waitingTime} Przepraszamy, jeżeli proces trwa zbyt długo. 
  Pracujemy nad jego przyspieszeniem.</p>`);
  spinner.spin(spinnerTarget);
  spinnerTarget.style.margin = '120px 0 120px 0';
  setTimeout(() => {
    createPDFTable(0, true, true);
    createPDFTable(2, false, false);

    const pdf = createPdf(dd);
    pdf.download(
      `${setTitle.innerText} (utworzono na stronie www.eduswiper.com).pdf`,
      function () {
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
