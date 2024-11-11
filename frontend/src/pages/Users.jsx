import React, { useState, useEffect } from 'react';

const API_URL = 'http://15.206.189.93:5000'; // Replace with your actual backend API URL

export const Users = () => {
  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const createUser = async () => {
    try {
      const userResponse = window.confirm('Are you sure you want to create this user?');
      if (!userResponse) return;

      const response = await fetch(`${API_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: state.name,
          email: state.email,
          password: state.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessage(data.message || 'User created successfully');
      fetchUsers(); // Refresh the list of users after creating a new user
    } catch (error) {
      console.error('There was an error creating the user!', error);
      setMessage('Error creating user');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('There was an error fetching the users!', error);
      setMessage('Error fetching users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser();
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={state.name}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={state.email}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Create User</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
      <h2 style={styles.heading}>Users List</h2>
      <ul style={styles.userList}>
        {users.map((user) => (
          <li key={user.id} style={styles.userItem}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  input: {
    marginBottom: '10px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#28a745',
    color: 'white',
    cursor: 'pointer',
  },
  message: {
    color: 'red',
    marginBottom: '20px',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  userList: {
    listStyleType: 'none',
    padding: '0',
  },
  userItem: {
    padding: '10px',
    borderBottom: '1px solid #ccc',
  },
};