import { Flex, IconButton } from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import Logo from './Logo';

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
            <Logo isVisible={true} />
        </Flex>
    );
};

export default MobileNav;
