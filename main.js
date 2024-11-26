const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const path = require('path');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const port = 9089;

const app = express();
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json());
app.use(cors());
app.use(express.json());


mongoose.connect('mongodb+srv://zzsdrt354:SrQzx3GgKGM9cer@cluster0.fktok.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => console.log("connected!"))

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: String, required: true },
})

const User = mongoose.model('User', userSchema);

app.post('/login', async (req, res) => {
    try {
        const { name_input, password_input, IST } = req.body;
        // console.log('Received Date (IST):', IST);
        if (!name_input || !password_input) {
            return res.status(400).send('Name and Password are required!');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password_input, saltRounds)

        const newUser = new User({
            name: name_input,
            password: hashedPassword,
            date: IST,
        });
        await newUser.save();

        console.log('User saved successfully:', newUser);
        res.status(201).send('User signed up successfully!');
    } catch (error) {
        res.status(500).send('Error signing up: ' + error.message);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/form.html'));
});
// --------------------------------------------------------------
app.get('/edit', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Edit.html'));
});

// READ (GET)
app.get('/Users', async (req, res) => {
    const data = await User.find()
    res.send(data)

});

// Update (PUT)
app.put('/Users/:id', async (req, res) => {
    const updateData = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.send(updateData);
})

// Delete (DELETE)
app.delete('/Users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.send({ Message: "deleted Succefully!" })
})
//--------------------------------------------------------------------
app.listen(port, () => {
    console.log(`running${port}`)
})