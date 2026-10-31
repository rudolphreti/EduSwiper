# Krok 5 — importer plików .esw

Importer obsługuje wersję `Prototype_k3d_v3_2templates`, którą deklarują wszystkie 23 zestawy dołączone do repozytorium. Nie zgaduje formatu nieznanych wersji. Stary plik pozostaje niezmieniony; dalszy zapis tworzy plik `.eduswiper`.

## Zachowane dane

Tytuł zestawu, treść i kolejność kart oraz dokładne bajty osadzonych obrazów JPEG/PNG/WebP. Identyczne pliki współdzielą jeden zasób. Karty dostają stabilne identyfikatory nowego modelu. Układy `4onA4ECO`, `2onA4`, `4onA4classic` przechodzą odpowiednio w `eco`, `classic2`, `classic4`.

Pierwotna nazwa czcionki, stopień pisma i nazwa szablonu są zapisane w `manifest.migration`. Poprawne pomocnicze parametry starego Croppera i per-card fontSize znajdują się w opcjonalnym `card.legacy`; są przenoszone również przy zapisie i ponownym otwarciu nowego formatu. Nie są używane do odgadywania kadru.

## Świadome różnice

Stary zapis zawiera parametry położenia i skali obrazu, ale nie zawiera kompletnego opisu obszaru kadrowania. Dołączone zestawy mają różne wartości odpowiadające różnym geometriom starego edytora. Nowe pola obrazu są kwadratowe. Dlatego bez obietnicy identycznego kadru importer wybiera `contain`: całe zdjęcie na białym tle. Użytkownik może przełączyć kartę na centralny kadr kwadratowy. Ręczne ustawianie kadru będzie częścią docelowego edytora.

Nazwy Calibri, Century Gothic lub Times nie oznaczają osadzenia fontu w projekcie. Bez dostarczonego pliku importer używa dołączonego Noto Sans i wyświetla informację o zamianie. Aktywna „Moja czcionka” wymaga osadzonego poprawnego TrueType TTF; font staje się zasobem nowego projektu i trafia do eksportu PDF. Nieobsługiwany lub uszkodzony aktywny font powoduje błąd całego importu zamiast cichej utraty ustawienia.

Bazowy rozmiar pisma jest przeliczany z px na pt mnożnikiem 0,75, a dla CLASSIC 4 dodatkowo 0,7 zgodnie ze skalowaniem tego układu. Wynik mieści się w zakresie nowego modelu 10–100 pt. Nie odtwarza to wadliwego przeliczenia jednostek starego PDF. Reguły dopasowania tekstu wynikają z nowego silnika, a oryginalna wartość pozostaje w metadanych migracji.

Brak linii podziału nie był zapisywany przez stary serializer; nowy projekt pozostawia domyślne ustawienie. Stan reklam i flagi wdrożeniowe nie należą do danych edukacyjnych i nie są migrowane.

Raport podaje liczbę kart i unikalnych obrazów, zmianę kadrowania, zamianę fontu oraz numery kart z nieprawidłowymi pomocniczymi danymi. Raport i pochodzenie projektu pozostają w nowym archiwum i wracają po ponownym otwarciu lub przywróceniu kopii roboczej.

## Błędy i anulowanie

Import działa w osobnym Workerze, pokazuje postęp kart i daje się anulować. Dopiero ukończony, zwalidowany wynik może zastąpić bieżącą pracę. Zmiana zestawu podczas odczytu blokuje jego zastąpienie. Błąd pojedynczego obrazu przerywa całą operację z numerem karty; nie pomija kart po cichu.

Nieprawidłowe pomocnicze dane kadrowania mogą być pominięte z wyraźnym wpisem w raporcie, ponieważ cały obraz jest zachowany. Niedozwolone URL-e obrazów i SVG nie są pobierane ani wykonywane. Obrazy muszą być osadzone jako base64. Limity nowego modelu nadal obowiązują; plik tekstowy .esw może mieć do 275 MB ze względu na narzut base64.

## Weryfikacja

`npm test`: 33 nazwane przypadki modelu, archiwum, PDF i parsera historycznego. `npm run test:legacy`: testy w Chromium, które zawsze sprawdzają syntetyczny projekt, raport w interfejsie i po ponownym otwarciu archiwum, błąd drugiej karty bez utraty bieżącego zestawu, integralność metadanych, anulowanie oraz osadzony TTF z generowaniem PDF.

Jeżeli katalog `../ready-to-use-sets` istnieje, ten sam test importuje wszystkie jego pliki `.esw`. Dla każdego porównuje tytuł, liczbę i kolejność kart, wszystkie podpisy oraz każdy bajt obrazów źródłowych. W tej przestrzeni roboczej dostępne są 23 projekty zawierające 892 karty; test nie ogranicza się do odczytania JSON. Wyniki zapisuje w ignorowanym `web/test-results/legacy-results.json`.

Build i workflow PR uwzględniają importer. Nie wykonano publikacji na GitHub Pages; nie powstał PR. Ten etap nie obejmuje docelowego edytora ani zgodności z innymi przeglądarkami.
