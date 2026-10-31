var mlCodes = [
  // {
  //   code: 'bg',
  //   name: 'Bulgarian',
  // },
  // {
  //   code: 'zh',
  //   name: 'Traditional',
  // },
  // {
  //   code: 'zh',
  //   name: 'Simplified',
  // },
  // {
  //   code: 'cs',
  //   name: 'Czech',
  // },
  // {
  //   code: 'da',
  //   name: 'Danish',
  // },
  // {
  //   code: 'nl',
  //   name: 'Dutch',
  // },
  {
    code: 'en',
    name: 'English',
  },
  // {
  //   code: 'et',
  //   name: 'Estonian',
  // },
  {
    code: 'de',
    name: 'Deutsch',
  },
  // {
  //   code: 'el',
  //   name: 'Greek',
  // },
  // {
  //   code: 'hu',
  //   name: 'Hungarian',
  // },
  // {
  //   code: 'it',
  //   name: 'Italian',
  // },
  // {
  //   code: 'no',
  //   name: 'Norwegian',
  // },
  {
    code: 'pl',
    name: 'Polski',
  },
  {
    code: 'fr',
    name: 'Français',
  },

  // {
  //   code: 'pt',
  //   name: 'Portuguese',
  // },
  // {
  //   code: 'ro',
  //   name: 'Romanian',
  // },
  // {
  //   code: 'sk',
  //   name: 'Slovak',
  // },
  // {
  //   code: 'ru',
  //   name: 'Russian',
  // },
  // {
  //   code: 'es',
  //   name: 'Spanish',
  // },
  // {
  //   code: 'sv',
  //   name: 'Swedish',
  // },
];

let codeArray = [];
mlCodes.forEach((el) => {
  codeArray.push(el.code);
});

