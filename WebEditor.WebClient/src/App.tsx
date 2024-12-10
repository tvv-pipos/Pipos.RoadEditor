import { observer } from 'mobx-react-lite';
import Map from './components/Map';
import YearSelector from './components/YearSelector';
import Login from './Login';
import { useStore } from './UseStore';
import { Box } from '@mui/material';
import Loader from './components/Loader';

const App: React.FC = observer(() => {
  const store = useStore();
  const session = store.session.id != null;

  let component = <Box />; // 

  if(!store.session.loading && !session)
    component = <Login sessionStore={store.session} />;
  else if (!store.session.loading && session) {
    component =
      <>
        <Map />
        <YearSelector />
        <Loader />
      </>;
  }

  return (
    component
  )
});

export default App
