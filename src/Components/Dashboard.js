import React, {useState, useRef, useEffect} from 'react'
import { Button, Navbar, Container, Nav, Table, Form, Alert} from 'react-bootstrap'
import { useAuth } from "../Context/AuthContext"
import { useHistory } from "react-router-dom"
import {db} from "../firebase"
import {v4} from "uuid"
function Dashboard() {
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [userUrls, setUserUrls] = useState([])
    const urlRef = useRef();
    const urlIDRef = useRef();
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    useEffect(() => {
        async function getUserData() {
            await db.collection('urlShortner').doc('userUrls').collection("users").where("id", "==", currentUser.uid).get()
                .then(async (querySnapshot) => {
                    if (!querySnapshot.empty) {
                        let urls = []
                        querySnapshot.forEach((snapshot) => {
                            urls = snapshot.data()?.urls
                        })
                        urls.forEach((url) => {
                            db.collection('urlShortner').doc('userUrls').collection("urls").where("id", "==", url).get()
                                .then(querySnapshot => {
                                    querySnapshot.forEach((snapshot) => {
                                        setUserUrls(oldArray => {
                                            let arr = oldArray.filter((arr) => arr.id !== snapshot.data().id)
                                            return [...arr,snapshot.data()]
                                        });
                                    })

                                })
                        })
                    }
                })
        }
        getUserData()
    }, [message, error, currentUser.uid]);

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
                            urls: [id],
                            id: currentUser.uid
                        })
                    }
                    db.collection('urlShortner').doc('userUrls').collection("urls").doc(id).set({
                        count: 1,
                        shortUrl: urlIDRef.current.value,
                        url: urlRef.current.value,
                        id: id
                    })
                    setMessage(`Short URL Created Successfully. You can visit it at ${window.location.origin}/${urlIDRef.current.value}`)
                } else {
                    setError('Short URL already exists, please create another one')
                }
                          
            })
        setLoading(false)
    }

    let handleDelete = async (id) => {
        await db.collection('urlShortner').doc('userUrls').collection("users").where("id", "==", currentUser.uid).get()
            .then(async (querySnapshot) => {
                    if (!querySnapshot.empty) {
                        querySnapshot.forEach(async (user) => {
                            if (user.id === currentUser.uid) {
                                await user.ref.update({
                                    urls: user.data().urls.filter(url => url !== id)
                                })
                            }
                        })
                    }
                })
        await db.collection('urlShortner').doc('userUrls').collection("urls").where("id", "==", id).get()
            .then(async (querySnapshot) => {
                if (!querySnapshot.empty) {
                    querySnapshot.forEach(async (url) => {
                        url.ref.delete();
                    })
                }
            })
        setUserUrls(oldArray => oldArray.filter(url => url.id !== id))
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
                    <Button disbaled={loading.toString()} className="w-100 mt-2" type="submit">Shorten URL</Button>
                </Form>
                
            </div>
            <div style={{marginTop: "10vh"}}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>URL</th>
                        <th>Short URL</th>
                        <th>Count</th>
                        <th className="d-flex align-items-center justify-content-center">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            userUrls.map(userUrl => {
                                return (<tr key={userUrls.id+"tr"}>
                                <td key={userUrls.id+"url"}><a href={userUrl.url}>{userUrl.url} </a></td>
                                <td key={userUrls.id+"shortUrl"}><a href={userUrl.shortUrl}>{userUrl.shortUrl} </a></td>
                                <td key={userUrls.id+"count"}>{userUrl.count}</td>
                                <td key={userUrls.id+"delete"}className="d-flex align-items-center justify-content-center"><Button  variant="danger" onClick={() => handleDelete(userUrl.id)} >X</Button></td>
                                </tr>)
                            })
                        }
                        
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default Dashboard
