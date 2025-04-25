import { useState, useEffect } from 'react';
import { Box, Heading, Image, Button, Flex, Text, Grid, Spinner, Card } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import usePlayerOfTheMonthStore from '../hooks/usePlayerOfTheMonthStore.js';

export default function PlayerOfTheMonth() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { player, loading, error, fetchPlayer } = usePlayerOfTheMonthStore();

    useEffect(() => {
        console.log('Fetching player on mount...');
        fetchPlayer();
    }, [fetchPlayer]);

    const nextImage = () => {
        if (player && player.images) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % player.images.length);
        }
    };

    const prevImage = () => {
        if (player && player.images) {
            setCurrentImageIndex(
                (prevIndex) => (prevIndex - 1 + player.images.length) % player.images.length
            );
        }
    };

    if (loading) {
        return (
            <Box textAlign="center" py="8">
                <Spinner size="lg" color="green.500" />
                <Text mt="2" color="gray.600">Loading Player of the Month...</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Box textAlign="center" py="8">
                <Text color="red.500">Error: {error}</Text>
            </Box>
        );
    }

    if (!player || !player.images || player.images.length === 0) {
        return (
            <Box textAlign="center" py="8">
                <Text color="gray.600">No Player of the Month data available.</Text>
            </Box>
        );
    }

    const currentImage = player.images[currentImageIndex];

    return (
        <Box id="player-of-month" maxW="5xl" mx="auto" py={{ base: '8', md: '12' }} px={{ base: '4', md: '0' }}>
            <Heading
                as="h1"
                size={{ base: 'xl', md: '2xl' }}
                textAlign="center"
                py="6"
                bg="green.600"
                color="white"
                mb="8"
                rounded="md"
            >
                BEFA PLAYER OF THE MONTH
            </Heading>

            <Card bg="gray.900" p={{ base: '4', md: '8' }} rounded="lg" shadow="lg">
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    gap={{ base: '6', md: '8' }}
                    align={{ base: 'center', md: 'flex-start' }}
                >
                    <Box
                        position="relative"
                        w={{ base: 'full', md: '300px' }}
                        h={{ base: '300px', md: '400px' }}
                        flexShrink={0}
                    >
                        <Image
                            src={currentImage.url || '/placeholder.svg'}
                            alt={`${player.name} - ${currentImage.caption || `Image ${currentImageIndex + 1}`}`}
                            w="full"
                            h="full"
                            objectFit="cover"
                            rounded="md"
                            fallbackSrc="/placeholder.svg"
                        />
                        {currentImage.caption && (
                            <Box
                                position="absolute"
                                bottom="0"
                                left="0"
                                right="0"
                                bg="blackAlpha.700"
                                color="white"
                                p="2"
                                fontSize="sm"
                                textAlign="center"
                            >
                                {currentImage.caption}
                            </Box>
                        )}
                        <Flex
                            position="absolute"
                            bottom="4"
                            left="0"
                            right="0"
                            justify="center"
                            gap="4"
                        >
                            <Button
                                onClick={prevImage}
                                bg="green.600"
                                color="white"
                                _hover={{ bg: 'green.700' }}
                                rounded="full"
                                size="md"
                                aria-label="Previous image"
                            >
                                <ChevronLeftIcon boxSize="6" />
                            </Button>
                            <Button
                                onClick={nextImage}
                                bg="green.600"
                                color="white"
                                _hover={{ bg: 'green.700' }}
                                rounded="full"
                                size="md"
                                aria-label="Next image"
                            >
                                <ChevronRightIcon boxSize="6" />
                            </Button>
                        </Flex>
                    </Box>

                    <Box flex="1" color="gray.200">
                        <Box mb="4">
                            <Heading as="h2" size={{ base: 'lg', md: 'xl' }} color="green.500">
                                {player.name}
                            </Heading>
                            <Text fontSize={{ base: 'md', md: 'lg' }} color="green.400">
                                {player.position}
                            </Text>
                        </Box>

                        <Box mb="6">
                            <Heading as="h3" size="md" color="green.500" mb="2">
                                Profile
                            </Heading>
                            <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.300">
                                {player.description}
                            </Text>
                        </Box>

                        <Box>
                            <Heading as="h3" size="md" color="green.500" mb="2">
                                Strengths
                            </Heading>
                            <Grid
                                templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
                                gap="2"
                            >
                                {player.strengths.map((strength, index) => (
                                    <Box
                                        key={index}
                                        bg="green.900"
                                        color="green.100"
                                        px="4"
                                        py="2"
                                        rounded="md"
                                        textAlign="center"
                                        fontSize={{ base: 'sm', md: 'md' }}
                                    >
                                        {strength}
                                    </Box>
                                ))}
                            </Grid>
                        </Box>

                        <Flex mt="6" align="center">
                            <Box flex="1" h="1" bg="gray.700">
                                {player.images.map((_, index) => (
                                    <Box
                                        key={index}
                                        w={`${100 / player.images.length}%`}
                                        h="full"
                                        bg={index === currentImageIndex ? 'green.500' : 'gray.700'}
                                        display="inline-block"
                                        transition="background 0.3s"
                                    />
                                ))}
                            </Box>
                            <Text
                                ml="4"
                                color="green.400"
                                fontWeight="medium"
                                fontSize={{ base: 'sm', md: 'md' }}
                            >
                                {currentImageIndex + 1}/{player.images.length}
                            </Text>
                        </Flex>
                    </Box>
                </Flex>
            </Card>
        </Box>
    );
}