// Dashboard Functions

async function loadDashboard() {
    try {
        const data = await apiCall(API.DASHBOARD_STATS);

        if (data.success) {
            const stats = data.data;

            // Update statistics cards
            document.getElementById('totalStudents').textContent = stats.totalStudents || 0;
            document.getElementById('activeStudents').textContent = stats.activeStudents || 0;
            document.getElementById('departmentCount').textContent = stats.byDepartment?.length || 0;
            
            // Calculate recent count (students added this month)
            const recentCount = stats.recentStudents?.length || 0;
            document.getElementById('recentCount').textContent = recentCount;

            // Display department chart
            displayDepartmentChart(stats.byDepartment || []);

            // Display year chart
            displayYearChart(stats.byYear || []);

            // Display recent students
            displayRecentStudents(stats.recentStudents || []);
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showAlert('Failed to load dashboard data', 'error');
    }
}

function displayDepartmentChart(data) {
    const container = document.getElementById('departmentChart');
    
    if (data.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No data available</p></div>';
        return;
    }

    let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';
    
    const maxCount = Math.max(...data.map(d => d.count));
    
    data.forEach(item => {
        const percentage = (item.count / maxCount) * 100;
        const deptName = item._id || 'Unknown';
        const shortName = deptName.length > 30 ? deptName.substring(0, 30) + '...' : deptName;
        
        html += `
            <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="font-size: 13px; color: #4a5568;" title="${deptName}">${shortName}</span>
                    <span style="font-size: 13px; font-weight: 600; color: #2d3748;">${item.count}</span>
                </div>
                <div style="background: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: ${percentage}%; transition: width 0.5s;"></div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function displayYearChart(data) {
    const container = document.getElementById('yearChart');
    
    if (data.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No data available</p></div>';
        return;
    }

    let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';
    
    const maxCount = Math.max(...data.map(d => d.count));
    
    // Sort by year
    const sortedData = data.sort((a, b) => {
        const yearA = parseInt(a._id);
        const yearB = parseInt(b._id);
        return yearA - yearB;
    });
    
    sortedData.forEach(item => {
        const percentage = (item.count / maxCount) * 100;
        
        html += `
            <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="font-size: 13px; color: #4a5568;">${item._id}</span>
                    <span style="font-size: 13px; font-weight: 600; color: #2d3748;">${item.count}</span>
                </div>
                <div style="background: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #48bb78, #38a169); height: 100%; width: ${percentage}%; transition: width 0.5s;"></div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function displayRecentStudents(students) {
    const container = document.getElementById('recentStudents');
    
    if (students.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No recent students</p></div>';
        return;
    }

    let html = '';
    
    students.forEach(student => {
        const date = new Date(student.createdAt);
        const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        html += `
            <div class="recent-item">
                <div class="recent-item-info">
                    <h4>${student.fullName}</h4>
                    <p>${student.studentId} • ${student.department} • ${student.year}</p>
                </div>
                <div class="recent-item-meta">
                    <p>${formattedDate}</p>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function showAlert(message, type = 'error') {
    // Create alert if it doesn't exist
    let alertEl = document.getElementById('alertMessage');
    if (!alertEl) {
        alertEl = document.createElement('div');
        alertEl.id = 'alertMessage';
        alertEl.className = 'alert';
        document.querySelector('.container').insertBefore(alertEl, document.querySelector('.container').firstChild);
    }

    alertEl.textContent = message;
    alertEl.className = `alert ${type}`;
    alertEl.style.display = 'block';

    setTimeout(() => {
        alertEl.style.display = 'none';
    }, 5000);
}
