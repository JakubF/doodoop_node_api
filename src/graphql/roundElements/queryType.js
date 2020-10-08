const schema = `
  type RoundElements {
    name: String,
    answer: String,
    id: Int,
    gameSessionId: Int,
    status: String,
    gameSession: GameSessions
  }
`;

export default schema;