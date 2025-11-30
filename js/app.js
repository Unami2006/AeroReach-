// AeroReach - Emergency Medical Drone Dispatch System
// Vanilla JavaScript Application

// Toast notification system
const toast = {
  container: null,
  
  init() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  },
  
  show(title, message, duration = 3000) {
    const toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.innerHTML = `
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    `;
    this.container.appendChild(toastEl);
    
    setTimeout(() => toastEl.classList.add('show'), 10);
    
    setTimeout(() => {
      toastEl.classList.remove('show');
      setTimeout(() => toastEl.remove(), 300);
    }, duration);
  }
};

// Initialize toast on DOM load
document.addEventListener('DOMContentLoaded', () => {
  toast.init();
});

// Mock Data Store
const store = {
  requests: [
    {
      id: '1',
      name: 'John Smith',
      age: 45,
      location: '123 Main Street, Downtown',
      injuryCategory: 'trauma',
      injuryType: 'heavy_bleeding',
      description: 'Deep cut on forearm',
      status: 'pending',
      isEmergency: true,
      timestamp: new Date(Date.now() - 5 * 60000)
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      age: 32,
      location: '456 Oak Avenue, Riverside',
      injuryCategory: 'postpartum',
      injuryType: 'postpartum_hemorrhage',
      description: 'Heavy bleeding after delivery',
      status: 'dispatched',
      isEmergency: true,
      droneId: 'drone-1',
      timestamp: new Date(Date.now() - 15 * 60000)
    },
    {
      id: '3',
      name: 'Mike Brown',
      age: 28,
      location: '789 Pine Road, Hillside',
      injuryCategory: 'chronic',
      injuryType: 'diabetic_emergency',
      description: 'Low blood sugar episode',
      status: 'pending',
      isEmergency: false,
      timestamp: new Date(Date.now() - 10 * 60000)
    }
  ],
  
  drones: [
    { id: 'drone-1', name: 'AeroMed-01', status: 'in-flight', battery: 85 },
    { id: 'drone-2', name: 'AeroMed-02', status: 'available', battery: 92 },
    { id: 'drone-3', name: 'AeroMed-03', status: 'available', battery: 78 },
    { id: 'drone-4', name: 'AeroMed-04', status: 'charging', battery: 45 }
  ],
  
  injuryCategories: {
    trauma: 'Physical Trauma',
    postpartum: 'Postpartum',
    gbv: 'GBV Emergency',
    chronic: 'Chronic Condition'
  },
  
  injuryTypes: {
    trauma: [
      { id: 'heavy_bleeding', label: 'Heavy Bleeding', critical: true },
      { id: 'breathing_difficulty', label: 'Breathing Difficulty', critical: true },
      { id: 'head_injury', label: 'Head/Neck/Spinal', critical: true },
      { id: 'fracture', label: 'Fracture', critical: false },
      { id: 'burn', label: 'Burn Injury', critical: false }
    ],
    postpartum: [
      { id: 'postpartum_hemorrhage', label: 'Hemorrhage', critical: true },
      { id: 'infection', label: 'Infection', critical: false },
      { id: 'preeclampsia', label: 'Preeclampsia', critical: false }
    ],
    gbv: [
      { id: 'gbv_emergency', label: 'GBV Emergency', critical: true },
      { id: 'assault', label: 'Physical Assault', critical: false }
    ],
    chronic: [
      { id: 'diabetic_emergency', label: 'Diabetic Emergency', critical: false },
      { id: 'asthma_attack', label: 'Asthma Attack', critical: false },
      { id: 'heart_condition', label: 'Heart Condition', critical: false }
    ]
  },
  
  tips: {
    heavy_bleeding: [
      'Apply firm, direct pressure to the wound',
      'Keep the injured area elevated if possible',
      'Do not remove any objects embedded in the wound',
      'Keep the person calm and still'
    ],
    breathing_difficulty: [
      'Help the person sit upright',
      'Loosen any tight clothing',
      'Keep airways clear',
      'Stay calm and help them breathe slowly'
    ],
    head_injury: [
      'Do not move the person',
      'Keep their head and neck still',
      'Monitor breathing closely',
      'Do not give food or water'
    ],
    default: [
      'Stay calm and keep the patient comfortable',
      'Monitor vital signs if possible',
      'Keep the person warm',
      'Wait for medical assistance'
    ]
  }
};

