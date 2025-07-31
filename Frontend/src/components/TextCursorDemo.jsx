import TextCursor from './CursorAnimation'

const TextCursorDemo = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative">
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
      <h1 className="text-4xl z-10">Move your mouse around 🖱️</h1>
    </div>
  )
}

export { TextCursorDemo }
