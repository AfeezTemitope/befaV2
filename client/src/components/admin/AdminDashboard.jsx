import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    VStack,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Flex,
    TableContainer,
    Stack,
} from '@chakra-ui/react';
import { AddIcon, ArrowLeftIcon } from '@chakra-ui/icons';

const AdminDashboard = () => {
    const [schedules, setSchedules] = useState([
        { day: '', time: '', jerseyColor: '', location: '', coach: '' },
    ]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Redirect if no token
    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
        }
    }, [token, navigate]);

    const handleInputChange = (index, field, value) => {
        const newSchedules = [...schedules];
        newSchedules[index][field] = value;
        setSchedules(newSchedules);
    };

    const addScheduleRow = () => {
        setSchedules([...schedules, { day: '', time: '', jerseyColor: '', location: '', coach: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return; // Prevent multiple submissions
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(schedules.length === 1 ? schedules[0] : schedules),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to add schedules');
            }

            setSuccess('Schedules updated successfully! Old schedules replaced.');
            setSchedules([{ day: '', time: '', jerseyColor: '', location: '', coach: '' }]);
        } catch (err) {
            setError(err.message);
            if (err.message.includes('token')) {
                localStorage.removeItem('token');
                navigate('/admin/login');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (!token) return null;

    return (
        <Box maxW="container.md" mx="auto" mt={{ base: 4, md: 10 }} p={{ base: 4, md: 6 }} borderWidth="1px" borderRadius="lg">
            <Flex justify="space-between" align="center" mb={6} flexDirection={{ base: 'column', md: 'row' }} gap={4}>
                <Heading as="h2" size={{ base: 'md', md: 'lg' }} color="green.600" textAlign={{ base: 'center', md: 'left' }}>
                    Admin Dashboard - Manage Training Schedules
                </Heading>
                <Button
                    leftIcon={<ArrowLeftIcon />}
                    colorScheme="red"
                    variant="outline"
                    onClick={handleLogout}
                    size={{ base: 'sm', md: 'md' }}
                >
                    Logout
                </Button>
            </Flex>
            {error && (
                <Text color="red.500" mb={4} textAlign="center">
                    {error}
                </Text>
            )}
            {success && (
                <Text color="green.500" mb={4} textAlign="center">
                    {success}
                </Text>
            )}
            <VStack as="form" onSubmit={handleSubmit} spacing={4}>
                <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>
                    Add New Schedules (Replaces Existing)
                </Text>
                {/* Desktop: Table Layout */}
                <TableContainer display={{ base: 'none', md: 'block' }} overflowX="auto">
                    <Table variant="simple" size="sm">
                        <Thead bg="green.500">
                            <Tr>
                                <Th color="white">Day</Th>
                                <Th color="white">Time</Th>
                                <Th color="white">Jersey Color</Th>
                                <Th color="white">Location</Th>
                                <Th color="white">Coach</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {schedules.map((schedule, index) => (
                                <Tr key={index}>
                                    <Td>
                                        <FormControl isRequired>
                                            <Input
                                                value={schedule.day}
                                                onChange={(e) => handleInputChange(index, 'day', e.target.value)}
                                                placeholder="e.g., Monday"
                                                size="sm"
                                            />
                                        </FormControl>
                                    </Td>
                                    <Td>
                                        <FormControl isRequired>
                                            <Input
                                                value={schedule.time}
                                                onChange={(e) => handleInputChange(index, 'time', e.target.value)}
                                                placeholder="e.g., 18:00"
                                                size="sm"
                                            />
                                        </FormControl>
                                    </Td>
                                    <Td>
                                        <FormControl isRequired>
                                            <Input
                                                value={schedule.jerseyColor}
                                                onChange={(e) => handleInputChange(index, 'jerseyColor', e.target.value)}
                                                placeholder="e.g., Blue"
                                                size="sm"
                                            />
                                        </FormControl>
                                    </Td>
                                    <Td>
                                        <FormControl isRequired>
                                            <Input
                                                value={schedule.location}
                                                onChange={(e) => handleInputChange(index, 'location', e.target.value)}
                                                placeholder="e.g., Main Field"
                                                size="sm"
                                            />
                                        </FormControl>
                                    </Td>
                                    <Td>
                                        <FormControl isRequired>
                                            <Input
                                                value={schedule.coach}
                                                onChange={(e) => handleInputChange(index, 'coach', e.target.value)}
                                                placeholder="e.g., John Doe"
                                                size="sm"
                                            />
                                        </FormControl>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                {/* Mobile: Stacked Layout */}
                <VStack display={{ base: 'flex', md: 'none' }} spacing={4} w="full">
                    {schedules.map((schedule, index) => (
                        <Box key={index} borderWidth="1px" borderRadius="md" p={4} w="full">
                            <FormControl isRequired mb={3}>
                                <FormLabel fontSize="sm">Day</FormLabel>
                                <Input
                                    value={schedule.day}
                                    onChange={(e) => handleInputChange(index, 'day', e.target.value)}
                                    placeholder="e.g., Monday"
                                    size="md"
                                />
                            </FormControl>
                            <FormControl isRequired mb={3}>
                                <FormLabel fontSize="sm">Time</FormLabel>
                                <Input
                                    value={schedule.time}
                                    onChange={(e) => handleInputChange(index, 'time', e.target.value)}
                                    placeholder="e.g., 18:00"
                                    size="md"
                                />
                            </FormControl>
                            <FormControl isRequired mb={3}>
                                <FormLabel fontSize="sm">Jersey Color</FormLabel>
                                <Input
                                    value={schedule.jerseyColor}
                                    onChange={(e) => handleInputChange(index, 'jerseyColor', e.target.value)}
                                    placeholder="e.g., Blue"
                                    size="md"
                                />
                            </FormControl>
                            <FormControl isRequired mb={3}>
                                <FormLabel fontSize="sm">Location</FormLabel>
                                <Input
                                    value={schedule.location}
                                    onChange={(e) => handleInputChange(index, 'location', e.target.value)}
                                    placeholder="e.g., Main Field"
                                    size="md"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm">Coach</FormLabel>
                                <Input
                                    value={schedule.coach}
                                    onChange={(e) => handleInputChange(index, 'coach', e.target.value)}
                                    placeholder="e.g., John Doe"
                                    size="md"
                                />
                            </FormControl>
                        </Box>
                    ))}
                </VStack>
                <IconButton
                    icon={<AddIcon />}
                    colorScheme="green"
                    onClick={addScheduleRow}
                    aria-label="Add schedule row"
                    size={{ base: 'md', md: 'lg' }}
                />
                <Button
                    type="submit"
                    colorScheme="green"
                    width="full"
                    isLoading={isSubmitting}
                    isDisabled={isSubmitting}
                    size={{ base: 'md', md: 'lg' }}
                >
                    Replace Schedules
                </Button>
            </VStack>
        </Box>
    );
};

export default AdminDashboard;