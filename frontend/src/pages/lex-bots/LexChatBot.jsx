import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import './LexChatBot.css'; // Assuming you have a CSS file for styling

const LexChatBot = () => {
    const lexRuntime = new AWS.LexRuntimeV2({
        region: 'us-east-1', // Replace with your AWS region
        accessKeyId :'ASIAXSVUMDCKZR4SHQPL',
        secretAccessKey :'zdHI/phLF7XT0qsOPNbKgPnbJnAqntWwk/AWMUTk',
        sessionToken :'IQoJb3JpZ2luX2VjEL7//////////wEaCXVzLXdlc3QtMiJGMEQCIFtYFWqk1PX6H2I5SJzUDFqQuePpJELCzrqB8SSHWGexAiA6DreaayUnC8Bn70NGp0O3lCU61ifvQdAW0aEyHo08eSqpAghnEAAaDDUyMTE0MzA2NDcyNSIM9QJf8LA6+tLWGkOZKoYCn7cGxGqPXV2jLYYoSvVV0TIinrUqA597q/fxWRwpz+IuULTHz1EMBs1eFiElRUQbolPfUX+vq1AN41XFAnWsa21sSh8lL8JiNR+uXfG8jruv4sZbsVwG7jLHkE21Rda8rGmiP+rKGuuPnZxtRQPbrjpMXQ2xrdhTr5hZjVuzQ3yHUn094neTrg7mPX6mq8JygX+12N1ifk98iq7hepsmqhMKmk7zwTnTg92QqbZt/hCvsmhGAITsqu9lyc3ArLM0RpK5mb658emWHXsS0kXEXi2/VkDLcp+6YDYdFyUC7IrPgCf/wXMNQEniyj5hIRauvFYHNM3rPDd6r7Ckr03Y80WN/ovXrDD49NezBjqeAWHHu7R9IDDFcsYFdbxl5GSPwcI2nLOXsWG2CXo+iyG9PGgiBDkM5C/CbtkKgVfyVYZsGN8V76HmsmWjpC2WXsLLfOm7c2uI735xj3MWOcgHSKvmZZULmnjEgz56JrmjlEBsxp8ShrhIoJbgrRYvdYR1+EOIOiwrlQ1VvwQiNunrY7bYxnhSbCDNIRrDlFAiMUINhSfQ37KUBJPK/wqR',
    });

    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [sessionId, setSessionId] = useState('');

    useEffect(() => {
        // Generate sessionId once when component mounts
        setSessionId('user' + Date.now());
    }, []); // Empty dependency array ensures it runs only once

    const handleSendMessage = async () => {
        if (userInput.trim() === '') return;

        // Add user message to messages state
        setMessages(prevMessages => [...prevMessages, { type: 'user', content: userInput }]);

        const params = {
            botAliasId: '1JXWJMIBAR', // Replace with your bot alias ID
            botId: '2XT7ZOJLAW', // Replace with your bot ID
            localeId: 'en_US', // Replace with your bot's locale
            sessionId: sessionId,
            text: userInput
        };

        try {
            const data = await lexRuntime.recognizeText(params).promise();
            console.log(data);

            if (data.messages) {
                const botMessages = data.messages.map(message => ({ type: 'bot', content: String(message.content) }));
                setMessages(prevMessages => [...prevMessages, ...botMessages]);
            } else {
                console.log('No messages returned from Lex');
            }

        } catch (err) {
            console.error('Error communicating with Lex:', err);
        }

        setUserInput(''); // Clear the input field
    };

    return (
        <div>
            <div className="chat-container">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.type}`}>
                        <strong>{message.type === 'user' ? 'User: ' : 'Bot: '}</strong>
                        <span>{message.content}</span>
                    </div>
                ))}
            </div>
            <input 
                type="text" 
                value={userInput} 
                onChange={(e) => setUserInput(e.target.value)} 
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default LexChatBot;
