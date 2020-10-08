const schema = `
  type RoundElements {
    name: String,
    answer: String,
    id: Int,
    gameSessionId: Int,
    points: Int,
    status: String,
    link: String,
    gameSession: GameSessions
  }

  type RoundElementMutations {
    create(gameSessionId: Int!, name: String!, link: String!, answer: String!, points: Int): RoundElements,
    update(id: Int!, name: String, link: String, answer: String, points: Int): RoundElements,
  }
`;

export default schema;