// App.jsx
import { Routes, Route } from 'react-router-dom'; // Remove BrowserRouter import
import Home from './view/home';
import NotFound from './view/page_not_found';
import ForgotPassword from './view/forgot_password';
import VerifyEmail from './view/verify_email';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;