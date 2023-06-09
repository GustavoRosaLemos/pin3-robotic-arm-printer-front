import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import HealthPage from '../pages/Health';
import store from '../store';
import HomePage from '../pages/Home';
import RenderPage from '../pages/Render';
import MultiRenderPage from '../pages/MultiRender';

function RouterSwitch() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="/render" element={<RenderPage />} />
        <Route path="/multi-render" element={<MultiRenderPage />} />
      </Routes>
    </Provider>
  );
}

export default RouterSwitch;
