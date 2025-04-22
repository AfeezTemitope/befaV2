import { useState, useEffect } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  Card,
  CardBody,
  Image,
  Button,
  Flex,
  HStack,
  Select,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react"
import { FaArrowLeft, FaTrophy } from "react-icons/fa"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { usePlayersArchive } from "../hooks/usePlayerOfTheMonth"

const PlayersArchivePage = () => {
  const { players, isLoading } = usePlayersArchive()
  const [filteredPlayers, setFilteredPlayers] = useState([])
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedMonth, setSelectedMonth] = useState("all")

  const cardBg = useColorModeValue("white", "gray.900")
  const borderColor = useColorModeValue("gray.200", "gray.800")

  // Get unique years and months from players data
  const years = players ? [...new Set(players.map((p) => p.playerOfMonthDetails.year))].sort((a, b) => b - a) : []

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  useEffect(() => {
    if (players) {
      let filtered = [...players]

      if (selectedYear !== "all") {
        filtered = filtered.filter((p) => p.playerOfMonthDetails.year === Number.parseInt(selectedYear))
      }

      if (selectedMonth !== "all") {
        filtered = filtered.filter((p) => p.playerOfMonthDetails.month === selectedMonth)
      }

      // Sort by year and month (most recent first)
      filtered.sort((a, b) => {
        if (a.playerOfMonthDetails.year !== b.playerOfMonthDetails.year) {
          return b.playerOfMonthDetails.year - a.playerOfMonthDetails.year
        }

        return months.indexOf(b.playerOfMonthDetails.month) - months.indexOf(a.playerOfMonthDetails.month)
      })

      setFilteredPlayers(filtered)
    }
  }, [players, selectedYear, selectedMonth])

  return (
    <Box minH="100vh" bg="bg-canvas">
      <Navbar />

      <Container maxW="container.xl" py={8}>
        <Button as={RouterLink} to="/" leftIcon={<FaArrowLeft />} variant="ghost" mb={6}>
          Back to Home
        </Button>

        <Heading size="xl" mb={2}>
          Player of the Month Archive
        </Heading>
        <Text color="text-secondary" mb={8}>
          Browse our past Player of the Month winners
        </Text>

        {/* Filters */}
        <HStack spacing={4} mb={8}>
          <Select
            placeholder="Filter by year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            maxW="200px"
          >
            <option value="all">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>

          <Select
            placeholder="Filter by month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            maxW="200px"
          >
            <option value="all">All Months</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </Select>
        </HStack>

        {isLoading ? (
          <Text>Loading players archive...</Text>
        ) : filteredPlayers.length > 0 ? (
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
            {filteredPlayers.map((player) => (
              <Card key={player._id} bg={cardBg} borderColor={borderColor} overflow="hidden">
                <Box position="relative" h="250px">
                  <Image
                    src={player.images[0] || "/placeholder.jpg"}
                    alt={player.name}
                    objectFit="cover"
                    w="100%"
                    h="100%"
                    fallbackSrc="https://via.placeholder.com/300x250?text=Player"
                  />
                  <Badge position="absolute" top={2} right={2} colorScheme="yellow" variant="solid" px={2} py={1}>
                    <Flex align="center">
                      <Box as={FaTrophy} mr={1} />
                      <Text>
                        {player.playerOfMonthDetails.month} {player.playerOfMonthDetails.year}
                      </Text>
                    </Flex>
                  </Badge>
                </Box>

                <CardBody p={4}>
                  <Heading size="md" mb={2}>
                    {player.name}
                  </Heading>

                  <Text fontSize="sm" color="text-secondary" mb={2}>
                    {player.position}
                  </Text>

                  <Text fontSize="sm" color="text-secondary" noOfLines={3} mb={4}>
                    {player.playerOfMonthDetails.announcement.substring(0, 150)}...
                  </Text>

                  <Button colorScheme="brand" size="sm" w="full">
                    View Details
                  </Button>
                </CardBody>
              </Card>
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" py={10}>
            <Heading size="md" mb={4}>
              No players found
            </Heading>
            <Text>Try adjusting your filters</Text>
          </Box>
        )}
      </Container>

      <Footer />
    </Box>
  )
}

export default PlayerOfTheMonth
