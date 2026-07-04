# Lernwörter

Minimalna aplikacja do dyktand zbudowana w React, Vite i Tailwind.

## Funkcje

- Syntezator mowy odczytuje aktualne wyrażenie.
- Użytkownik wpisuje usłyszane wyrażenie i dostaje prostą informację zwrotną.
- Krótki dźwięk oznacza poprawną lub błędną odpowiedź.
- Wyrażenia są przechowywane jako wersjonowany JSON w `localStorage`.
- JSON z wyrażeniami można importować i eksportować z poziomu UI.

## Format JSON

```json
{
  "version": 1,
  "expressions": ["Guten Morgen", "Das ist ein Apfel"]
}
```

## Komendy

```bash
npm install
npm test
npm run build
npm run dev
```

Zgodnie z regułami projektu `npm run dev` należy uruchamiać dopiero po zielonych testach.

## Deploy na GitHub Pages

Deploy uruchamia GitHub Actions tylko po pushu do zdalnej gałęzi `main` na GitHubie. Workflow nie reaguje na zamknięcie pull requesta, żeby po merge nie tworzyć drugiego równoległego uruchomienia dla gałęzi PR.

Po zmergowaniu zmian do lokalnego `main` wypchnij je do GitHuba:

```bash
git push origin main
```

Po tym pushu zakładka GitHub Actions powinna pokazać workflow `Deploy GitHub Pages`, który uruchamia testy, buduje aplikację i publikuje katalog `dist` na GitHub Pages.
