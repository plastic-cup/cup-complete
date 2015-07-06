# autocomplete

Easily find words in the English dictionary :)

[![Build Status](https://travis-ci.org/plastic-cup/cup-complete.svg?branch=master)](https://travis-ci.org/plastic-cup/cup-complete)
[![Code Climate](https://codeclimate.com/github/plastic-cup/cup-complete/badges/gpa.svg)](https://codeclimate.com/github/plastic-cup/cup-complete)
[![Test Coverage](https://codeclimate.com/github/plastic-cup/cup-complete/badges/coverage.svg)](https://codeclimate.com/github/plastic-cup/cup-complete/coverage)

## What?

A small dictionary web app with autocomplete functionality - provides suggestions for words before you've finished typing them.  Word defintions are pulled from Wiktionary.  

Server is written in pure Node.

### Autocomplete Module

* [x] Import a list of words from a file on Node server.
* [x] Search through list of words for a string and return a list of suggestions
* [x] Record the string that was searched for (for stats and graphs)

### Autocomplete Website

* [x] Serve an html page with a search box
* [x] Expose the findWords method as an API endpoint
* [x] Display the ***definition*** of a word when the person clicks/taps (*or navigates using the keyboard arrows -- for extra credits!*) to their desired word
* [ ] Display the ***history*** of words people have searched for


### How is it made?

Made with Node and with vanilla javascript (and a teensy bit of jQuery). Use node module `nodemon` to run server. Use core node modules `fs` and `http` to run server and deal with queries. Backend exposes itself through URL structures and GET requests. Load in text file of words and split it up to array. Has nice methods, filter etc.

* Using regular expressions to parse Wiki-flavoured markdown page
* Accessing API with node 'request' module

Frontend use JS and event handlers and refactoring. Use bind because timeout!

### How run?

Clone repo.

`npm install`

Run with: `nodemon server.js`!

See frontend tests at `/test/test.html`.

### How test?

Backend use `assert` module. Use `istanbul` to ensure full coverage. Use `pre-commit` to ensure `istanbul` and `js-hint` for linting. Frontend use `qUnit`. Use `honor-system` to ensure full coverage.

### BADGE?!

Travis check all code for working -- check all tests do pass! Codeclimate check code follow best practices and has full coverage. Full coverage + all tests pass = all code cool.
