# EduSwiper

Trwa przebudowa aplikacji z priorytetem poprawnego generowania PDF. Nowa implementacja znajduje się w `web/`; dotychczasowa aplikacja nadal znajduje się w `app.html` i `js/`.

## Nowa wersja — uruchomienie

Wymagany Node.js 24 i npm:

```sh
cd web
npm ci
npm run dev
```

Sprawdzenie:

```sh
npm test
npm run build
```

Test integracyjny wymaga uruchomionego serwera Vite na porcie 5175 i Chromium:

```sh
npm run dev -- --port 5175
# W drugim terminalu, również w web/:
npm run test:browser
npm run test:legacy
npm run test:editor
```

Można użyć systemowego `/usr/bin/chromium`, wskazać `CHROMIUM_PATH` lub zainstalować przeglądarkę przez `npx playwright install chromium`. Wyniki trafiają do ignorowanego `web/test-results/`. GitHub Actions sprawdza PR-y dotyczące `web/`. Osobny workflow `pages.yml` buduje i publikuje aplikację po zmianach na `main`; wymaga wybrania GitHub Actions jako źródła strony w ustawieniach Pages.

## Zaimplementowany etap

- Wersjonowany, walidowany model projektu ze stabilnymi identyfikatorami kart.
- Oryginalne obrazy identyfikowane przez SHA-256; kadry w jednostkach względnych obrazu źródłowego.
- Import starych `.esw` wersji `Prototype_k3d_v3_2templates`: raport migracji, zachowanie oryginałów i pomocniczych danych kadrowania, obsługa osadzonych TTF.
- Zapis i odczyt `.eduswiper` jako ZIP z manifestem JSON i binarnymi zasobami; sprawdzanie rozmiarów i sum kontrolnych przed zastąpieniem pracy.
- Edytor React: ręczne kadrowanie, kolejność kart, historia zmian i responsywny interfejs.
- Podgląd PDF.js rzeczywistego dokumentu, nawigacja stron, zoom i oznaczenie nieaktualnego podglądu.
- Lokalna kopia robocza w IndexedDB, odtwarzana na żądanie; błąd zapisu jest widoczny.
- Import JPEG, PNG i WebP, orientacja EXIF, wyśrodkowany kadr kwadratowy lub dopasowanie całego obrazu.
- Osobne warianty eksportowe do 300 ppi, białe tło przezroczystości, bez sztucznego zwiększania rozdzielczości.
- Trzy układy A4, font Noto Sans, dopasowanie tekstu z kontrolą przepełnienia, linia podziału i tytuł w metadanych PDF.
- Eksport poza głównym wątkiem, postęp, anulowanie i kopia danych z momentu rozpoczęcia.

Interfejs działa w React: karty mają edytowalne podpisy, kolejność i kadry. Kadrowanie obsługuje przeciąganie myszą i dotykiem, zoom oraz klawiaturę. Można cofać i ponawiać zmiany. Podgląd PDF.js renderuje rzeczywisty plik z nawigacją stron i powiększaniem. Nie ma jeszcze dodawania własnych fontów w interfejsie, pokazu slajdów . Schemat nowego formatu nie zastępuje importera starego formatu.

## Dokumentacja

- [Audyt](docs/01-audit.md)
- [Specyfikacja](docs/02-specification.md)
- [Decyzja technologiczna i prototyp](docs/03-pdf-prototype.md)
- [Model projektu i moduł eksportu](docs/04-project-and-export.md)
- [Importer historycznych projektów](docs/05-legacy-import.md)
- [Edytor React i podgląd PDF.js](docs/06-editor.md)
- [Publikacja na GitHub Pages](docs/07-publication.md)

Font i jego informacje licencyjne znajdują się w `web/assets/`. Dane testowe to syntetyczne figury; prywatne zdjęcia nie są dołączane do repozytorium ani wysyłane na serwer. Publiczne wdrożenie na GitHub Pages jest osobnym, niewykonanym jeszcze etapem.
