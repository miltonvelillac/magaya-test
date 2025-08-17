// karma.conf.cjs
module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    browsers: ['ChromeHeadlessNoSandbox, ChromeHeadless'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
      }
    },
    reporters: ['progress', 'kjhtml'],
    client: { clearContext: false },
    singleRun: true,
    autoWatch: false,
    browserNoActivityTimeout: 60000,
    captureTimeout: 120000,
    browserDisconnectTolerance: 2,
  });
};
