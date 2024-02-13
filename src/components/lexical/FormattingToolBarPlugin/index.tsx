import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_CRITICAL } from "lexical";
import { useCallback, useEffect, useState } from "react";
import { $isRootOrShadowRoot } from "lexical";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import Box from '@mui/material/Box';
import { FormControl, InputLabel, OutlinedInput, MenuItem } from "@mui/material";
import Select from "@mui/material/Select";
import { $isLinkNode } from '@lexical/link';
import { $isTableNode } from '@lexical/table';
import {
  $findMatchingParent,
  $getNearestNodeOfType,
} from '@lexical/utils';
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  // INSERT_ORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingTagType,
} from '@lexical/rich-text';
import {
  $setBlocksType,
} from '@lexical/selection';
import {
  $createParagraphNode,
} from 'lexical';
import { LexicalEditor } from 'lexical/LexicalEditor';
import { getSelectedNode } from "../utils/getSelectedNode";

const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
} as const;

const rootTypeToRootName = {
  root: 'Root',
  table: 'Table',
} as const;

export type BlockFormatDropDownProps = {
  editor: LexicalEditor,
  blockType: keyof typeof blockTypeToBlockName;
  rootType: keyof typeof rootTypeToRootName;
  disabled?: boolean;
}

export function BlockFormatDropDown({
  blockType,
  editor,
  // rootType,
  // disabled = false,
}: BlockFormatDropDownProps): JSX.Element {

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };


  const formatCheckList = () => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  // const formatNumberedList = () => {
  //   if (blockType !== 'number') {
  //     editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  //   } else {
  //     editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  //   }
  // };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  }
  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }
      }>
        <InputLabel id="style-label" > Style </InputLabel>
        < Select
          labelId="style-label"
          id="style"
          input={< OutlinedInput label="Name" />}
          value={blockType}
          variant="outlined"
        >
          <MenuItem
            value="paragraph"
            onClick={formatParagraph}
          >
            Paragraph
          </MenuItem>

          < MenuItem
            value="h1"
            onClick={() => formatHeading('h1')}
          >
            Heading 1
          </MenuItem>

          < MenuItem
            value="quote"
            onClick={formatQuote}
          >
            Quote
          </MenuItem>

          < MenuItem
            value="check"
            onClick={formatCheckList}
          >
            CheckList
          </MenuItem>

        </Select>
      </FormControl>
    </div>
  );
}

/**
 * Plugin to insert into <LexicalComposer> here <LexicalComposer />
                      * To add a formatting toolbar to Lexical.
                      */
export function FormattingToolBarPlugin() {

  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [rootType, setRootType] = useState<BlockFormatDropDownProps['rootType']>("root");
  const [blockType, setBlockType] = useState<BlockFormatDropDownProps['blockType']>("paragraph");
  const [, setSelectedElementKey] = useState("")
  const [, setIsLink] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
            const parent = e.getParent();
            return parent !== null && $isRootOrShadowRoot(parent);
          });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        setRootType('table');
      } else {
        setRootType('root');
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
        }
      }

    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, $updateToolbar]);
  
  return (
    <Box>
      <BlockFormatDropDown
        editor={editor}
        blockType={blockType}
        rootType={rootType}
      />
    </Box>
  )
}
