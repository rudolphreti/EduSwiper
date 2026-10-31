# EduSwiper — audyt przed przebudową

Data: 2026-10-31. Repozytorium: rudolphreti/EduSwiper, commit c737131521a0e05deb377526d63d6ee0a51ad354.
Zakres: krok 1 — analiza obecnej aplikacji, zapisu projektów i eksportu PDF. Bez zmian kodu aplikacji i bez wyboru nowego stosu technologicznego.

## Wniosek

Największym problemem jest powiązanie dokumentu PDF z chwilowym stanem edytora: strukturą DOM, czcionką dopasowaną w pikselach i aktywnymi instancjami Croppera. Nowy eksport potrzebuje niezależnego opisu danych, reguł geometrii strony i własnego pomiaru tekstu. Sama wymiana interfejsu ani aktualizacja biblioteki nie zapewnią poprawnego wydruku.

Dodatkowo wszystkie trzy aktywne generatory wywołują niezdefiniowane globalne `createPdf(...)`, podczas gdy używana biblioteka udostępnia `pdfMake.createPdf(...)`. Jest to błąd kodu, niezależny od problemów z dostępem do CDN.

## 1. Obecna konstrukcja

- Statyczna aplikacja uruchamiana przez `app.html`, bez backendu, menedżera zależności, procesu budowania i własnego zestawu testów.
- Globalne zmienne i funkcje, zależność od kolejności skryptów, obsługa zdarzeń częściowo w HTML.
- Stan rozproszony między `cardSet`, `instanceArray`, DOM i zmiennymi globalnymi.
- Biblioteki: pdfmake 0.2.0, Cropper (lokalnie), Swiper 7, textFit 2.4.0, FileSaver 2.0.0, JSZip 3.7.1, spin.js 2.3.2. Część ładowana z CDN; Swiper wskazuje wersję główną, bez dokładnego przypięcia wydania.
- `ready-to-use-sets/app.html` i `style.css` stanowią dodatkową kopię interfejsu. Względne odwołania do `js/` z tej kopii nie odpowiadają strukturze repozytorium; przy migracji trzeba ustalić, czy ta kopia była w ogóle używaną stroną.

## 2. Funkcje do zachowania

1. Tworzenie zestawu z wielu obrazów, dodawanie i podmiana obrazów, przeciąganie i wklejanie.
2. Edycja tytułu i podpisów kart; operacje na liście słów i kopiowanie do schowka.
3. Kadrowanie i powiększanie obrazów; zbiorowe wyśrodkowanie z przycięciem albo dopasowanie do obszaru.
4. Usuwanie kart i przełączanie trybu edycji.
5. Trzy układy wydruku, w tym karty kontrolne oraz osobne podpisy w układach CLASSIC.
6. Wybór czcionki i rozmiaru, dopasowanie tekstu, import własnej czcionki.
7. Zapis i odczyt projektów `.esw`, biblioteka gotowych zestawów, otwieranie zestawu przez parametr URL.
8. Pokaz slajdów z tekstem i obrazem, pełny ekran, obsługa klawiatury, tryb ciemny i rozmiar tekstu.
9. Eksport obrazów do ZIP i wersje językowe interfejsu.

Nie należy automatycznie przenosić reklam, tekstów promocyjnych, stopki PDF ani filmów pomocy jako wymagań nowego produktu. Trzeba zdecydować o nich oddzielnie. Pokaz slajdów i ZIP używają obrazów źródłowych, natomiast PDF — wyników kadrowania; tę różnicę trzeba zachować świadomie lub zmienić w specyfikacji.

## 3. Jak powstaje PDF

`downloadPdfFn()` wybiera generator na podstawie `selectTemplate.value`. Generator pobiera obraz z `getCroppedCanvas().toDataURL()`, tekst z elementów sąsiadujących z kontenerem Croppera i rozmiar z `span.style.fontSize`. Następnie składa tabelę pdfmake i uruchamia pobranie.

| Wariant | Zawartość | Strona i podział | Geometria wpisana w kod |
| --- | --- | --- | --- |
| 4 na A4 ECO | Na każdy obraz dwie karty z podpisami; opcja linii pomiędzy obrazem a podpisem karty kontrolnej | A4 pionowo, jedna długa tabela; podział automatyczny | Kolumny 278 pt, obraz 263 × 263 pt, wiersze 278 i 120 pt |
| 2 na A4 CLASSIC | Obraz z podpisem, obraz bez podpisu oraz osobny podpis | A4 poziomo, tabela na każdy obraz, jawny podział po każdej tabeli | Kolumny 390 pt, obraz 380 × 310 pt, wiersze 325/65/65 pt |
| 4 na A4 CLASSIC | Dwa takie komplety na stronę; ostatni może być pojedynczy | A4 pionowo, tabela na parę obrazów, jawny podział po każdej tabeli | Kolumny 275 pt, obraz 247 × 215,65 pt, wiersze 225/50/50 pt na komplet |

