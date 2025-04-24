import React, { useEffect, useState } from 'react';
import { Box, Drawer, DrawerOverlay, DrawerContent, DrawerBody } from '@chakra-ui/react';
import SidebarContent from './SidebarContent';
import MobileNav from './MobileNav';
import { NavItems } from './NavConfig';

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
                    isMobile={false}
                    onToggle={onToggle}
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
                                    isMobile={true}
                                    onToggle={onToggle}
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