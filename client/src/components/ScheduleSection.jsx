// import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Badge, Card } from "@chakra-ui/react"
//
// const SchedulesSection = () => {
//     // Sample schedule data
//     const schedules = [
//         {
//             id: 1,
//             day: "Monday",
//             time: "4:00 PM - 5:30 PM",
//             group: "U-12",
//             location: "Main Field",
//             coach: "Coach Thompson",
//         },
//         {
//             id: 2,
//             day: "Tuesday",
//             time: "5:00 PM - 6:30 PM",
//             group: "U-14",
//             location: "Training Ground B",
//             coach: "Coach Martinez",
//         },
//         {
//             id: 3,
//             day: "Wednesday",
//             time: "4:00 PM - 5:30 PM",
//             group: "U-12",
//             location: "Main Field",
//             coach: "Coach Thompson",
//         },
//         {
//             id: 4,
//             day: "Thursday",
//             time: "5:00 PM - 6:30 PM",
//             group: "U-14",
//             location: "Training Ground B",
//             coach: "Coach Martinez",
//         },
//         {
//             id: 5,
//             day: "Friday",
//             time: "4:30 PM - 6:00 PM",
//             group: "U-17",
//             location: "Main Field",
//             coach: "Coach Wilson",
//         },
//         {
//             id: 6,
//             day: "Saturday",
//             time: "10:00 AM - 12:00 PM",
//             group: "All Groups",
//             location: "Main Field",
//             coach: "All Coaches",
//         },
//     ]
//
//     return (
//         <Box id="schedules" pt="20" pb="16" bg="gray.100">
//             <Heading as="h2" size="xl" mb="6" color="green.600">
//                 Training Schedules
//             </Heading>
//             <Card shadow="md" overflow="hidden">
//                 <TableContainer>
//                     <Table variant="simple">
//                         <Thead bg="green.500">
//                             <Tr>
//                                 <Th color="white">Day</Th>
//                                 <Th color="white">Time</Th>
//                                 <Th color="white">Group</Th>
//                                 <Th color="white" display={{ base: "none", md: "table-cell" }}>
//                                     Location
//                                 </Th>
//                                 <Th color="white" display={{ base: "none", md: "table-cell" }}>
//                                     Coach
//                                 </Th>
//                             </Tr>
//                         </Thead>
//                         <Tbody>
//                             {schedules.map((schedule) => (
//                                 <Tr key={schedule.id}>
//                                     <Td fontWeight="bold">{schedule.day}</Td>
//                                     <Td>{schedule.time}</Td>
//                                     <Td>
//                                         <Badge colorScheme="green">{schedule.group}</Badge>
//                                     </Td>
//                                     <Td display={{ base: "none", md: "table-cell" }}>{schedule.location}</Td>
//                                     <Td display={{ base: "none", md: "table-cell" }}>{schedule.coach}</Td>
//                                 </Tr>
//                             ))}
//                         </Tbody>
//                     </Table>
//                 </TableContainer>
//             </Card>
//         </Box>
//     )
// }
//
// export default SchedulesSection

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
import useSchedulesStore from './useScheduleStore.js';  

const SchedulesSection = () => {  
    const { schedules, loading, error, fetchSchedules } = useSchedulesStore();  

    useEffect(() => {  
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
            {error && (  
                <Text color="red.500" mb="4">  
                    Error: {error}  
                </Text>  
            )}  
            {!loading && !error && (!Array.isArray(schedules) || schedules.length === 0) && (  
                <Text>No schedules available.</Text>  
            )}  
            {!loading && !error && Array.isArray(schedules) && schedules.length > 0 && (  
                <Card shadow="md" overflow="hidden">  
                    <TableContainer>  
                        <Table variant="simple">  
                            <Thead bg="green.500">  
                                <Tr>  
                                    <Th color="white">Day</Th>  
                                    <Th color="white">Time</Th>  
                                    <Th color="white">Group</Th>  
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
                                    <Tr key={schedule.id}>  
                                        <Td fontWeight="bold">{schedule.day}</Td>  
                                        <Td>{schedule.time}</Td>  
                                        <Td>  
                                            <Badge colorScheme="green">{schedule.group}</Badge>  
                                        </Td>  
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