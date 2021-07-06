import {firebase} from "../firebase"

const fetchGames = () => {
    const ref = firebase.firestore().collection("games");
    const items = []
    ref.onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc)=> {
            items.push(doc.data())
        })
    })
    return items
}

export {
    fetchGames
}