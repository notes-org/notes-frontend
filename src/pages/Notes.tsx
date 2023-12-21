import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Resource } from "../components/resource";
import { Note } from "../components/note";
import { Editor } from "../components/editor/Editor";
import { useQuery } from "react-query";
import { ApiClient } from "../utils/ApiClient";
import { RESOURCE_NOT_FOUND, RESOURCE_PLACEHOLDER } from "../mocks/resource";

function Notes() {
  const { data: resource, error, isLoading } = useQuery(
    [
      'get-resource', {
        url: new URLSearchParams(window.location.search).get("url")
      }] as const, // const is required to properly infer a type for queryKey
    async (context) => {

      const [_key, params] = context.queryKey;
      if (!params.url) {
        console.error("Url is empty or null");
        return RESOURCE_NOT_FOUND;
      }
      const resource_or_null = await ApiClient.getOrCreateResource(params.url);
      return resource_or_null ?? RESOURCE_NOT_FOUND;
    },
    {
      initialData: RESOURCE_PLACEHOLDER, // Note: curiously, this does not help to have data always defined.
      placeholderData: RESOURCE_PLACEHOLDER,
    }
  );

  return (
    <Container maxWidth={false} sx={{ maxWidth: "650px" }}>
      <Box>
        {error != null && <h1 style={{ color: 'red' }}>{JSON.stringify(error)}</h1>}
        {isLoading && <h1 style={{ color: 'grey' }}>Loading ...</h1>}
        {resource != undefined && <>
          <Resource resource={resource} />
          <Editor resource={resource} />
          {resource.notes.map((note, idx) => <Note key={idx} note={note} />)}
        </>
        }
      </Box>
    </Container>
  );
}

export default Notes;
