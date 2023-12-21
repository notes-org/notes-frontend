
function NotFound() {
    const queryParameters = new URLSearchParams(window.location.search);
    const url = queryParameters.get("url");
    
    return <div>
        <p>The resource you're looking for is not found.</p>
        <p>URL: {url}</p>
    </div>
}

export default NotFound