# EduSwiper — specyfikacja nowej aplikacji i jakości PDF

Status: założenia robocze do implementacji prototypu, krok 2. Data: 2026-10-31.

## Cel i sposób publikacji

Publiczna aplikacja do przygotowywania edukacyjnych kart obrazkowych, ich drukowania i prezentowania. Priorytetem jest poprawny PDF do wydruku. GitHub jest miejscem przechowywania kodu; przyjmujemy GitHub Pages jako hosting statycznej aplikacji, wdrażanej automatycznie przez GitHub Actions. Publikacja nie jest częścią tego dokumentu i nie została wykonana.

Bez konta i backendu. Prywatne zdjęcia, projekty oraz własne fonty są przetwarzane na urządzeniu. Tylko zestawy świadomie dołączone do publicznego repozytorium stają się publiczne. Kod i zasoby wymagane do edycji i eksportu są dostarczane razem z aplikacją, bez bibliotek wykonywalnych pobieranych w trakcie pracy z zewnętrznych CDN. Publiczne zestawy mogą być pobierane na żądanie. Pełna obsługa offline pozostaje kolejnym etapem, a nie obietnicą pierwszej wersji.

## Zakres funkcjonalny

- Utworzenie zestawu, edycja tytułu, dodawanie wielu zdjęć, podpisy z nazw plików.
- Dodawanie przez wybór plików, przeciąganie i wklejanie; podmiana zdjęcia bez usuwania podpisu.
- Edycja podpisów, wprowadzanie listy słów i kopiowanie listy.
- Zmiana kolejności, usuwanie kart i możliwość cofnięcia ostatnich zmian.
- Kadrowanie: wypełnij obszar z przycięciem, dopasuj cały obraz z tłem, ręczne przesunięcie i zoom. Operacje na jednej lub wszystkich kartach.
- Trzy układy PDF opisane poniżej, wybór fontu i stopnia pisma, podgląd stron oraz pobranie dokumentu.
- Zapis i otwieranie nowego formatu projektu, importer starych plików `.esw`.
- Biblioteka gotowych zestawów, odnośniki do zestawów, tryb prezentacji chroniący przed przypadkową edycją.
- Pokaz slajdów: naprzemiennie podpis i obraz, klawiatura, pełny ekran, jasne i ciemne tło, regulacja tekstu.
- ZIP obrazów; wyraźna opcja oryginałów albo aktualnych kadrów, bez nadpisywania plików o jednakowych nazwach.
- Polski interfejs jako domyślny oraz angielski; układ responsywny i dostępna obsługa klawiaturą.

Reklamy, automatycznie ładowane filmy i promocyjne nagłówki PDF nie należą do pierwszej wersji. Proste oznaczenie zestawu i numeracja stron mogą być opcjonalne.

## Kontrakt wydruku

Jednostką projektu dokumentu jest milimetr. Dokument PDF używa przeliczenia 1 mm = 72/25,4 pt. Rozmiar ekranu, zoom przeglądarki i gęstość pikseli urządzenia nie zmieniają geometrii wydruku.

Poniższe wymiary są świadomie wybranymi punktami startowymi nowej wersji, nie rekonstrukcją starego PDF. Ostatecznie potwierdzi je wzorcowy dokument i próbny wydruk.

| Układ | Papier | Karta kontrolna | Karta obrazkowa | Osobny podpis | Różne obrazy na stronę |
| --- | --- | --- | --- | --- | --- |
| ECO 4 | A4 pionowo 210 × 297 mm | 90 × 130 mm: obraz 90 × 90 + podpis 90 × 40 | 90 × 130 mm: obraz 90 × 90 + podpis 90 × 40 | brak | 2 |
| CLASSIC 2 | A4 poziomo 297 × 210 mm | 130 × 150 mm: obraz 130 × 130 + podpis 130 × 20 | 130 × 150 mm: obraz 130 × 130 + puste pole 130 × 20 | 130 × 20 mm pod kartą kontrolną | 1 |
| CLASSIC 4 | A4 pionowo 210 × 297 mm | 90 × 108 mm: obraz 90 × 90 + podpis 90 × 18 | 90 × 108 mm: obraz 90 × 90 + puste pole 90 × 18 | 90 × 18 mm pod kartą kontrolną | 2 |

Zachowujemy sens dotychczasowych układów: dwie karty obrazkowe na jeden obraz źródłowy, a w CLASSIC dodatkową etykietę do wycięcia. Nowe proporcje ECO upraszczają wspólne kadrowanie do kwadratu; jest to zmiana względem prostokątnego obszaru starego edytora. Import starych kadrów musi tę zmianę ujawniać, nie ukrywać.

