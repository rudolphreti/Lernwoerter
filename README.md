# Lernwörter

Minimalna aplikacja do dyktand zbudowana w React, Vite i Tailwind.

## Funkcje

- Syntezator mowy odczytuje aktualne wyrażenie, a głos można wybrać w menu.
- Użytkownik wpisuje usłyszane wyrażenie i dostaje prostą informację zwrotną.
- Krótki dźwięk oznacza poprawną lub błędną odpowiedź. Po poprawnej odpowiedzi aplikacja przechodzi do kolejnego wyrażenia i odczytuje je po sekundzie.
- Wyrażenia są przechowywane jako wersjonowany JSON w `localStorage`.
- Plik TXT z wyrażeniami można importować i eksportować z poziomu UI bez podglądu treści w aplikacji.

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
