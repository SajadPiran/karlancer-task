import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore , collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  const firebaseConfig = {
    apiKey: "AIzaSyA1Mz56lgEctWCkFKpx_rJabIQa2ISCTXo",
    authDomain: "karlancertask.firebaseapp.com",
    projectId: "karlancertask",
    storageBucket: "karlancertask.appspot.com",
    messagingSenderId: "44281313519",
    appId: "1:44281313519:web:67e4237468e935f9b6431a",
    measurementId: "G-EV2FBY3DL5",
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  function $(selector) {
    const elements = document.querySelectorAll(selector);
    if (elements.length == 1) return elements[0];
    else return elements;
  }

  const chatForm = $("#chatForm");
  const chatInput = $("#chatInput");
  const chatBox = $("#chatBox");
  const loginContainer = $("#login");
  let id;

  onAuthStateChanged(auth, (user) => {
    if (user){
      loginContainer.style.display = "none";
      id = user.uid;
    }
    else {
      $("#login #loader").style.display = "none";
      $("#login #login-form").style.display = "flex";

      $("#login #login-form-button").addEventListener("click", () =>
        signInWithPopup(auth, new GoogleAuthProvider())
      );
    }
  });
  async function saveUserData( data ) {

    try {
      await addDoc( collection( db , 'user_messages' ) , data );
    } catch (e) {
      console.error("خطا در ذخیره داده:", e);
    }

  }

  function createMessage(text, fromUser = true) {
    const bubble = document.createElement("div");
    bubble.className =
      (fromUser
        ? "bg-indigo-100 text-gray-800 self-start mr-auto"
        : "bg-gray-100 text-gray-700 self-end ml-auto") +
      " px-4 py-2 rounded-xl w-fit max-w-xs";
    bubble.textContent = text;
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  async function getChatGptResponse( prompt ){
    
    const headers = {
      'Authorization' : 'Bearer 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',
      'Content-Type' : 'application/json'
    }
    const body = {
      'model' : 'gpt-4o-mini',
      'messages': [
          {'role': 'user', 
          'content': prompt}
        ]
    }
    const request = await fetch( 'https://api.openai.com/v1/chat/completions' , {
      method : 'POST',
      headers : headers,
      body : JSON.stringify(body) 
    });
    const response = await request.json();
    if ( request.ok ) return response.choices[0].message.content

  }

  chatForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (message) {

      createMessage(message);
      getChatGptResponse(message).then( ( response ) => {
        
        createMessage(response,false);

        saveUserData({
          'message_text' : message,
          'response_text' : response,
          'user_id' : id,
          'timestamp' : new Date().getTime()
        });

      });
      chatInput.value = "";

    }

  });

});
