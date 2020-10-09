const schema = `
  type RoundElements {
    name: String,
    answer: String,
    id: Int,
    gameSessionId: Int,
    points: Int,
    status: String,
    link: String,
    gameSession: GameSessions,
    answers: [Answers],
    winner: Players
  }

  type RoundElementMutations {
    create(gameSessionId: Int!, name: String!, link: String!, answer: String!, points: Int): RoundElements,
    update(id: Int!, name: String, link: String, answer: String, points: Int): RoundElements,
    destroy(id: Int!): Boolean,
  }
`;

export default schema;