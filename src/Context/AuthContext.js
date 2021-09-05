import React, { useContext, useState, useEffect } from 'react'
import { auth, signInProvider } from '../firebase'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({children}) {

    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    function signup(email, password, username) {
        return auth.createUserWithEmailAndPassword(email, password).then((user) => {
            user.user.updateProfile({
              displayName: username
            });
          })
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }
    function logout() {
        auth.signOut()
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email)
    }

    function updatePassword(password) {
        currentUser.updatePassword(password)
    }

    function SignInWithGoogle() {
        return auth.signInWithPopup(signInProvider)
    }

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false);
        })
    }, [])

    
    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
        SignInWithGoogle
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

