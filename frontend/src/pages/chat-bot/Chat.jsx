import { getUserAttribute } from "../authentication/Account";
import { useState, useEffect } from "react";

const BotRenderer = () => {
    const [botHtml, setBotHtml] = useState('');
  
    useEffect(() => {
      const fetchBotHtml = async () => {
        try {
          const role = await getUserAttribute("custom:role");
          console.log(role);
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
          setBotHtml(botHtmlString);
        } catch (error) {
          console.error('Failed to fetch user attribute:', error);
          // Render guest bot in case of error
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
  
      fetchBotHtml();
    }, []);
  
    return <div dangerouslySetInnerHTML={{ __html: botHtml }} />;
};

export default BotRenderer;