Margines bezpieczny minimum 10 mm. Odstęp między kolumnami 5 mm; między kompletami 5 mm. Arkusz wyśrodkowany w obszarze roboczym. Dwa komplety CLASSIC 4 mają wysokość 257 mm, ECO — 265 mm; mieszczą się w 277 mm obszaru roboczego. CLASSIC 2 zajmuje szerokość 265 mm i wysokość 170 mm, mieszcząc się w 277 × 190 mm.

Linie cięcia 0,25 mm, rysowane wewnątrz wymiarów elementów. Podział obrazu i podpisu karty kontrolnej można wyłączyć bez przesuwania zawartości. Tekst ma co najmniej 3 mm wewnętrznego odstępu od granic pola. Puste miejsca ostatniej strony pozostają puste; nie tworzymy dodatkowych kart ani pustych stron.

Dla N > 0 kart źródłowych: CLASSIC 2 generuje N stron; ECO 4 i CLASSIC 4 generują ceil(N/2). Eksport pustego zestawu jest niedostępny z objaśnieniem. Żadna karta, etykieta ani para obraz–podpis nie może przejść na następną stronę.

PDF musi zachować rozmiary MediaBox zgodne z A4. Druk w skali 100%; instrukcja przy eksporcie wyjaśnia wyłączenie „dopasuj do strony”. Kontrola pliku ma tolerancję 0,1 mm; próbny wydruk ocenia oddzielnie wpływ drukarki.

## Typografia

- Tekst pozostaje tekstem PDF: możliwe wyszukiwanie, zaznaczanie i kopiowanie, bez rasteryzowania całej strony.
- Jeden domyślny font z jednoznaczną licencją na dystrybucję i osadzanie; dobór konkretnego fontu nastąpi w prototypie. Nie kopiujemy automatycznie dawnych fontów systemowych.
- Font rzeczywiście użyty w dokumencie jest osadzony. Mierzenie i rysowanie tekstu korzystają z tego samego pliku fontu.
- Bazowy rozmiar 24 pt w CLASSIC 2, 18 pt w CLASSIC 4 i ECO; użytkownik może go zmienić.
- Domyślnie zachowujemy ręczne podziały wiersza i zawijamy po słowach. Długie słowo może być łamane między znakami. Bez automatycznej zmiany treści i bez obcinania tekstu.
- Dopasowanie zmniejsza stopień pisma tylko wtedy, gdy trzeba, do 10 pt. Dalsze przepełnienie blokuje eksport i wskazuje kartę do poprawy. Minimum można później udostępnić jako ustawienie.
- Podpis karty kontrolnej i odpowiadająca mu osobna etykieta mają tę samą treść oraz stopień pisma dobrany do obu pól.
- Polskie znaki, cyfry, interpunkcja, wielowierszowe podpisy i diakrytyki należą do wymaganego zakresu. Brak glifu musi być wykryty przed eksportem. Emoji i złożone pisma spoza tego zakresu otrzymują jasny komunikat, dopóki nie zostaną zweryfikowane.
- Import własnego fontu w pierwszej wersji: TTF/OTF po sprawdzeniu przez wybrany silnik. Błędny lub nieobsługiwany font nie zastępuje dotychczasowego.

## Obrazy i kadry

Obrazy zachowują proporcje. Położenie kadru zapisujemy względem obrazu źródłowego; nie zależy od wymiarów elementu HTML. Karta kontrolna i odpowiadająca jej karta obrazkowa używają identycznego kadru. Przełączanie układów nie niszczy ustawień. Prezentacja domyślnie pokazuje cały obraz, z opcją użycia kadru wydruku.

Docelowa rozdzielczość eksportu wynosi 300 ppi przy fizycznym rozmiarze wydruku. Nie powiększamy sztucznie małych obrazów w celu udawania jakości. Przed eksportem pokazujemy efektywne ppi; poniżej 150 ppi wyświetlamy ostrzeżenie bez automatycznej blokady.

Zdjęcia i grafiki płaskie mogą wymagać różnych metod kompresji. Te same zasoby w dokumencie współdzielą dane obrazu. Zachowujemy oryginały w projekcie, a warianty eksportowe powstają na żądanie. Orientacja EXIF ma być uwzględniona przed kadrowaniem. Przezroczystość otrzymuje przewidywalne białe tło w trybie druku.

Pierwszy obowiązkowy zakres importu to JPEG, PNG i WebP. AVIF i bezpiecznie przetwarzane SVG będą wspierane dopiero po sprawdzeniu zgodności. Animowany GIF oznacza pojedynczą klatkę i wymaga jasnego komunikatu.

## Podgląd i eksport

Podgląd wydruku przedstawia wynik z rzeczywistego PDF, z możliwością powiększania stron. Widok edycji karty może być uproszczony, ale nie jest oznaczany jako wierny podgląd wydruku. Dzięki temu nie utrzymujemy dwóch niezależnych implementacji łamania tekstu.

