import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithPopup , GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.addEventListener('DOMContentLoaded' , ()=>{

    const firebaseConfig = {
    apiKey: "AIzaSyA1Mz56lgEctWCkFKpx_rJabIQa2ISCTXo",
    authDomain: "karlancertask.firebaseapp.com",
    projectId: "karlancertask",
    storageBucket: "karlancertask.firebasestorage.app",
    messagingSenderId: "44281313519",
    appId: "1:44281313519:web:67e4237468e935f9b6431a",
    measurementId: "G-EV2FBY3DL5"
    };
    const app = initializeApp(firebaseConfig);


    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const chatBox = document.getElementById("chatBox");

    function createMessage(text, fromUser = true) {

      const bubble = document.createElement("div");
      bubble.className =
        (fromUser
          ? "bg-indigo-100 text-gray-800 self-end ml-auto"
          : "bg-gray-100 text-gray-700 self-start mr-auto") +
        " px-4 py-2 rounded-xl w-fit max-w-xs";
      bubble.textContent = text;
      chatBox.appendChild(bubble);
      chatBox.scrollTop = chatBox.scrollHeight;

    }

    chatForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (message) {
        createMessage(message, true);
        chatInput.value = "";

      }
    });

})