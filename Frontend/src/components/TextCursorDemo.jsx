import TextCursor from './CursorAnimation'

const TextCursorDemo = () => {
  return (
    <TextCursor
      text="🖱️"
      delay={0.02}
      spacing={50}
      followMouseDirection={true}
      randomFloat={true}
      exitDuration={0.4}
      removalInterval={25}
      maxPoints={15}
    />
  )
}

export { TextCursorDemo }
