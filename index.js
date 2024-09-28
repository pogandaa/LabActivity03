const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const users = [];

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validateFields = (name, email, password) => {
    if (!name || !email || !password) {
        return false;
    }
    return true;
};

app.get('/users', (req, res) => {
    console.log('GET /users endpoint was accessed');
    res.status(200).json(users);
});

app.post('/register', (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!validateFields(name, email, password)) {
            console.log('Missing required fields');
            return res.status(400).json({ message: 'Missing required fields: name, email, and password are required' });
        }

        if (!validateEmail(email)) {
            console.log(`Invalid email format: ${email}`);
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const userExists = users.some(user => user.email === email);
       
        if (userExists) {
            console.log(`User with email ${email} already exists.`);
            return res.status(409).json({ message: 'User already exists' });
        }

        users.push({ name, email, password });
        console.log(`POST /register endpoint was accessed ${JSON.stringify(users)}`);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        next(error); // Passes the error to the error-handling middleware
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//okayyyy