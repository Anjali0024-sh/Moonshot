async function fetchData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        // Display an error message in the table
        document.getElementById('data-table-body').innerHTML = '<tr><td colspan="9">Failed to load data.  Check the console and ensure data.json is accessible.</td></tr>';
        return null;
    }
}

function setLocalStorage(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
}

function getLocalStorage(name) {
    const storedValue = localStorage.getItem(name);
    return storedValue ? JSON.parse(storedValue) : null;
}
function removeLocalStorage(name) {
    localStorage.removeItem(name);
}



const loginPage = document.getElementById('loginPage');
const signUpPage = document.getElementById('signUpPage');
const forgotPasswordPage = document.getElementById('forgotPasswordPage');
const dashboardPage = document.getElementById('dashboardPage');


const barChartCanvas = document.getElementById('barChart');
const lineChartCanvas = document.getElementById('lineChart');
const dataTableBody = document.getElementById('data-table-body');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const ageFilterSelect = document.getElementById('ageFilter');
const genderFilterSelect = document.getElementById('genderFilter');
const applyFiltersButton = document.getElementById('apply-filters');
const resetFiltersButton = document.getElementById('reset-filters');
const shareUrlButton = document.getElementById('share-url');
const urlPopup = document.getElementById('urlPopup');
const sharedUrlDisplay = document.getElementById('shared-url-display');
const darkModeButton = document.getElementById('darkModeButton');

let barChart, lineChart;
let allData;
let currentFilters = {
    startDate: null,
    endDate: null,
    age: 'all',
    gender: 'all'
};


const users = [
    { "username": "user1", "password": "123" },
    { "username": "user2", "password": "456" }
];


function showLoginPage() {
    loginPage.style.display = 'flex';
    signUpPage.style.display = 'none';
    forgotPasswordPage.style.display = 'none';
}

function showSignUpPage() {
    loginPage.style.display = 'none';
    signUpPage.style.display = 'flex';
    forgotPasswordPage.style.display = 'none';
}

function showForgotPassword() {
    loginPage.style.display = 'none';
    signUpPage.style.display = 'none';
    forgotPasswordPage.style.display = 'flex';
}

function toggleLoginPassword(event) {
   const passwordInput = event.target.parentElement.querySelector('.loginPassword')
   const eyeIcon = event.target;

  if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
  } else {
      passwordInput.type = 'password';
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
  }
}
function toggleSignupPassword(event) {
  const passwordInput = event.target.parentElement.querySelector('.signupPassword')
  const eyeIcon = event.target;
  if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
  } else {
      passwordInput.type = 'password';
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
  }
}
function toggleConfirmSignupPassword(event) {
  const passwordInput = event.target.parentElement.querySelector('.confirmSignupPassword')
  const eyeIcon = event.target;
  if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
  } else {
      passwordInput.type = 'password';
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
  }
}
function toggleNewPassword(event) {
  const passwordInput = event.target.parentElement.querySelector('.newPassword')
    const eyeIcon = event.target;
  if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
  } else {
      passwordInput.type = 'password';
     eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
  }
}

function toggleConfirmPassword(event) {
 const passwordInput = event.target.parentElement.querySelector('.confirmPassword')
   const eyeIcon = event.target;
  if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
  } else {
      passwordInput.type = 'password';
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
  }
}


function login() {
  const username = document.querySelector('.loginUsername').value;
  const password = document.querySelector('.loginPassword').value;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
      setLocalStorage('loggedInUser', username);
      loginPage.style.display = 'none';
      dashboardPage.style.display = 'block';
      loadDashboard();
  } else {
      alert('Login failed. Please check your credentials.');
  }
}
function signUp() {
  const username = document.querySelector('.signupUsername').value;
  const password = document.querySelector('.signupPassword').value;
   const confirmPassword = document.querySelector('.confirmSignupPassword').value;


  if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
  }

  users.push({ "username": username, "password": password })
  alert('Sign Up successfully');
  showLoginPage();

}

function resetPassword() {
 const newPassword = document.querySelector('.newPassword').value;
  const confirmPassword = document.querySelector('.confirmPassword').value;

  if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
  }
  alert('Password reset successfully');
  showLoginPage();

}


function handleLogout() {
  removeLocalStorage('loggedInUser');
  dashboardPage.style.display = 'none';
  loginPage.style.display = 'flex';
  resetDashboard();
}




