import { useState, useEffect } from "react"
import { playerService } from "../service/playerService"
import { useToast } from "@chakra-ui/react"

export const usePlayerOfTheMonth = () => {
  const [players, setPlayers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const toast = useToast()

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setIsLoading(true)
        const data = await playerService.getPlayersOfMonth()
        setPlayers(data)
      } catch (err) {
        setError(err.message || "Failed to fetch players archive")
        toast({
          title: "Error",
          description: err.message || "Failed to fetch players archive",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayers()
  }, [toast])

  return { players, isLoading, error }
}
