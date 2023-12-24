import { Button, Container, Box } from "@mui/material"
import { useNavigate } from "react-router-dom"

function NotFound() {
    const navigate = useNavigate()
    return (
        <Container
            maxWidth={false}
            sx={{ maxWidth: '400px' }}
        >
            <Box
                className="m-5 flex flex-col gap-5"
            >
                <h1 className="text-3xl">404 - Not Found</h1>
                <p>Sorry... the page you're looking for does not exist ({window.location.href})</p>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                >Go Home</Button>
            </Box>
        </Container>
    )
}

export default NotFound