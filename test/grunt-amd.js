'use strict';

var fs = require('fs');
var exec = require('child_process').exec;
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var opn = require('opn');

var util = require('./support/util');
var defaultAnswers = require('./support/defaultPromtAnswers');

var answers = Object.assign({},defaultAnswers, {
  "buildTool":"Grunt",
  "loadingType": "AMD"
});


describe('Grunt + AMD', function () {

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
        'Gruntfile.js',
        'package.json',
        'bower.json'
      ]);
      assert.noFile([
        'app/scripts/license.js',
        'webpack.config.js',
        'tsconfig.json'
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

    it('succeeds to run production build', function (done) {
      var dir = this.dir;
      exec('npm run production', {cwd: dir}, function(error, stdout, stderr) {
        assert.ok(error === null, "Production build failed: "+error);
        util.maybeOpenInBrowser(dir,done,'dist/index.html');
      });
    });
  });

});
