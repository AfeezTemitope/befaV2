"use client";
import { Box, IconButton, Flex, Text } from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import AnnouncementsSection from "../components/AnnouncementsSection";
import SchedulesSection from "../components/ScheduleSection.jsx";
import PlayerOfTheMonth from "../components/PlayerOfTheMonth.jsx";

const MainContent = ({ isSidebarOpen, onToggleSidebar }) => {
    return (
        <Box
            flex="1"
            bg="gray.50"
            minH="100vh"
            p={2}
            w="100%"
        >
            <Flex
                bg="black"
                color="white"
                h="60px"
                alignItems="center"
                px="2"
                display={{ base: "none", md: "flex" }}
                position={{ md: "fixed" }}
                top={{ md: 0 }}
                left={{ md: 0 }}
                right={{ md: 0 }}
                zIndex={{ md: 9 }}
            >
                <IconButton
                    aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                    icon={isSidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
                    onClick={onToggleSidebar}
                    variant="ghost"
                    color="gray.400"
                    _hover={{ bg: "green.500", color: "white" }}
                />
                <Text ml="4" fontWeight="bold" color="green.400">
                    BEFA - Budu Elite Football Academy
                </Text>
            </Flex>
            <Box pt={{ base: 0, md: "60px" }} p={{ base: "4", md: 0 }} pb={{ base: "4", md: "16" }}>
                <SchedulesSection />
                <AnnouncementsSection />
                <PlayerOfTheMonth/>
            </Box>
        </Box>
    );
};

export default MainContent;