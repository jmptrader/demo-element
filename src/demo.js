import {customElement, processContent, inject, inlineView} from 'aurelia-framework';
import {addResource} from './inline-loader';
import {fixIndent, decodeHtml, getLanguage} from './utils';
import './demo.css!';

const demoView = `
<template>
  <require from="./syntax-highlight"></require>

  <ul class="nav nav-tabs">
    <li role="presentation" repeat.for="module of modules"
        class="\${activeModule === module ? 'active' : ''}">
      <a href="#" click.delegate="activeModule = module">
        \${module.name}
        <small show.bind="module.isResult" class="glyphicon glyphicon-flash"></small>
      </a>
    </li>
  </ul>

  <div class="au-demo-result" show.bind="activeModule.isResult">
    <compose view-model.bind="main"></compose>
  </div>
  <div class="au-demo-code" repeat.for="module of modules.slice(1)" show.bind="activeModule === module">
    <pre><code class="\${module.language}" syntax-highlight>\${module.source}</code></pre>
  </div>
</template>`;

@customElement('demo')
@processContent(false)
@inject(Element)
@inlineView(demoView)
export class Demo {
  static id = 0;

  id;
  main;
  modules;
  activeModule;

  constructor(element) {
    this.id = Demo.id++;
    this.main = `${System.baseURL}inline-modules/${this.id}/${element.getAttribute('main')}`;
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
