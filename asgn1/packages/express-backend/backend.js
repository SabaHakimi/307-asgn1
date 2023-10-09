import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

const users = { 
   users_list : [
      { 
         id : 'xyz789',
         name : 'Charlie',
         job: 'Janitor',
      },
      {
         id : 'abc123', 
         name: 'Mac',
         job: 'Bouncer',
      },
      {
         id : 'ppp222', 
         name: 'Mac',
         job: 'Professor',
      }, 
      {
         id: 'yat999', 
         name: 'Dee',
         job: 'Aspring actress',
      },
      {
         id: 'zap555', 
         name: 'Dennis',
         job: 'Bartender',
      }
   ]
}

const findUserByName = (name) => { 
    return users['users_list']
      .filter( (user) => user['name'] === name); 
}

const findUserById = (id) =>
    users['users_list']
      .find( (user) => user['id'] === id);

const findUserByJob = (job) => {
   return users['users_list']
      .filter( (user) => user['job'] === job);
}

const addUser = (user) => {
    users['users_list'].push(user);
    return user;
}

const deleteUserById = (id) => {
   const userIndex = users['users_list'].findIndex((user) => user["id"] == id);
   console.log(`User index: ${userIndex}`);
   if (userIndex != -1) {
      console.log(`User index is not -1`);
      const deletedUser = users['users_list'].splice(userIndex, 1)[0];
      console.log(`Returning deletedUser.id: ${deletedUser.id}`);
      return deletedUser.id;
   } else {
      return null;
   }
}

function generateRandomId() {
   const idLength = 6;
   const characters = 'abcdefghijklmnopqrstuvwxyz';
   const numbers = '0123456789'
   let randomId = '';

   for (let i = 0; i < idLength; i++) {
      if (i < idLength / 2) {
         const randomIndex = Math.floor(Math.random() * characters.length);
         randomId += characters.charAt(randomIndex);
      } else {
         const randomIndex = Math.floor(Math.random() * numbers.length);
         randomId += numbers.charAt(randomIndex);
      }
   }

   return randomId;
}

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/users', (req, res) => {
    const { name, job } = req.query;
    let filteredUsers = users.users_list;

    if (name && job) {
       // Filter users by both name and job
       filteredUsers = findUserByName(name).filter(
          (user) => user.job === job
       );
    } else if (name) {
       filteredUsers = findUserByName(name);
    } else if (job) {
       filteredUsers = findUserByJob(job);
    }

    res.send({ users_list: filteredUsers });
});

app.get('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send('Resource not found.');
    } else {
        res.send(result);
    }
});

app.post('/users', (req, res) => {
    const userToAdd = req.body;
    const randomId = generateRandomId();
    userToAdd.id = randomId;

    addUser(userToAdd);
    res.status(201).json(userToAdd);
});

app.delete('/users/:id', (req, res) => {
   const id = req.params["id"];
   const result = deleteUserById(id);

   if (result != null) {
      console.log(`Successful delete. Sending 204 to frontend.`);
      res.status(204).send("User has been deleted.");
   } else {
      res.status(404).send("User not found.");
      console.log(`Delete unsuccessful. Sending 404 to frontend`);
   }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});      
