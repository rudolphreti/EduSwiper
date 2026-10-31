# Krok 6 — edytor React, ręczne kadrowanie i podgląd PDF.js

Dotychczasowy tymczasowy interfejs `web/src/main.ts` zastąpiły `main.tsx`, `App.tsx`, kontroler `useEditor.ts` i komponenty. Logika archiwum, importu historycznego, lokalnych kopii i generowania PDF pozostaje oddzielona od interfejsu. Katalogi starej aplikacji nie zostały usunięte ani przebudowane.

## Interfejs i praca z kartami

Edytor ma tytuł projektu, zapis i otwieranie plików, przywracanie kopii lokalnej, karty z podpisami oraz panel ustawień wydruku. Zdjęcia można wybrać z urządzenia, przeciągnąć lub wkleić ze schowka poza polem tekstowym. Podpisy pozostają zwykłym tekstem; React nie interpretuje ich jako HTML.

Przyciski na kartach zmieniają kolejność i usuwają kartę. Cofanie i ponawianie obejmuje dane projektu, w tym kadry, kolejność i usunięcia; historia zachowuje do 30 stanów i grupuje pisanie przez krótki okres. Jest historią bieżącej sesji, nie dodatkowym formatem pliku. Skrót Ctrl/Cmd+Z poza polami tekstowymi cofa zmianę, Shift+Ctrl/Cmd+Z ponawia; wewnątrz pola tekstowego pozostaje natywna historia wpisywania. Otwarcie projektu rozpoczyna nową historię.

Po błędzie pliku aktualny projekt pozostaje dostępny. Import nadal pracuje w Workerze i można go anulować. Raport migracji jest wyświetlany z metadanych projektu również po ponownym otwarciu. Lokalna kopia robocza jest zapisywana po krótkiej przerwie w edycji; jej zapis nie oznacza pobrania pliku projektu.

## Kadrowanie

Okno dialogowe pokazuje rzeczywisty kwadratowy kadr. Przeciąganie obsługuje Pointer Events (mysz, dotyk, pióro). Suwak oraz przyciski zmieniają zoom w zakresie 1–8 razy. Strzałki przesuwają zdjęcie, Shift zwiększa krok; Escape i „Anuluj” odrzucają lokalne zmiany. „Wyśrodkuj” przywraca kadr z całym krótszym bokiem źródła. Dopiero „Zastosuj kadr” tworzy jedną zmianę w historii projektu.

Ruch i zoom opisują prostokąt w jednostkach obrazu źródłowego, nie pikselach elementu HTML. Prostokąt zachowuje kwadratowy kształt w pikselach źródła i pozostaje w jego granicach. Miniatura korzysta z tych samych współrzędnych, które następnie otrzymuje rasteryzacja w Workerze eksportu. Oryginał nie jest modyfikowany. Przełączenie na „Cały obraz” nie usuwa zapisanego kadru.

## Podgląd

PDF.js jest ładowany dopiero po przygotowaniu dokumentu. Odczytuje kopię bajtów wygenerowanego PDF; oryginalne bajty nadal służą do pobrania. Osobny Worker PDF.js jest dostarczany z aplikacją, bez CDN. Podgląd nie generuje własnego układu tekstu ani kart.

Dostępne są nawigacja stron, zoom 50–200% względem dopasowania do szerokości oraz tekst strony w rozwijanej sekcji. Renderowanie odbywa się na osobnym buforze Canvas, aby szybkie zmiany zoomu lub strony nie uruchamiały konkurencyjnych operacji na tym samym płótnie. Zmiana dokumentu niszczy poprzednie zadanie PDF.js. Błąd podglądu nie odbiera możliwości pobrania pliku.

Jeżeli zestaw został zmieniony od wygenerowania dokumentu, podgląd i przycisk pobierania informują o starszej wersji. Do odświeżenia służy ponowne generowanie. Eksport korzysta z danych z momentu rozpoczęcia, zachowuje postęp i anulowanie.

## Weryfikacja

- 36 nazwanych testów modelu, archiwum, importera, PDF i geometrii kadru.
- Dotychczasowy test Chromium: zapis, ponowne otwarcie, kopia IndexedDB, zachowanie projektu po błędzie, anulowanie i renderowanie w PDF.js.
- Test importera w nowym interfejsie i pełny korpus 23 plików / 892 kart.
- Test edytora: ustawienie zoomu i przeciągnięcie kadru, zapis współrzędnych, cofnięcie i ponowienie, odrzucenie zmian w dialogu, zmiana kolejności, PDF.js z dwoma stronami, przejście strony i zoom, komunikat nieaktualnego dokumentu, nawigacja zakładek klawiaturą, Escape oraz brak poziomego przepełnienia przy szerokości 390 px.
- Test produkcyjnego builda pod podkatalogiem sprawdza działanie zasobów i Workerów na zasadach wymaganych przez GitHub Pages. Nie jest rzeczywistym wdrożeniem.
- Niezależny odczyt PDF przez PyMuPDF potwierdza, że do dokumentu trafia ręcznie wybrany czerwony obszar testowego obrazu, zamiast jego pierwotnego zielonego środka; sprawdza również polski tekst i dwie strony.

Testy używają syntetycznych obrazów. Zrzuty i dokumenty z testów znajdują się w ignorowanym `web/test-results/`. Workflow PR zawiera również `npm run test:editor`. Nie był uruchomiony na GitHub.

## Dalszy zakres

Pokaz slajdów, biblioteka gotowych zestawów, lista słów i dodatkowe operacje zbiorcze, dodawanie własnej czcionki z interfejsu oraz testy pozostałych przeglądarek i fizycznego wydruku. Podstawowy interfejs pozostaje polskojęzyczny. Ten etap nie publikuje aplikacji i nie tworzy PR-a.
