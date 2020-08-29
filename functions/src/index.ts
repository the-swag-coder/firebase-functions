import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from 'body-parser';

admin.initializeApp(functions.config().firebase);

const app = express();
const main = express();

main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: false}));

const db = admin.firestore();
const userCollection = 'user';

export const webApi = functions.https.onRequest(main);

interface IUser {
  name: string;
  email: string;
}

app.get('/user', async (req, res) => {
  try {
    const userQuerySnapshot = await db.collection(userCollection).get();
    const users: any[] = [];

    userQuerySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        data: doc.data()
      });
    });

    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({message: e});
  }
});

app.get('/user/:userId', (req, res) => {
  const userId = req.params.userId;

  db.collection(userCollection).doc(userId).get()
    .then(user => {
      if (!user.exists) {
        throw new Error('User not found !!!');
      }

      res.status(200).json({id: user.id, data: user.data()});
    })
    .catch(error => res.status(500).send(error));
});

app.post('/user', async (req, res) => {
  try {
    const user: IUser = {
      name: req.body['name'],
      email: req.body['email']
    };

    const newDoc = await db.collection(userCollection).add(user);
    res.status(201).json({message: `Created a new user of userId: ${newDoc.id}`});
  } catch (e) {
    res.status(400).json({message: 'User should contain name & email'});
  }
});

app.put('/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  await db.collection(userCollection).doc(userId).set(req.body, {merge: true})
    .then(() => res.status(200).json({message: 'User updated successfully !!!'}))
    .catch((error) => res.status(500).json({message: error}));
});

app.delete('/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  await db.collection(userCollection).doc(userId).delete()
    .then(() => res.status(200).json({message: 'User deleted successfully !!!'}))
    .catch((error) => res.status(500).json({message: error}));
});
