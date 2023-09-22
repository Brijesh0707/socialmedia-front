import React, { useEffect, useState } from 'react';
import Loading from '../images/loading.gif';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const userString = localStorage.getItem('user');
  const userObject = JSON.parse(userString);
  const username = userObject.username;
  console.log(username);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetch('https://socialapi-dr9x.onrender.com/allposts', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.reverse());
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  const handleLike = async (postIndex) => {
    if (isButtonDisabled) {
      return;
    }

    setIsButtonDisabled(true);

    const updatedData = [...data];
    const post = updatedData[postIndex];

    try {
      const response = await fetch(
        `https://socialapi-dr9x.onrender.com/${post.likes.includes(
          JSON.parse(localStorage.getItem('user'))._id
        ) ? 'unlikes' : 'likes'}`,
        {
          method: 'put',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('jwt'),
          },
          body: JSON.stringify({
            postid: post._id,
          }),
        }
      );

      const result = await response.json();
      post.likes = result.likes;
      setData(updatedData);
    } catch (error) {
      console.error(error);
    }

    setIsButtonDisabled(false);
  };

  // State for handling modal
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState('');

  // Function to open the modal and select the post
  const openModal = (post) => {
    setModalIsOpen(true);
    setSelectedPost(post);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPost(null);
  };

  const handleCommentSubmit = async (postid) => {
    if (!commentText.trim()) {
      return;
    }

    try {
      const response = await fetch(`https://socialapi-dr9x.onrender.com/comments`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('jwt'),
        },
        body: JSON.stringify({
          postid: postid,
          text: commentText,
        }),
      });

      const result = await response.json();

      // Update the comments for the selected post
      const updatedData = data.map((post) => {
        if (post._id === postid) {
          post.comments = result.comments;
        }
        return post;
      });

      setData(updatedData);
      setCommentText('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='home-container'>
      {isLoading ? (
        <div className='loading-container'>
          <img src={Loading} alt='Loading' className='loading-indicator' />
        </div>
      ) : (
        <div className='row'>
          {data &&
            data.map((post, index) => (
              <div key={post._id} className='col-md-12'>
                <div className='cards'>
                  <div className='profile-1'>
                    <div className='profile-2'>
                      <img
                        src={post.photo}
                        className='logo-profile'
                        alt='Profile'
                      />
                    </div>
                    <div className='profile-name'>
                      <h6>{post.postedby.username}</h6>
                    </div>
                  </div>
                  <div className='post-1'>
                    <img src={post.photo} className='post-2' alt='Post' />
                  </div><p className='post-caption' >{post.body}</p>
                  <div className='like-comment'>
                    <button
                      onClick={() => handleLike(index)}
                      disabled={isButtonDisabled}
                      style={{
                        backgroundColor: post.likes.includes(
                          JSON.parse(localStorage.getItem('user'))._id
                        )
                          ? 'red'
                          : 'white',
                        color: post.likes.includes(
                          JSON.parse(localStorage.getItem('user'))._id
                        )
                          ? 'white'
                          : 'black',
                        border: '1px solid black',
                      }}
                    >
                      {post.likes.includes(
                        JSON.parse(localStorage.getItem('user'))._id
                      )
                        ? 'Liked'
                        : 'Like'}
                    </button>
                    <p
                      id='likes'
                      style={{
                        color: post.likes.includes(
                          JSON.parse(localStorage.getItem('user'))._id
                        )
                          ? 'black'
                          : 'gray',
                      }}
                    >
                      {post.likes.length} likes
                      <div className='comment'>
                        <input
                          type='text'
                          placeholder='Add a comment'
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleCommentSubmit(post._id);
                            }
                          }}
                        />
                        <button onClick={() => handleCommentSubmit(post._id)}>
                          Send
                        </button>
                      </div>
                      <p
                        className='View-1'
                        onClick={() => openModal(post)}
                      >
                        View Comment
                      </p>
                    </p>
                    <br />
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
      {selectedPost && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Post Modal"
          style={{
    content: {
      width: '350px', 
      marginTop: '50px', 
      padding: '20px', 
      borderRadius: '8px', 
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', 
    }
          }}
        >
          <div className='model_head'>
          <button className='close-button' onClick={closeModal}>
        X
      </button>
            <h2>{selectedPost.postedby.username}'s Post</h2>
            <img src={selectedPost.photo} alt="Post" className='model_post' />
            <p>{selectedPost.likes.length} likes</p>
            <div>
            <div>
              <input
                type="text"
                placeholder="Add a comment"
                value={commentText}
                
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button className='btn-model' onClick={() => handleCommentSubmit(selectedPost._id)}>
                Send
              </button>
            </div>
              {selectedPost.comments.map((comment) => (
                <div key={comment._id}>
                  <p>
                    {comment.text}
                  </p>
                </div>
              ))}
              
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Home;
