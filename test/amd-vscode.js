'use strict';

var fs = require('fs');
var exec = require('child_process').exec;
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var opn = require('opn');

var util = require('./support/util');
var defaultAnswers = require('./support/defaultPromtAnswers');

var answers = Object.assign({},defaultAnswers, {
  "buildTool":"none",
  "loadingType": "AMD",
  "advancedOptions": [
    "Visual Studio Code integration",
    "Use yfiles-typeinfo.js"
  ]
});


describe('AMD + VS Code', function () {

  this.timeout(55000);

  before(function(done) {
    var that = this;
    this.app = helpers
      .run(require.resolve('../generators/app'))
      .withGenerators([[helpers.createDummyGenerator(),require.resolve('../generators/class')]])
      .withOptions({
        'skip-welcome-message': true,
        'skip-message': true,
        'skip-install': false
      })
      .withPrompts(answers).then(function(dir) {
        that.dir = dir;
        done();
      })
  });

  describe('check files', function() {
    it('generates base files', function () {
      assert.file([
        'app/index.html',
        'app/scripts/app.js',
        'app/styles/yfiles.css',
        'bower.json',
        'jsconfig.json',
      ]);
      assert.noFile([
        'tsconfig.json',
        'package.json',
        'Gruntfile.js',
        'app/scripts/license.js',
        'webpack.config.js'
      ]);
    });

  });

  describe('build result', function() {

    it('installed bower files', function() {
      assert.file([
        'bower_components/requirejs/require.js'
      ]);
    });

    it('runs', function (done) {
      util.maybeOpenInBrowser(this.dir,done);
    });

  });

});
