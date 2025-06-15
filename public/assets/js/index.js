import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore , collection, addDoc , getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  const firebaseConfig = {
    apiKey: "AIzaSyDvWdD9yTHlOds3kvAIkTCTFh1S7Xg_7NA",
    authDomain: "karlancertask-af4c8.firebaseapp.com",
    projectId: "karlancertask-af4c8",
    storageBucket: "karlancertask-af4c8.firebasestorage.app",
    messagingSenderId: "995971703141",
    appId: "1:995971703141:web:cabb32bf0707a481c9c18c",
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
  
  onAuthStateChanged( auth, async (user) => {
    if (user){
      const querySnapshot = await getDocs(collection(db, "user_messages"));
      loginContainer.style.display = "none";
      id = user.uid;
      const messages = querySnapshot.docs.map( doc => ( {...doc.data()} ) );
      messages.forEach( (message) =>{
        if( message.user_id == id ){
          createMessage(message.message_text)
          createMessage(message.response_text,false)
        }
      });

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


  async function getChatGptResponse( prompt ){
    
    const headers = {

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
