import { Button } from "@/components/ui/button"

const HomePage = () => {
  return (
    <div className="text-3xl">
      <h2>Talkify</h2>
      <Button variant={"ghost"}>Talk to me</Button>
      <Button size={'sm'} variant={"outline"}>Talk to other</Button>
    </div>
  )
}

export default HomePage