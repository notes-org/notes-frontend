import { Editable, Slate, withReact } from "slate-react";
import { Descendant, createEditor } from "slate";
import { useMemo } from "react";
import { useRenderer } from "./useRenderer";

/**
 * Wraps a minimalist Slate Editor to render a given graph (Descendant[])
 */
export const ReadOnlyEditor = ({ value }: { value: Descendant[]}) => {
    /**
     * Note: I'm relying on Slate and Editable components, but I think we could easily remove this dependency.
     *       Indeed, the functions renderElement and renderLeaf should be enough for a readonly note.
     */
    const editor = useMemo(() => withReact(createEditor()), [])
    const { renderElement, renderLeaf } = useRenderer();
    return (
        <Slate editor={editor} initialValue={value}>
            <Editable
                readOnly
                renderElement={renderElement}
                renderLeaf={renderLeaf}
            />
        </Slate>
    )
}