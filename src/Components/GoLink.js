import React, {useEffect} from 'react'
import { useParams, useHistory } from 'react-router-dom';
import {db} from "../firebase"

function GoLink() {
    const { shortUrl } = useParams()
    const history = useHistory()


    useEffect(() => {
        let query = db.collection('urlShortner')
        query.onSnapshot(data => {
            if (data.empty) {
                history.push("/")
                return
            }
            data = data.docs[0].data()
            let url = data.urls.find(eachUrl => eachUrl.shortUrl === shortUrl)?.url
            console.log(url)
            if (url) {
                window.location.replace(url)
            } else {
                history.push("/")
            }
        });
    }, [])


    return (
        <h1 className="d-flex align-items-center justify-content-center">
            Redirecting...
        </h1>
    )
}

export default GoLink
