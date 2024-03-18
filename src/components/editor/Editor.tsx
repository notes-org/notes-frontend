import React, { useMemo, FormEventHandler, useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import { EditorProps } from "./types";
import { useApiClient } from "../../hooks/useApiClient";
import { Button, Icon, IconButton } from '@mui/material'
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import isHotkey from 'is-hotkey'
import {
  Editor as SlateEditor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
  BaseEditor,
} from 'slate'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import { withHistory } from 'slate-history'
import { useRenderer } from './useRenderer'

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
} as const; // "const" required to get compile-time checks

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']
const DEFAULT_VALUE: Descendant[] = [{
  type: 'paragraph',
  children: [
    { text: '' }
  ],
} as Descendant ];

function Editor( { resource, onCreateNote }: EditorProps ) {

  const [value, setValue] = useState<Descendant[]>(DEFAULT_VALUE);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => !resource.locked && setOpen(true);
  const handleClose = () => setOpen(false);
  const [status, setStatus] = useState<string | null>(null);
  const api = useApiClient();
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const { renderElement, renderLeaf } = useRenderer();

  useEffect( () => {
    if (!open) setStatus(null)
  }, [open])

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    setStatus("Submitting...")
    const newNote = await api.createNote({ content: value }, resource);
    if ( newNote ) {
      // TODO: handle errors
      setOpen(false);
      setValue(DEFAULT_VALUE);
      onCreateNote(newNote)
    }
    setStatus( newNote ? "Submitted" : "Oups, we're unable to submit...")
  };

  const handleChange = (value: Descendant[]): void => {
    console.debug("Editor change:", { value});
    setValue(value);
  }

  const handleCancel = () => {
    // Clear value before to close
    setValue(DEFAULT_VALUE);
    setOpen(false);
  }

  return (
    <>
      <Box sx={{ paddingX: 3, paddingY: 4, borderBottom: 1, borderColor: "grey.300" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid
            item
            xs
            container
            justifyContent="space-between"
            onClick={handleOpen}
            sx={{ cursor: "text" }}
          >
            <Typography variant="subtitle1" color="text.secondary">
            {!resource.locked ? "Have any context to add?" : "Sorry, this resource can't be edited ..."}
            </Typography>
            {!resource.locked && <EditIcon sx={{ color: "text.secondary" }}/>}
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}       
      >
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            className="flex flex-col gap-2"
            onSubmit={handleSubmit}
          >
            <Slate editor={editor} initialValue={value} onChange={handleChange}>
              <Box>
                <MarkButton format="bold" icon="format_bold" />
                <MarkButton format="italic" icon="format_italic" />
                <MarkButton format="underline" icon="format_underlined" />
                <MarkButton format="code" icon="code" />
                <BlockButton format="heading-one" icon="looks_one" />
                <BlockButton format="heading-two" icon="looks_two" />
                <BlockButton format="block-quote" icon="format_quote" />
                <BlockButton format="numbered-list" icon="format_list_numbered" />
                <BlockButton format="bulleted-list" icon="format_list_bulleted" />
                <BlockButton format="left" icon="format_align_left" />
                <BlockButton format="center" icon="format_align_center" />
                <BlockButton format="right" icon="format_align_right" />
                <BlockButton format="justify" icon="format_align_justify" />
              </Box>
              <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Type something here..."
                spellCheck
                autoFocus
                className="flex-auto"                
                onKeyDown={event => {
                  let hotkey: keyof typeof HOTKEYS;
                  for (hotkey in HOTKEYS) {
                    if (isHotkey(hotkey, event as any)) {
                      event.preventDefault()
                      const mark = HOTKEYS[hotkey]
                      toggleMark(editor, mark)
                    }
                  }
                }}
              />
            </Slate>
            <Box className="flex-200px flex gap-2 justify-end">
              <Button variant="outlined" onClick={handleCancel}>Cancel</Button>              
              <Button variant="contained" type="submit">Submit</Button>
            </Box>
            <p>{status}</p>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

const toggleBlock = (editor: BaseEditor, format: any) => { // TODO: typings (any)
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !SlateEditor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes((n as any).type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })
  let newProperties: Partial<SlateElement>
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    } as any
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    } as any
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor: BaseEditor, format: any) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    SlateEditor.removeMark(editor, format)
  } else {
    SlateEditor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor: BaseEditor, format: any, blockType = 'type'): boolean => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    SlateEditor.nodes(editor, {
      at: SlateEditor.unhangRange(editor, selection),
      match: _node => 
        !SlateEditor.isEditor(_node) &&
        SlateElement.isElement(_node) &&
        (_node as any)[blockType] === format // TODO: typings (any)
    })
  )

  return !!match
}

const isMarkActive = (editor: BaseEditor, format: string) => {
  const marks: any = SlateEditor.marks(editor) // TODO: typings (any)
  return marks ? marks[format] === true : false
}

const BlockButton = ({ format, icon }: any) => { // TODO: typings (any)
  const editor = useSlate()
  return (
    <IconButton    
      size="small"  
      /** This is supposed to show a feedback of the state, but does not work
       * disabled={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}   */
      onMouseDown={(event: any) => { // TODO: typings (any)
        event.preventDefault()
        toggleBlock(editor, format)
      }}
      title="Work in progress..."
    >
      <Icon>{icon}</Icon>
    </IconButton>
  )
}

const MarkButton = ({ format, icon }: any) => { // TODO: typings (any)
  const editor = useSlate();
  return (
    <IconButton
      size="small"  
      /** This is supposed to show a feedback of the state, but does not work       
      disabled={!isMarkActive(editor, format)} */
      onMouseDown={ (event: any) => { // TODO: typings (any)
        event.preventDefault()
        toggleMark(editor, format)
      }}
      title="Work in progress..."
    >
      <Icon>{icon}</Icon>
    </IconButton>
  )
}

export { Editor };
