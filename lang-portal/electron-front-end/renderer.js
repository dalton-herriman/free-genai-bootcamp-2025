// API Configuration
const API_BASE_URL = 'http://localhost:5000';

// State Management
let currentPage = {
  words: 1,
  groups: 1,
  studySessions: 1
};

let currentSection = 'dashboard';

// API Helper Functions
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Navigation
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.content-section');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all links and sections
      navLinks.forEach(l => l.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      
      // Add active class to clicked link
      link.classList.add('active');
      
      // Show corresponding section
      const sectionId = link.getAttribute('data-section');
      const section = document.getElementById(sectionId);
      if (section) {
        section.classList.add('active');
        currentSection = sectionId;
        
        // Load data for the section
        loadSectionData(sectionId);
      }
    });
  });
}

// Section Data Loading
async function loadSectionData(section) {
  switch (section) {
    case 'dashboard':
      await loadDashboard();
      break;
    case 'words':
      await loadWords();
      break;
    case 'groups':
      await loadGroups();
      break;
    case 'study-sessions':
      await loadStudySessions();
      break;
    case 'study-activities':
      await loadStudyActivities();
      break;
  }
}

// Dashboard Functions
async function loadDashboard() {
  try {
    const [stats, recentSession] = await Promise.all([
      apiCall('/dashboard/stats'),
      apiCall('/dashboard/recent-session')
    ]);
    
    displayStats(stats);
    displayRecentSession(recentSession);
  } catch (error) {
    console.error('Failed to load dashboard:', error);
    showError('Failed to load dashboard data');
  }
}

function displayStats(stats) {
  const statsContent = document.getElementById('stats-content');
  
  if (!stats || stats.error) {
    statsContent.innerHTML = '<div class="error">Failed to load statistics</div>';
    return;
  }
  
  statsContent.innerHTML = `
    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-value">${stats.total_vocabulary || 0}</span>
        <span class="stat-label">Total Vocabulary</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${stats.total_words_studied || 0}</span>
        <span class="stat-label">Words Studied</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${stats.mastered_words || 0}</span>
        <span class="stat-label">Mastered Words</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${Math.round((stats.success_rate || 0) * 100)}%</span>
        <span class="stat-label">Success Rate</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${stats.total_sessions || 0}</span>
        <span class="stat-label">Total Sessions</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${stats.current_streak || 0}</span>
        <span class="stat-label">Current Streak</span>
      </div>
    </div>
  `;
}

function displayRecentSession(session) {
  const recentContent = document.getElementById('recent-session-content');
  
  if (!session || session.error) {
    recentContent.innerHTML = '<div class="no-data">No recent sessions</div>';
    return;
  }
  
  const date = new Date(session.created_at).toLocaleDateString();
  const time = new Date(session.created_at).toLocaleTimeString();
  
  recentContent.innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">${session.activity_name}</span>
        <span class="card-meta">${date} at ${time}</span>
      </div>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-value">${session.correct_count}</span>
          <span class="stat-label">Correct</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${session.wrong_count}</span>
          <span class="stat-label">Incorrect</span>
        </div>
      </div>
    </div>
  `;
}

// Words Functions
async function loadWords() {
  try {
    const data = await apiCall(`/words?page=${currentPage.words}`);
    displayWords(data);
  } catch (error) {
    console.error('Failed to load words:', error);
    showError('Failed to load words');
  }
}

function displayWords(data) {
  const wordsContent = document.getElementById('words-content');
  const pageInfo = document.getElementById('page-info');
  
  if (!data || data.error) {
    wordsContent.innerHTML = '<div class="error">Failed to load words</div>';
    return;
  }
  
  pageInfo.textContent = `Page ${data.current_page} of ${data.total_pages}`;
  
  const wordsHtml = data.words.map(word => `
    <tr>
      <td>${word.kanji}</td>
      <td>${word.romaji}</td>
      <td>${word.english}</td>
      <td>${word.correct_count}</td>
      <td>${word.wrong_count}</td>
    </tr>
  `).join('');
  
  wordsContent.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Kanji</th>
          <th>Romaji</th>
          <th>English</th>
          <th>Correct</th>
          <th>Incorrect</th>
        </tr>
      </thead>
      <tbody>
        ${wordsHtml}
      </tbody>
    </table>
  `;
}

