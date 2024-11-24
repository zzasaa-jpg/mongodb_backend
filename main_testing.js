const express = require('express');
const path = require('path');
const app = express();
const port = 9089;

app.use(express.json());


let users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];


app.get('/',(req, res)=>{
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.get('/users', (req, res) =>{
    res.json(users);
});

app.get('/users/:id', (req, res)=>{
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user){
        return res.status(404).send("user not find!");
    }
    res.json(user);
});

app.post('/users', (req, res) => {
    const newUser = {id: users.length + 1 , name:req.body.name};
    users.push(newUsers);
    res.status(201).json(newUser);
});

app.put('/usera/:id', (req, res)=>{
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user){
        return res.status(404).send("User not found!");
    }
    user.name = req.body.name;
    res.json(user);
});

app.delete('/users/:id', (req, res)=>{
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) {
        return res.status(404).send("user not foind!");
    }
    users.splice(userIndex, 1);
    res.status(204).send();
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/form.html'))
    
})
app.listen(port, ()=>{
    console.log(`App running on ${port} port!`);
})