function parseDate(dateString) {
    const parts = dateString.split('/');
    // Ensure we have the expected parts (day, month, year)
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JavaScript Dates
        const year = parseInt(parts[2], 10);

        // Check if the parts resulted in valid numbers
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            return new Date(year, month, day);
        } else {
            console.error("Invalid date part(s) in:", dateString);
            return null; // Or throw an error, or return a default date
        }
    } else {
        console.error("Unexpected date format:", dateString);
        return null; // Or throw an error, or return a default date
    }
}
function filterData(data, filters) {
    return data.filter(item => {
        const itemDate = parseDate(item.Day);
        const startDate = filters.startDate ? new Date(filters.startDate) : null;
        const endDate = filters.endDate ? new Date(filters.endDate) : null;

        if (!itemDate) return false; // Skip invalid dates.

        if (startDate && itemDate < startDate) return false;
        if (endDate && itemDate > endDate) return false;

        if (filters.age !== 'all') {
            if (filters.age === '15-25' && item.Age !== '15-25') return false;
            if (filters.age === '>25' && item.Age !== '>25') return false;
        }

        if (filters.gender !== 'all' && item.Gender !== filters.gender) return false;

        return true;
    });
}


function updateDataTable(filteredData) {
  dataTableBody.innerHTML = '';
  if (filteredData && filteredData.length > 0) {
      filteredData.forEach(item => {
          const row = document.createElement('tr');
          row.innerHTML = `
          <td>${item.Day}</td>
          <td>${item.Age}</td>
          <td>${item.Gender}</td>
          <td>${item.A}</td>
          <td>${item.B}</td>
          <td>${item.C}</td>
          <td>${item.D}</td>
          <td>${item.E}</td>
          <td>${item.F}</td>
       `;
          dataTableBody.appendChild(row);
      });
  } else {
      dataTableBody.innerHTML = '<tr><td colspan="9">No data to display.</td></tr>';
  }
}

function prepareBarChartData(filteredData) {
  const featureTotals = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  filteredData.forEach(item => {
      for (const feature in featureTotals) {
          featureTotals[feature] += item[feature];
      }
  });
  return {
      labels: Object.keys(featureTotals),
      datasets: [{
          label: 'Total Time Spent',
          data: Object.values(featureTotals),
          backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)'
          ],
          borderWidth: 1,
          borderColor: '#777',
          hoverBorderWidth: 3,
          hoverBorderColor: '#000'
      }]
  };
}

function updateChartColors(isDarkMode) {
  const darkModeColor = 'rgba(220, 220, 220, 0.6)';
      const lightModeColor = [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)'
          ];


  const barChartData = barChart?.data;
  if (barChartData) {
      barChartData.datasets[0].backgroundColor = isDarkMode ? darkModeColor : lightModeColor;
       barChart.update();
  }

      const lineChartData = lineChart?.data;

      if (lineChartData) {
         lineChartData.datasets[0].borderColor = isDarkMode ? darkModeColor : 'rgb(75, 192, 192)';
          lineChart.update();
  }
}

function toggleDarkMode() {
  const body = document.body;
  const isDarkMode = body.classList.toggle('dark-mode');
  updateChartColors(isDarkMode);
}

function updateBarChart(chartData) {
    if (barChart) {
        barChart.data = chartData;
        barChart.update();
    } else {
        barChart = new Chart(barChartCanvas, {
            type: 'bar',
            data: chartData,
            options: {
                onClick: (e) => {
                    const points = barChart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
                    if (points.length) {
                        const clickedLabel = barChart.data.labels[points[0].index];
                        updateLineChart(clickedLabel, allData, currentFilters);
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Total Time Spent by Feature',
                        fontSize: 25
                    },
                    legend: {
                        display: false
                    }
                },
                responsive: true
            }
        });
    }
}




function prepareLineChartData(feature, filteredData) {
  const timeData = {};
  filteredData.forEach(item => {
      const day = item.Day;
      if (!timeData[day]) {
          timeData[day] = 0;
      }
      timeData[day] += item[feature];
  });

  const sortedDays = Object.keys(timeData).sort((a, b) => parseDate(a) - parseDate(b));

  return {
      labels: sortedDays,
      datasets: [{
          label: `Time Trend for Feature ${feature}`,
          data: sortedDays.map(day => timeData[day]),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
      }]
  };
}

