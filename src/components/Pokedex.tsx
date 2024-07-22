import { useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import OpenAI from 'openai'

const Pokedex: React.FC = () => {
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_GPT_KEY,
    dangerouslyAllowBrowser: true,
  })

  const webcamRef = useRef<Webcam>(null)
  // const [imgSrc, setImgSrc] = useState<string | null>(null)

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot() || null
    // setImgSrc(imageSrc)
    console.log(imageSrc)

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'You are to act like a pokedex from pokemon. Identify the pokemon in the photo and respond with the information a pokedex would respond with.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `${imageSrc}`,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
      model: 'gpt-4o-mini',
    })
    console.log(completion.choices[0])
  }, [webcamRef])

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-red-500'>
      <div className='flex h-96 w-96 flex-col items-center rounded-lg bg-gray-200 p-4 shadow-lg'>
        <div className='mb-4 flex h-64 w-full items-center justify-center rounded-md bg-white shadow-inner'>
          <Webcam ref={webcamRef} />
        </div>
        <button
          onClick={capture}
          className='mt-auto rounded-full bg-blue-500 px-4 py-2 font-bold text-white shadow-lg transition duration-200 hover:bg-blue-700'
        >
          Capture
        </button>
      </div>
    </div>
  )
}

export default Pokedex
