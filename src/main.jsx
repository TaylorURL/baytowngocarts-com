import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import './styles/Theme.css';
import './index.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 100,
});

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App/>
    </StrictMode>
);
