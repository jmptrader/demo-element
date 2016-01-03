const resources = {};

export function addResource(url, source) {
  resources[url] = source;
}

// "fetch" logic that will attempt to load inline modules before failing over to the standard logic.
function fetch(load, fetch) {
  let source = resources[load.address];
  if (source) {
    return source;
  }
  return fetch(load);
}

// add the "inline-loader" plugin.
System.set('inline-loader', System.newModule({ fetch }));

// update the "text" plugin to use our "fetch" logic.
System.set(System.normalizeSync('text'), System.newModule({
  'translate': function(load) {
    return 'module.exports = "' + load.source
      .replace(/(["\\])/g, '\\$1')
      .replace(/[\f]/g, '\\f')
      .replace(/[\b]/g, '\\b')
      .replace(/[\n]/g, '\\n')
      .replace(/[\t]/g, '\\t')
      .replace(/[\r]/g, '\\r')
      .replace(/[\u2028]/g, '\\u2028')
      .replace(/[\u2029]/g, '\\u2029')
    + '";';
  },
  'fetch': fetch
}));
