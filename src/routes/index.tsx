import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import HealthPage from '../pages/health';
import store from '../store';

function RouterSwitch() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<div>Hello World!</div>} />
        <Route path="/health" element={<HealthPage />} />
      </Routes>
    </Provider>
  );
}

export default RouterSwitch;
