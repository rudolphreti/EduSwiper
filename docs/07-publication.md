# Publikacja na GitHub Pages

Nowa aplikacja jest budowana z `web/` i publikowana przez `.github/workflows/pages.yml`. Workflow uruchamia się po zmianach aplikacji na `main` lub ręcznie w GitHub Actions. Najpierw instaluje zależności z lockfile, sprawdza formatowanie i testy, buduje Vite, a następnie publikuje wyłącznie `web/dist`. Zdjęcia testowe, lokalne projekty i `node_modules` nie należą do artefaktu strony.

W repozytorium GitHub musi być włączone **Settings → Pages → Build and deployment → Source: GitHub Actions**. Workflow używa uprawnień `pages: write` i `id-token: write` dostarczanych przez GitHub Actions; nie wymaga dodawania osobistego tokena do repozytorium. Ewentualne reguły zatwierdzania środowiska `github-pages` nadal obowiązują.

Domyślny adres projektu bez własnej domeny to `https://rudolphreti.github.io/EduSwiper/`. Jest to adres wynikający z nazwy właściciela i repozytorium; sama jego znajomość nie potwierdza udanego wdrożenia. Potwierdzeniem jest zakończony sukcesem job `deploy` i działająca strona zawierająca oczekiwany `build-info.json` z SHA opublikowanego commita.

Build używa ścieżek względnych; zasoby aplikacji, font i oba rodzaje Workerów działają również pod podkatalogiem. Dane projektu pozostają w przeglądarce użytkownika. Weryfikacja po publikacji powinna obejmować dodanie obrazu, ustawienie kadru, wygenerowanie i pobranie PDF oraz załadowanie podglądu PDF.js.
