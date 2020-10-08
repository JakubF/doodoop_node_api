const schema = `
  type GameSessions {
    name: String,
    enterCode: String,
    status: String,
    id: Int,
    roundElements: [RoundElements],
    currentRoundElement: RoundElements,
    players: [Players],
  }

  type GameSessionMutations {
    create(name: String!): GameSessions,
    update(id: Int!, name: String!): GameSessions,
    start(id: Int!): GameSessions,
    join(enterCode: String!, name: String!): Players
  }
`;

export default schema;