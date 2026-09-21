import { Button } from "@/components/ui/button"
import { getMeAction } from "@/features/Auth/state/authActions"
import { useAppDispatch } from "@/shared/hooks/hooks"
import { useEffect } from "react"

const HomePage = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getMeAction())
  }, [])
  return (
    <div className="text-3xl">
      <h2>Talkify</h2>
      <Button variant={"ghost"}>Talk to me</Button>
      <Button size={'sm'} variant={"outline"}>Talk to other</Button>
    </div>
  )
}

export default HomePage