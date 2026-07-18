import { useEffect, useRef } from 'react';
import s from './Admin.module.scss';

export default function RichTextEditor({ value, onChange }) {
  const editor = useRef(null);
  useEffect(() => {
    if (editor.current && editor.current.innerHTML !== value) editor.current.innerHTML = value || '';
  }, [value]);

  function command(name, argument) {
    editor.current?.focus();
    document.execCommand(name, false, argument);
    onChange(editor.current?.innerHTML || '');
  }

  function addLink() {
    const url = window.prompt('Адрес ссылки (https://…)');
    if (url) command('createLink', url);
  }

  return (
    <div>
      <div className={s.editorToolbar}>
        <button type='button' onClick={() => command('formatBlock', 'p')}>P</button>
        <button type='button' onClick={() => command('formatBlock', 'h2')}>H2</button>
        <button type='button' onClick={() => command('bold')}><b>Ж</b></button>
        <button type='button' onClick={() => command('italic')}><i>К</i></button>
        <button type='button' onClick={() => command('insertUnorderedList')}>• Список</button>
        <button type='button' onClick={addLink}>Ссылка</button>
        <button type='button' onClick={() => command('unlink')}>Убрать ссылку</button>
      </div>
      <div
        ref={editor}
        className={s.editor}
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
      />
    </div>
  );
}
