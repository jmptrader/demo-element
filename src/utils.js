export function fixIndent(source) {
  /*
  This is intended to remove indentation that is not really part of
  the source, to preserve the ability to indent the markup properly.
  In the example below the total indentation will be reduced by 4 characters.
  |
  |<example>
  |  <module>
  |    export class Foo {
  |      bar = 'baz';
  |    }
  |  </module>
  |</example>
  |
  */
  if (source) {
    let result = /^( +)\S/im.exec(source);
    source = source.replace(new RegExp('^ {' + result[1].length.toString() + '}', 'gim'), '');
  }
  return source;
}

export function decodeHtml(html) {
  let txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

const extensionLanguageMap = {
  js: 'javascript',
  html: 'html'
};

export function getLanguage(filename) {
  let extension = (/\.(\w+)$/).exec(filename)[1].toLowerCase();
  return extensionLanguageMap[extension];
}
