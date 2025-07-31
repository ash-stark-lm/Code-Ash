import TextCursor from './CursorAnimation'

const TextCursorDemo = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]">
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
    </div>
  )
}

export { TextCursorDemo }
