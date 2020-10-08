const schema = `
  type GameSessions {
    name: String,
    enterCode: String,
    status: String,
    id: Int,
    roundElements: [RoundElements]
  }

  type GameSessionMutations {
    create(name: String!): GameSessions
  }
`;

export default schema;