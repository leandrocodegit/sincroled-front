import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonHighlighter',
  standalone: true
})
export class JsonHighlighterPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '';

    // Transforma o objeto em string indentada
    let json = JSON.stringify(value, null, 2);

    // Escapa caracteres HTML
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Expressão regular para encontrar componentes do JSON
    const regex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g;

    return json.replace(regex, (match) => {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }

      // Envolve o pedaço de texto em um span com a classe correspondente
      return `<span class="${cls}">${match}</span>`;
    });
  }
}
