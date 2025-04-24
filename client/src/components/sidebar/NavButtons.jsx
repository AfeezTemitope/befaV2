import React from 'react';
import { VStack, Button } from '@chakra-ui/react';

const NavButtons = () => {
    return (
        <VStack spacing={2}>
            <Button
                as="a"
                href="/admin/login"
                colorScheme="green"
                variant="outline"
                size="sm"
                width="full"
            >
                SIGN IN
            </Button>
            <Button
                as="a"
                href="/subscribe"
                colorScheme="green"
                size="sm"
                width="full"
            >
                SUBSCRIBE
            </Button>
        </VStack>
    );
};

export default NavButtons;