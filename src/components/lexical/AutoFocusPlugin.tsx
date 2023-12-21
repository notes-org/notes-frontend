import React from "react";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

/**
 * Plugin to auto focus the LexicalComposer component.
 * Has to be inserted <LexicalComposer> here </LexicalComposer>
 */
function AutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

export default AutoFocusPlugin;
