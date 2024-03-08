import { api } from "../../types/api";

export type EditorProps = {
    resource: api.Resource;
    /** Triggered when a new note is created */
    onCreateNote: (note: api.Note) => void;
}
  