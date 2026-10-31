const listOfExamples = document.getElementById('montessori-cards');

//temporary HTML generating
function readyToUseSetsNames(setName) {
  return [
    setName
      .replace(/ /g, '-')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ł/g, 'l'),
    setName,
  ];
}

const examplesArr = [
  readyToUseSetsNames('AGD - kuchnia - gotowanie'),
  readyToUseSetsNames('AGD - kuchnia - smażenie'),
  readyToUseSetsNames('Boże Narodzenie'),
  readyToUseSetsNames('Boże Narodzenie - Stół wigilijny'),
  readyToUseSetsNames('Drzewa iglaste występujące w Polsce'),
  readyToUseSetsNames('Flagi państw i terytoriów zależnych Europy'),
  readyToUseSetsNames('Flagi'),
  readyToUseSetsNames('Kompozytorzy muzyki filmowej'),
  readyToUseSetsNames('Kompozytorzy muzyki poważnej'),
  readyToUseSetsNames('Liście drzew'),
  readyToUseSetsNames('Maszyny budowlane'),
  readyToUseSetsNames('Motyle'),
  readyToUseSetsNames('Najrzadsze zwierzęta świata'),
  readyToUseSetsNames('Poczet królów i książąt polskich Jana Matejki'),
  readyToUseSetsNames('Polskie stroje ludowe'),
  readyToUseSetsNames('Rasy kotów'),
  readyToUseSetsNames('Układ Słoneczny'),
  readyToUseSetsNames('Wybitni Polacy'),
  readyToUseSetsNames('Zwierzęta'),
];

function loadExamples() {
  examplesArr.forEach((el) => {
    examples.getElementsByTagName(
      'ul'
    )[0].innerHTML += `<li><a href='../app/app.html?ready-to-use-set=../app/ready-to-use-sets/${el[0]}.esw' target='_blank'><span data-mlr-text>${el[1]}</span></a></li>`;
  });
}

window.addEventListener('DOMContentLoaded', loadExamples);
