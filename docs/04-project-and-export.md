# Krok 4 — model projektu, zasoby i eksport

Nowa implementacja jest teraz częścią repozytorium w `web/`. Wcześniejsze dokumenty i prototyp były poza checkoutem; dokumenty zostały skopiowane do `docs/` jako zapis poprzednich etapów. Ich ścieżki `/workspace/…` opisują poprzednią sesję, a nie katalogi wymagane do uruchomienia nowej aplikacji.

## Format projektu

Rozszerzenie `.eduswiper`, archiwum ZIP: `manifest.json` i `assets/<sha256>`. Manifest `format: eduswiper`, `version: 1` ma tytuł, identyfikator zestawu, uporządkowane karty i ustawienia wydruku. Każda karta ma osobny stabilny identyfikator i odniesienie do źródła obrazu. Identyczne pliki źródłowe współdzielą jeden zasób. Usuwanie ostatniego odniesienia usuwa zasób z projektu w pamięci, bez modyfikowania pliku źródłowego użytkownika.

Kadr jest prostokątem x/y/width/height w zakresie 0–1. Dla trybu cover musi odpowiadać kwadratowi w pikselach obrazu po uwzględnieniu EXIF. Tryb contain pokazuje cały obraz i wypełnia resztę bielą. Wszystkie obecne układy mają kwadratowy obszar obrazu, więc współdzielą ustawienie kadru; zmiana układu go nie modyfikuje.

Limity pierwszej wersji: 1000 kart, 50 MB na zasób, 200 MB łącznie zasobów, 40 mln pikseli na obraz, manifest do 2 MB. Walidacja kontroluje format, wersję, odwołania, unikalność identyfikatorów, wymiary, zakresy kadru i ustawienia. SHA-256 weryfikuje integralność, nie autentyczność autora projektu. ZIP jest sprawdzany przed dopuszczeniem zawartości do aplikacji; niedozwolone ścieżki i nadmierne deklarowane rozmiary są odrzucane. Aplikacja nie wypakowuje plików do systemu plików.

Otwieranie pliku najpierw tworzy i sprawdza nowy projekt. Błąd zachowuje bieżący zestaw. Zmiany dokonane podczas odczytu pliku powodują przerwanie zastępowania. Przed zastąpieniem niezapisanego zestawu interfejs prosi użytkownika o potwierdzenie. Kopia robocza jest zapisywana transakcyjnie w IndexedDB; użytkownik może ją jawnie przywrócić. Zapis lokalny nie jest kopią w chmurze ani pobranym plikiem.

## Moduły

- `project.ts`: schemat, walidacja integralności, tworzenie projektu, kadry i referencje zasobów.
- `archive.ts`: przenośny zapis i odczyt.
- `storage.ts`: kopia robocza na urządzeniu.
- `images.ts`: import oryginałów, geometria i warianty obrazu do PDF.
- `pdf.ts`: geometria dokumentu i tekst; niezależny od DOM.
- `pdf.worker.ts`: przygotowanie obrazów, generowanie dokumentu i komunikaty postępu.
- `export.ts`: odizolowana kopia projektu, cykl życia Workera, wynik, błędy i AbortSignal.
- `main.ts`: tymczasowy interfejs integracyjny. Nie wyznacza architektury docelowych komponentów edytora.

Wariant eksportowy nie powiększa obrazu ponad dostępną liczbę pikseli. Obraz źródłowy pozostaje niezmieniony. Przezroczystość jest składana na białym tle. PNG pozostaje PNG; pozostałe obsługiwane obrazy trafiają do JPEG z jakością 0,92. Dwie kopie tej samej karty w PDF korzystają z jednego zasobu. Obsługa fontów w interfejsie ogranicza się obecnie do dołączonego Noto Sans; model ma miejsce na font TTF, ale samodzielne dodawanie fontu wymaga kolejnego etapu.

Postęp obejmuje przygotowanie obrazów i skład dokumentu. Anulowanie kończy Worker. Edycja po rozpoczęciu eksportu nie zmienia jego danych; interfejs oznacza wynik jako pochodzący ze wcześniejszego stanu. Pobieranie używa nazwy zestawu z momentu rozpoczęcia eksportu.

## Weryfikacja

`npm test` uruchamia nazwane przypadki modelu i PDF, a nie tylko test pliku. `npm run test:browser` sprawdza rzeczywiste API przeglądarki, w tym IndexedDB, Web Worker i Canvas. Testy używają syntetycznych obrazów z kolorowymi pasami, przezroczystością i EXIF; nie wymagają publikowania zdjęć ze starych zestawów. W tym etapie przeszło 28 nazwanych testów, kontrola TypeScript i build produkcyjny. Test Chromium potwierdził zapis/odczyt archiwum, odtworzenie IndexedDB po przeładowaniu, zachowanie kart po błędzie pliku, anulowanie podczas pracy Workera i odizolowanie danych eksportu od późniejszej edycji. Porównanie pikseli potwierdziło centralny kadr, białe tło trybu contain i orientację EXIF. Niezależna kontrola PyMuPDF sprawdziła 12 dokumentów generatora oraz dokument pobrany z przeglądarki: liczbę stron, A4, liczbę obrazów, polski tekst i osadzenie fontu.

Workflow `web-checks.yml` przygotowuje testy PR na GitHub; nie był uruchomiony zdalnie i nie wykonuje wdrożenia. Lokalne powodzenie nie jest dowodem działania w innych przeglądarkach ani poprawności fizycznego wydruku.

## Dalszy zakres

Importer historycznych `.esw`, ręczna edycja kadru i docelowy interfejs React, PDF.js, dodatkowe przeglądarki, większe zestawy, dostępność, pokaz slajdów i publikacja. Nie migrowano starych danych kadrowania bez sprawdzenia ich znaczenia. Nie usunięto dotychczasowego kodu aplikacji.
