import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ROUTER_PATH } from "../config";

function Home() {

  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  /** Redirects to the resource page with the user defined URL */
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {

    event.preventDefault();

    // Temporary solution.
    // Apply simple checks on URL before to redirect. 
    // Ideally we want to check that using a schema when the form changes (see Formik package)

    if (!url) {
      alert(`URL field is not set!\n(url: '${url}')`)
    } else if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('www.')) {
      alert(`URL field is not an url`)
    } else {
      navigate(`${ROUTER_PATH.NOTES}?url=${url}`)
    }
  }

  const handleUrlChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setUrl(event.currentTarget.value);
  }

  return (
    <div className="p-3">
      <div >
        <h1>Home</h1>
      </div>
      <form onSubmit={handleSubmit} className="mt-3">
        <h1 className="mb-3">Enter an url and hit Enter or press the Submit button.</h1>
        <div className="flex gap-2">
          <label>URL: </label>
          <input name="url" type="string" defaultValue={url} onChange={handleUrlChange} placeholder="Enter and url ..." />
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

export default Home