Nazwy „2” i „4” dotyczą wydrukowanych kart obrazkowych, nie liczby różnych obrazów źródłowych. Dla N obrazów zamierzona liczba stron to odpowiednio: CLASSIC 2 — N; CLASSIC 4 — ceil(N/2); ECO — około ceil(N/2), ale obecny kod polega na automatycznym łamaniu tabeli. To intencja do potwierdzenia, a nie zmierzony wynik renderowania.

`layouts/4inA4.js` jest pozostałością poprzedniego rozwiązania: nie jest aktywnie wczytywany w głównym HTML. Nie stanowi czwartego dostępnego szablonu. Funkcja `endpage()` również nie jest aktywnie dodawana przez obecne generatory.

## 4. Potwierdzone problemy i ich znaczenie

### Blokujące eksport lub zagrażające danym

- **Niezdefiniowane `createPdf`.** Dotyczy wszystkich aktywnych generatorów. Odtworzono `ReferenceError` w izolowanym wykonaniu Node VM z atrapami interfejsu i prawidłowym miejscem API `pdfMake.createPdf`. To test ścieżki kodu, nie pełny test przeglądarkowy biblioteki.
- **Import usuwa bieżący zestaw przed walidacją.** `openProject()` wywołuje `destroyAll()` przed parsowaniem JSON. Brak obsługi błędu parsowania i walidacji schematu. Uszkodzony plik może pozbawić użytkownika bieżącej pracy.
- **Font ładuje się poza kontrolą eksportu.** `getFont()` w `vfs_fonts.js` używa `fetch`, nie zwraca obietnicy gotowości, nie sprawdza statusu HTTP. Eksport nie czeka na ukończenie. Przy imporcie własnego fontu `font.load()` również nie jest oczekiwane.

### Jakość i przewidywalność PDF

- **Rozmiar tekstu pochodzi z CSS w px, a trafia jako liczba do PDF w pt.** CLASSIC 4 dodatkowo mnoży go przez 0,7. Brak jawnego przeliczenia jednostek i ponownego dopasowania tekstu według metryk PDF.
- **Podgląd edytora nie jest podglądem wydruku.** ECO: obszar obrazu w edytorze ma 278 × 240 px, PDF wymusza kwadrat 263 × 263 pt. CLASSIC: edytor 390 × 325 px, PDF 380 × 310 pt lub 247 × 215,65 pt. Proporcje nie są identyczne; wymuszenie szerokości i wysokości może zniekształcić obraz.
- **Wyrównanie pionowe używa prywatnych danych pdfmake.** `vertical-aligment.js` odczytuje i modyfikuje `_inlines`, `_calcWidth`, `_height`, `_margin`. Aktualizacja silnika może zmienić te szczegóły.
- **Brak strategii jakości obrazów.** Eksport Canvas bez zadanych wymiarów i parametrów kodowania, domyślnie PNG. Brak docelowego DPI, limitu rozdzielczości i polityki dla zdjęć, rysunków i przezroczystości. Nie zmierzono rzeczywistego DPI gotowych PDF-ów.
- **Brak kontroli niepodzielności całej karty ECO.** `dontBreakRows` chroni pojedynczy wiersz; obraz i podpis są różnymi wierszami. Kod nie ustanawia reguły utrzymania ich razem.
- **Niejednolita geometria i paginacja.** Trzy osobne implementacje powtarzają nagłówki, stopki, rozmiary i obsługę pobierania. Jawne `pageBreak: 'after'` występuje także na końcu zawartości. Ewentualną pustą stronę końcową należy sprawdzić na wynikowym PDF-ie; nie została tu potwierdzona.
- **Brak pełnej obsługi błędów eksportu.** Spinner kończy się w callbacku sukcesu; brak wspólnej obsługi wyjątków, anulowania i ochrony przed równoległymi eksportami.
- **Praca na głównym wątku.** `setTimeout(..., 20)` opóźnia rozpoczęcie, ale nie przenosi obróbki obrazów poza wątek interfejsu. Wpływ na czas i pamięć wymaga pomiaru.

### Edytor i zgodność danych

