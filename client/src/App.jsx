"use client";
import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Flex, Box } from '@chakra-ui/react';
import Sidebar from './pages/Sidebar';
import MainContent from './pages/MainSection.jsx';

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        console.log('Toggling sidebar, current state:', isSidebarOpen);
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Router>
            <Flex minH="100vh" w="100%" bg="gray.50" overflow="hidden" flexDirection={{ base: 'column', md: 'row' }}>
                <Box
                    position={{ base: 'relative', md: 'fixed' }}
                    h={{ base: 'auto', md: '100vh' }}
                    w={{ base: '100%', md: isSidebarOpen ? '250px' : '80px' }}
                    transition="width 0.3s ease"
                    zIndex={10}
                >
                    <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
                </Box>
                <Box
                    flex="1"
                    ml={{ base: 0, md: isSidebarOpen ? '250px' : '80px' }}
                    mt={{ base: '60px', md: 0 }}
                    w={{ base: '100%', md: 'auto' }}
                    transition="margin-left 0.3s ease"
                    overflowY="auto"
                    css={{ scrollBehavior: 'smooth' }}
                >
                    <MainContent
                        isSidebarOpen={isSidebarOpen}
                        onToggleSidebar={toggleSidebar}
                    />
                </Box>
            </Flex>
        </Router>
    );
}

export default App;