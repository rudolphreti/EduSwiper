function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode);
}

function adDiv(urlArg) {
  const adDivEl = document.createElement('DIV');
  const adHTML = document.createElement('DIV');

  url = `js/addAd/${urlArg}.txt`;
  fetch(url)
    .then((response) => response.text())
    .then((responseData) => {
      adHTML.innerHTML = responseData;
      console.log(responseData);
    })
    .catch((error) => console.warn(error));

  adDivEl.id = 'ad-div';
  adDivEl.classList.add('animation');

  adDivEl.appendChild(adHTML);
  insertAfter(adDivEl, document.getElementById('set-title'));
}

function findRegex(setTitleArg) {
  return setTitle.innerText === setTitleArg;
}

function addAd() {
  if (
    findRegex('Flagi') ||
    findRegex('Flagi państw i terytoriów zależnych Europy')
  ) {
    adDiv('mojamilosc');
  }

  if (findRegex('Polskie stroje ludowe')) {
    adDiv('stroje');
  }
  

  // switch (window.location.toString()) {
  //   case 'https://www.eduswiper.com/?ready-to-use-set=../ready-to-use-sets/flagi.esw':
  //     adDiv(
  //       `<a href='https://www.facebook.com/groups/kocham.cie.ja.i.caly.swiat/' target="_blank">
  //       <img src='images/mojamilosc.jpg'>
  //       </a>
  //      <br><br>
  //       Zestaw dedykowany jest grupie "Moja miłość jest tak wielka, że dotarła aż..."<br>
  //       <a href='https://www.facebook.com/groups/kocham.cie.ja.i.caly.swiat/' target="_blank">facebook.com/groups/kocham.cie.ja.i.caly.swiat</a><br><br>
  //       To miejsce, które łączy dwie piękne idee:<br>
  //       1) możliwość stworzenia oryginalnego prezentu w postaci zdjęć z całego świata z personalizowaną dedykacją, <br>
  //       2) pomoc chorym dzieciom poprzez drobne wpłaty za otrzymane zdjęcia.<br>
  //       Możesz zrobić coś dobrego bez wychodzenia z domu zamawiając zdjęcia na prezent, ale też przyłączając się do akcji robienia zdjęć dla innych.<br>
  //       Zapraszamy!<br><br>
  //       #boRazemMozemyWiecej`
  //     );
  //     break;
  //   case 'https://www.eduswiper.com/?ready-to-use-set=../ready-to-use-sets/polskie-stroje-ludowe-(www.polskatradycja.pl).esw':
  //     adDiv(
  //       `<a href='https://www.polskatradycja.pl/folklor/stroje-ludowe.html' target="_blank">
  //       <img src='images/polskatradycja.jpg'>
  //       </a>
  //      <br><br>
  //       Zestaw powstał dzięki uprzejmości redakcji strony <a href='https://www.polskatradycja.pl/folklor/stroje-ludowe.html' target="_blank">polskatradycja.pl</a>, która wyraziła zgodę na bezpłatne wykorzystanie zdjęć.
  //       Jeżeli masz ochotę podziękować redakcji jest to bardzo proste - odwiedź/obserwuj/polub/udostępnij: <br>
  //       WWW: <a href='https://www.polskatradycja.pl' target="_blank">www.polskatradycja.pl</a><br>
  //       FB: <a href='https://www.facebook.com/PolskaTradycja/' target="_blank">facebook.com/PolskaTradycja</a><br>
  //       Twitter: <a href='https://twitter.com/PolskaTradycja' target="_blank">twitter.com/PolskaTradycja</a><br>
  //       Pinterest: <a href='https://pl.pinterest.com/polskatradycja/_saved/' target="_blank">twitter.com/pl.pinterest.com/polskatradycja/_saved/</a><br>
  //       Projekt "Polska tradycja" można także wesprzeć na Patronite: <a href='https://patronite.pl/PolskaTradycja' target="_blank">patronite.pl/PolskaTradycja</a>.`
  //     );
  //     break;
  // }
}
