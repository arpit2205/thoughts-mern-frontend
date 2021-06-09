import React, { useEffect, useState, useRef } from "react";
import "./App.scss";
import Axios from "axios";
import { gsap, Power2 } from "gsap";

import heart from "./assets/heart-white.png";

function App() {
  const [posts, setPosts] = useState([]);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");

  const getAllPosts = () => {
    Axios.get("https://thoughtsbackend.herokuapp.com/").then((response) =>
      setPosts(response.data.reverse())
    );
  };

  const createPost = () => {
    Axios.post("https://thoughtsbackend.herokuapp.com/", {
      name: formName,
      thoughts: formDesc,
    })
      .then((response) => console.log(response))
      .catch((err) => console.log(err));

    hideForm();
    setTimeout(getAllPosts, 500);
    setFormDesc("");
    setFormName("");
  };

  const updateLike = (id) => {
    Axios.put(`https://thoughtsbackend.herokuapp.com/${id}`)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));

    setTimeout(getAllPosts, 500);
  };

  // Get all posts on load
  useEffect(() => {
    getAllPosts();
  }, []);

  ///////////////////////////////////////////////////////////////////

  let formRef = useRef(null);
  let formPopup = useRef(null);
  let tl = gsap.timeline();

  const showForm = () => {
    tl.to(formRef, { css: { visibility: "visible" }, duration: 0 })
      .to(formRef, { opacity: 1, duration: 0.2 })
      .to(formPopup, {
        opacity: 1,
        y: 0,
        ease: Power2.easeInOut,
        duration: 0.4,
        delay: -0.2,
      });
  };

  const hideForm = () => {
    tl.to(formPopup, {
      opacity: 0,
      y: -40,
      ease: Power2.easeInOut,
      duration: 0.4,
    })
      .to(formRef, { opacity: 0, duration: 0.2, delay: -0.2 })
      .to(formRef, { css: { visibility: "hidden" }, duration: 0 });
  };

  return (
    <div className="container">
      {/* Top Section */}
      <header className="header">
        <h1 className="title">Thoughts</h1>
        <h4 className="subtitle">
          Share your thoughts and read what others are thinking
        </h4>
      </header>

      {/* Thoughts Section */}
      <section className="thoughts-section">
        <h4 className="section-title">Some recent thoughts</h4>
        <div className="thoughts-list">
          {posts.map((post, key) => (
            <div key={post._id} className="thought-card">
              <p className="name">@{post.name}</p>
              <p className="thought-desc">{post.thoughts}</p>
              <div className="date-div">
                <p className="date">{post.date.slice(0, 10)}</p>
                <button
                  className="like-btn"
                  onClick={() => updateLike(post._id)}
                >
                  {post.likes} <img src={heart} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add button */}
      <div className="add-btn" onClick={showForm}>
        <h1>+</h1>
      </div>

      {/* Form */}
      <div ref={(el) => (formRef = el)} className="form-container">
        <div ref={(el) => (formPopup = el)} className="form-popup">
          <h1 className="form-title">Create a new post</h1>
          <input
            type="text"
            placeholder="Your nickname"
            className="name-input"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <textarea
            type="text"
            placeholder="Write your thoughts here"
            className="thoughts-input"
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
          />
          <button className="post-btn" onClick={createPost}>
            Share your thoughts
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