// Groups Functions
async function loadGroups() {
  try {
    const data = await apiCall(`/groups?page=${currentPage.groups}`);
    displayGroups(data);
  } catch (error) {
    console.error('Failed to load groups:', error);
    showError('Failed to load groups');
  }
}

function displayGroups(data) {
  const groupsContent = document.getElementById('groups-content');
  const pageInfo = document.getElementById('groups-page-info');
  
  if (!data || data.error) {
    groupsContent.innerHTML = '<div class="error">Failed to load groups</div>';
    return;
  }
  
  pageInfo.textContent = `Page ${data.current_page} of ${data.total_pages}`;
  
  const groupsHtml = data.groups.map(group => `
    <div class="card">
      <div class="card-header">
        <span class="card-title">${group.group_name}</span>
        <span class="card-meta">${group.word_count} words</span>
      </div>
      <div class="card-actions">
        <button class="btn" onclick="viewGroupWords(${group.id})">View Words</button>
        <button class="btn" onclick="viewGroupSessions(${group.id})">Study Sessions</button>
      </div>
    </div>
  `).join('');
  
  groupsContent.innerHTML = groupsHtml;
}

// Study Sessions Functions
async function loadStudySessions() {
  try {
    const data = await apiCall(`/api/study-sessions?page=${currentPage.studySessions}`);
    displayStudySessions(data);
  } catch (error) {
    console.error('Failed to load study sessions:', error);
    showError('Failed to load study sessions');
  }
}

function displayStudySessions(data) {
  const sessionsContent = document.getElementById('study-sessions-content');
  const pageInfo = document.getElementById('sessions-page-info');
  
  if (!data || data.error) {
    sessionsContent.innerHTML = '<div class="error">Failed to load study sessions</div>';
    return;
  }
  
  pageInfo.textContent = `Page ${data.page} of ${data.total_pages}`;
  
  const sessionsHtml = data.items.map(session => `
    <div class="card">
      <div class="card-header">
        <span class="card-title">${session.activity_name}</span>
        <span class="card-meta">${session.group_name}</span>
      </div>
      <div class="card-meta">
        Started: ${new Date(session.start_time).toLocaleString()}
        <br>Review Items: ${session.review_items_count}
      </div>
      <div class="card-actions">
        <button class="btn" onclick="viewSessionDetails(${session.id})">View Details</button>
      </div>
    </div>
  `).join('');
  
  sessionsContent.innerHTML = sessionsHtml;
}

// Study Activities Functions
async function loadStudyActivities() {
  try {
    const activities = await apiCall('/api/study-activities');
    displayStudyActivities(activities);
  } catch (error) {
    console.error('Failed to load study activities:', error);
    showError('Failed to load study activities');
  }
}

function displayStudyActivities(activities) {
  const activitiesContent = document.getElementById('study-activities-content');
  
  if (!activities || activities.error) {
    activitiesContent.innerHTML = '<div class="error">Failed to load study activities</div>';
    return;
  }
  
  const activitiesHtml = activities.map(activity => `
    <div class="card">
      <div class="card-header">
        <span class="card-title">${activity.title}</span>
      </div>
      <div class="card-actions">
        <button class="btn btn-primary" onclick="launchActivity(${activity.id})">Launch Activity</button>
        <button class="btn" onclick="viewActivitySessions(${activity.id})">View Sessions</button>
      </div>
    </div>
  `).join('');
  
  activitiesContent.innerHTML = activitiesHtml;
}

// Modal Functions
function showModal(title, content) {
  const modal = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  
  modalTitle.textContent = title;
  modalBody.innerHTML = content;
  modal.classList.remove('hidden');
}

