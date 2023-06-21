import * as React from 'react';
import {
  Box,
  Checkbox,
  Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField,
  Tooltip
} from '@mui/material';
import {tableCellClasses} from '@mui/material/TableCell';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import PropTypes from 'prop-types';
import * as api from '../../../fake-backend/api';
import {red, green} from '@mui/material/colors';

const ORDERED_TYPES = ['INDEX', 'CURRENCY', 'CRYPTOCURRENCY', 'FUTURE', 'EQUITY'];

const Symbols = ({onTimeSeries}) => {
  const [symbols, setSymbols] = React.useState([]);
  const [selectedSymbol, setSelectedSymbol] = React.useState();
  const [filter, setFilter] = React.useState('');
  const [filteredSymbols, setFilteredSymbols] = React.useState([]);

  React.useMemo(() => {
    api.symbols()
      .then(symbols => symbols
        .map(s => ({
          ...s,
          typeSortable: ORDERED_TYPES.indexOf(s.type),
          filterables: [s.symbol, s.label, s.name, s.type].map(str => str.toLowerCase()),
        }))
        .sort((a, b) => {
          let result = a.typeSortable - b.typeSortable;
          if (result === 0) {
            result = a.label.localeCompare(b.label);
          }

          return result;
        })
      )
      .then(setSymbols)
      .catch(reason => console.error(reason));
  }, []);

  React.useEffect(() => {
    if (selectedSymbol !== undefined) {
      api.symbol(selectedSymbol)
        .then(timeSeries => onTimeSeries(timeSeries))
        .catch(() => setSelectedSymbol(undefined));
    } else {
      onTimeSeries(undefined);
    }
  }, [onTimeSeries, selectedSymbol]);


  React.useEffect(() => {
    api.symbol("^DJI")
    .then(timeSeries => onTimeSeries(timeSeries))
    .catch(() => setSelectedSymbol(undefined));
  }, [])

  React.useMemo(() => {
    setFilteredSymbols(filter.length > 0
      ? symbols.filter(s => s.symbol === selectedSymbol || s.filterables.some(filterable => filterable.includes(filter)))
      : symbols
    );
  }, [symbols, selectedSymbol, filter]);

  const handleToggle = symbol => {
    setSelectedSymbol(symbol === selectedSymbol ? undefined : symbol);
  };

  const handleFilter = value => {
    setFilter(value.trim().toLowerCase());
  };

  return (
    <Stack>
      <Box sx={{display: 'flex', alignItems: 'flex-end', mx: 2, mt: 2}}>
        <FilterAltIcon sx={{color: 'action.active', mr: 1, my: 0.5}}/>
        <TextField
          fullWidth={true}
          onChange={e => handleFilter(e.target.value)}
          placeholder="Search symbols to overlay"
          size="small"
          variant="standard"
        />
      </Box>

      <TableContainer sx={{mt: 1}}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{'& th': {border: 0, paddingX: 1}}}>
              <TableCell></TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center" colSpan={2}>Change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSymbols.map((symbol, i, arr) => {
              const labelId = `checkbox-symbol-label-${symbol.symbol}`;
              const isSelected = symbol.symbol === selectedSymbol;
              const changeColor = symbol.changeAbs < 0 ? red['A200'] : green['A700'];
              const isNextDifferentType = i + 1 < arr.length && symbol.type !== arr[i + 1].type;

              return (
                <Tooltip followCursor title={symbol.name} key={symbol.symbol}>
                  <TableRow
                    hover
                    onClick={() => handleToggle(symbol.symbol)}
                    role="checkbox"
                    tabIndex={-1}
                    aria-checked={isSelected}
                    selected={isSelected}
                    sx={{
                      cursor: 'pointer',
                      '& td, & th': {paddingX: 1, borderBottomWidth: isNextDifferentType ? 3 : 1},
                      '&:last-child td, &:last-child th': {border: 0}
                    }}
                  >
                    <TableCell
                      padding="checkbox"
                      sx={{
                        [`&.${tableCellClasses.paddingCheckbox}`]: {paddingX: 1}
                      }}
                    >
                      <Checkbox
                        checked={isSelected}
                        inputProps={{'aria-labelledby': labelId}}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row" sx={{fontWeight: 'bold'}}>
                      {symbol.label}
                    </TableCell>
                    <TableCell align="right">{symbol.price.toFixed(2)}</TableCell>
                    <TableCell align="right" sx={{color: changeColor}}>{symbol.changeAbs.toFixed(2)}</TableCell>
                    <TableCell align="right" sx={{color: changeColor}}>{symbol.changePct.toFixed(2)}%</TableCell>
                  </TableRow>
                </Tooltip>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

Symbols.propTypes = {
  onTimeSeries: PropTypes.func.isRequired // ({from: date-time, prices: {symbol: string, label: string, name: string, tstamp: string, price: number, changeAbs: number, changePct: number}[]}) => void
};

export default Symbols;
