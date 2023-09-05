// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Firebase configuration
const appSettings = {
    databaseURL: "https://we-are-the-champions-db-c108c-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

// Initialize Firebase
const app = initializeApp(appSettings)
const database = getDatabase(app)

// Reference to the "endorsements" node in the Firebase Realtime Database
const endorsementInDB = ref(database, "endorsements")

// Get DOM elements
const inputFieldEl = document.getElementById("input-field")
const fromEl = document.getElementById("from-el")
const toEl = document.getElementById("to-el")
const publishButtonEl = document.getElementById("publish-button")
const endorsementEl = document.getElementById("endorsement-el")

// Add a click event listener to the "Publish" button
publishButtonEl.addEventListener("click", function() {
    let reviewText = inputFieldEl.value
    let fromData = fromEl.value
    let toData = toEl.value

    if (reviewText && fromData && toData) {
        // Clear input fields and push data to the Firebase database
        clearInputFieldEl()
        pushData(reviewText, fromData, toData);
        inputFieldEl.style.border = "none"
        fromEl.style.border = "none"
        toEl.style.border = "none"
    } else {
        // If any input field is empty, display an error by adding a red border
        clearInputFieldEl()
        inputFieldEl.style.border = "2px solid red"
        fromEl.style.border = "2px solid red"
        toEl.style.border = "2px solid red"
    }

})

// Function to clear input fields
function clearInputFieldEl() {
    inputFieldEl.value = ""
    fromEl.value = ""
    toEl.value = ""
}

// Function to push data to the Firebase database
function pushData(review, from, to) {
    let arr = [review, from, to, 0];
    push(endorsementInDB, arr)
}

// Listen for changes in the "endorsements" node in the Firebase database
onValue(endorsementInDB, function(snapshot) {
    clearEndorsementEl()

    if(snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        let reverseEndorsementArray = itemsArray.reverse()

        clearEndorsementEl()

        for (let i = 0; i < reverseEndorsementArray.length; i++) {
            let currentReview = itemsArray[i]
            let currentEndorsementID = itemsArray[0]
            let currentEndorsementValue = itemsArray[1]

            appendNewValueToEndorsementEl(currentReview)
        }
    } else {
            clearEndorsementEl()
        }
})

function clearEndorsementEl() {
    endorsementEl.innerHTML = ""
}

// Function to append a new review to the "endorsement" element in the DOM
function appendNewValueToEndorsementEl(review) {
    let reviewID = review[0];
    let reviewData = review[1];
    let reviewText = reviewData[0];
    let reviewFrom = reviewData[1];
    let reviewTo = reviewData[2];
    let reviewLikes = reviewData[3];

    let newEl = document.createElement("li");
    let mainEl = document.createElement("div");
    let toEl = document.createElement("h3");
    let reviewEl = document.createElement("p");
    let flexEl = document.createElement("div");
    let fromEl = document.createElement("h3");
    let likesEl = document.createElement("button");

    toEl.textContent = `To ${reviewTo}`;
    reviewEl.textContent = reviewText;
    fromEl.textContent = `From ${reviewFrom}`;
    likesEl.textContent = `💙 ${reviewLikes}`;

    newEl.appendChild(mainEl);
    mainEl.appendChild(toEl);
    mainEl.appendChild(reviewEl);
    mainEl.appendChild(flexEl);
    flexEl.appendChild(fromEl);
    flexEl.appendChild(likesEl);

    reviewEl.classList = "review-text";
    flexEl.classList = "flex-container";
    likesEl.classList = "like-btn";

    // Generate a unique identifier for the like button
    const likeButtonID = `likeButton_${reviewID}`;
    likesEl.id = likeButtonID;

    // Check if the user has already liked this review
    const hasLiked = localStorage.getItem(likeButtonID);

    if (hasLiked === 'true') {
        // If the user has already liked the review, disable the like button
        likesEl.classList.add('liked'); // Add a CSS class for liked button
    } else {
        // If the user hasn't liked the review, add a click event listener
        likesEl.addEventListener("click", function () {
            if (likesEl.classList.contains('liked')) {
                // User is unliking the review
                reviewLikes -= 1;
                likesEl.classList.remove('liked');
                localStorage.setItem(likeButtonID, 'false'); // Set as unliked
            } else {
                // User is liking the review
                reviewLikes += 1;
                likesEl.classList.add('liked');
                localStorage.setItem(likeButtonID, 'true'); // Set as liked
            }
            
            // Update the button text with the new like count
            likesEl.textContent = `💙 ${reviewLikes}`;
        });
    }

    endorsementEl.append(newEl);
}