var MLstrings = [
  {
    English:
      'An application (prototype) for the quick creation of schematic teaching materials.',
    Polski:
      'Aplikacja (prototyp) do szybkiego tworzenia schematycznych materiałów dydaktycznych.',
    Deutsch:
      'Eine Anwendung (Prototyp) zur schnellen Erstellung von schematischen Unterrichtsmaterialien.',
    Français:
      'Une application (prototype) pour la création rapide de matériel pédagogique schématique.',
  },
  {
    English:
      'Currently, you can use it to create Montessori three-part cards in three templates and view the collections using the slider.',
    Polski:
      'Obecnie można za jej pomocą tworzyć karty trójdzielne Montessori w trzech szablonach i przeglądać kolekcje za pomocą slajdera.',
    Deutsch:
      'Derzeit kann man damit dreiteilige Montessori-Karten in drei Vorlagen erstellen und die Sammlungen mit einem Slider durchsuchen.',
    Français:
      "Actuellement, vous pouvez l'utiliser pour créer des cartes Montessori en trois parties dans trois modèles et visualiser les collections à l'aide du curseur.",
  },
  {
    English: 'Workspace',
    Polski: 'Obszar roboczy',
    Deutsch: 'Arbeitsbereich',
    Français: 'Espace de travail',
  },
  {
    English: 'Examples',
    Polski: 'Gotowe zestawy',
    Deutsch: 'Beispiele',
    Français: 'Exemples',
  },
  {
    English: 'Download PDF',
    Polski: 'Pobierz PDF',
    Deutsch: 'PDF herunterladen',
    Français: 'Télécharger le PDF',
  },
  {
    English: 'Template:',
    Polski: 'Szablon:',
    Deutsch: 'Vorlage:',
    Français: 'Modèle :',
  },
  {
    English: 'Slideshow',
    Polski: 'Pokaz slajdów',
    Deutsch: 'Diashow',
    Français: 'Diaporama',
  },
  {
    English: 'Edit:',
    Polski: 'Edytuj:',
    Deutsch: 'Bearbeiten:',
  },
  {
    English: 'Save as ESW...',
    Polski: 'Zapisz jako ESW...',
    Deutsch: 'Speichern unter ESW...',
    Français: 'Enregistrer sous ESW...',
  },
  {
    English: 'Font:',
    Polski: 'Czcionka:',
    Deutsch: 'Schriftart:',
    Français: 'Police :',
  },
  {
    English: 'Font...',
    Polski: 'Czcionka...',
    Deutsch: 'Schriftart ...',
    Français: 'Police...',
  },
  {
    English: 'Max. size:',
    Polski: 'Max. rozmiar:',
    Deutsch: 'Max. Größe:',
    Français: 'Taille max. :',
  },
  {
    English: 'Max. font size',
    Polski: 'Max. rozmiar czcionki:',
    Deutsch: 'Max. Schriftgröße:',
    Français: 'Taille max. de la police :',
  },
  {
    English: 'Font:',
    Polski: 'Czcionka:',
    Deutsch: 'Schriftart:',
    Français: 'Police :',
  },
  {
    English: 'Load your font...',
    Polski: 'Załaduj własną czcionkę...',
    Deutsch: 'Laden Sie Ihre Schriftart ...',
    Français: 'Charger votre police...',
  },
  {
    English: 'Cropping...',
    Polski: 'Kadrowanie...',
    Deutsch: 'Beschneiden ...',
    Français: 'Recadrer...',
  },

  {
    English: 'Crop all:',
    Polski: 'Kadruj wszystko:',
    Deutsch: 'Alles beschneiden:',
    Français: 'Recadrer tout :',
  },
  {
    English: 'Center with cropping',
    Polski: 'Centruj z przycięciem',
    Deutsch: 'Zentrieren mit Zuschneiden',
    Français: 'Centrer avec recadrage',
  },
  {
    English: 'Fit',
    Polski: 'Dopasuj',
    Deutsch: 'Einpassen',
    Français: 'Correspondre',
  },
  {
    English: 'Download all of images...',
    Polski: 'Pobierz wszystkie obrazy...',
    Deutsch: 'Alle Bilder herunterladen ...',
    Français: 'Télécharger toutes les images...',
  },
  {
    English: 'Copy word list to clipboard',
    Polski: 'Kopiuj listę słów do schowka',
    Deutsch: 'Wortliste in die Zwischenablage kopieren',
    Français: 'Copier la liste de mots dans le presse-papiers',
  },
  {
    English: 'Add references from images +',
    Polski: 'Dodaj odnośniki na podstawie obrazów +',
    Deutsch: 'Referenzen aus Bildern hinzufügen +',
    Français: "Ajouter des références à partir d'images +",
  },
  {
    English: 'Upload images to create new references:',
    Polski: 'Aby utworzyć nowe odnośniki możesz załadować obrazy:',
    Deutsch: 'Um neue Verweise zu erstellen, können Sie Bilder hochladen:',
    Français: 'Charger des images pour créer de nouveaux liens:',
  },
  {
    English: 'Enter words from the list into the set:',
    Polski: 'Wprowadź słowa z listy do zestawu:',
    Deutsch: 'Geben Sie Wörter aus der Liste in das Set ein:',
    Français: 'Entrez les mots de la liste dans le jeu:',
  },
  {
    English: 'Hide list area...',
    Polski: 'Ukryj pole listy...',
    Deutsch: 'Listenfeld verstecken ...',
    Français: 'Masquer le champ de la liste...',
  },

  {
    English: 'from your disc',
    Polski: 'z dysku',
    Deutsch: 'aus Ihrem Disc',
    Français: 'à partir de votre disque',
  },
  {
    English: 'by drag and drop',
    Polski: 'metodą przeciągnij i upuść',
    Deutsch: 'durch Ziehen und Ablegen',
    Français: 'par glisser-déposer',
  },
  {
    English: 'by copy and paste.',
    Polski: 'metodą kopiuj i wklej.',
    Deutsch: 'durch Kopieren und Einfügen.',
    Français: 'par copier-coller.',
  },
  {
    English: 'Browse...',
    Polski: 'Przeglądaj...',
    Deutsch: 'Browsen ...',
    Français: 'Parcourir...',
  },
  {
    English: 'We invite you to:',
    Polski: 'Zapraszamy do:',
    Deutsch: 'Wir laden Sie ein zu:',
    Français: 'Nous vous invitons à :',
  },
  {
    English: 'our group on Facebook (35.7k. members):',
    Polski: 'naszej grupy na Facebooku (35,7 tys. członków):',
    Deutsch: 'unsere Gruppe auf Facebook (35,7k. Mitglieder):',
    Français: 'notre groupe sur Facebook (35.7k. membres) :',
  },
  {
    English: 'Facebook funpage:',
    Polski: 'strony na Facebooku:',
    Deutsch: 'Facebook Funpage:',
    Français: "la page d'accueil de Facebook :",
  },
  {
    English: 'contact us:',
    Polski: 'kontaktu poprzez e-mail:',
    Deutsch: 'Kontaktieren Sie uns:',
    Français: 'nous contacter :',
  },
  {
    English: 'Open ESW project...',
    Polski: 'Otwórz projekt ESW...',
    Deutsch: 'Projekt ESW öffnen ...',
    Français: 'Ouvrir un Projet ESW...',
  },
  {
    English:
      'The examples are temporarily available only in Polish! We are working on a language switcher of set.',
    Polski:
      'Gotowe zestawy są tymczasowo dostępne tylko w języku polskim! Trwają prace nad przełącznikiem języka zestawu.',
    Deutsch:
      'Die Beispiele sind vorübergehend nur auf Polnisch verfügbar! Wir arbeiten an einer Sprachumschaltung von Set.',
    Français: `Les exemples sont temporairement disponibles uniquement en polonais ! Nous travaillons sur un commutateur de langue de l'ensemble.`,
  },
  {
    Polski: 'AGD - kuchnia - gotowanie',
    Deutsch: 'Haushaltsgeräte - Küche - Kochen',
    English: 'Household appliances - kitchen - boiling',
    Français: 'Appareils ménagers - cuisine - bouillir',
  },
  {
    Polski: 'AGD - kuchnia - smażenie',
    Deutsch: 'Haushaltsgeräte - Kochen - Braten',
    English: 'Household appliances - kitchen - frying',
    Français: 'Appareils ménagers - cuisine - friture',
  },
  {
    Polski: 'Boże Narodzenie',
    Deutsch: 'Weihnachten',
    English: 'Christmas',
    Français: 'Noël',
  },
  {
    Polski: 'Boże Narodzenie - Stół wigilijny',
    Deutsch: 'Weihnachten - Der Tisch am Heiligabend',
    English: 'Christmas - The Christmas Eve Table',
    Français: 'Noël - La table de la veillée de Noël',
  },
  {
    Polski: 'Drzewa iglaste występujące w Polsce',
    Deutsch: 'Nadelbäume in Polen',
    English: 'Conifers in Poland',
    Français: 'Les conifères en Pologne',
  },
  {
    Polski: 'Flagi państw i terytoriów zależnych Europy',
    Deutsch: 'Flaggen der europäischen Länder und der abhängigen Territorien',
    English: 'Flags of European countries and dependent territories',
    Français: 'Drapeaux des pays européens et des territoires dépendants',
  },
  {
    Polski: 'Flagi',
    Deutsch: 'Flaggen',
    English: 'Flags',
    Français: 'Drapeaux',
  },
  {
    Polski: 'Kompozytorzy muzyki filmowej',
    Deutsch: 'Komponisten von Filmmusik',
    English: 'Composers of film music',
    Français: 'Compositeurs de musique de film',
  },
  {
    Polski: 'Kompozytorzy muzyki poważnej',
    Deutsch: 'Komponisten klassischer Musik',
    English: 'Classical music composers',
    Français: 'Compositeurs de musique classique',
  },
  {
    Polski: 'Liście drzew',
    Deutsch: 'Baumblätter',
    English: 'Tree leaves',
    Français: "Feuilles d'arbres",
  },
  {
    Polski: 'Maszyny budowlane',
    Deutsch: 'Baumaschinen',
    English: 'Building machines',
    Français: 'Machines de construction',
  },
  {
    Polski: 'Motyle',
    Deutsch: 'Schmetterlinge',
    English: 'Butterflies',
    Français: 'Papillons',
  },
  {
    Polski: 'Najrzadsze zwierzęta świata',
    Deutsch: 'Die seltensten Tiere der Welt',
    English: "World's rarest animals",
    Français: 'Les animaux les plus rares du monde',
  },
  {
    Polski: 'Poczet królów i książąt polskich Jana Matejki',
    Deutsch: 'Polnische Könige und Prinzen von Jan Matejko',
    English: 'Polish Kings and Princes by Jan Matejko',
    Français: 'Rois et princes polonais par Jan Matejko',
  },
  {
    Polski: 'Polskie stroje ludowe',
    Deutsch: 'Polnische Volkstrachten',
    English: 'Polish Folk Costumes',
    Français: 'Costumes folkloriques polonais',
  },
  {
    Polski: 'Rasy kotów',
    Deutsch: 'Rassen von Katzen',
    English: 'Breeds of cats',
    Français: 'Races de chats',
  },
  {
    Polski: 'Układ Słoneczny',
    Deutsch: 'Sonnensystem',
    English: 'Solar System',
    Français: 'Système solaire',
  },
  {
    Polski: 'Wybitni Polacy',
    Deutsch: 'Prominente Polen',
    English: 'Famous Poles',
    Français: 'Polonais célèbres',
  },
  {
    Polski: 'Wyrazy trzyliterowe bez znaków diakrytycznych',
    Deutsch: 'Wörter mit drei Buchstaben ohne diakritische Zeichen',
    English: 'Three letter words without diacritical marks',
    Français: 'Mots de trois lettres sans signes diacritiques',
  },
  {
    Deutsch: 'Tiere',
    Polski: 'Zwierzęta',
    English: 'Animals',
    Français: 'Animaux',
  },
  {
    Deutsch: 'Vorgänge auf der Wortliste ...',
    Polski: 'Operacje na liście słów...',
    English: 'Word list operations...',
    Français: 'Opérations sur la liste des mots...',
  },
  {
    Deutsch: 'Keine Trennlinie in der Kontrollkarte',
    Polski: 'Brak linii oddzielającej w karcie kontrolnej',
    English: 'No dividing line in the control card',
    Français: 'Pas de ligne de séparation sur la carte de contrôle',
  },
];

