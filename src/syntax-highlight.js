import hljs from 'highlight.js';
import 'highlight.js/styles/github-gist.css!';

export class SyntaxHighlightCustomAttribute {
  static inject = [Element];

  constructor(element) {
    this.element = element;
  }

  attached() {
    //Prism.highlightElement(this.element)
    hljs.highlightBlock(this.element);
  }
}