// Utility functions
function formatTime(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 60000);
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff} min ago`;
  return `${Math.floor(diff / 60)}h ago`;
}

function generateId() {
  return 'req-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Page-specific initialization
function initUserLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    toast.show('Welcome!', 'Redirecting to request form...');
    setTimeout(() => {
      window.location.href = 'user-request.html';
    }, 1000);
  });
  
  const guestBtn = document.getElementById('guestBtn');
  if (guestBtn) {
    guestBtn.addEventListener('click', () => {
      window.location.href = 'user-request.html';
    });
  }
}

function initResponderLogin() {
  const form = document.getElementById('responderForm');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    toast.show('Access Granted', 'Redirecting to dashboard...');
    setTimeout(() => {
      window.location.href = 'responder-dashboard.html';
    }, 1000);
  });
}

function initUserRequest() {
  const categorySelect = document.getElementById('injuryCategory');
  const typeContainer = document.getElementById('injuryTypeContainer');
  const form = document.getElementById('requestForm');
  let selectedType = null;
  let isCritical = false;
  
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      const category = e.target.value;
      selectedType = null;
      isCritical = false;
      renderInjuryTypes(category);
    });
  }
  
  function renderInjuryTypes(category) {
    if (!typeContainer || !category) {
      if (typeContainer) typeContainer.innerHTML = '';
      return;
    }
    
    const types = store.injuryTypes[category] || [];
    typeContainer.innerHTML = `
      <div class="injury-grid">
        ${types.map(type => `
          <div class="injury-option ${type.critical ? 'critical' : ''}" data-id="${type.id}" data-critical="${type.critical}">
            ${type.label}
          </div>
        `).join('')}
      </div>
      <div id="criticalWarning" class="critical-warning" style="display: none;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span>Critical injury detected. A drone will be dispatched immediately upon submission.</span>
      </div>
    `;
    
    // Add click handlers
    typeContainer.querySelectorAll('.injury-option').forEach(option => {
      option.addEventListener('click', () => {
        typeContainer.querySelectorAll('.injury-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        selectedType = option.dataset.id;
        isCritical = option.dataset.critical === 'true';
        
        const warning = document.getElementById('criticalWarning');
        if (warning) {
          warning.style.display = isCritical ? 'flex' : 'none';
        }
      });
    });
  }
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name')?.value;
      const age = document.getElementById('age')?.value;
      const location = document.getElementById('location')?.value;
      const category = categorySelect?.value;
      const description = document.getElementById('description')?.value;
      
      if (!name || !age || !location || !category || !selectedType) {
        toast.show('Error', 'Please fill in all required fields');
        return;
      }
      
      const request = {
        id: generateId(),
        name,
        age: parseInt(age),
        location,
        injuryCategory: category,
        injuryType: selectedType,
        description,
        status: 'pending',
        isEmergency: isCritical,
        timestamp: new Date()
      };
      
      // Store the request
      const requests = JSON.parse(localStorage.getItem('requests') || '[]');
      requests.push(request);
      localStorage.setItem('requests', JSON.stringify(requests));
      
      if (isCritical) {
        // Show modal and redirect to emergency page
        showDispatchModal(() => {
          localStorage.setItem('currentEmergency', JSON.stringify({
            injuryType: selectedType,
            location: location
          }));
          window.location.href = 'emergency.html';
        });
      } else {
        toast.show('Request Submitted', 'Your request has been received.');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
      }
    });
  }
  
  // Check for emergency mode
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('emergency') === 'true') {
    toast.show('Emergency Mode', 'Please provide your details quickly');
  }
}

function showDispatchModal(onClose) {
  const modal = document.getElementById('dispatchModal');
  if (modal) {
    modal.classList.add('active');
    
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        if (onClose) onClose();
      });
    }
  }
}

function initResponderDashboard() {
  const requestList = document.getElementById('requestList');
  const droneList = document.getElementById('droneList');
  const pendingCount = document.getElementById('pendingCount');
  const activeCount = document.getElementById('activeCount');
  const availableCount = document.getElementById('availableCount');
  
  // Combine mock data with localStorage data
  const localRequests = JSON.parse(localStorage.getItem('requests') || '[]');
  const allRequests = [...store.requests, ...localRequests];
  
  function render() {
    // Update stats
    const pending = allRequests.filter(r => r.status === 'pending').length;
    const active = allRequests.filter(r => r.status === 'dispatched').length;
    const available = store.drones.filter(d => d.status === 'available').length;
    
    if (pendingCount) pendingCount.textContent = pending;
    if (activeCount) activeCount.textContent = active;
    if (availableCount) availableCount.textContent = available;
    
    // Render requests
    if (requestList) {
      const sorted = [...allRequests].sort((a, b) => {
        if (a.isEmergency && !b.isEmergency) return -1;
        if (!a.isEmergency && b.isEmergency) return 1;
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      
      requestList.innerHTML = sorted.map(req => `
        <div class="card request-card ${req.isEmergency ? 'emergency' : ''} ${req.status}">
          <div class="request-header-row">
            <div>
              <div class="request-location">${req.location}</div>
              <div class="request-time">${formatTime(new Date(req.timestamp))}</div>
            </div>
            <span class="badge badge-${req.isEmergency ? 'emergency' : req.status}">
              ${req.isEmergency ? 'EMERGENCY' : req.status.toUpperCase()}
            </span>
          </div>
          <div class="request-details">
            <span>👤 ${req.name}, ${req.age}</span>
            <span>🩹 ${store.injuryCategories[req.injuryCategory] || req.injuryCategory}</span>
          </div>
          ${req.status === 'pending' ? `
            <div class="request-actions">
              <select class="form-select drone-select" data-request-id="${req.id}" style="max-width: 150px;">
                <option value="">Select drone</option>
                ${store.drones.filter(d => d.status === 'available').map(d => `
                  <option value="${d.id}">${d.name}</option>
                `).join('')}
              </select>
              <button class="btn btn-primary dispatch-btn" data-request-id="${req.id}">Dispatch</button>
            </div>
          ` : ''}
        </div>
      `).join('');
      
      // Add dispatch handlers
      requestList.querySelectorAll('.dispatch-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const requestId = btn.dataset.requestId;
          const select = requestList.querySelector(`.drone-select[data-request-id="${requestId}"]`);
          const droneId = select?.value;
          
          if (!droneId) {
            toast.show('Error', 'Please select a drone');
            return;
          }
          
          // Update request status
          const request = allRequests.find(r => r.id === requestId);
          if (request) {
            request.status = 'dispatched';
            request.droneId = droneId;
          }
          
          // Update drone status
          const drone = store.drones.find(d => d.id === droneId);
          if (drone) {
            drone.status = 'in-flight';
          }
          
          toast.show('Drone Dispatched', `${drone?.name || 'Drone'} is on the way!`);
          render();
        });
      });
    }
    
    // Render drones
    if (droneList) {
      droneList.innerHTML = store.drones.map(drone => `
        <div class="card drone-card">
          <div class="drone-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
          </div>
          <div class="drone-info">
            <div class="drone-name">${drone.name}</div>
            <div class="drone-status">${drone.status}</div>
          </div>
          <div class="battery-bar">
            <div class="battery-fill ${drone.battery < 30 ? 'critical' : drone.battery < 60 ? 'low' : ''}" 
                 style="width: ${drone.battery}%"></div>
          </div>
        </div>
      `).join('');
    }
  }
  
  render();
  
  // Refresh button
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      toast.show('Refreshed', 'Data updated');
      render();
    });
  }
  
  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
}

function initEmergencyPage() {
  const etaDisplay = document.getElementById('etaTime');
  const locationDisplay = document.getElementById('userLocation');
  const tipsList = document.getElementById('tipsList');
  
  // Get emergency data
  const emergencyData = JSON.parse(localStorage.getItem('currentEmergency') || '{}');
  const injuryType = emergencyData.injuryType || 'default';
  const location = emergencyData.location || 'Your current location';
  
  // Set location
  if (locationDisplay) {
    locationDisplay.textContent = location;
  }
  
  // Set tips
  const tips = store.tips[injuryType] || store.tips.default;
  if (tipsList) {
    tipsList.innerHTML = tips.map(tip => `
      <li>
        <svg class="tip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>${tip}</span>
      </li>
    `).join('');
  }
  
  // ETA countdown
  let eta = 8;
  function updateETA() {
    if (etaDisplay) {
      etaDisplay.textContent = eta;
    }
    if (eta > 1) {
      eta--;
      setTimeout(updateETA, 60000); // Update every minute in real scenario
    }
  }
  updateETA();
  
  // Simulate progress (for demo)
  setTimeout(() => {
    const timeline = document.querySelectorAll('.timeline-dot');
    if (timeline[1]) timeline[1].classList.add('active');
  }, 3000);
}

// Router - initialize correct page
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  
  switch (page) {
    case 'user-login':
      initUserLogin();
      break;
    case 'responder-login':
      initResponderLogin();
      break;
    case 'user-request':
      initUserRequest();
      break;
    case 'responder-dashboard':
      initResponderDashboard();
      break;
    case 'emergency':
      initEmergencyPage();
      break;
  }
});