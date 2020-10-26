import React from 'react';
import './ConversationSearch.css';
import { FaSearch } from 'react-icons/fa';

export default function ConversationSearch() {
    return (
      <div className="conversation-search">
        <input
          type="search"
          className="conversation-search-input"
          placeholder="Search Messages"
        />
        <div className="search-icon">
            <FaSearch />
        </div>
      </div>
    );
}
