import React, { useEffect, useState } from 'react';
import {
    Box,
    Flex,
    Text,
    VStack,
    Button,
    IconButton,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerBody,
    Image,
    CloseButton,
    Icon,
} from '@chakra-ui/react';
import {
    FiMenu,
    FiMessageSquare,
    FiFileText,
    FiCalendar,
    FiShoppingBag,
    FiAward,
    FiBell,
} from 'react-icons/fi';

const NavItems = [
    { name: 'NEWS', icon: FiMessageSquare, href: '#news' },
    { name: 'CLUB ANNOUNCEMENT', icon: FiBell, href: '#announcements' },
    { name: 'ARTICLES', icon: FiFileText, href: '#articles' },
    { name: 'TRAINING SCHEDULES', icon: FiCalendar, href: '#schedules' },
    { name: 'JERSEY', icon: FiShoppingBag, href: '#jersey' },
    { name: 'PLAYER OF THE MONTH', icon: FiAward, href: '#player-of-month' },
];

const logoPath = '../assets/Befa.png';

const NavItem = ({ icon, children, href, onClose, isActive }) => {
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
                {children}
            </Flex>
        </a>
    );
};

const SidebarContent = ({ onClose, activeItem, setActiveItem, isOpen }) => {
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
                <Flex alignItems="center" display={isOpen ? 'flex' : 'none'}>
                    <Image
                        src={logoPath}
                        alt="BEFA Logo"
                        boxSize="40px"
                        fallbackSrc="https://static.vecteezy.com/system/resources/previews/001/204/023/original/soccer-png.png"
                        borderRadius="md"
                    />
                    <Box ml="2">
                        <Text fontSize="md" fontWeight="bold" color="green.400">
                            BEFA
                        </Text>
                        <Text fontSize="xs" color="gray.400">
                            Budu Elite Football Academy
                        </Text>
                    </Box>
                </Flex>
                <CloseButton
                    display={{ base: 'flex', md: 'none' }}
                    onClick={onClose}
                    color="gray.400"
                />
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
                            onClick={() => setActiveItem(item.href)}
                        >
                            {isOpen && <Text>{item.name}</Text>}
                        </NavItem>
                    ))}
                </VStack>
            </Box>

            {isOpen && (
                <Box mt="auto" px={4} py={4}>
                    <VStack spacing={2}>
                        <Button
                            as="a"
                            href="/signin"
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
                </Box>
            )}
        </Box>
    );
};

const MobileNav = ({ onOpen }) => {
    return (
        <Flex
            px={4}
            height="16"
            alignItems="center"
            bg="black"
            borderBottomWidth="1px"
            borderBottomColor="gray.800"
            justifyContent="space-between"
            display={{ base: 'flex', md: 'none' }}
            position="fixed"
            top="0"
            left="0"
            right="0"
            zIndex={20}
        >
            <IconButton
                onClick={onOpen}
                variant="outline"
                aria-label="Open menu"
                icon={<FiMenu />}
                color="gray.400"
                _hover={{ bg: 'green.500', color: 'white' }}
            />
            <Flex alignItems="center">
                <Image
                    src={logoPath}
                    alt="BEFA Logo"
                    boxSize="40px"
                    fallbackSrc="https://static.vecteezy.com/system/resources/previews/001/204/023/original/soccer-png.png"
                    borderRadius="md"
                />
                <Box ml="2">
                    <Text fontSize="md" fontWeight="bold" color="green.400">
                        BEFA
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                        Budu Elite Football Academy
                    </Text>
                </Box>
            </Flex>
        </Flex>
    );
};

const Sidebar = ({ isOpen, onToggle }) => {
    const [activeItem, setActiveItem] = useState(NavItems[0].href);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const onOpenDrawer = () => {
        if (!isToggling) {
            setIsToggling(true);
            setIsDrawerOpen(true);
            setTimeout(() => setIsToggling(false), 300);
        }
    };

    const onCloseDrawer = () => {
        if (!isToggling) {
            setIsToggling(true);
            setIsDrawerOpen(false);
            setTimeout(() => setIsToggling(false), 300);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;
            NavItems.forEach((item) => {
                const section = document.querySelector(item.href);
                if (section) {
                    const { top, bottom } = section.getBoundingClientRect();
                    const sectionTop = top + window.scrollY;
                    const sectionBottom = bottom + window.scrollY;
                    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                        setActiveItem(item.href);
                    }
                }
            });
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Box>
            {!isMobile && (
                <SidebarContent
                    onClose={onCloseDrawer}
                    activeItem={activeItem}
                    setActiveItem={setActiveItem}
                    isOpen={isOpen}
                />
            )}
            {isMobile && (
                <>
                    <MobileNav onOpen={onOpenDrawer} />
                    <Drawer
                        isOpen={isDrawerOpen}
                        placement="left"
                        onClose={onCloseDrawer}
                        size="full"
                    >
                        <DrawerOverlay />
                        <DrawerContent bg="black">
                            <DrawerBody p={0}>
                                <SidebarContent
                                    onClose={onCloseDrawer}
                                    activeItem={activeItem}
                                    setActiveItem={setActiveItem}
                                    isOpen={true}
                                />
                            </DrawerBody>
                        </DrawerContent>
                    </Drawer>
                </>
            )}
        </Box>
    );
};

export default Sidebar;