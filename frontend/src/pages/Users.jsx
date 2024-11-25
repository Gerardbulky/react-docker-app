import React, { useState, useEffect, useCallback } from 'react';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = "http://52.66.249.115:30005";

console.log('API URL:', API_URL); 

export const Users = () => {
  const [state, setState] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  // Fetch users from the backend
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      setError('Error fetching users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = async () => {
    if (!state.name || !state.email || !state.password) {
      setMessage('Please fill out all fields');
      return;
    }
  
    try {
      const userResponse = window.confirm('Are you sure you want to create this user?');
      if (!userResponse) return;
  
      setLoading(true);
      const response = await fetch(`${API_URL}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error details:', errorText);
        throw new Error(`Failed to create user: ${response.statusText}`);
      }
  
      const data = await response.json();
      setMessage(data.message || 'User created successfully');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      setMessage('Error creating user');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    createUser();
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      <h2 style={styles.heading}>Users List</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <ul style={styles.userList}>
          {users.map((user) => (
            <li key={user.id} style={styles.userItem}>
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      )}
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