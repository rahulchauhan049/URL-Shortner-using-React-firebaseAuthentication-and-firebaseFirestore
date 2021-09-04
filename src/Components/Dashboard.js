import React, {useState, useRef} from 'react'
import { Button, Navbar, Container, Nav, Table, Form } from 'react-bootstrap'
import { useAuth } from "../Context/AuthContext"
import { useHistory } from "react-router-dom"

function Dashboard() {
    const [error, setError] = useState("")
    const urlRef = useRef();
    const urlIDRef = useRef();
    // const [userUrls, setUserUrls] = useState([])
    const { currentUser, logout } = useAuth()
    const history = useHistory()
    let handleLogout = async () => {
        setError('')

        try {
            await logout()
            history.push('/login')
        } catch {
            setError('Failed to log out')
        }
    }
    
    return (
        <>
            <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Text>
                    Welcome: <b>{currentUser.displayName}</b>
                </Navbar.Text>
                <Nav className="justify-content-end">
                    <Button variant="link" onClick={handleLogout}>Log Out</Button>
                </Nav>
            </Container>
            </Navbar>
            <h1 className="d-flex align-items-center justify-content-center">Create Short URL</h1>
            <div className="m-4">
                <Form className="w-100 p-4">
                    <Form.Group id="url" className="mt-2">
                        <Form.Control type="url" ref={urlRef} required placeholder="Enter Full URL (Example: https://www.calledRahul.com)"/>
                    </Form.Group>
                    <Form.Group id="shortUrl" className="mt-2">
                        <Form.Control type="text" ref={urlIDRef} placeholder="Enter Short URL (Example: protfolio)" />
                    </Form.Group>
                    <Button className="w-100 mt-2" type="submit">Shorten URL</Button>
                </Form>
                
            </div>
            <div style={{marginTop: "10vh"}}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>URL</th>
                        <th>Short URL</th>
                        <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>1</td>
                        <td><a href="http://www.google.com">Google </a></td>
                        <td><a href="http://www.google.com">Google </a></td>
                        <td>1</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default Dashboard
