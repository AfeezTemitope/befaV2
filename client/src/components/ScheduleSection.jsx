import { useEffect } from 'react';
import {
    Box,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Badge,
    Card,
    Text,
    Spinner,
} from '@chakra-ui/react';
import useSchedulesStore from '../hooks/useScheduleStore';

const SchedulesSection = () => {
    const { schedules, loading, error, fetchSchedules } = useSchedulesStore();

    useEffect(() => {
        // Fetch schedules when the component mounts
        fetchSchedules();
    }, [fetchSchedules]);

    return (
        <Box id="schedules" pt="20" pb="16" bg="gray.50">
            <Heading as="h2" size="xl" mb="6" color="green.600">
                Training Schedules
            </Heading>

            {loading && (
                <Box textAlign="center" py="4">
                    <Spinner size="lg" color="green.500" />
                    <Text mt="2">Loading schedules...</Text>
                </Box>
            )}

            {error ? (
                // Display error message if there is an error
                <Text color="red.500" mb="4">
                    {error} {/* Display the error message */}
                </Text>
            ) : (
                !loading && // Only display this if NOT loading and no error
                (!Array.isArray(schedules) || schedules.length === 0) && (
                    <Text>No schedules available.</Text>
                )
            )}

            {!loading && !error && Array.isArray(schedules) && schedules.length > 0 && (
                <Card shadow="md" overflow="hidden">
                    <TableContainer>
                        <Table variant="simple">
                            <Thead bg="green.500">
                                <Tr>
                                    <Th color="white">Day</Th>
                                    <Th color="white">Time</Th>
                                    <Th color="white">Jersey Color</Th>
                                    <Th color="white" display={{ base: 'none', md: 'table-cell' }}>
                                        Location
                                    </Th>
                                    <Th color="white" display={{ base: 'none', md: 'table-cell' }}>
                                        Coach
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {schedules.map((schedule) => (
                                    <Tr key={schedule._id}>
                                        <Td fontWeight="bold">{schedule.day}</Td>
                                        <Td>{schedule.time}</Td>
                                        <Td>{schedule.jerseyColor}</Td>
                                        <Td display={{ base: 'none', md: 'table-cell' }}>{schedule.location}</Td>
                                        <Td display={{ base: 'none', md: 'table-cell' }}>{schedule.coach}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Card>
            )}
        </Box>
    );
};

export default SchedulesSection;