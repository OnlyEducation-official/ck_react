// src/EquationPlugin.js
import { Plugin, ButtonView } from 'ckeditor5';

const equationIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
     viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
     class="icon icon-tabler icons-tabler-outline icon-tabler-math-function">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M3 19a2 2 0 0 0 2 2c2 0 2 -4 3 -9s1 -9 3 -9a2 2 0 0 1 2 2"/>
  <path d="M5 12h6"/>
  <path d="M15 12l6 6"/>
  <path d="M15 18l6 -6"/>
</svg>`;

export default class EquationPlugin extends Plugin {
    init() {
        const editor = this.editor;

        // --- Single "Insert Equation" Button ---
        editor.ui.componentFactory.add('insertEquation', (locale) => {
            const button = new ButtonView(locale);
            button.set({
                // label: 'Insert Equation',
                icon: equationIcon,
                withText: true,
                tooltip: true,
            });

            // When clicked → open modal (default: inline mode)
            button.on('execute', () => {
                editor.fire('openEqEditor', { displayMode: false });
            });

            return button;
        });
    }
}