function hideModal() {
  const modal = document.getElementById('modal-overlay');
  modal.classList.add('hidden');
}

// Create Session Modal
function showCreateSessionModal() {
  const content = `
    <form id="create-session-form">
      <div class="form-group">
        <label for="group-select">Group:</label>
        <select id="group-select" required>
          <option value="">Select a group...</option>
        </select>
      </div>
      <div class="form-group">
        <label for="activity-select">Activity:</label>
        <select id="activity-select" required>
          <option value="">Select an activity...</option>
        </select>
      </div>
      <div class="form-actions">
        <button type="button" class="btn" onclick="hideModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Create Session</button>
      </div>
    </form>
  `;
  
  showModal('Create New Study Session', content);
  
  // Load groups and activities
  loadGroupsForSelect();
  loadActivitiesForSelect();
  
  // Handle form submission
  document.getElementById('create-session-form').addEventListener('submit', handleCreateSession);
}

async function loadGroupsForSelect() {
  try {
    const groups = await apiCall('/groups');
    const select = document.getElementById('group-select');
    
    groups.groups.forEach(group => {
      const option = document.createElement('option');
      option.value = group.id;
      option.textContent = group.group_name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load groups for select:', error);
  }
}

async function loadActivitiesForSelect() {
  try {
    const activities = await apiCall('/api/study-activities');
    const select = document.getElementById('activity-select');
    
    activities.forEach(activity => {
      const option = document.createElement('option');
      option.value = activity.id;
      option.textContent = activity.title;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load activities for select:', error);
  }
}

async function handleCreateSession(e) {
  e.preventDefault();
  
  const groupId = document.getElementById('group-select').value;
  const activityId = document.getElementById('activity-select').value;
  
  if (!groupId || !activityId) {
    showError('Please select both a group and an activity');
    return;
  }
  
  try {
    const session = await apiCall('/api/study-sessions', {
      method: 'POST',
      body: JSON.stringify({
        group_id: parseInt(groupId),
        study_activity_id: parseInt(activityId)
      })
    });
    
    hideModal();
    showSuccess('Study session created successfully!');
    loadStudySessions(); // Refresh the sessions list
  } catch (error) {
    console.error('Failed to create session:', error);
    showError('Failed to create study session');
  }
}

// Utility Functions
function showError(message) {
  // Simple error display - could be enhanced with a toast notification
  alert(`Error: ${message}`);
}

function showSuccess(message) {
  // Simple success display - could be enhanced with a toast notification
  alert(`Success: ${message}`);
}

// Pagination Functions
function initPagination() {
  // Words pagination
  document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage.words > 1) {
      currentPage.words--;
      loadWords();
    }
  });
  
  document.getElementById('next-page').addEventListener('click', () => {
    currentPage.words++;
    loadWords();
  });
  
  // Groups pagination
  document.getElementById('groups-prev-page').addEventListener('click', () => {
    if (currentPage.groups > 1) {
      currentPage.groups--;
      loadGroups();
    }
  });
  
  document.getElementById('groups-next-page').addEventListener('click', () => {
    currentPage.groups++;
    loadGroups();
  });
  
  // Study sessions pagination
  document.getElementById('sessions-prev-page').addEventListener('click', () => {
    if (currentPage.studySessions > 1) {
      currentPage.studySessions--;
      loadStudySessions();
    }
  });
  
  document.getElementById('sessions-next-page').addEventListener('click', () => {
    currentPage.studySessions++;
    loadStudySessions();
  });
}

// Event Listeners
function initEventListeners() {
  // Modal close
  document.getElementById('modal-close').addEventListener('click', hideModal);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') {
      hideModal();
    }
  });
  
  // Create session button
  document.getElementById('create-session-btn').addEventListener('click', showCreateSessionModal);
  
  // Search functionality
  document.getElementById('word-search').addEventListener('input', (e) => {
    // Implement search functionality if needed
    console.log('Search:', e.target.value);
  });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initPagination();
  initEventListeners();
  
  // Load initial dashboard data
  loadDashboard();
}); 