const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3001;

// Temporary in-memory storage for sessions
const sessions = {};


app.post('/create-session', (req, res) => {
  const { playerName } = req.body;

  if (!playerName) {
    return res.status(400).json({ error: 'playerName is required' });
  }

  const sessionId = uuidv4();
  const player = { id: uuidv4(), name: playerName };

  sessions[sessionId] = { players: [player], attackers: [], defenders: [] };

  res.json({ sessionId, playerId: player.id });
});

app.post('/join-session', (req, res) => {
  const { sessionId, playerName } = req.body;

  if (!sessions[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }

  // Generate a default name if playerName is not provided
  const playerCount = sessions[sessionId].players.length;
  const defaultName = `Player ${playerCount + 1}`;
  const name = playerName || defaultName;

  const player = { id: uuidv4(), name };
  sessions[sessionId].players.push(player);
  res.json({ session: sessions[sessionId], playerId: player.id });
});

app.post('/change-player-name', (req, res) => {
  const { sessionId, playerId, newPlayerName } = req.body;

  if (!sessions[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const player = sessions[sessionId].players.find(p => p.id === playerId);
  if (!player) {
    return res.status(404).json({ error: 'Player not found in the session' });
  }

  // Update the player's name
  player.name = newPlayerName;
  res.json({ message: 'Player name updated', session: sessions[sessionId] });
});

app.get('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (!sessions[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(sessions[sessionId]);
});

app.post('/session/:sessionId/update-operators', (req, res) => {
  const { sessionId } = req.params;
  const { playerId, attackers, defenders } = req.body;

  if (!sessions[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const session = sessions[sessionId];

  // Verify that the player is in the session
  const player = session.players.find(p => p.id === playerId);
  if (!player) {
    return res.status(403).json({ error: 'Player not in session' });
  }

  // Update the session's attackers and defenders
  session.attackers = attackers;
  session.defenders = defenders;

  res.json({ message: 'Operators updated' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
