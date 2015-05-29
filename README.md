# autocomplete

Easily find words in the English dictionary :)

[![Build Status](https://travis-ci.org/plastic-cup/cup-complete.svg?branch=master)](https://travis-ci.org/plastic-cup/cup-complete)
[![Code Climate](https://codeclimate.com/github/plastic-cup/cup-complete/badges/gpa.svg)](https://codeclimate.com/github/plastic-cup/cup-complete)
[![Test Coverage](https://codeclimate.com/github/plastic-cup/cup-complete/badges/coverage.svg)](https://codeclimate.com/github/plastic-cup/cup-complete/coverage)

## Why exists?

Exists because learning how to do Node as well as because typing hard so do less but still get word + definition which will be useful. Also serve some stats because Data.

## What is?

Is a website with a type box and when type, words that contain what typed come down. Bit you type in **red**. Click for more about word (e.g. definition). Also, recording lots about what happen on site. We show you about that.

### Autocomplete Module

* [x] we're gonna, like, import like ... like a list, I guess? and we're gonna put it in an array called 'words'. Cos that's what it'll be. Words.
* [x] Search through list of words for a string and return a list of suggestions
* [x] Record the string that was searched for (for stats and graphs)

### Autocomplete Website

* [x] serve an html page with a search box
* [x] expose the findWords method as an API endpoint
* [ ] display the ***definition*** of a word when the person clicks/taps (*or navigates using the keyboard arrows -- for extra credits!*) to their desired word
* [ ] display the ***history*** of words people have searched for


## How make? How run?

### How make

Make with Node and with vanilla javascript (and a teensy bit of jQuery). Use node module `nodemon` to run server and not have to refresh (except sometimes). Use core node modules `fs` and `http` to run server and deal with queries. Backend exposes itself through URL structures and GET requests. Load in text file of words and split it up to array. Has nice methods, filter etc.

* Using regular expressions to parse Wiki markdown page
* Accessing API with node 'request' module

Frontend use JS and event handlers and refactoring. Use bind because timeout!

### How run

Clone repo. Have node. `npm install nodemon` in directory. `npm run nodemon`. Now run! See frontend tests at `/test/test.html`.

### How test?

Backend use `assert` module. Use `istanbul` to ensure full coverage. Use `pre-commit` to ensure `istanbul` and `js-hint` for linting. Frontend use `qUnit`. Use `honor-system` to ensure full coverage.

### BADGE?!

Yes.

### How badge?

Travis check all code for working -- check all tests do pass! Codeclimate check code follow best practices and has full coverage. Full coverage + all tests pass = all code cool.


## Well done

Thanks
