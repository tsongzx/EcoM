import React, { useEffect, useState } from 'react';
import './SelfExpiringMessage.css';

const SelfExpiringMessage = ({message}) => {
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(100);
    const timeout = 5000;

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
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
            <p>{message}</p>
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