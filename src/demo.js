import {customElement, processContent, inject} from 'aurelia-framework';
import {addResource} from './inline-loader';
import {fixIndent, decodeHtml, getLanguage} from './utils';
import './demo.css!';

@customElement('demo')
@processContent(false)
@inject(Element)
export class Demo {
  static id = 0;

  id;
  main;
  modules;
  activeModule;

  constructor(element) {
    this.id = Demo.id++;
    this.main = `/inline-modules/${this.id}/${element.getAttribute('main')}`;
    this.modules = [{ name: 'Result', isResult: true }];
    this.activeModule = this.modules[0];

    let moduleElements = element.querySelectorAll('module');
    for (let i = 0; i < moduleElements.length; i++) {
      let moduleElement = moduleElements.item(i);
      let name = moduleElement.getAttribute('name');
      let source;
      if (moduleElement.firstChild.nodeType === 8) {
        source = moduleElement.firstChild.textContent;
      } else {
        source = decodeHtml(moduleElement.innerHTML);
      }
      source = fixIndent(source).trim();
      let language = getLanguage(name);
      addResource(`${System.baseURL}inline-modules/${this.id}/${name}`, source);
      this.modules.push({ name, source, language, isResult: false });
    }
    element.innerHTML = '';
  }
}
