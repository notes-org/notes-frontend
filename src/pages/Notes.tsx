import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Resource } from "../components/resource";
import { Note } from "../components/note";
import { Editor } from "../components/editor/Editor";
import { Filters } from "../components/filters/Filters";
import { useQuery } from "react-query";
import { RESOURCE_NOT_FOUND, RESOURCE_PLACEHOLDER } from "../mocks/resource";
import { TopBar } from "../components/top-bar";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams } from "react-router-dom";
import { UserLoginButton } from "../components/user/UserLoginButton";
import { useApiClient } from "../hooks/useApiClient";

function Notes() {
  const api = useApiClient();
  /** searchParams as state (we store URL state in it) */
  const [searchParams, setSearchParams] = useSearchParams({ url: '' })
  const url = searchParams.get('url')
  const setURL = (value: string) => {
    setSearchParams({ url: value });
  }
  const { data: resource, error, isLoading } = useQuery(
    [
      'get-resource', {
        url
      }] as const, // const is required to properly infer a type for queryKey
    async (context) => {

      const [_key, params] = context.queryKey;
      if (!params.url) {
        return RESOURCE_PLACEHOLDER;
      }
      const resource_or_null = await api.getOrCreateResource(params.url);
      return resource_or_null ?? RESOURCE_NOT_FOUND;
    },
    {
      initialData: RESOURCE_PLACEHOLDER, // Note: curiously, this does not help to have data always defined.
      placeholderData: RESOURCE_PLACEHOLDER,
    }
  );

  /** Debounced setURL to use when user is typing */
  const setURLDebounced = useDebouncedCallback(setURL, 500);

  return (<>
    <TopBar
      defaultValue={url}
      onChange={setURLDebounced}
      onSubmit={setURL}
      rightContent={
        <UserLoginButton/>
      }
    />
    <Container
      maxWidth={false} sx={{ maxWidth: "800px" }}
    >
      <Box className="h-100">
        {error != null && <h1 style={{ color: 'red' }}>{JSON.stringify(error)}</h1>}
        {isLoading && <h1 style={{ color: 'grey' }}>Loading ...</h1>}
        {resource && <>
          <Resource resource={resource} />
          <Editor resource={resource} />
          <Filters />
          {resource.notes.map((note, idx) => <Note key={idx} note={note} />)}
        </>}
      </Box>
    </Container>
  </>
  );
}

export default Notes;
