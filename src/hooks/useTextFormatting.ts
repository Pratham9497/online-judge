import { useEffect } from 'react';

const useTextFormatting = (textareaSelector: string) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        let tag = '';
        switch (e.key) {
          case 'b': // Ctrl + B for bold
            e.preventDefault();
            tag = 'b';
            break;
          case 'i': // Ctrl + I for italic
            e.preventDefault();
            tag = 'i';
            break;
          case 'u': // Ctrl + U for underline
            e.preventDefault();
            tag = 'u';
            break;
          case 's': // Ctrl + S for superscript
            e.preventDefault();
            tag = 'sup';
            break;
          case 'd': // Ctrl + D for subscript
            e.preventDefault();
            tag = 'sub';
            break;
          // Add more cases as needed for other formatting options
        }

        if (tag) {
          const activeElement = document.activeElement as HTMLTextAreaElement;
          if (activeElement && activeElement.matches(textareaSelector)) {
            insertTag(activeElement, tag);
          }
        }
      }
    };

    const insertTag = (textarea: HTMLTextAreaElement, tag: string) => {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      const formattedText = `<${tag}>${selectedText}</${tag}>`;

      textarea.setRangeText(formattedText, start, end, 'end');
      // To ensure the cursor is at the end of the inserted text
      textarea.selectionStart = textarea.selectionEnd = start + formattedText.length;
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [textareaSelector]);
};

export default useTextFormatting;
