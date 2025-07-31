import TextCursor from './CursorAnimation'

const TextCursorDemo = () => {
  return (
    <div className="flex w-full min-h-screen justify-center items-center bg-black p-8">
      <div className="w-full h-[400px] relative">
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
    </div>
  )
}

export { TextCursorDemo }
