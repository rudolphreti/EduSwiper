# EduSwiper — decyzja technologiczna i wynik prototypu PDF

Krok 3, 2026-10-31. Prototyp: `/workspace/eduswiper-pdf-prototype`. Stary kod aplikacji pozostawiono bez zmian. Nie wykonano publikacji na GitHub ani GitHub Pages.

## Decyzja

Rekomendowany stos pełnej aplikacji: TypeScript, React, Vite, generator jsPDF w Web Workerze, PDF.js do podglądu wynikowego dokumentu. Dane projektu i zasoby niezależne od komponentów UI. IndexedDB do kopii roboczych i binarnych zasobów; wersjonowany przenośny format projektu. GitHub Actions do testów i budowania; GitHub Pages do statycznego hostingu. W pierwszym prototypie wdrożono TypeScript, Vite, jsPDF, fontkit i Worker. React, PDF.js, IndexedDB oraz workflow publikacji nie są jeszcze zaimplementowane.

Nie istnieje jedna najlepsza biblioteka PDF do wszystkich zastosowań. Dla tej aplikacji najważniejsza jest kontrolowana geometria kart, metryki fontów i wykonywanie bez serwera. Wybór oparto na tych wymaganiach i działającym prototypie, nie na dotychczasowym stosie.

## Porównanie rozwiązań

Sprawdzono wersje i daty modyfikacji publikacji w npm: jsPDF 4.2.1 (2026-03), pdfmake 0.3.13 (2026-10), React-pdf renderer 4.9.0 (2026-08), pdf-lib 1.17.1 (2022-05). Są to informacje o publikacjach pakietów; sama data nie dowodzi jakości ani stanu całego projektu. Nie przeprowadzono pełnego benchmarku wszystkich czterech silników. Praktycznie uruchomiono jsPDF.

| Rozwiązanie | Zalety dla EduSwiper | Koszt lub ograniczenie | Decyzja |
| --- | --- | --- | --- |
| jsPDF | Jawna geometria w mm, fonty TTF, metryki, tekst wektorowy, obrazy, praca w przeglądarce | Własne reguły zawijania i paginacji; konieczne testy znaków i pomiarów | Wybrane do prototypu; testy potwierdziły zakres opisany poniżej |
| pdf-lib | Precyzyjne operacje na PDF, osadzanie fontów, dobre dopasowanie do rysowania stałych kart | Ostatnie wydanie npm znacznie starsze; również wymaga własnego składu tekstu | Możliwa alternatywa, bez przewagi wykazanej w tym etapie |
| pdfmake | Deklaratywny dokument, tabele i automatyczny przepływ tekstu | Stałe karty wymagają rygorystycznego panowania nad automatycznym podziałem; nie wolno opierać się na prywatnych polach | Nie wybrano; błędy starego kodu nie oznaczają, że biblioteka jest zła |
| React-pdf | Komponentowy opis dokumentów, fonty i silnik układu | Dodatkowa warstwa layoutu dla małego zestawu stałych geometrii; osobny sposób renderowania od edytora | Nie wykazano potrzeby tej warstwy w prototypie |
| HTML i druk przeglądarki / serwerowy Chromium | Wygodny skład HTML/CSS | Dialog i różnice ustawień wydruku; wariant serwerowy wymaga infrastruktury poza Pages | Nie jako główny generator pobieranego pliku |
| Zrzut HTML do obrazu, potem PDF | Łatwy pozorny odpowiednik widoku | Rasteryzacja tekstu, zależność od ekranu, słabsza jakość i większe pliki | Odrzucone |

Dokumentacja referencyjna: https://github.com/parallax/jsPDF ; https://pdf-lib.js.org/ ; https://pdfmake.github.io/docs/ ; https://react-pdf.org/ ; https://mozilla.github.io/pdf.js/ ; https://vite.dev/guide/static-deploy.html#github-pages . W tym etapie informacje o API sprawdzano również w zainstalowanych pakietach i przez wykonanie kodu.

## Co powstało

- Czysty generator w `src/pdf.ts`, bez dostępu do DOM, CSS i sieci.
- Trzy geometrie z kroku 2; pięć kart z krótkim, wielowierszowym i długim podpisem oraz podpisem pustym.
- Osadzony Noto Sans na licencji OFL; sprawdzanie obecności znaków przez fontkit.
- Dopasowanie podpisu według szerokości i metryk fontu, minimalnie 10 pt; brak miejsca powoduje wskazanie karty i błąd zamiast obcięcia.
- Współdzielenie tego samego obrazu między dwiema kartami na stronie.
- Ostrzeżenia dla efektywnej rozdzielczości poniżej 150 ppi, bez sztucznego powiększania oryginału.
- Prosta strona testowa i Worker generujący pobieralny PDF. Podgląd prototypu korzysta z wbudowanego czytnika przeglądarki; nie jest jeszcze docelowym podglądem PDF.js.
- Produkcyjny build z relatywnymi ścieżkami; przetestowany pod adresem z podkatalogiem odpowiadającym zasadzie hostingu projektowego na Pages. Nie stanowi to testu rzeczywistego wdrożenia na GitHub.

