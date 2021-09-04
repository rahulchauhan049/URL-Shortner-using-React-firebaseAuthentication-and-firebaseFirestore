import React, {useRef, useState} from 'react'
import { Card, Button, Form, Alert } from 'react-bootstrap'
import { useAuth } from '../Context/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import GoogleImage from "../Images/google.png"
function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login, SignInWithGoogle } = useAuth()
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(event) {
        event.preventDefault();
 
        try {
            setError('');
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value)
            history.push("/")
        } catch (e) {
            setError(`Failed to sign in: ${e}`)
        }
        setLoading(false)
    }

    async function handleSignInWithGoogle() {
        try {
            setError('');
            setLoading(true);
            await SignInWithGoogle()
            history.push("/")
        } catch (e) {
            setError(`Failed to sign in: ${e}`)
        }
        setLoading(false)
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Log In</h2>
                    {error && <Alert variant="danger">{error} </ Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>

                        <Button disbaled={loading} className="w-100 mt-4" type="submit">Log In</Button>
                    </Form>
                    <img src={ GoogleImage} alt="Google Sign In" style={{height:"4.5rem", width:"100%", marginTop: "4px", cursor:"pointer"}} onClick={handleSignInWithGoogle}/>

                    <div className="w-100 text-center mt-3">
                        <Link to="/forgot-password">Forgot Password</Link>
                    </div>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Need an Account? <Link to="/signup">Sign Up</Link>
            </div>
        </>
    )
}

export default Login