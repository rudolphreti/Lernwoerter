# Lernwörter

Minimalna aplikacja do dyktand zbudowana w React, Vite i Tailwind.

## Funkcje

- Syntezator mowy odczytuje aktualne wyrażenie.
- Użytkownik wpisuje usłyszane wyrażenie i dostaje prostą informację zwrotną.
- Krótki dźwięk oznacza poprawną lub błędną odpowiedź.
- Wyrażenia są przechowywane jako wersjonowany JSON w `localStorage`.
- Listę TXT z wyrażeniami można importować i eksportować z poziomu UI.

## Format TXT importu i eksportu

Każde wyrażenie powinno znajdować się w osobnej linii:

```txt
Guten Morgen
Das ist ein Apfel
```

## Komendy

```bash
npm install
npm test
npm run build
npm run dev
```

Zgodnie z regułami projektu `npm run dev` należy uruchamiać dopiero po zielonych testach.
