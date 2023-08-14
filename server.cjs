const express = require('express');
const app = express();
const path = require('path');
const { getUser, getUserByToken } = require('./db/db.cjs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, `dist`, `assets`)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, `dist`, `index.html`));
});

app.post('/authenticate', async(req, res, next) => {
  try {
    console.log(`REQ.BODY`, req.body);
    const token = await getUser(req.body);
    res.send({ token });
  } catch(err) {
    next(err);
  }
});

app.get('/authenticate', async(req, res) => {
  console.log(req.headers.authorization);
  const user = await getUserByToken(req.headers.authorization);
  res.send(user);
});

app.use((req, res) => {
  res.send(`404 route not found`);
});

app.use((err, req, res) => {
  console.log(err);
  res.status(401).send({ error: err.message });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));