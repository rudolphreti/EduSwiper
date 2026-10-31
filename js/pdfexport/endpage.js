//dopisać do ładowania pliku z adress bar w js\ready-to-use-projects\load-project-from-address-bar.js

function textIfsetUploadedOnServer() {
  if (cardSet.setUploadedOnServer === true) {
    const url = `https://eduswiper.com/?ready-to-use-set=../ready-to-use-sets/${setTitle.innerText
      .replace(/ /g, '-')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ł/g, 'l')
      .toLowerCase()}.esw`;
    //refa, stworzyć funkcję, to samo jest potrzebne też w js\ready-to-use-projects\ready-to-use-projects-HTML.js i w js\save-and-open\save.js

    return [
      {
        text: 'Zestaw jest darmowy. Tutaj można go edytować:',
        alignment: 'center',
        fontSize: 12,
        marginLeft: 50,
        marginRight: 50,
      },
      {
        text: url,
        link: url,
        alignment: 'center',
        fontSize: 12,
        color: 'blue',
        marginBottom: endPage2onA4(50, 30),
        marginLeft: 50,
        marginRight: 50,
      },
    ];
  }
}

function textIfSetIsSponsored() {
  switch (window.location.toString()) {
    case 'https://www.eduswiper.com/?ready-to-use-set=../ready-to-use-sets/polskie-stroje-ludowe.esw':
      return addPDFAd(
        `Zdjęcia pochodzą ze strony:`,
        'www.polskatradycja.pl',
        `https://www.polskatradycja.pl/folklor/stroje-ludowe.html?rel="follow"`
      );
    case 'https://www.eduswiper.com/?ready-to-use-set=../ready-to-use-sets/flagi.esw':
      return addPDFAd(
        `Zestaw dedykowany jest grupie "Moja miłość jest tak wielka, że dotarła aż..." To miejsce, które łączy dwie piękne idee: 1) możliwość stworzenia oryginalnego prezentu w postaci zdjęć z całego świata z personalizowaną dedykacją, 2) pomoc chorym dzieciom poprzez drobne wpłaty za otrzymane zdjęcia. Możesz zrobić coś dobrego bez wychodzenia z domu zamawiając zdjęcia na prezent, ale też przyłączając się do akcji robienia zdjęć dla innych. Zapraszamy! #boRazemMozemyWiecej`,
        'facebook.com/groups/kocham.cie.ja.i.caly.swiat/',
        `https://www.facebook.com/groups/kocham.cie.ja.i.caly.swiat/`
      );
  }
}

function endPage2onA4(anotherTemplates, template2onA4) {
  if (selectTemplate.value !== '2onA4') {
    return anotherTemplates;
  } else {
    return template2onA4;
  }
}

function endpage() {
  return [
    {
      alignment: 'center',
      //z url się nie dało nie wiem czemu:
      image: `data:image/png;base64,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`,
      width: 50,
      height: 50,
      marginTop: endPage2onA4(50, 5),
      marginBottom: 20,
      link: 'https://eduswiper.com',
    },
    {
      text: 'www.eduswiper.com',
      link: 'https://eduswiper.com',
      alignment: 'center',
      marginBottom: 50,
      marginLeft: 50,
      marginRight: 50,
      fontSize: 28,
      color: 'blue',
    },
    textIfsetUploadedOnServer(),
    textIfSetIsSponsored(),
    {
      text: 'Zestaw został wygenerowany za pomocą prototypu EduSwipera — aplikacji do błyskawicznego pozyskiwania schematycznych materiałów dydaktycznych.',
      alignment: 'center',
      marginBottom: endPage2onA4(50, 30),
      marginLeft: 50,
      marginRight: 50,
      fontSize: 12,
    },
    {
      text: 'Napisz do nas!',
      alignment: 'center',
      fontSize: 12,
      marginLeft: 50,
      marginRight: 50,
    },
    {
      text: 'Co sądzisz o naszym pomyśle? ',
      alignment: 'center',
      fontSize: 12,
      marginLeft: 50,
      marginRight: 50,
    },
    {
      text: 'Jakich funkcji potrzebujesz? ',
      alignment: 'center',
      fontSize: 12,
      marginLeft: 50,
      marginRight: 50,
    },
    {
      text: 'Jakiego zestawu kart trójdzielnych szukasz? ',
      alignment: 'center',
      marginBottom: endPage2onA4(50, 30),
      fontSize: 12,
      marginLeft: 50,
      marginRight: 50,
    },
    {
      text: 'Twoje zdanie jest dla nas bardzo ważne! Masz wpływ na to jak będzie wyglądać aplikacja EduSwiper! Możesz skontaktować się z nami poprzez stronę na Facebooku:',
      alignment: 'center',
      fontSize: 12,
      marginLeft: 50,
      marginRight: 50,
    },
    {
      text: 'www.facebook.com/eduswiper',
      link: 'https://www.facebook.com/eduswiper',
      alignment: 'center',
      fontSize: 12,
      color: 'blue',
      marginLeft: 50,
      marginRight: 50,
    },
    {
      text: 'lub e-mail:',
      alignment: 'center',
      fontSize: 12,
      marginLeft: 50,
      marginRight: 50,
    },
    {
      text: 'contact@eduswiper.com',
      link: 'mailto:contact@eduswiper.com',
      alignment: 'center',
      fontSize: 12,
      color: 'blue',
      marginLeft: 50,
      marginRight: 50,
    },
  ];
}

function addPDFAd(txt, companyTxt, companyUrl) {
  return [
    {
      text: txt,
      alignment: 'center',
      fontSize: endPage2onA4(12, 8),
      marginLeft: 50,
      marginRight: 50,
    },
    {
      text: companyTxt,
      link: companyUrl,
      alignment: 'center',
      fontSize: 12,
      color: 'blue',
      marginBottom: endPage2onA4(50, 30),
      marginLeft: 50,
      marginRight: 50,
    },
  ];
}
