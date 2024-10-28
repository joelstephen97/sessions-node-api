const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Temporary in-memory storage for sessions
const sessions = {};

// Sample operators
const attackers = [
  'Sledge', 'Thatcher', 'Ash', 'Thermite', 'Twitch', 'Montagne', 'Glaz', 'Fuze', 'Blitz', 'IQ',
];
const defenders = [
  'Smoke', 'Mute', 'Castle', 'Pulse', 'Doc', 'Rook', 'Kapkan', 'Tachanka', 'Jäger', 'Bandit',
];

// Helper function to shuffle and get a random subset of operators
function getRandomOperators(operatorList, count) {
  const shuffled = operatorList.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// 1. Create a new session
app.post('/create-session', (req, res) => {
  const sessionId = uuidv4();
  sessions[sessionId] = { players: [], attackers: [], defenders: [] };
  res.json({ sessionId });
});

// 2. Join a session
app.post('/join-session', (req, res) => {
  const { sessionId, playerName } = req.body;

  if (!sessions[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const player = { id: uuidv4(), name: playerName };
  sessions[sessionId].players.push(player);
  res.json({ session: sessions[sessionId], playerId: player.id });
});

// 3. Randomize operators for all players in session (Attackers or Defenders)
app.post('/randomize-operators', (req, res) => {
  const { sessionId, type } = req.body;

  if (!sessions[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const operatorList = type === 'attackers' ? attackers : defenders;
  const randomized = getRandomOperators(operatorList, sessions[sessionId].players.length);

  sessions[sessionId][type] = sessions[sessionId].players.map((player, i) => ({
    playerName: player.name,
    operator: randomized[i % randomized.length],
  }));

  res.json({ [type]: sessions[sessionId][type] });
});

// 4. Get session data (for debugging or client refresh)
app.get('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (!sessions[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(sessions[sessionId]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
