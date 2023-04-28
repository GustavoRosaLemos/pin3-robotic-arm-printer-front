import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import HealthPage from '../pages/health';
import store from '../store';
import HomePage from '../pages/Home';

function RouterSwitch() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/health" element={<HealthPage />} />
      </Routes>
    </Provider>
  );
}

export default RouterSwitch;
