import { useState } from 'react'
import ChatBot from "react-chatbotify"
import axios from 'axios';
import Cookies from 'js-cookie';
import { Box } from '@mui/material';
import './Chatbot.css';
const ChatFeature = () => {
  const [restart, setRestart] = useState(false)
  const makeChatBotQuery = async (params) => {
    const token = Cookies.get('authToken');
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/chat`,
        {'query': params.userInput},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data.response);
      await params.injectMessage(response.data.response);
    } catch (error) {
      console.log(error);
      await params.injectMessage('Sorry, I am unable to answer this.');
      setRestart(true);
    }
  };

  const flow={
		start: {
			message: 'Hello! Do you need any help?',
      path: 'loop',
		},
		loop: {
      message: async (params) => {
        console.log('printing');
        console.log(params);
				await makeChatBotQuery(params);
			},
			path: () => {
				if (restart) {  
					return 'start'
				}
				return 'loop'
			}
		}
	}
	return (
    // <Box className='chatbot-container'>
      <ChatBot options={{
          theme: {}, 
          chatHistory: {storageKey: 'chatHistory'},
          header: {
            title: 'Chatbot'
          },
          footer: {
            text: 'Crumpets'
          },
          chatWindowStyle: {
            // height: '20vh',
            // width: '10vw',
            // // inset: 'auto',
            // borderRadius: '10px',
            // position: 'fixed',
            // // bottom: '20px',
            // // right: 20,
            // display: 'flex',
            // flexDirection: 'column'
          }
        }
    } flow={flow}/>
    // </Box>
	);
}

export default ChatFeature;