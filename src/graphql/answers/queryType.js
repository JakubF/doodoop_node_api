const schema = `
  type Answers {
    value: String,
    id: Int,
    roundElementId: Int,
    playerId: Int,
    roundElement: RoundElements,
    player: Players,
  }

  type AnswerMutations {
    create(playerId: Int!, gameSessionId: Int!, value: String!): Answers,
  }
`;

export default schema;