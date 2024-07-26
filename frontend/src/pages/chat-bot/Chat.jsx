import { getUserAttribute } from "../authentication/Account";
import { useState, useEffect } from "react";

const BotRenderer = () => {
    // State to store the HTML string of the bot
    const [botHtml, setBotHtml] = useState('');

    useEffect(() => {
        // Function to fetch the bot HTML based on user role
        const fetchBotHtml = async () => {
            try {
                // Fetch user role from authentication service
                const role = await getUserAttribute("custom:role");
                console.log(role);
                
                // Determine bot HTML based on user role
                let botHtmlString;
                switch (role) {
                    case 'customer':
                        botHtmlString = `
                            <df-messenger
                              intent="WELCOME"
                              chat-title="Registered-User-Bot"
                              agent-id="d8a6bdc2-2011-40de-b42a-2dcdb73a4283"
                              language-code="en"
                            ></df-messenger>
                        `;
                        break;
                    case 'agent':
                        botHtmlString = `
                            <df-messenger
                              intent="WELCOME"
                              chat-title="Property-Agent-Bot"
                              agent-id="8dff0da9-a75b-4958-9000-ef918bce0f39"
                              language-code="en"
                            ></df-messenger>
                        `;
                        break;
                    case null:
                    default:
                        botHtmlString = `
                            <df-messenger
                              intent="WELCOME"
                              chat-title="Guest-Bot"
                              agent-id="d5bb5bb6-d108-42be-844e-4022bdf0f3ba"
                              language-code="en"
                            ></df-messenger>
                        `;
                        break;
                }
                // Update the state with the determined bot HTML
                setBotHtml(botHtmlString);
            } catch (error) {
                console.error('Failed to fetch user attribute:', error);
                // Render guest bot in case of error or if role is null
                const botHtmlString = `
                    <df-messenger
                      intent="WELCOME"
                      chat-title="Guest-Bot"
                      agent-id="d5bb5bb6-d108-42be-844e-4022bdf0f3ba"
                      language-code="en"
                    ></df-messenger>
                `;
                setBotHtml(botHtmlString);
            }
        };

        fetchBotHtml(); // Call the function to fetch and set bot HTML
    }, []); // Empty dependency array ensures this runs only once

    // Render the bot using dangerouslySetInnerHTML
    return <div dangerouslySetInnerHTML={{ __html: botHtml }} />;
};

export default BotRenderer;