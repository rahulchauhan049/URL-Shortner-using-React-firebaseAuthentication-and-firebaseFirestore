import React, {useEffect} from 'react'
import { useParams, useHistory } from 'react-router-dom';
import {db} from "../firebase"

function GoLink() {
    const { shortUrl } = useParams()
    const history = useHistory()


    useEffect(() => {
        db.collection('urlShortner').doc('userUrls').collection("urls").where("shortUrl", "==", shortUrl).get()
            .then(querySnapshot => {
                if (querySnapshot.empty) {
                    history.push("/")
                    return
                }
                querySnapshot.forEach(async (snapshot) => {
                    let count = snapshot.data().count
                    await snapshot.ref.update({
                        count: ++count
                    })
                    window.location.replace(snapshot.data().url)
                    
                }
                )                
        })
    }, [history, shortUrl])


    return (
        <h1 className="d-flex align-items-center justify-content-center">
            Redirecting...
        </h1>
    )
}

export default GoLink
