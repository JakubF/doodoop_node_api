const schema = `
  type Answers {
    value: String,
    roundElementId: Int,
    playerId: Int,
    roundElement: RoundElements,
    player: Players,
  }

  type AnswerMutations {
    create(playerId: Int!, roundElementId: Int!, value: String!): Answers,
  }
`;

export default schema;