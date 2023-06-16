import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import HealthPage from '../pages/Health';
import store from '../store';
import HomePage from '../pages/Home';
import RenderPage from '../pages/Render';

function RouterSwitch() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="/render" element={<RenderPage />} />
      </Routes>
    </Provider>
  );
}

export default RouterSwitch;
