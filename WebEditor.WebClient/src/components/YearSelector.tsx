import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useStore } from '../UseStore';
import { observer } from 'mobx-react-lite';

const useStyles = makeStyles(() => ({
    formControl: {
        position: 'absolute',
        top: '7px',
        left: '435px',
        transform: 'translateX(-50%)',
        minWidth: 120,
        backgroundColor: '#FFFFFF80',
        backdropFilter: 'blur(2px)'
    },
}));

const YearSelector: React.FC = observer(() => {
    const classes = useStyles();
    const store = useStore();

    const handleChange = (event: SelectChangeEvent<number>) => {
        store.setYear(event.target.value as number);
    };

    return (
        <FormControl className={classes.formControl} style={{ position: 'fixed' }} sx={{ m: 1, minWidth: 120 }}>
            <Paper elevation={5} sx={{ backgroundColor:'#FFFFFF00', m:0, p:0, display: "inline-grid"}}  >
                <InputLabel id="year-select-label">År</InputLabel>
                <Select
                    labelId="year-select-label"
                    value={store.year}
                    label="År"
                    onChange={handleChange}
                >
                    <MenuItem value="2024">2024</MenuItem>
                    <MenuItem value="2023">2023</MenuItem>
                    <MenuItem value="2022">2022</MenuItem>
                    <MenuItem value="2021">2021</MenuItem>
                    <MenuItem value="2020">2020</MenuItem>
                    <MenuItem value="2014">2014</MenuItem>
                    <MenuItem value="2008">2008</MenuItem>
                </Select>
            </Paper>
        </FormControl>
    );
});

export default YearSelector;