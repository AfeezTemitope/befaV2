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
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Textarea,
} from '@chakra-ui/react';
import { AddIcon, ArrowLeftIcon } from '@chakra-ui/icons';

const AdminDashboard = () => {
    const [schedules, setSchedules] = useState([
        { day: '', time: '', jerseyColor: '', location: '', coach: '' },
    ]);
    const [player, setPlayer] = useState({
        name: '',
        position: '',
        description: '',
        strengths: '',
        images: [],
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmittingSchedules, setIsSubmittingSchedules] = useState(false);
    const [isSubmittingPlayer, setIsSubmittingPlayer] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Redirect if no token
    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
        }
    }, [token, navigate]);

    // Schedule Handlers (Unchanged)
    const handleScheduleInputChange = (index, field, value) => {
        const newSchedules = [...schedules];
        newSchedules[index][field] = value;
        setSchedules(newSchedules);
    };

    const addScheduleRow = () => {
        setSchedules([...schedules, { day: '', time: '', jerseyColor: '', location: '', coach: '' }]);
    };

    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmittingSchedules) return;
        setIsSubmittingSchedules(true);
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
            setIsSubmittingSchedules(false);
        }
    };

    // Player Handlers
    const handlePlayerInputChange = (field, value) => {
        setPlayer((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (index, field, value) => {
        const newImages = [...player.images];
        newImages[index] = { ...newImages[index], [field]: value };
        setPlayer((prev) => ({ ...prev, images: newImages }));
    };

    const addImageRow = () => {
        if (player.images.length >= 10) {
            setError('Maximum 10 images allowed');
            return;
        }
        setPlayer((prev) => ({
            ...prev,
            images: [...prev.images, { file: null, caption: '' }],
        }));
    };

    const removeImageRow = (index) => {
        const newImages = player.images.filter((_, i) => i !== index);
        setPlayer((prev) => ({ ...prev, images: newImages }));
    };

    const handlePlayerSubmit = async (e) => {
        e.preventDefault();
        if (isSubmittingPlayer) return;
        setIsSubmittingPlayer(true);
        setError('');
        setSuccess('');

        // Validate player fields
        if (!player.name || !player.position || !player.description || !player.strengths) {
            setError('All player fields are required');
            setIsSubmittingPlayer(false);
            return;
        }

        // Validate images
        if (player.images.length < 3) {
            setError('Minimum 3 images required');
            setIsSubmittingPlayer(false);
            return;
        }
        if (player.images.length > 10) {
            setError('Maximum 10 images allowed');
            setIsSubmittingPlayer(false);
            return;
        }
        if (player.images.some((img) => !img.file)) {
            setError('All images must have a file');
            setIsSubmittingPlayer(false);
            return;
        }
        // Validate file types and size
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (
            player.images.some((img) => !allowedTypes.includes(img.file.type) || img.file.size > maxSize)
        ) {
            setError('Images must be JPEG, PNG, or GIF and under 5MB');
            setIsSubmittingPlayer(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', player.name);
            formData.append('position', player.position);
            formData.append('description', player.description);
            // Send strengths as JSON string
            const strengthsArray = player.strengths.split(',').map((s) => s.trim()).filter((s) => s);
            if (strengthsArray.length === 0) {
                setError('At least one strength is required');
                setIsSubmittingPlayer(false);
                return;
            }
            formData.append('strengths', JSON.stringify(strengthsArray));
            // Send images as files and captions
            const captions = player.images.map((image) => image.caption || '');
            formData.append('captions', JSON.stringify(captions));
            player.images.forEach((image) => {
                formData.append('images', image.file); // Files under 'images'
            });

            const response = await fetch('/api/playerOfTheMonth', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                console.error('Server response:', data);
                throw new Error(data.message || 'Failed to update Player of the Month');
            }

            setSuccess('Player of the Month updated successfully!');
            setPlayer({
                name: '',
                position: '',
                description: '',
                strengths: '',
                images: [],
            });
        } catch (err) {
            setError(err.message);
            if (err.message.includes('token')) {
                localStorage.removeItem('token');
                navigate('/admin/login');
            }
        } finally {
            setIsSubmittingPlayer(false);
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
                    Admin Dashboard
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
            <Tabs variant="enclosed" colorScheme="green">
                <TabList>
                    <Tab>Manage Schedules</Tab>
                    <Tab>Manage Player of the Month</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
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
                        <VStack as="form" onSubmit={handleScheduleSubmit} spacing={4}>
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
                                                            name={`schedules[${index}][day]`}
                                                            value={schedule.day}
                                                            onChange={(e) => handleScheduleInputChange(index, 'day', e.target.value)}
                                                            placeholder="e.g., Monday"
                                                            size="sm"
                                                        />
                                                    </FormControl>
                                                </Td>
                                                <Td>
                                                    <FormControl isRequired>
                                                        <Input
                                                            name={`schedules[${index}][time]`}
                                                            value={schedule.time}
                                                            onChange={(e) => handleScheduleInputChange(index, 'time', e.target.value)}
                                                            placeholder="e.g., 18:00"
                                                            size="sm"
                                                        />
                                                    </FormControl>
                                                </Td>
                                                <Td>
                                                    <FormControl isRequired>
                                                        <Input
                                                            name={`schedules[${index}][jerseyColor]`}
                                                            value={schedule.jerseyColor}
                                                            onChange={(e) => handleScheduleInputChange(index, 'jerseyColor', e.target.value)}
                                                            placeholder="e.g., Blue"
                                                            size="sm"
                                                        />
                                                    </FormControl>
                                                </Td>
                                                <Td>
                                                    <FormControl isRequired>
                                                        <Input
                                                            name={`schedules[${index}][location]`}
                                                            value={schedule.location}
                                                            onChange={(e) => handleScheduleInputChange(index, 'location', e.target.value)}
                                                            placeholder="e.g., Main Field"
                                                            size="sm"
                                                        />
                                                    </FormControl>
                                                </Td>
                                                <Td>
                                                    <FormControl isRequired>
                                                        <Input
                                                            name={`schedules[${index}][coach]`}
                                                            value={schedule.coach}
                                                            onChange={(e) => handleScheduleInputChange(index, 'coach', e.target.value)}
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
                                                name={`schedules[${index}][day]`}
                                                value={schedule.day}
                                                onChange={(e) => handleScheduleInputChange(index, 'day', e.target.value)}
                                                placeholder="e.g., Monday"
                                                size="md"
                                            />
                                        </FormControl>
                                        <FormControl isRequired mb={3}>
                                            <FormLabel fontSize="sm">Time</FormLabel>
                                            <Input
                                                name={`schedules[${index}][time]`}
                                                value={schedule.time}
                                                onChange={(e) => handleScheduleInputChange(index, 'time', e.target.value)}
                                                placeholder="e.g., 18:00"
                                                size="md"
                                            />
                                        </FormControl>
                                        <FormControl isRequired mb={3}>
                                            <FormLabel fontSize="sm">Jersey Color</FormLabel>
                                            <Input
                                                name={`schedules[${index}][jerseyColor]`}
                                                value={schedule.jerseyColor}
                                                onChange={(e) => handleScheduleInputChange(index, 'jerseyColor', e.target.value)}
                                                placeholder="e.g., Blue"
                                                size="md"
                                            />
                                        </FormControl>
                                        <FormControl isRequired mb={3}>
                                            <FormLabel fontSize="sm">Location</FormLabel>
                                            <Input
                                                name={`schedules[${index}][location]`}
                                                value={schedule.location}
                                                onChange={(e) => handleScheduleInputChange(index, 'location', e.target.value)}
                                                placeholder="e.g., Main Field"
                                                size="md"
                                            />
                                        </FormControl>
                                        <FormControl isRequired>
                                            <FormLabel fontSize="sm">Coach</FormLabel>
                                            <Input
                                                name={`schedules[${index}][coach]`}
                                                value={schedule.coach}
                                                onChange={(e) => handleScheduleInputChange(index, 'coach', e.target.value)}
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
                                isLoading={isSubmittingSchedules}
                                isDisabled={isSubmittingSchedules}
                                size={{ base: 'md', md: 'lg' }}
                            >
                                Replace Schedules
                            </Button>
                        </VStack>
                    </TabPanel>
                    <TabPanel>
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
                        <VStack as="form" onSubmit={handlePlayerSubmit} spacing={4}>
                            <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>
                                Update Player of the Month (Replaces Existing)
                            </Text>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm">Name</FormLabel>
                                <Input
                                    name="name"
                                    value={player.name}
                                    onChange={(e) => handlePlayerInputChange('name', e.target.value)}
                                    placeholder="e.g., Marcus Johnson"
                                    size="md"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm">Position</FormLabel>
                                <Input
                                    name="position"
                                    value={player.position}
                                    onChange={(e) => handlePlayerInputChange('position', e.target.value)}
                                    placeholder="e.g., Forward"
                                    size="md"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm">Description</FormLabel>
                                <Textarea
                                    name="description"
                                    value={player.description}
                                    onChange={(e) => handlePlayerInputChange('description', e.target.value)}
                                    placeholder="e.g., Marcus has been exceptional..."
                                    size="md"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm">Strengths (comma-separated)</FormLabel>
                                <Input
                                    name="strengths"
                                    value={player.strengths}
                                    onChange={(e) => handlePlayerInputChange('strengths', e.target.value)}
                                    placeholder="e.g., Finishing, Speed, Leadership"
                                    size="md"
                                />
                            </FormControl>
                            {/* Desktop: Table Layout */}
                            <TableContainer display={{ base: 'none', md: 'block' }} overflowX="auto">
                                <Table variant="simple" size="sm">
                                    <Thead bg="green.500">
                                        <Tr>
                                            <Th color="white">Image File</Th>
                                            <Th color="white">Caption</Th>
                                            <Th color="white">Action</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {player.images.map((image, index) => (
                                            <Tr key={index}>
                                                <Td>
                                                    <FormControl>
                                                        <Input
                                                            type="file"
                                                            accept="image/*"
                                                            name={`images[${index}][file]`}
                                                            onChange={(e) =>
                                                                handleImageChange(index, 'file', e.target.files[0])
                                                            }
                                                            size="sm"
                                                        />
                                                    </FormControl>
                                                </Td>
                                                <Td>
                                                    <FormControl>
                                                        <Input
                                                            name={`images[${index}][caption]`}
                                                            value={image.caption}
                                                            onChange={(e) =>
                                                                handleImageChange(index, 'caption', e.target.value)
                                                            }
                                                            placeholder="e.g., Scoring goal"
                                                            size="sm"
                                                        />
                                                    </FormControl>
                                                </Td>
                                                <Td>
                                                    <Button
                                                        colorScheme="red"
                                                        size="sm"
                                                        onClick={() => removeImageRow(index)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            {/* Mobile: Stacked Layout */}
                            <VStack display={{ base: 'flex', md: 'none' }} spacing={4} w="full">
                                {player.images.map((image, index) => (
                                    <Box key={index} borderWidth="1px" borderRadius="md" p={4} w="full">
                                        <FormControl mb={3}>
                                            <FormLabel fontSize="sm">Image File</FormLabel>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                name={`images[${index}][file]`}
                                                onChange={(e) =>
                                                    handleImageChange(index, 'file', e.target.files[0])
                                                }
                                                size="md"
                                            />
                                        </FormControl>
                                        <FormControl mb={3}>
                                            <FormLabel fontSize="sm">Caption</FormLabel>
                                            <Input
                                                name={`images[${index}][caption]`}
                                                value={image.caption}
                                                onChange={(e) =>
                                                    handleImageChange(index, 'caption', e.target.value)
                                                }
                                                placeholder="e.g., Scoring goal"
                                                size="md"
                                            />
                                        </FormControl>
                                        <Button
                                            colorScheme="red"
                                            size="md"
                                            onClick={() => removeImageRow(index)}
                                            w="full"
                                        >
                                            Remove Image
                                        </Button>
                                    </Box>
                                ))}
                            </VStack>
                            <IconButton
                                icon={<AddIcon />}
                                colorScheme="green"
                                onClick={addImageRow}
                                aria-label="Add image row"
                                size={{ base: 'md', md: 'lg' }}
                            />
                            <Button
                                type="submit"
                                colorScheme="green"
                                width="full"
                                isLoading={isSubmittingPlayer}
                                isDisabled={isSubmittingPlayer || player.images.length < 3}
                                size={{ base: 'md', md: 'lg' }}
                            >
                                Update Player of the Month
                            </Button>
                        </VStack>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default AdminDashboard;