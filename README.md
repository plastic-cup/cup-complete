# autocomplete

Easily find words in the English dictionary :)

[![Build Status](https://travis-ci.org/plastic-cup/cup-complete.svg?branch=master)](https://travis-ci.org/plastic-cup/cup-complete)

### Autocomplete Module

* [x] we're gonna, like, import like ... like a list, I guess? and we're gonna put it in an array called 'words'. Cos that's what it'll be. Words.
* [x] Search through list of words for a string and return a list of suggestions
* [x] Record the string that was searched for (for stats and graphs)

### Autocomplete Website

* [x] serve an html page with a search box
* [x] expose the findWords method as an API endpoint
* [ ] display the ***definiton*** of a word when the person clicks/taps (*or navigates using the keyboard arrows -- for extra credits!*) to their desired word
* [ ] display the ***history*** of words people have searched for

##Backend
###Getting at our data
* Using regular expressions to parse Wiki markdown page
* Accessing API with node 'request' module
