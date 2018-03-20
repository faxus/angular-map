Error.stackTraceLimit = Infinity;

// polyfills
import "core-js/es6/reflect";
import "core-js/es7/reflect";
import "zone.js/dist/zone";
import "zone.js/dist/proxy";
import "zone.js/dist/sync-test";
import "zone.js/dist/async-test";
import "zone.js/dist/jasmine-patch";

import { TestBed } from "@angular/core/testing";
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";

var appContext = require.context("./src", true, /\.spec\.ts/);
appContext.keys().forEach(appContext);

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());