Eksport pracuje na nieruchomej kopii danych zestawu. Dalsza edycja nie zmienia już generowanego dokumentu. Użytkownik widzi postęp, może anulować operację i otrzymuje czytelny błąd z możliwością ponowienia. Długie przetwarzanie powinno odbywać się poza głównym wątkiem, jeśli wybrany silnik na to pozwala; płynność zweryfikuje prototyp.

## Projekty i bezpieczeństwo pracy

Nowy format ma jawny numer wersji, stabilne identyfikatory kart, oddzielone zasoby i ustawienia wydruku. Import najpierw sprawdza cały plik, dopiero potem zastępuje otwarty zestaw. Niezapisany projekt pozostaje dostępny po błędzie. Kopia robocza w przeglądarce i ostrzeżenie o niezapisanych zmianach uzupełniają ręczny zapis; trzeba obsłużyć brak miejsca na urządzeniu.

Importer `.esw` obsługuje 23 dostarczone przykłady i używaną wersję prototypu. Zachowuje tekst, tytuł, kolejność i obrazy; przy fontach lub kadrach bez jednoznacznego odpowiednika pokazuje raport importu. Nie obiecuje identycznego starego wydruku, bo geometria nowej wersji jest celowo uporządkowana. Oryginalnego pliku nie nadpisuje.

Nazwy pobieranych plików są bezpieczne; duplikaty mają jednoznaczne przyrostki. Tekst z projektów jest traktowany jako tekst, nie HTML. Zewnętrzne adresy zestawów nie otrzymują uprawnień do uruchamiania kodu. Dane obrazów i projektów nie trafiają do logów ani analityki.

## Kryteria odbioru i zestawy wzorcowe

| Przypadek | Sprawdzany wynik |
| --- | --- |
| 0, 1, 2, 3 i 5 obrazów w każdym układzie | Poprawna liczba stron, kolejność, kompletność, brak pustej końcowej strony |
| Podpis krótki, 3 wiersze, długie słowo, pusty podpis | Brak obcięcia, stabilny układ, poprawna obsługa przepełnienia |
| „Zażółć gęślą jaźń”, diakrytyki, symbole i brak glifu | Poprawne glify albo wskazany problem przed eksportem |
| Zdjęcie poziome, pionowe, kwadratowe, EXIF, przezroczystość | Brak rozciągania, zgodność kadru, przewidywalne tło |
| Ten sam projekt na różnych szerokościach ekranu i przy zoomie 80/100/150% | Taka sama geometria i treść PDF; nie wymagamy identycznych bajtów metadanych |
| Dwa kolejne eksporty, zmiana fontu tuż przed eksportem | Brak wyścigów, ten sam oczekiwany wynik |
| Błędny JSON, niepełny projekt, uszkodzony obraz/font | Zachowanie bieżącej pracy i czytelny komunikat |
| 23 stare zestawy, łącznie 892 karty | Raport zgodności importu; bez cichego pomijania kart |
| Największa liczba kart: flagi.esw, 258; największy plik: około 40,5 MB | Zmierzone zużycie pamięci, czas, rozmiar PDF i reakcja na anulowanie |
| Kontrola pliku i wydruk A4 w skali 100% | Wymiary, osadzenie fontów, czytelność, linie cięcia i brak przycięcia przez marginesy |

Prototyp musi dostarczyć trzy wzorcowe PDF-y, po jednym na układ, z mieszanym zestawem obrazów i trudnymi podpisami. Oprócz porównań wizualnych sprawdzamy liczbę stron, tekst, fonty i geometrię. Porównanie obrazów samo nie wystarcza do potwierdzenia wymiarów ani jakości tekstu.

Docelowe czasy i limit pamięci ustalimy po benchmarku na nazwanej konfiguracji urządzenia i przeglądarki. Nie deklarujemy arbitralnych wyników bez pomiaru. Podstawowy zakres przeglądarek: aktualne stabilne Chrome, Firefox, Edge i Safari; mobilny eksport należy sprawdzić oddzielnie.

## Następny etap i kolejność realizacji

Krok 3: porównanie dostępnych rozwiązań generowania PDF pod kątem precyzji, fontów, pomiaru tekstu, wydajności w przeglądarce, zgodności z GitHub Pages, licencji i utrzymania. Potem ograniczony prototyp generujący trzy wzorce i raport pomiarów. Dopiero po wykazaniu jakości eksportu budujemy pełny edytor i wdrożenie.

Ten dokument nie wybiera jeszcze silnika ani frameworka. Dobór technologii wynika z wymagań nowej aplikacji, nie z konstrukcji starego kodu. Nie rozpoczęto implementacji i nie wykonano publikacji.
