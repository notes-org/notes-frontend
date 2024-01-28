import { InitialConfigType } from "@lexical/react/LexicalComposer";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { theme } from "./theme";
import { ParagraphNode } from "lexical";

export const composerBaseConfig: InitialConfigType = {
    editorState: null,
    namespace: 'notes',
    onError: console.error,
    nodes: [
        ParagraphNode,
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        AutoLinkNode,
        LinkNode
    ],
    theme: theme
};