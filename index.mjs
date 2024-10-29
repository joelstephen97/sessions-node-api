// index.mjs
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import db from './db.mjs';
import {
  createSessionSchema,
  joinSessionSchema,
  changePlayerNameSchema,
  updateOperatorsSchema,
} from './validation.mjs';

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); 
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});
app.use(cors());

const PORT = process.env.PORT || 3001;

/**
 * Create a new game session.
 */
app.post('/create-session', async (req, res) => {
  const { error, value } = createSessionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { playerName } = value;

  const sessionId = uuidv4();
  const playerId = uuidv4();
  const player = { id: playerId, name: playerName };

  await db.read();
  db.data.sessions[sessionId] = {
    players: [player],
    attackers: [],
    defenders: [],
  };
  await db.write();

  res.json({ sessionId, playerId });
});

/**
 * Join an existing game session.
 */
app.post('/join-session', async (req, res) => {
  const { error, value } = joinSessionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { sessionId, playerName } = value;

  await db.read();
  const session = db.data.sessions[sessionId];
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const name = playerName || `Player ${session.players.length + 1}`;
  const playerId = uuidv4();
  const player = { id: playerId, name };

  session.players.push(player);
  await db.write();

  res.json({status: 200, session, playerId });
});

/**
 * Change the name of a player in a session.
 */
app.post('/change-player-name', async (req, res) => {
  const { error, value } = changePlayerNameSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { sessionId, playerId, newPlayerName } = value;

  await db.read();
  const session = db.data.sessions[sessionId];
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const player = session.players.find((p) => p.id === playerId);
  if (!player) {
    return res.status(404).json({ error: 'Player not found in the session' });
  }

  player.name = newPlayerName;
  await db.write();

  res.json({status: 200, message: 'Player name updated', session });
});

/**
 * Retrieve details of a session.
 */
app.get('/session/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  await db.read();
  const session = db.data.sessions[sessionId];
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json({status: 200,session});
});

/**
 * Update the operators (attackers and defenders) in a session.
 */
app.post('/session/:sessionId/update-operators', async (req, res) => {
  const { sessionId } = req.params;
  const { error, value } = updateOperatorsSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { playerId, attackers, defenders } = value;

  await db.read();
  const session = db.data.sessions[sessionId];
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const player = session.players.find((p) => p.id === playerId);
  if (!player) {
    return res.status(403).json({ error: 'Player not in session' });
  }

  session.attackers = attackers;
  session.defenders = defenders;
  await db.write();

  res.json({status: 200, message: 'Operators updated' });
});

/**
 * Delete a session.
 */
app.delete('/session/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  await db.read();
  if (!db.data.sessions[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }

  delete db.data.sessions[sessionId];
  await db.write();

  res.json({ message: 'Session deleted successfully' });
});

app.get('/',(req, res) => {
  res.json({
    status: 200,
    message: 'Welcome to the Sessions API for R6!',
  })
})

/**
 * Start the server.
 */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
