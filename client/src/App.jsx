import { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Flex, Box } from '@chakra-ui/react';
import Sidebar from './components/sidebar/Sidebar';
import MainContent from './pages/MainSection.jsx';
import AdminLogin from './components/admin/AdminLogin.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation(); // Get current route

    // Define routes where sidebar should be hidden
    const hideSidebarRoutes = ['/admin/login', '/admin-dashboard'];

    // Check if sidebar should be shown
    const showSidebar = !hideSidebarRoutes.includes(location.pathname);

    const toggleSidebar = () => {
        console.log('Toggling sidebar, current state:', isSidebarOpen);
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Flex
            minH="100vh"
            w="100%"
            bg="gray.50"
            overflow="hidden"
            flexDirection={{ base: 'column', md: 'row' }}
        >
            {showSidebar && (
                <Box
                    position={{ base: 'relative', md: 'fixed' }}
                    h={{ base: 'auto', md: '100vh' }}
                    w={{ base: '100%', md: isSidebarOpen ? '250px' : '80px' }}
                    transition="width 0.3s ease"
                    zIndex={10}
                >
                    <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
                </Box>
            )}
            <Box
                flex="1"
                ml={{ base: 0, md: showSidebar ? (isSidebarOpen ? '250px' : '80px') : 0 }}
                mt={{ base: showSidebar ? '60px' : 0, md: 0 }}
                w={{ base: '100%', md: 'auto' }}
                transition="margin-left 0.3s ease"
                overflowY="auto"
                css={{ scrollBehavior: 'smooth' }}
            >
                <Routes>
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route
                        path="/"
                        element={<MainContent isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />}
                    />
                </Routes>
            </Box>
        </Flex>
    );
}

export default App;