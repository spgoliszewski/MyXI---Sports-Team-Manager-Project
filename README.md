# MyXI — Menedżer Drużyny Piłkarskiej

## 🇵🇱 Opis projektu

MyXI to aplikacja webowa do zarządzania drużyną piłkarską. Umożliwia prowadzenie kadry, terminarza meczów, statystyk zawodników oraz podstawowych ustawień zespołu.

Projekt został zbudowany w oparciu o React + TypeScript i wykorzystuje `localStorage` do przechowywania danych po stronie przeglądarki.

## Najważniejsze funkcje

- Logowanie menedżera i ochrona tras wymagających autoryzacji.
- Dashboard z podsumowaniem drużyny (m.in. najlepsi zawodnicy, bilans meczów, następny mecz).
- Zarządzanie zawodnikami: lista, profil zawodnika, edycja danych i statystyk.
- Kalendarz/terminarz spotkań oraz obsługa wyników meczów.
- Strony rankingowe: królowie strzelców, najlepsi asystenci, najwięcej i najmniej minut.
- Ustawienia zespołu oraz szybkie wypełnianie przykładowymi danymi.

## Stos technologiczny

- React
- TypeScript
- React Router
- Tailwind CSS
- `sonner` (powiadomienia)
- `localStorage` (persistencja danych)

## Struktura katalogów

- `components/` — komponenty UI, layout oraz funkcje (dialogi, formularze).
- `pages/` — główne widoki aplikacji.
- `lib/` — logika pomocnicza, seed danych i operacje na storage.
- `types/` — definicje typów TypeScript.
- `constants/` — stałe aplikacyjne (np. pozycje zawodników).

## Uruchomienie

1. Przejdź do katalogu głównego projektu (tam, gdzie znajduje się `package.json`).
2. Zainstaluj zależności:

	```bash
	npm install
	```

3. Uruchom aplikację w trybie deweloperskim:

	```bash
	npm run dev
	```

## Uwagi

- Dane są przechowywane lokalnie w przeglądarce.
- W konsoli przeglądarki dostępna jest funkcja pomocnicza do wygenerowania realistycznych danych testowych.

---

# MyXI — Soccer Team Manager

## 🇺🇸 Project overview

MyXI is a web application for managing a soccer team. It helps you manage the squad, match schedule, player statistics, and core team settings.

The project is built with React + TypeScript and uses browser-side `localStorage` for data persistence.

## Key features

- Manager login and protected routes for authenticated views.
- Dashboard with team summary (top players, match record, upcoming match).
- Player management: list, player profile, and editing player data/statistics.
- Match calendar/schedule and match result handling.
- Ranking pages: top scorers, top assisters, most minutes, least minutes.
- Team settings and quick sample data population.

## Tech stack

- React
- TypeScript
- React Router
- Tailwind CSS
- `sonner` (toast notifications)
- `localStorage` (data persistence)

## Folder structure

- `components/` — UI components, layout, and feature components (dialogs, forms).
- `pages/` — main application views.
- `lib/` — helper logic, data seeding, and storage operations.
- `types/` — TypeScript type definitions.
- `constants/` — app constants (e.g., player positions).

## Getting started

1. Go to the project root directory (where `package.json` is located).
2. Install dependencies:

	```bash
	npm install
	```

3. Start the app in development mode:

	```bash
	npm run dev
	```

## Notes

- Data is stored locally in the browser.
- A helper function is exposed in the browser console to populate realistic sample data.