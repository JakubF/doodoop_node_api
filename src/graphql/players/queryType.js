const schema = `
  type Players {
    name: String,
    id: Int,
    points: Int,
    gameSessionId: Int,
    gameSession: GameSessions,
  }
`;

export default schema;