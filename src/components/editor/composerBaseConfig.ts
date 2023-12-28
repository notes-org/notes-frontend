import { InitialConfigType } from "@lexical/react/LexicalComposer";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { theme } from "./theme";

export const composerBaseConfig: InitialConfigType = {
    namespace: 'notes',
    // theme: composerTheme, // to override theme if needed
    onError: console.error,
    nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        LinkNode
    ],
    theme: theme
};