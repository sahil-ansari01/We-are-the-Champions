import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://we-are-the-champions-db-c108c-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementInDB = ref(database, "endorsements")

const inputFieldEl = document.getElementById("input-field")
const publishButtonEl = document.getElementById("publish-button")
const endorsementEl = document.getElementById("endorsement-el")


publishButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;
    
    push(endorsementInDB, inputValue)
    
    clearInputFieldEl()
})

onValue(endorsementInDB, function(snapshot) {

    if(snapshot.exists()) {
        let endorsementsArray = Object.entries(snapshot.val())

        clearEndorsementEl()

        for (let i = 0; i < endorsementsArray.length; i++) {
            let currentEndorsement = endorsementsArray[i]
            let currentEndorsementID = endorsementsArray[0]
            let currentEndorsementValue = endorsementsArray[1]

            appendNewValueToEndorsementEl(currentEndorsement)
        }
    } else {
            endorsementEl.innerHTML = ""
        }
})

function clearEndorsementEl() {
    endorsementEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendNewValueToEndorsementEl(endorsement) {
    let endorsementID = endorsement[0]
    let endorsementValue = endorsement[1]

    let newValue = document.createElement("li")

    newValue.textContent = endorsementValue

    newValue.addEventListener("click", function() {
        let exactLocOfEndorsementInDB = ref(database, `endorsements/${endorsementID}`)
        
        remove(exactLocOfEndorsementInDB)
    })

    endorsementEl.append(newValue)
}