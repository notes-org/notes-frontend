import BaseButton from "@mui/material/Button";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { EditorState } from "lexical/LexicalEditorState";
import React from "react";

/**
 * Add a submit button to a Lexical Composer
 * Has to be inserted <LexicalComposer> here </LexicalComposer>
 */
function SubmitButtonPlugin( props: { onSubmit: (editorState: EditorState) => void }) {
  const [editor] = useLexicalComposerContext();
  const handleSubmit: React.FormEventHandler<HTMLButtonElement> = (event: React.FormEvent) => {
    props.onSubmit(editor.getEditorState());
    event.preventDefault();
  }
  return <BaseButton type="submit" onClick={handleSubmit} fullWidth>Submit</BaseButton>;
}

export default SubmitButtonPlugin;
