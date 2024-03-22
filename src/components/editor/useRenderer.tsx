/**
 * Code shared by Editor and ReadOnlyEditor to render a graph.
 */

import { useCallback } from "react"

const Element = ({ attributes, children, element }: any) => {
    const style = { textAlign: element.align }
    switch (element.type) {
        case 'block-quote':
            return (
                <blockquote style={style} {...attributes}>
                    {children}
                </blockquote>
            )

        case 'heading-one':
            return (
                <h1 className="text-lg" style={style} {...attributes}>
                    {children}
                </h1>
            )
        case 'heading-two':
            return (
                <h2 className="text-xl" style={style} {...attributes}>
                    {children}
                </h2>
            )
        case 'list-item':
            return (
                <li style={style} {...attributes}>
                    {children}
                </li>
            )
        case 'bulleted-list':
            return (
                <ul className="list-inside list-disc" style={style} {...attributes}>
                    {children}
                </ul>
            )
        case 'numbered-list':
            return (
                <ol className="list-inside list-decimal" style={style} {...attributes}>
                    {children}
                </ol>
            )
        case 'paragraph':
            return (
                <p style={style} {...attributes}>
                    {children}
                </p>
            )
        default:
            throw new Error('Unhandled case')
    }
}

const Leaf = ({ attributes, children, leaf }: any) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
}

/**
 * Provide two render methods (as callback) to pass to Slate.
 */
export function useRenderer() {

    // Create 2 callback with an empty array for dependencies.
    // Reference will never change, Slate demo code was using this to limit re-render.

    const renderElement = useCallback((props: any) => <Element {...props} />, [])
    const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [])
    
    return {
        renderElement,
        renderLeaf
    }
}