// Global var :(
var mlrLangInUse;
var updateLanguage;
var mlr = function (_a) {
  var _b = _a === void 0 ? {} : _a,
    _c = _b.dropID,
    dropID = _c === void 0 ? 'mbPOCControlsLangDrop' : _c,
    _d = _b.stringAttribute,
    stringAttribute = _d === void 0 ? 'data-mlr-text' : _d,
    _e = _b.chosenLang,
    chosenLang = _e === void 0 ? 'English' : _e,
    _f = _b.mLstrings,
    mLstrings = _f === void 0 ? MLstrings : _f,
    _g = _b.countryCodes,
    countryCodes = _g === void 0 ? false : _g,
    _h = _b.countryCodeData,
    countryCodeData = _h === void 0 ? [] : _h;
  var root = document.documentElement;
  var listOfLanguages = Object.keys(mLstrings[0]);
  mlrLangInUse = chosenLang;
  (function createMLDrop() {
    var mbPOCControlsLangDrop = document.getElementById(dropID);
    // Reset the menu
    mbPOCControlsLangDrop.innerHTML = '';
    // Now build the options
    listOfLanguages.forEach(function (lang, langidx) {
      var HTMLoption = document.createElement('option');
      HTMLoption.value = lang;
      HTMLoption.textContent = lang;
      mbPOCControlsLangDrop.appendChild(HTMLoption);
      if (lang === chosenLang) {
        mbPOCControlsLangDrop.value = lang;
      }
    });
    updateLanguage = function () {
      console.log('updateLanguage');
      mlrLangInUse =
        mbPOCControlsLangDrop[mbPOCControlsLangDrop.selectedIndex].value;

      resolveAllMLStrings();
      // Here we update the 2-digit lang attribute if required
      if (countryCodes === true) {
        if (!Array.isArray(countryCodeData) || !countryCodeData.length) {
          console.warn('Cannot access strings for language codes');
          return;
        }
        root.setAttribute('lang', updateCountryCodeOnHTML().code);
      }
      document.cookie = `chosenLang=${mlrLangInUse}; expires=Thu, 18 Dec 2080 12:00:00 UTC`;

      if (listOfExamples.style.display !== 'none') {
        sort(listOfExamples);
      }
    };
    mbPOCControlsLangDrop.addEventListener('change', updateLanguage);
  })();
  function updateCountryCodeOnHTML() {
    return countryCodeData.find(function (this2Digit) {
      return this2Digit.name === mlrLangInUse;
    });
  }
  function resolveAllMLStrings() {
    var stringsToBeResolved = document.querySelectorAll(
      '['.concat(stringAttribute, ']')
    );

    stringsToBeResolved.forEach(function (stringToBeResolved) {
      var originaltextContent = stringToBeResolved.innerText
        .replace(/\s+/g, ' ')
        .trim();
      mlrDOMElement = stringToBeResolved;
      var resolvedText = resolveMLString(originaltextContent, mLstrings);

      stringToBeResolved.textContent = resolvedText;
    });
  }
};

