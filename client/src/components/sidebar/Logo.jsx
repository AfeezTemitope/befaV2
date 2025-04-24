import React from 'react';
import { Flex, Image, Text, Box } from '@chakra-ui/react';
import { logoPath } from './NavConfig';

const Logo = ({ isVisible = true }) => {
    if (!isVisible) return null;
    return (
        <Flex alignItems="center" textAlign='center'>
            <Image
                src={logoPath}
                alt="BEFA Logo"
                boxSize="50px"
                fallbackSrc="https://static.vecteezy.com/system/resources/previews/001/204/023/original/soccer-png.png"
                borderRadius="md"
            />
            <Box ml="2" >
                <Text fontSize="xs" fontWeight="bold" color="green.400">
                    BEFA
                </Text>
                <Text fontSize="xs" color="gray.400">
                    Budu Elite Football Academy
                </Text>
            </Box>
        </Flex>
    );
};

export default Logo;