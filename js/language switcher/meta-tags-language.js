function metaTagsLanguage(desc, kw, title, lang) {
  /*function meta(name,atr,value) {
      document.querySelector(name).setAttribute(atr, value);
    }*/

  document
    .querySelector('meta[name="description"]')
    .setAttribute('content', desc);
  document.querySelector('meta[name="keywords"]').setAttribute('content', kw);
  document
    .querySelector('meta[property="og:title"]')
    .setAttribute('content', desc);
  document
    .querySelector('meta[property="og:title"]')
    .setAttribute('content', title);
  document
    .querySelector('meta[property="og:description"]')
    .setAttribute('content', desc);
  document
    .querySelector('meta[property="twitter:title"]')
    .setAttribute('content', title);
  document
    .querySelector('meta[property="twitter:description"]')
    .setAttribute('content', desc);
  document
    .querySelector('meta[http-equiv="content-language"]')
    .setAttribute('content', lang);
}

var kwPl = `'karty trójdzielne szablon', 'karty trójdzielne PDF', 'Karty Montessori do pobrania za darmo', 'darmowe zestawy karty trójdzielne', 'darmowe karty trójdzielne', 'darmowe zestawy kart trójdzielnych', 'karty trójdzielne do pobrania','aplikacja do tworzenia kart trójdzielnych', 'aplikacje dla dzieci', 'aplikacje dla nauczycieli', 'aplikacje do nauki czytania', 'aplikacje edukacyjne', 'czytanie', 'czytanie dla dzieci', 'czytanie globalne', 'dla dzieci', 'doman', 'domanowanie', 'dzieci', 'dzieci czytają', 'edukacja', 'edukacja dla dzieci', 'edukacja wczesnoszkolna', 'eduswiper ', 'fiszki', 'jak nauczyć dziecko czytać', 'karty montessori', 'kartypracy', 'kartytrójdzielne', 'pomoce Montessori tanio', 'karty Montessori', 'karty ze zwierzętami Montessori', 'pomoce Montessori do druku', 'karty trójdzielne aplikacja', 'klasy 1-3', 'kreatywni nauczyciele', 'kreatywni rodzice', 'maluch czyta', 'materiały edukacyjne', 'metoda Domana', 'metoda montessori', 'montessori', 'nauczanie początkowe', 'nauka czytania', 'nauka czytania aplikacja', 'nauka czytania małego dziecka ', 'nauka języków', 'pedagogika', 'pedagogika montessori', 'pedagogika przedszkolna', 'pedagogika wczesnoszkolna', 'pomoce dydaktyczne', 'pomoce edukacyjne', 'pomoce szkolne', 'przedszkole', 'rodzicielstwo', 'szkoła', 'szkoła podstawowa', 'zabawa w czytanie'`;

var kwDe = `'dreiteilige Karten Vorlage', 'dreiteilige Karten PDF', 'Montessori-Karten kostenloser Download', 'kostenlose dreiteilige Karten Sets', 'kostenlose 'dreiteilige Karten Sets', 'dreiteilige Karten Download', 'dreiteilige Karten erstellen App', 'Apps für Kinder', 'Apps für Lehrer', 'Apps zum Lesenlernen', 'Bildungs-Apps', 'Lesen', 'Lesen für Kinder', 'Globales Lesen', 'für Kinder', 'doman', 'Kinder', 'Kinder lesen', 'Bildung', 'Bildung für Kinder', 'frühkindliche Bildung', 'eduswiper', 'Lernkarteien', 'wie man einem Kind das Lesen beibringt', 'montessori cards Arbeitsblätter', 'Quizkarten', 'billige Montessori-Hilfsmittel', 'Montessori-Karten', 'Montessori-Tierkarten', 'ausdruckbare Montessori-Karten', 'Quizkarten-Anwendung', 'Klassen 1-3', 'kreative Lehrer', 'kreative Eltern', 'Kleinkind liest', 'pädagogische Materialien', 'Doman-Methode', 'Montessori-Methode', 'Montessori', 'frühkindliche Erziehung', 'Lesen lernen Anwendung', 'Lesen lernen Kleinkind', 'Sprachen lernen', 'Pädagogik', 'Montessori-Pädagogik', 'Vorschulpädagogik', 'Frühkindliche Pädagogik', 'Didaktische Hilfsmittel', 'Pädagogische Hilfsmittel', 'Schulische Hilfsmittel', 'Kindergarten', 'Erziehung', 'Schule', 'Grundschule', 'Lesespaß', '3-teilige Karten Vorlage', '3-teilige Karten PDF', 'kostenlose '3-teilige Karten Sets', 'kostenlose '3-teilige Karten Sets', '3-teilige Karten Download', '3-teilige Karten erstellen App'`;

var kwEng = `'three part cards template', 'three part cards pdf', 'montessori cards free download', 'free three part cards sets', 'free 'three part cards sets', 'three part cards download', 'creating three part cards app', 'apps for kids', 'apps for teachers', 'apps for learning to read', 'education apps', 'reading', 'reading for kids', 'global reading', 'for kids', 'doman', 'kids', 'kids reading', 'education', 'education for kids', 'early childhood education', 'eduswiper', 'flashcards', 'how to teach a child to read', 'montessori cards worksheets', 'quiz cards', 'cheap montessori materials', 'montessori cards', 'montessori animal cards', 'printable montessori cards', 'quiz card application', 'grades 1-3', 'creative teachers', 'creative parents', 'kid reads', 'educational materials', 'doman method', 'montessori method', 'montessori', 'early childhood education', 'learn to read application', 'learn to read kid', 'learn languages', 'montessori education', 'preschool education', 'early childhood education', 'didactic tools', 'educational tools', 'school tools', 'kindergarten', 'education', 'school', 'elementary school', 'reading fun', '3-part cards template', '3-part cards pdf', 'free '3-part cards sets', 'free '3-part cards sets', '3-part cards download', 'creating 3-part cards app'`;

function metaTagsLanguageSwitcher() {
  switch (mbPOCControlsLangDrop.value) {
    case 'Polski':
      metaTagsLanguage(
        'Aplikacja (prototyp) do szybkiego tworzenia schematycznych materiałów dydaktycznych. Obecnie można za jej pomocą tworzyć karty trójdzielne Montessori w trzech szablonach i przeglądać kolekcje za pomocą slajdera.',
        kwPl,
        'EduSwiper - Szybkie tworzenie schematycznych materiałów dydaktycznych, karty trójdzielne Montessori',
        'pl'
      );
      break;
    case 'Deutsch':
      metaTagsLanguage(
        'Eine Anwendung (Prototyp) zur schnellen Erstellung von schematischen Unterrichtsmaterialien. Derzeit kann man damit dreiteilige Montessori-Karten in drei Vorlagen erstellen und die Sammlungen mit einem Slider durchsuchen.',
        kwDe,
        'EduSwiper - Schnelle Erstellung von schematischen Unterrichtsmaterialien, dreiteilige Montessori-Karten',
        'de'
      );
      break;
    case 'English':
      metaTagsLanguage(
        'An application (prototype) for the quick creation of schematic teaching materials. Currently, you can use it to creating Montessori three-part cards in three templates and view the collections using the slider.',
        kwEng,
        'EduSwiper - Quick creation of schematic educational materials, Montessori three-part cards',
        'en'
      );
      break;
  }
}
