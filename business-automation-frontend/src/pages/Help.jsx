import React from "react";
import "./Help.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleQuestion,
  faBook,
  faVideo,
  faHeadset,
  faCircleInfo,
  faMessage
} from "@fortawesome/free-solid-svg-icons";

const Help = () => {
  const faqs = [
    {
      question: "How do I create a new campaign?",
      answer: "Go to the Campaigns page from the sidebar, click on 'Create Campaign', fill in the details, select your contacts, and schedule your message."
    },
    {
      question: "Can I import contacts from Excel?",
      answer: "Yes! In the Contacts section, you can use the 'Import CSV' button to upload your contact list in bulk."
    },
    {
      question: "What is the message limit?",
      answer: "Message limits depend on your subscription plan. You can view your current usage in the Dashboard analytics."
    },
    {
      question: "How can I change my password?",
      answer: "Navigate to Settings > Security to update your password and other account details."
    }
  ];

  return (
    <div className="help-container">
      <div className="help-header">
        <h1>How can we help you?</h1>
        <p>Find answers to common questions or reach out to our support team.</p>
      </div>

      <div className="help-grid">
        <div className="help-card">
          <div className="icon">
            <FontAwesomeIcon icon={faBook} />
          </div>
          <h3>Documentation</h3>
          <p>Read our detailed guides on how to use every feature of BizNotify effectively.</p>
        </div>
        <div className="help-card">
          <div className="icon">
            <FontAwesomeIcon icon={faVideo} />
          </div>
          <h3>Video Tutorials</h3>
          <p>Watch quick step-by-step videos to get started with your first automation.</p>
        </div>
        <div className="help-card">
          <div className="icon">
            <FontAwesomeIcon icon={faHeadset} />
          </div>
          <h3>Direct Support</h3>
          <p>Our dedicated support team is available 24/7 to help you with any issues.</p>
        </div>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question">
                <FontAwesomeIcon icon={faCircleInfo} />
                {faq.question}
              </div>
              <div className="faq-answer">{faq.answer}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="contact-support">
        <h2>Still need help?</h2>
        <p>Our team is always ready to assist you. Chat with us now or send an email.</p>
        <button className="support-btn" onClick={() => window.location.href = 'mailto:support@biznotify.com'}>
          <FontAwesomeIcon icon={faMessage} /> Contact Support
        </button>
      </div>
    </div>
  );
};

export default Help;
