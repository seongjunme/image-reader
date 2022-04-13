/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!*********************************!*\
  !*** ./src/background/index.ts ***!
  \*********************************/

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({
        isSystemRun: false,
    });
});

/******/ })()
;