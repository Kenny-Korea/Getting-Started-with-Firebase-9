import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// front와 back을 이어주는 config 파일
const firebaseConfig = {
  apiKey: "AIzaSyBCsx-o1i-vmeIs7kctBVt3lLqVSPivxpk",
  authDomain: "fir-9-tutorial-97d27.firebaseapp.com",
  projectId: "fir-9-tutorial-97d27",
  storageBucket: "fir-9-tutorial-97d27.appspot.com",
  messagingSenderId: "489331772373",
  appId: "1:489331772373:web:7630c470432b999cb54b5c",
};

// init firebase
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection ref
// collection이라는 ref를 사용하여 해당 db에 접근할 수 있음
const colRef = collection(db, "books");

const $items = document.querySelector(".items");

// get collection data
// getDocs(colRef)
//   .then((snapshot) => {
//     // console.log(snapshot.docs);
//     let books = [];
//     snapshot.docs.forEach((doc) => {
//       books.push({ ...doc.data(), id: doc.id });
//     });
//     console.log(books);
//     for (let x of books) {
//       $items.appendChild(x);
//     }
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// queries
const q = query(
  colRef,
  // where("author", "==", "ddd"),
  orderBy("createdAt")
);

// realtime collection data
// 일반적인 경우 데이터의 변경이 있어도 새로고침을 해야 하기 때문에
// realtime을 사용하여 데이터의 변경이 발생하면 자동 새로고침을 할 수 있도록 설정
// 첫 번째 인자로 쿼리를 넣거나 colRef를 넣으면 됨
const unsubCol = onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});

// adding docs
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(colRef, {
    // html의 name 속성을 title/author로 지정하여 사용
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    // input 안에 있는 내용을 초기화 해줌(비워줌)
    addBookForm.reset();
  });
});

// deleting docs
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", deleteBookForm.id.value);

  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
  });
});

// fetching a single document (& realtime)
// colRef collection이고 docRef는 single data임
const docRef = doc(db, "books", "CCxvYY7gBJGK2NwVkHTO");

// Refresh required
// getDoc(docRef).then((doc) => {
//   console.log(doc.data(), doc.id);
// });

// Realtime
const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

// updating a document
const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let docRef = doc(db, "books", updateForm.id.value);

  updateDoc(docRef, {
    title: "updated title",
  }).then(() => {
    updateForm.reset();
  });
});

// signing users up
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("user created:", cred.user);
      signupForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// logging in and out
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("user signed out");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("user logged in:", cred.user);
      loginForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log("user status changed:", user);
});

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener("click", () => {
  console.log("unsubscribing");
  unsubCol();
  unsubDoc();
  unsubAuth();
});
