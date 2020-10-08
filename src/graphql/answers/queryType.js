const schema = `
  type Answers {
    value: String,
    roundElementId: Int,
    playerId: Int,
    roundElement: RoundElements,
    player: Players,
  }
`;

export default schema;