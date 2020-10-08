const schema = `
  type Players {
    name: String,
    id: Int,
    gameSessionId: Int,
    GameSession: GameSessions,
    gameSession: GameSessions,
  }
`;

export default schema;