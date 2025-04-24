import { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Button, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Invalid email or password');
            }
            localStorage.setItem('token', data.token);
            setCredentials({ email: '', password: '' });
            setError('');
            navigate('/admin-dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Box maxW="sm" mx="auto" mt="10" p="6" borderWidth="1px" borderRadius="lg">
            <Heading as="h2" size="lg" mb="6" textAlign="center" color="green.600">
                Admin Login
            </Heading>
            {error && (
                <Text color="red.500" mb="4">
                    {error}
                </Text>
            )}
            <VStack as="form" onSubmit={handleSubmit} spacing="4">
                <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleInputChange}
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleInputChange}
                    />
                </FormControl>
                <Button type="submit" colorScheme="green" width="full">
                    Login
                </Button>
            </VStack>
        </Box>
    );
};

export default AdminLogin;