import * as React from 'react';
import {
  Divider,
  IconButton,
  InputBase,
  Paper,
  Stack,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import * as api from '../../../fake-backend/api';
import {useSearchParams} from 'react-router-dom';
import SearchEntry from './SearchEntry';

const SearchInput = ({onTimeSeries}) => {
  const theme = useTheme();
  const COLORS = [
    '#d500f9',
    '#f50057',
    '#00a152',
    '#ff6d00',
    '#ffc400',
    theme.palette.text.primary
  ];
  const MAX_ENTRIES = COLORS.length;

  const [searchParams, setSearchParams] = useSearchParams();
  const textParams = Array
    .from(new Set( // Remove duplicates.
      searchParams
        .getAll('t')
        .map(t => t.trim())
        .filter(t => t.length > 0)
    ))
    .slice(0, MAX_ENTRIES);

  const [shuffledColors] = React.useState(() => COLORS
    .map(color => ({color, sort: Math.random()}))
    .sort((a, b) => a.sort - b.sort)
    .map(({color}) => color));

  const [searches, setSearches] = React.useState([]);

  const inputRef = React.useRef(null);
  const [editText, setEditText] = React.useState(null);
  const [editId, setEditId] = React.useState(null); // The color property is unique and static, thus serving as identifier (rather than array index which will shift on deletion)

  // Init from params
  React.useMemo(() => {
    setSearches(textParams.map((text, i) => ({
      text,
      state: 'init',
      color: shuffledColors[i],
      timeSeries: null
    })));
  }, [shuffledColors]);

  React.useMemo(() => {
    const timeSeriesLoaded = searches
      .filter(s => s.state === 'loaded')
      .map(s => ({
        ...s.timeSeries,
        text: s.text,
        color: s.color
      }));
    const timeSeriesLoading = searches
      .filter(s => s.state === 'loading')
      .length;
    setTimeout(() => onTimeSeries(timeSeriesLoaded, timeSeriesLoading));

    const init = searches.filter(s => s.state === 'init');
    if (init.length > 0) {
      init.forEach(s => {
        const searchText = s.text;

        api.timeSeries(searchText)
          .then(timeSeries => {
            resolveSearch(searchText, timeSeries);
          })
          .catch(reason => {
            console.error('err', reason);
            resolveSearch(searchText, null);
          });
        s.state = 'loading';
      });

      setSearches(prevState => [...prevState]);
    }
  }, [searches]);

  const resolveSearch = (text, timeSeries) => {
    setSearches(prevState => {
      const entry = prevState.find(s => s.text === text);
      if (entry !== undefined && entry.state === 'loading') {
        entry.state = timeSeries == null ? 'error' : 'loaded';
        entry.timeSeries = timeSeries;

        return [...prevState];
      } else { // Ignore if no longer present in searches
        return prevState;
      }
    });
  }

  const syncParams = newSearches => {
    const currentTexts = searchParams.getAll('t');
    const newTexts = newSearches.map(s => s.text);
    if (JSON.stringify(newTexts) !== JSON.stringify(currentTexts)) {
      setSearchParams(
        sp => {
          sp.delete('t');
          newTexts.forEach(t => sp.append('t', t));
          sp.sort();

          return sp;
        },
        {replace: true}
      );
    }
  }

  const handleSubmit = () => {
    setEditText(null);
    setEditId(null);

    const newText = editText.trim();
    if (newText.length > 0 && !searches.find(s => s.text === newText)) { // Ensure no duplicates by ignoring submission if an entry with same text already exists
      let isChange = true;
      const newSearches = [...searches];
      if (editId == null) {
        newSearches.push({
          text: newText,
          state: 'init',
          color: shuffledColors.find(c => !newSearches.map(s => s.color).includes(c)),
          timeSeries: null
        });
      } else {
        const entry = searches.find(s => s.color === editId);
        if (entry !== undefined && entry.text !== newText) {
          entry.text = newText;
          entry.state = 'init';
          entry.timeSeries = null;
        } else {
          isChange = false;
        }
      }

      if (isChange) {
        setSearches(newSearches);
        syncParams(newSearches);
      }
    }
  }

  const handleBeginEdit = id => {
    setEditId(id);
    setEditText(id == null ? '' : searches.find(s => s.color === id).text);
    setTimeout(() => inputRef.current.focus()); // Delay to make sure input field is rendered
  }

  const handleDelete = id => {
    setEditText(null);
    setEditId(null);

    const newSearches = [...searches].filter(s => s.color !== id);
    setSearches(newSearches);
    syncParams(newSearches);
  }

  return (
    <React.Fragment>
      <Stack
        direction="row"
        sx={{
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          listStyle: 'none',
          p: 1,
          m: 0,
          mr: 6
        }}
        component="ol"
      >
        {searches.map(search => (
          <SearchEntry
            key={search.color}
            component="li"
            search={{...search, state: editId === search.color ? 'editing' : (search.state === 'init' ? 'loading' : search.state)}}
            onEdit={() => handleBeginEdit(search.color)}
            onDelete={() => handleDelete(search.color)}
            sx={{m: 1}}
          />
        ))}
        {searches.length > 0 && searches.length < MAX_ENTRIES &&
          <IconButton color="primary" size="large" sx={{mt: 1}} onClick={() => handleBeginEdit(null)}>
            <AddIcon fontSize="inherit"/>
          </IconButton>
        }
      </Stack>

      {(searches.length === 0 || editText != null) &&
        <Paper
          component="form"
          onSubmit={e => {handleSubmit(); e.preventDefault();}}
          sx={{
            display: 'flex',
            alignItems: 'center',
            ml: 2,
            mr: 8,
            mb: 2,
            p: 1,
          }}
        >
          <InputBase
            sx={{
              flex: 1,
              ml: 1
            }}
            placeholder="Explore your narrative"
            value={editText || ''}
            onChange={e => setEditText(e.target.value)}
            inputRef={inputRef}
            autoComplete="on"
          />
          <Divider sx={{height: 28, m: .5}} orientation="vertical"/>
          <IconButton
            color="primary"
            sx={{p: 1}}
            disabled={editText == null || editText.length < 1}
            onClick={() => handleSubmit()}
          >
            <SearchIcon/>
          </IconButton>
        </Paper>
      }
    </React.Fragment>
  );
}

export default SearchInput;