function updateLineChart(feature, data, filters) {
  const filteredData = filterData(data, filters)
  const lineChartData = prepareLineChartData(feature, filteredData);

   if (lineChart) {
      lineChart.destroy();
      lineChart = null;
  }

  if (lineChartData.labels.length > 0) {  // only create/update if data available.
    lineChart = new Chart(lineChartCanvas, {
          type: 'line',
          data: lineChartData,
          options: {
              responsive: true,
              plugins: {
                  title: {
                      display: true,
                      text: `Time Trend for Feature ${feature}`,
                      fontSize: 25
                  },
                  legend: {
                      display: false
                  }
              },
              scales: {
                  x: {
                      title: {
                          display: true,
                          text: 'Date'
                      },
                  },
                  y: {
                      title: {
                          display: true,
                          text: 'Time Spent'
                      },
                  }
              },



          }

      });
  }
}

function resetDashboard() {

  currentFilters = {
      startDate: null,
      endDate: null,
      age: 'all',
      gender: 'all'
  };
  startDateInput.value = '';
  endDateInput.value = '';
  ageFilterSelect.value = 'all';
  genderFilterSelect.value = 'all';
  dataTableBody.innerHTML = '';
  if (barChart) {
      barChart.destroy();
      barChart = null;
  }
  if (lineChart) {
      lineChart.destroy();
      lineChart = null;
  }
   removeLocalStorage('filters');
  updateDataTable([]);
   updateBarChart({ labels: [], datasets: [] });
      updateLineChart('A', [], currentFilters);
}

function loadInitialState(data) {

  function getURLParams() {
      const urlParams = new URLSearchParams(window.location.search);
      const params = {};
      for (const [key, value] of urlParams) {
          params[key] = value;
      }
      return params;
  }

   const urlParams = getURLParams();
   const storedFilters = getLocalStorage('filters') || {};

    const storedStartDate = urlParams.startDate || storedFilters.startDate || '';
    const storedEndDate = urlParams.endDate || storedFilters.endDate || '';
    const storedAge = urlParams.age || storedFilters.age || 'all';
    const storedGender = urlParams.gender || storedFilters.gender || 'all';

 
  currentFilters = {
      startDate: storedStartDate,
      endDate: storedEndDate,
      age: storedAge,
      gender: storedGender
  };

  if (storedStartDate) startDateInput.value = storedStartDate;
  if (storedEndDate) endDateInput.value = storedEndDate;
  ageFilterSelect.value = storedAge;
  genderFilterSelect.value = storedGender;
  applyFilters(data, false);
}


function applyFilters(data, initialLoad = true) {
  currentFilters.startDate = startDateInput.value;
  currentFilters.endDate = endDateInput.value;
  currentFilters.age = ageFilterSelect.value;
  currentFilters.gender = genderFilterSelect.value;

   setLocalStorage('filters', currentFilters);

  const filteredData = filterData(data, currentFilters);



  updateDataTable(filteredData);
  const barChartData = prepareBarChartData(filteredData);
  updateBarChart(barChartData);



  if (barChart && barChart.data && barChart.data.labels && barChart.data.labels.length > 0) {
      updateLineChart(barChart.data.labels[0], data, currentFilters);
  } else {
        updateLineChart('A', data, currentFilters);
  }

}

function shareDashboard() {
  const params = new URLSearchParams(currentFilters);
  const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`; // Correct template literal usage
  sharedUrlDisplay.textContent = `Share this URL: ${url}`; // Correct template literal usage
  urlPopup.style.display = 'flex';
}

applyFiltersButton.addEventListener('click', () => {
  if (allData) {
      applyFilters(allData)
  }
});
resetFiltersButton.addEventListener('click', () => {
  resetDashboard();
  });
shareUrlButton.addEventListener('click', shareDashboard);


async function loadDashboard() {
  const fetchedData = await fetchData();
  if (fetchedData) {
      allData = fetchedData.data;
      loadInitialState(allData);
  }
}

const loggedInUser = getLocalStorage('loggedInUser');

if (loggedInUser) {
  loginPage.style.display = 'none';
  dashboardPage.style.display = 'block';
  loadDashboard();
} else {
  loginPage.style.display = 'flex';
  dashboardPage.style.display = 'none';
}
if (darkModeButton) {
darkModeButton.addEventListener('click', toggleDarkMode);
}