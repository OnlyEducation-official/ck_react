// EquationPlugin.js
import { Plugin, ButtonView } from 'ckeditor5';


export default class EquationPlugin extends Plugin {
    init() {
        const editor = this.editor;
        editor.ui.componentFactory.add('insertEquation', locale => {
            const button = new ButtonView(locale);
            button.set({
                label: 'Insert Equation',
                withText: true
            });
            button.on('execute', () => {
                editor.fire('openEqEditor');
            });
            return button;
        });
    }
}
