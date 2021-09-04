import React, {useState, useRef} from 'react'
import { Button, Navbar, Container, Nav, Table, Form, Alert} from 'react-bootstrap'
import { useAuth } from "../Context/AuthContext"
import { useHistory } from "react-router-dom"
import {db} from "../firebase"
import {v4} from "uuid"
function Dashboard() {
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
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

    let handleSubmit = (event) => {
        event.preventDefault();
        setError("")
        setMessage("")
        setLoading(true);
        db.collection('urlShortner').doc('userUrls').collection("urls").where("shortUrl", "==", urlIDRef.current.value).get()
            .then(async (querySnapshot) => {
                if (querySnapshot.empty) {
                    let users = await db.collection('urlShortner').doc('userUrls').collection("users").get()
                    console.log(users)
                    let userExists = false
                    let id = v4()
                    users.forEach(async (user) => {
                        if (user.id === currentUser.uid) {
                            
                            userExists = true
                            let urlsArray = user.data().urls
                            await user.ref.update({
                                urls: [id ,...urlsArray]
                            })
                            
                        }
                    })
                    if (!userExists) {
                        db.collection('urlShortner').doc('userUrls').collection("users").doc(currentUser.uid).set({
                            urls: [id]
                        })
                    }
                    db.collection('urlShortner').doc('userUrls').collection("urls").doc(id).set({
                        count: 1,
                        shortUrl: urlIDRef.current.value,
                        url: urlRef.current.value
                    })
                    setMessage(`Short URL Created Successfully. You can visit it at localhost/3000/${urlIDRef.current.value}`)
                } else {
                    setError('Short URL already exists, please create another one')
                }
                          
            })
        setLoading(false)
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
            {error && <Alert variant="danger">{error} </ Alert>}
            {message && <Alert variant="success">{message} </ Alert>}
            <div className="m-4">
                <Form className="w-100 p-4" onSubmit={handleSubmit}>
                    <Form.Group id="url" className="mt-2">
                        <Form.Control type="url" ref={urlRef} required placeholder="Enter Full URL (Example: https://www.calledRahul.com)"/>
                    </Form.Group>
                    <Form.Group id="shortUrl" className="mt-2">
                        <Form.Control type="text" ref={urlIDRef} required placeholder="Enter Short URL (Example: protfolio)" />
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
