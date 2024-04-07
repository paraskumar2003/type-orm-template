import express from 'express';
import { connectTypeOrm } from './connect/ormconfig';

const app = express();

connectTypeOrm();

app.listen(4000, () => { console.log("listening on 4000") });

app.use("/", (req, res) => { console.log(req.query); res.send(200) });