Wzorce: `output/eco.pdf`, `output/classic2.pdf`, `output/classic4.pdf`. Zbiorczy raster: `output/overview.png`. Wzorce są materiałem do oceny, a nie zatwierdzonym wzorcem drukarskim.

## Wyniki pomiarów i testów

- `npm test`: 21 kontroli przeszło — trzy układy, puste zestawy, liczby kart 1/2/3/5, przepełnienie podpisu i brakujący znak w foncie.
- `npm run build`: kontrola TypeScript i build produkcyjny przeszły. Vite zgłasza większe fragmenty bundla: około 798 kB Workera przed gzip i około 1 MB kodu strony zawierającego próbne dane obrazów. Przed pełną aplikacją trzeba oddzielić zasoby zestawów od kodu i ograniczyć ładowanie do potrzebnych modułów.
- Chromium: sześć eksportów z produkcyjnego builda, szerokości 390 i 1280 px, po trzy układy. Brak błędów JavaScript; pobranie dokumentów działa.
- `scripts/verify.py`: 18 porównań dokumentów przeszło. Sprawdzono liczbę stron, wymiary A4 z tolerancją 0,1 mm, boki obrazów 90/130 mm, bezpieczne marginesy obrazów, osadzone dane fontu, obecność i powielenie podpisów oraz liczbę obrazów. Tekst mieści się na stronie i nie spada poniżej 10 pt.
- Wyniki z Chromium i Node.js mają identyczne obrazy stron przy rasteryzacji PyMuPDF, niezależnie od dwóch sprawdzonych szerokości okna. To nie jest test Safari, Firefoxa ani fizycznego urządzenia mobilnego.
- `pdffonts` potwierdził font NotoSans: osadzony, mapa Unicode; narzędzie nie oznacza go jako podzbioru. Skuteczność ograniczania danych fontu wymaga osobnej weryfikacji.
- Dla pięciu kart: ECO 3 strony, CLASSIC 2 — 5 stron, CLASSIC 4 — 3 strony; pliki około 793 kB. Worker w Chromium: 79–105 ms w sześciu sprawdzonych eksportach. Pomiar nie obejmuje pobrania fontu, pobierania pliku i renderowania podglądu.
- Benchmark istniejącego `flagi.esw`, po oddzielnym przygotowaniu kwadratowych kadrów: 258 kart, 129 stron CLASSIC 4, 516 wystąpień obrazu, PDF 4 449 125 bajtów. Generator Node.js: 196 ms; maksymalny RSS całego procesu około 213 MB. Node 24.19.0, Linux x64 w tej maszynie. Nie jest to limit pamięci samego generatora ani prognoza dla telefonu.
- 249 ostrzeżeń niskiej rozdzielczości w benchmarku. Źródłowych obrazów nie powiększano, więc pomiar nie dowodzi gotowości całego zestawu do druku 300 ppi.
- Obejrzano zbiorczy raster z krótkimi/długimi podpisami i niepełną ostatnią stroną. Nie wykonano fizycznego wydruku ani automatycznego porównania ze wzorcem zatwierdzonym przez użytkownika.

Surowe metryki: `output/metrics.json`, `output/browser-metrics.json`, `output/benchmark.json`.

## Granice prototypu i następny etap

Nie zaimplementowano pełnego edytora, importera `.esw`, autosave, docelowego formatu projektu, obsługi własnych fontów, interaktywnego kadrowania, pełnego preprocessingu obrazów, postępu/anulowania w interfejsie ani publikacji. Użyte obrazy są wyśrodkowanymi kwadratowymi kadrami przygotowanymi ze starych zestawów, a nie migracją zapisanych historycznych kadrów.

Najbliższy krok to model danych projektu i docelowy moduł PDF: osobne źródła obrazów i kadry, ustawienia wydruku, walidacja, warianty eksportowe do 300 ppi, kompletne komunikaty błędów i obsługa anulowania. Następnie importer starych projektów oraz integracja edytora. Przed produkcją pozostają testy innych przeglądarek, przypadków obrazów i fontów, praw do publikowanych zasobów oraz próbny wydruk.

Nie deklarujemy „perfekcyjnego PDF” na podstawie samego prototypu. Udowodniono kluczowe możliwości wybranej technologii i sprawdzono trzy układy w opisanym zakresie.
