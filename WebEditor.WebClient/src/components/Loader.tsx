import React from 'react';
import { observer } from "mobx-react-lite";
import { Modal, CircularProgress, Box } from '@mui/material';
import { useStore } from '../UseStore';

const Loader: React.FC = observer(() => {
    const store = useStore();

    return (
        <Modal
            open={store.loading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Box sx={{ outline: 'none' }}>
                <CircularProgress />
            </Box>
        </Modal>
    );
});

export default Loader;
