import React from 'react';
import { Flex, Icon, Text } from '@chakra-ui/react';

const NavItem = ({ icon, children, href, onClose, isActive, isOpen }) => {
    const handleClick = (e) => {
        e.preventDefault();
        const targetId = href.replace('#', '');
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        onClose();
    };

    return (
        <a href={href} style={{ textDecoration: 'none' }} onClick={handleClick}>
            <Flex
                align="center"
                p="3"
                mx="2"
                borderRadius="lg"
                cursor="pointer"
                bg={isActive ? 'green.500' : 'transparent'}
                color={isActive ? 'white' : 'gray.300'}
                _hover={{ bg: 'green.400', color: 'white' }}
                transition="all 0.3s"
                fontSize={{ base: 'sm', md: 'md' }}
            >
                {icon && <Icon as={icon} mr="3" fontSize="16" />}
                {isOpen && <Text>{children}</Text>}
            </Flex>
        </a>
    );
};

export default NavItem;