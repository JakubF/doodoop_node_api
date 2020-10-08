const schema = `
  type RoundElements {
    name: String,
    answer: String,
    id: Int,
    gameSessionId: Int,
    status: String,
    link: String,
    gameSession: GameSessions
  }

  type RoundElementMutations {
    create(name: String!): GameSessions,
    update(id: Int!, name: String!): GameSessions,
  }
`;

export default schema;