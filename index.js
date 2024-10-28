const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

// In-memory storage for sessions
const sessions = {};

/**
 * Create a new game session.
 */
app.post('/create-session', (req, res) => {
  const { playerName } = req.body;

  if (!playerName) {
    return res.status(400).json({ error: 'playerName is required' });
  }

  const sessionId = uuidv4();
  const playerId = uuidv4();
  const player = { id: playerId, name: playerName };

  sessions[sessionId] = {
    players: [player],
    attackers: [],
    defenders: [],
  };

  res.json({ sessionId, playerId });
});

/**
 * Join an existing game session.
 */
app.post('/join-session', (req, res) => {
  const { sessionId, playerName } = req.body;

  const session = sessions[sessionId];
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const name =
    playerName || `Player ${session.players.length + 1}`;
  const playerId = uuidv4();
  const player = { id: playerId, name };

  session.players.push(player);

  res.json({ session, playerId });
});

/**
 * Change the name of a player in a session.
 */
app.post('/change-player-name', (req, res) => {
  const { sessionId, playerId, newPlayerName } = req.body;

  if (!newPlayerName) {
    return res.status(400).json({ error: 'newPlayerName is required' });
  }

  const session = sessions[sessionId];
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const player = session.players.find((p) => p.id === playerId);
  if (!player) {
    return res.status(404).json({ error: 'Player not found in the session' });
  }

  player.name = newPlayerName;
  res.json({ message: 'Player name updated', session });
});

/**
 * Retrieve details of a session.
 */
app.get('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = sessions[sessionId];

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json(session);
});

/**
 * Update the operators (attackers and defenders) in a session.
 */
app.post('/session/:sessionId/update-operators', (req, res) => {
  const { sessionId } = req.params;
  const { playerId, attackers, defenders } = req.body;

  const session = sessions[sessionId];
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const player = session.players.find((p) => p.id === playerId);
  if (!player) {
    return res.status(403).json({ error: 'Player not in session' });
  }

  // Validate attackers and defenders arrays
  if (!Array.isArray(attackers) || !Array.isArray(defenders)) {
    return res.status(400).json({ error: 'Attackers and defenders must be arrays' });
  }

  session.attackers = attackers;
  session.defenders = defenders;

  res.json({ message: 'Operators updated' });
});

/**
 * Start the server.
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