function resolveMLString(stringToBeResolved, mLstrings) {
  var matchingStringIndex = mLstrings.find(function (stringObj) {
    // Create an array of the objects values:
    var stringValues = Object.values(stringObj);
    // Now return if we can find that string anywhere in there
    return stringValues.includes(stringToBeResolved);
  });

  if (matchingStringIndex !== undefined) {
    if (matchingStringIndex[mlrLangInUse] !== undefined) {
      return matchingStringIndex[mlrLangInUse];
    } else {
      // console.log(stringToBeResolved);
      stringToBeResolved = matchingStringIndex['English'];
      // If we don't have a match in our language strings, return the original
      return stringToBeResolved;
    }
  }
}

var languageSwitcherInitLaunched = false;
window.addEventListener('DOMContentLoaded', function () {
  let navLang = window.navigator.language.substring(0, 2);
  // console.log(getCookie('chosenLang'));
  // console.log(getCookie('chosenLang') === '');
  // console.log(navLang);
  // console.log(codeArray.includes(navLang));
  if (getCookie('chosenLang') === '') {
    if (codeArray.includes(navLang)) {
      //w Chrome pojawiają się stringi typu pl-PL, a substring(0, 2) zawsze zwróci tylko 2 pierwsze litery
      mlCodes.forEach((el) => {
        if (el.code === navLang) {
          document.cookie = `chosenLang=${el.name}`;
        }
      });
    } else {
      document.cookie = `chosenLang=English`;
    }
  }

  mlr({
    dropID: 'mbPOCControlsLangDrop',
    stringAttribute: 'data-mlr-text',
    chosenLang: getCookie('chosenLang'),
    mLstrings: MLstrings,
    countryCodes: true,
    countryCodeData: mlCodes,
  });
  updateLanguage();
  languageSwitcherInitLaunched = true;
});
