// TimestampPlugin.js (JS file)
import { Plugin, ButtonView } from 'ckeditor5'

export class TimestampPlugin extends Plugin {
    init() {
        const editor = this.editor;
        editor.ui.componentFactory.add('timestamp', locale => {
            const button = new ButtonView(locale);
            button.set({ label: 'Timestamp', withText: true });
            button.on('execute', () => {
                const now = new Date();
                editor.model.change(writer => {
                    editor.model.insertContent(writer.createText(now.toString()));
                });
            });
            return button;
        });
    }
}
