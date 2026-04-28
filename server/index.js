const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./config/db');

app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/crawl', require('./routes/crawl'));
app.use('/api/notify', require('./routes/notify'));

app.get('/', (req, res) => {
    res.json({ message: 'Medical Job Monitor API' });
});

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

require('./utils/scheduler');