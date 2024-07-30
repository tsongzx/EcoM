import React, { useEffect, useState } from 'react';
import './SelfExpiringMessage.css';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const SelfExpiringMessage = ({message, onExpiry}) => {
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(100);
    const timeout = 3000;

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onExpiry();
        }, timeout);

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev - (100 / (timeout / 100));
                return newProgress < 0 ? 0 : newProgress;
            });
        }, 100);

        return () => {
            clearTimeout(timer);
            clearInterval(progressInterval);
        };
    },[]);

    return (
        <div className={`msg-container ${visible ? "visible" : "hidden"}`}>
                <p className='selfexp-msgcontent'>{message}</p>
            
            <div className="progress-bar-container">
                <div 
                    className="progress-bar" 
                    style={{ width: `${progress}%` }} 
                />
            </div>
        </div>
    );
}

export default SelfExpiringMessage;