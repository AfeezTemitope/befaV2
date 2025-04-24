import { Box, Flex, VStack, CloseButton, IconButton } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import NavItem from './NavItem';
import Logo from './Logo';
import NavButtons from './NavButtons';
import { NavItems } from './NavConfig';

const SidebarContent = ({ onClose, activeItem, setActiveItem, isOpen, isMobile, onToggle }) => {
    return (
        <Box
            bg="black"
            w={{ base: 'full', md: isOpen ? '250px' : '80px' }}
            h="100vh"
            zIndex={10}
            display="flex"
            flexDirection="column"
            transition="width 0.3s ease"
            overflow="hidden"
            p={0}
            m={0}
        >
            <Flex h="16" alignItems="center" mx="4" justifyContent="space-between">
                <Logo isVisible={isOpen} />
                {isMobile ? (
                    <CloseButton
                        display={{ base: 'flex', md: 'none' }}
                        onClick={onClose}
                        color="gray.400"
                    />
                ) : (
                    <IconButton
                        display={{ base: 'none', md: 'flex' }}
                        onClick={onToggle}
                        variant="outline"
                        aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                        icon={isOpen ? <FiChevronLeft /> : <FiChevronRight />}
                        color="gray.400"
                        _hover={{ bg: 'green.500', color: 'white' }}
                    />
                )}
            </Flex>

            <Box flex="1" overflowY="auto" mt={4}>
                <VStack spacing={1} align="stretch">
                    {NavItems.map((item) => (
                        <NavItem
                            key={item.name}
                            icon={item.icon}
                            href={item.href}
                            onClose={onClose}
                            isActive={activeItem === item.href}
                            isOpen={isOpen}
                            onClick={() => setActiveItem(item.href)}
                        >
                            {item.name}
                        </NavItem>
                    ))}
                </VStack>
            </Box>

            {isOpen && (
                <Box mt="auto" px={4} py={4}>
                    <NavButtons />
                </Box>
            )}
        </Box>
    );
};

export default SidebarContent;