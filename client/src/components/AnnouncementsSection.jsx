import { Box, Heading, Text, VStack, Card, CardBody, Badge, Flex } from "@chakra-ui/react";

const AnnouncementsSection = () => {
    // Sample announcements data
    const announcements = [
        {
            id: 1,
            title: "Registration Open for Summer Camp",
            date: "May 15, 2023",
            content: "Registration is now open for our annual summer training camp. Limited spots available.",
            type: "Event",
        },
        {
            id: 2,
            title: "Change in Training Schedule",
            date: "May 10, 2023",
            content: "Due to facility maintenance, all training sessions will be held at the secondary field next week.",
            type: "Important",
        },
        {
            id: 3,
            title: "Parents Meeting",
            date: "May 5, 2023",
            content: "There will be a parents meeting on May 20th to discuss the upcoming tournament schedule.",
            type: "Meeting",
        },
    ];

    return (
        <Box id="announcements" pt="16" pb="10" bg="gray.50" px={{ base: "2", md: 0 }}>
            <Heading as="h2" size="xl" mb="2" color="green.600">
                Club Announcements
            </Heading>
            <VStack spacing="2" align="stretch">
                {announcements.map((item) => (
                    <Card key={item.id} shadow="md">
                        <CardBody>
                            <Flex justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Heading size="md" mb="2">
                                        {item.title}
                                    </Heading>
                                    <Text fontSize="sm" color="gray.500" mb="3">
                                        {item.date}
                                    </Text>
                                    <Text>{item.content}</Text>
                                </Box>
                                <Badge colorScheme={item.type === "Important" ? "red" : "green"} ml="2">
                                    {item.type}
                                </Badge>
                            </Flex>
                        </CardBody>
                    </Card>
                ))}
            </VStack>
        </Box>
    );
};

export default AnnouncementsSection;