- Dane kadrowania są zapisywane z opóźnieniem 500 ms po zdarzeniach ruchu i zoomu. Zapis wykonany wcześniej może nie zawierać ostatniego ustawienia.
- Przełączenie szablonu niszczy i odtwarza Croppery; nowa konfiguracja w `templates.general()` nie rejestruje tych samych zdarzeń zapisu kadru co pierwotna inicjalizacja. Istnieje ścieżka utraty kolejnych zmian kadrowania w zapisanym projekcie.
- Po dodawaniu obrazów kod odtwarza tablicę danych kart i oba warianty kadrowania na podstawie aktualnego stanu. Może nadpisać wcześniej niezależne kadry drugiego układu.
- Import fontów dopuszcza w HTML TTF/OTF/WOFF/WOFF2/SVG/EOT, ale plik jest bez konwersji przekazywany również do PDF. Zgodność każdego formatu z silnikiem PDF nie jest zweryfikowana.
- Filtr wyboru obrazów i walidator nie zgadzają się: HTML dopuszcza SVG, walidator go odrzuca; walidator dopuszcza AVIF, którego nie ma w filtrze HTML.
- Brak aktywnego ostrzeżenia o niezapisanej pracy — odpowiedni fragment jest zakomentowany.

## 5. Format `.esw` i migracja

To zwykły JSON, nie archiwum. Zestaw zawiera `version`, `title`, `fontType`, `baseFontSize`, `template`, `cards`; opcjonalnie `customFont` oraz `setUploadedOnServer`. Karta zawiera `imgDataUri`, `word`, `templatesData.ECO4onA4` i `templatesData.CLASSIC2onA4`. Niektóre karty mają również starsze `canvasData` i `fontSize`.

Obrazy i ewentualny font są osadzone jako data URI/base64. Kadrowanie zapisuje parametry Canvas Croppera, a nie niezależny od ekranu prostokąt w pikselach obrazu źródłowego. Oba szablony CLASSIC współdzielą jeden wariant kadru. Ustawienie linii podziału karty ECO nie jest zapisywane przez `updateCardSetObject()`.

Przeczytano wszystkie 23 dostarczone projekty: 892 karty, jedna deklarowana wersja `Prototype_k3d_v3_2templates`; 15 projektów CLASSIC 4, 5 CLASSIC 2, 3 ECO. Każdy plik był poprawnym JSON-em. Rozmiary wynoszą około 0,89–40,50 MB; zestaw `flagi.esw` ma 258 kart. To realny materiał do późniejszych testów wydajności i kompatybilności, nie dowód poprawnego otwierania/renderowania wszystkich kart.

Importer nowej wersji powinien zachowywać oryginały, kolejność, podpisy, tytuł, font i kadry; mieć jawne wersjonowanie i walidację. Nie wolno z góry zakładać, że stare `getCanvasData()` da się bezstratnie przeliczyć bez odtworzenia geometrii starego edytora. Należy ustalić regułę migracji i sprawdzić ją na przykładach. Brak stabilnych identyfikatorów kart trzeba uwzględnić przy konwersji.

## 6. Co sprawdzono i czego nie potwierdzono

Wykonano przegląd HTML, styli, przepływów edytora, wszystkich aktywnych generatorów oraz zapisu i odczytu projektów. Przeczytano 23 pliki danych. Izolowany test trzech generatorów potwierdził brak globalnego `createPdf`.

Nie wykonano pełnego renderowania PDF, porównania wizualnego, testu wydruku, oceny pokrycia znaków fontów ani pomiaru czasu i pamięci. Wcześniejszy etap konfiguracji potwierdził blokadę CDN przez proxy; zapisanie list dozwolonych domen w konfiguracji nie dowodzi zastosowania ich w bieżącej maszynie. Ustalenia dotyczące prywatnych API, jednostek i proporcji wynikają z kodu; skutki wizualne należy zmierzyć na dokumentach po usunięciu blokad. Nie poprawiano kodu na potrzeby audytu.

## 7. Dane wejściowe do następnego kroku

Przed wyborem silnika PDF należy ustalić:

- Dokładne fizyczne wymiary kart, marginesów i linii cięcia; wymagania zwykłych drukarek A4.
- Czy zachowujemy wszystkie trzy układy i które elementy karty pozostają po wycięciu.
- Zasady dla długich podpisów, ręcznych podziałów wiersza, minimalnego stopnia pisma i przepełnienia.
- Czy kadr ma być identyczny w podglądzie, PDF i pokazie slajdów; osobne kadry dla różnych proporcji.
- Docelową jakość obrazu, maksymalny rozmiar pliku i skalę zestawów do obsłużenia.
- Obsługiwane fonty, znaki, formaty importu oraz prawa do osadzania i dystrybucji dołączonych fontów.
- Wymóg działania lokalnie/offline lub możliwość generowania na serwerze.

Krok 2 powinien zakończyć się zaakceptowaną specyfikacją i wzorcowymi stronami. Dopiero krok 3 porówna silniki na tych samych przypadkach. Ten audyt nie uzasadnia jeszcze wyboru frameworka ani konkretnej biblioteki PDF.
