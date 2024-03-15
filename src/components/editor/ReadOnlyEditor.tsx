import { Editable, Slate, withReact } from "slate-react";
import { Descendant, createEditor } from "slate";
import { useCallback, useMemo } from "react";
import { Element, Leaf} from "./rendering";

/**
 * Wraps a minimalist Slate Editor to render a given graph (Descendant[])
 */
export const ReadOnlyEditor = ({ value }: { value: Descendant[]}) => {
    /**
     * Note: I'm relying on Slate and Editable components, but I think we could easily remove this dependency.
     *       Indeed, the functions renderElement and renderLeaf should be enough for a readonly note.
     */
    const editor = useMemo(() => withReact(createEditor()), [])
    const renderElement = useCallback( (props: any) => <Element {...props} />, []) // TODO: typings (any)
    const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []) // TODO: typings (any)
    return (
        <Slate editor={editor} initialValue={value}>
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
            />
        </Slate>
    )
}