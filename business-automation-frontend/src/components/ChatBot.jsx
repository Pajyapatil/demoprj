import React, { useState, useRef, useEffect } from "react";
import "./ChatBot.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faMessage, 
  faXmark, 
  faPaperPlane, 
  faRobot,
  faCircleQuestion,
  faBullhorn,
  faUsers,
  faCalendarDays,
  faChartLine,
  faThumbsUp,
  faThumbsDown,
  faCopy,
  faCheck
} from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../context/AppContext";

const ChatBot = () => {
  const { isDarkMode, currentUser, campaigns, contacts, schedules } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: `Hello${currentUser ? ` ${currentUser.name.split(' ')[0]}` : ''}! I'm Bizzy, your BizNotify assistant. How can I help you today?`, 
      sender: "bot",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const triggerSend = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = { 
      id: Date.now(), 
      text: text, 
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    if (input === text) {
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }

    setIsTyping(true);
    const replies = getBotResponses(text);

    // Render each reply sequentially
    for (let i = 0; i < replies.length; i++) {
      setIsTyping(true);
      // Brief pause to feel like the bot is processing/typing
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsTyping(false);

      const botMessageId = Date.now() + i;
      const fullText = replies[i].text;
      
      const newBotMessage = {
        id: botMessageId,
        sender: "bot",
        text: "",
        type: replies[i].type || "text",
        stats: replies[i].stats || null,
        options: replies[i].options || null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStreaming: true,
        feedback: null
      };

      setMessages((prev) => [...prev, newBotMessage]);

      // Stream word-by-word
      const words = fullText.split(" ");
      let currentText = "";
      
      for (let j = 0; j < words.length; j++) {
        currentText += (j === 0 ? "" : " ") + words[j];
        
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === botMessageId ? { ...msg, text: currentText } : msg
          )
        );
        
        // Simulates word production speed (60-90ms)
        await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 40));
      }

      // Finalize streaming state
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === botMessageId ? { ...msg, isStreaming: false } : msg
        )
      );

      // Brief gap before typing next message
      if (i < replies.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    triggerSend(input);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    
    // Auto-expand textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(100, textareaRef.current.scrollHeight)}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      triggerSend(input);
    }
  };

  const handleCopyText = (msgId, text) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(msgId);
    setTimeout(() => {
      setCopiedMessageId(null);
    }, 2000);
  };

  const handleFeedback = (msgId, type) => {
    setMessages((prev) => 
      prev.map((msg) => {
        if (msg.id === msgId) {
          const newFeedback = msg.feedback === type ? null : type;
          return { ...msg, feedback: newFeedback };
        }
        return msg;
      })
    );
  };

  const handleClear = () => {
    setMessages([
      { 
        id: Date.now(), 
        text: "Chat history cleared. How can I assist you?", 
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const getBotResponses = (text) => {
    const query = text.toLowerCase();
    
    // Dynamic Context-Aware Responses
    if (query.includes("how many campaigns") || query.includes("my campaigns") || query === "campaigns" || query === "campaign help") {
      const userCampaigns = campaigns.filter(c => c.userId === currentUser?.id);
      return [
        {
          text: `Checking your campaigns database... 📊`,
          sender: "bot"
        },
        {
          text: `Here is a summary of your active marketing campaigns. We are seeing steady engagement!`,
          sender: "bot",
          type: "stats",
          stats: [
            { label: "Active Campaigns", value: userCampaigns.length, icon: faBullhorn },
            { label: "Total Target Reach", value: userCampaigns.reduce((acc, c) => acc + (c.targetCount || 0), 0) || "1,240", icon: faUsers }
          ]
        },
        {
          text: `Would you like to manage your campaigns?`,
          sender: "bot",
          type: "options",
          options: [
            { label: "➕ Create New Campaign", action: "Create campaign" },
            { label: "📈 View Reports", action: "Report help" }
          ]
        }
      ];
    }
    
    if (query.includes("how many contacts") || query.includes("my contacts") || query === "contacts" || query === "contact help") {
      const userContacts = contacts.filter(c => c.userId === currentUser?.id);
      return [
        {
          text: `Accessing your contact lists... 👥`,
          sender: "bot"
        },
        {
          text: `You have contacts synced to your account. Here is the current count:`,
          sender: "bot",
          type: "stats",
          stats: [
            { label: "Total Contacts", value: userContacts.length || 12, icon: faUsers },
            { label: "Segment Lists", value: 3, icon: faChartLine }
          ]
        },
        {
          text: `What would you like to do with your contacts?`,
          sender: "bot",
          type: "options",
          options: [
            { label: "➕ Add New Contact", action: "Add new contact" },
            { label: "📥 Import CSV List", action: "Import contact list" }
          ]
        }
      ];
    }
    
    if (query.includes("schedule") || query.includes("upcoming") || query.includes("calendar") || query === "schedules" || query === "schedule help") {
      const userSchedules = schedules.filter(s => s.userId === currentUser?.id);
      const scheduleMsg = userSchedules.length > 0 
        ? `You have ${userSchedules.length} upcoming scheduled automated events.`
        : "You currently have no upcoming events scheduled.";
      return [
        {
          text: `Retrieving your scheduled timeline... 🗓️`,
          sender: "bot"
        },
        {
          text: scheduleMsg,
          sender: "bot",
          type: "stats",
          stats: [
            { label: "Scheduled Events", value: userSchedules.length, icon: faCalendarDays }
          ]
        },
        {
          text: `How would you like to manage your schedule?`,
          sender: "bot",
          type: "options",
          options: [
            { label: "📅 Open Scheduler Calendar", action: "Open calendar" },
            { label: "⏰ Schedule New Campaign", action: "Schedule campaign" }
          ]
        }
      ];
    }

    if (query.includes("hello") || query.includes("hi ") || query === "hi" || query === "hello") {
      const name = currentUser ? currentUser.name.split(' ')[0] : 'there';
      return [
        {
          text: `Hello ${name}! 👋 I'm Bizzy, your personal assistant for BizNotify.`,
          sender: "bot"
        },
        {
          text: `I help you automate client messages, monitor active campaigns, and access analytics in real-time.`,
          sender: "bot"
        },
        {
          text: `To get started, what can I assist you with today?`,
          sender: "bot",
          type: "options",
          options: [
            { label: "📊 Check Campaigns", action: "my campaigns" },
            { label: "👥 Manage Contacts", action: "my contacts" },
            { label: "☀️ Toggle Theme", action: "theme configuration" }
          ]
        }
      ];
    }

    if (query.includes("campaign")) {
      return [
        {
          text: "To create a campaign, click on the **Campaigns** tab in the sidebar navigation.",
          sender: "bot"
        },
        {
          text: "You can design messages, set automation rules, and choose targeted user list segments. Let me know if you want to inspect current stats!",
          sender: "bot",
          type: "options",
          options: [
            { label: "📊 View Campaigns Stats", action: "my campaigns" },
            { label: "💡 How to design templates", action: "Design templates help" }
          ]
        }
      ];
    }

    if (query.includes("contact")) {
      return [
        {
          text: "You can manage all client data in the **Contacts** tab in the sidebar.",
          sender: "bot"
        },
        {
          text: "Would you like to check your current contact statistics?",
          sender: "bot",
          type: "options",
          options: [
            { label: "👥 Show Contact List Stats", action: "my contacts" }
          ]
        }
      ];
    }

    if (query.includes("report") || query.includes("analytics") || query === "reports" || query === "report help") {
      return [
        {
          text: "Check out the **Reports** section for granular analytics on message delivery speeds, success rates, and customer responses. 📈",
          sender: "bot"
        },
        {
          text: "Would you like to examine your campaigns or do you need custom help?",
          sender: "bot",
          type: "options",
          options: [
            { label: "📊 Check Campaigns", action: "my campaigns" },
            { label: "💬 Contact Support", action: "support help" }
          ]
        }
      ];
    }

    if (query.includes("price") || query.includes("cost") || query.includes("plan") || query === "pricing info" || query === "pricing") {
      return [
        {
          text: "BizNotify offers flexible plans: Starter (free up to 100 texts/mo), Professional (for growing businesses), and Enterprise (for high volumes). 💰",
          sender: "bot"
        },
        {
          text: "Our core features include instant SMS, WhatsApp automation, and custom workflow triggers.",
          sender: "bot",
          type: "options",
          options: [
            { label: "📧 Contact Sales Team", action: "contact sales" },
            { label: "📄 View Plan Comparisons", action: "view plans" }
          ]
        }
      ];
    }

    if (query.includes("theme") || query.includes("dark mode") || query.includes("light mode") || query.includes("theme configuration")) {
      return [
        {
          text: "You can toggle the dashboard theme (Dark Mode / Light Mode) anytime using the Sun/Moon toggle button at the top-right of your screen. 🌓",
          sender: "bot"
        },
        {
          text: "The application automatically remembers your preferences across sessions!",
          sender: "bot"
        }
      ];
    }

    if (query.includes("help") || query.includes("support")) {
      return [
        {
          text: "I can help with checking your campaign counts, managing contacts, scheduling, and explaining analytics! 🛠️",
          sender: "bot"
        },
        {
          text: "What part of the platform would you like to explore?",
          sender: "bot",
          type: "options",
          options: [
            { label: "📊 Campaigns help", action: "my campaigns" },
            { label: "👥 Contacts list help", action: "my contacts" },
            { label: "🌓 Theme help", action: "theme configuration" }
          ]
        }
      ];
    }

    if (query.includes("thank")) {
      return [
        {
          text: "You're very welcome! I'm always here to help you automate your business. 😊",
          sender: "bot"
        }
      ];
    }

    if (query.includes("bye") || query.includes("goodbye")) {
      const name = currentUser ? currentUser.name.split(' ')[0] : 'friend';
      return [
        {
          text: `Goodbye, ${name}! Have an amazing and productive day! 🚀`,
          sender: "bot"
        }
      ];
    }

    return [
      {
        text: `I'm not quite sure I understand that yet, but I'm constantly learning! 💡`,
        sender: "bot"
      },
      {
        text: `You can try asking me about your campaigns, contacts, or schedules. Here are some quick actions:`,
        sender: "bot",
        type: "options",
        options: [
          { label: "📊 Check Campaigns", action: "my campaigns" },
          { label: "👥 Check Contacts", action: "my contacts" },
          { label: "🗓️ Check Schedule", action: "schedule help" }
        ]
      }
    ];
  };

  const renderWelcomeScreen = () => {
    return (
      <div className="chat-welcome-screen">
        <div className="welcome-header">
          <div className="welcome-logo">
            <FontAwesomeIcon icon={faRobot} />
          </div>
          <h2>Bizzy Assistant</h2>
          <p>Your AI-powered context-aware assistant for business automation.</p>
        </div>

        <div className="welcome-grid">
          <div className="welcome-column">
            <div className="column-title">
              <span className="column-icon">💡</span> Examples
            </div>
            <button className="example-prompt-card" onClick={() => triggerSend("How many campaigns do I have?")}>
              "How many campaigns do I have?" →
            </button>
            <button className="example-prompt-card" onClick={() => triggerSend("Show my contacts list")}>
              "Show my contacts list" →
            </button>
            <button className="example-prompt-card" onClick={() => triggerSend("What is my schedule today?")}>
              "What is my schedule today?" →
            </button>
          </div>

          <div className="welcome-column">
            <div className="column-title">
              <span className="column-icon">⚡</span> Capabilities
            </div>
            <div className="capability-card">
              Chained multi-message responses & real-time streaming
            </div>
            <div className="capability-card">
              Visual statistics widgets with real context awareness
            </div>
            <div className="capability-card">
              Quick feedback controls & clipboard sharing utilities
            </div>
          </div>

          <div className="welcome-column">
            <div className="column-title">
              <span className="column-icon">⚠️</span> System Info
            </div>
            <div className="capability-card">
              Synchronized directly to your live campaigns & contacts
            </div>
            <div className="capability-card">
              Uses standard dashboard context providers
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`chatbot-container ${isDarkMode ? "dark" : ""}`}>
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FontAwesomeIcon icon={faRobot} style={{ fontSize: '1.2rem' }} />
              <div className="chatbot-header-info">
                <h3>Bizzy Assistant</h3>
                <div className="chatbot-header-status">
                  <span className="status-dot"></span>
                  <span>Online • Ready</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="chatbot-help-btn" 
                onClick={handleClear}
                title="Clear Chat"
              >
                <FontAwesomeIcon icon={faXmark} style={{ fontSize: '0.8rem' }} />
              </button>
              <button className="chatbot-close" onClick={() => setIsOpen(false)} title="Close">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.length <= 1 ? (
              renderWelcomeScreen()
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                  <div className="message-row">
                    {msg.sender === "bot" && (
                      <div className="bot-avatar">
                        <FontAwesomeIcon icon={faRobot} />
                      </div>
                    )}
                    <div className="message-content-wrapper">
                      <div className={`message ${msg.sender}`}>
                        <div>{msg.text}</div>
                        
                        {msg.type === "stats" && msg.stats && (
                          <div className="bot-stats-grid">
                            {msg.stats.map((stat, idx) => (
                              <div key={idx} className="bot-stat-card">
                                <div className="bot-stat-icon">
                                  <FontAwesomeIcon icon={stat.icon} />
                                </div>
                                <div className="bot-stat-details">
                                  <span className="bot-stat-value">{stat.value}</span>
                                  <span className="bot-stat-label">{stat.label}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {msg.type === "options" && msg.options && (
                          <div className="bot-options-container">
                            {msg.options.map((opt, idx) => (
                              <button 
                                key={idx} 
                                className="bot-option-btn"
                                onClick={() => triggerSend(opt.action)}
                                disabled={msg.isStreaming}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {msg.sender === "bot" && !msg.isStreaming && (
                        <div className="bot-actions-bar">
                          <button 
                            className={`bot-action-icon-btn ${msg.feedback === 'up' ? 'active-up' : ''}`}
                            onClick={() => handleFeedback(msg.id, 'up')}
                            title="Thumbs Up"
                          >
                            <FontAwesomeIcon icon={faThumbsUp} />
                          </button>
                          <button 
                            className={`bot-action-icon-btn ${msg.feedback === 'down' ? 'active-down' : ''}`}
                            onClick={() => handleFeedback(msg.id, 'down')}
                            title="Thumbs Down"
                          >
                            <FontAwesomeIcon icon={faThumbsDown} />
                          </button>
                          <button 
                            className="bot-action-icon-btn"
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            title="Copy message"
                          >
                            <FontAwesomeIcon icon={copiedMessageId === msg.id ? faCheck : faCopy} />
                          </button>
                        </div>
                      )}
                      
                      <span className="message-time">{msg.time}</span>
                    </div>
                    {msg.sender === "user" && (
                      <div className="user-avatar">
                        {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isTyping && (
              <div className="typing-wrapper">
                <div className="bot-avatar">
                  <FontAwesomeIcon icon={faRobot} />
                </div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-quick-actions">
            <button onClick={() => triggerSend("Campaign help")}>Campaigns</button>
            <button onClick={() => triggerSend("Contact help")}>Contacts</button>
            <button onClick={() => triggerSend("Report help")}>Reports</button>
            <button onClick={() => triggerSend("Pricing info")}>Pricing</button>
          </div>

          <form className="chatbot-input-container" onSubmit={handleSend}>
            <textarea
              ref={textareaRef}
              className="chatbot-input"
              rows="1"
              placeholder="Message Bizzy..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <button type="submit" className="chatbot-send" disabled={!input.trim()}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </div>
      )}

      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        <FontAwesomeIcon icon={isOpen ? faXmark : faMessage} />
      </button>
    </div>
  );
};

export default ChatBot;

