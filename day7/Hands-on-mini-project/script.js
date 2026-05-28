// Initial student data
let students = [
  {name: 'Rahul', age: 20, marks: 85},
  {name: 'Aditi', age: 21, marks: 92},
  {name: 'Aman', age: 19, marks: 76}
];

const studentsList = document.getElementById('studentsList');
const toppersList = document.getElementById('toppersList');
const averageEl = document.getElementById('average');
const form = document.getElementById('addForm');

function renderStudents() {
  studentsList.innerHTML = '';
  students.forEach(s => {
    const li = document.createElement('li');
    li.textContent = `${s.name} - ${s.marks}`;
    studentsList.appendChild(li);
  });
}

function renderToppers() {
  toppersList.innerHTML = '';
  const toppers = students.filter(s => s.marks >= 80);
  toppers.forEach(s => {
    const li = document.createElement('li');
    li.textContent = `${s.name} - ${s.marks}`;
    toppersList.appendChild(li);
  });
}

function calculateAverage() {
  if (students.length === 0) return 0;
  const total = students.reduce((acc, s) => acc + s.marks, 0);
  return (total / students.length).toFixed(2);
}

function updateUI() {
  renderStudents();
  renderToppers();
  averageEl.textContent = calculateAverage();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const age = Number(document.getElementById('age').value);
  const marks = Number(document.getElementById('marks').value);
  if (!name || !age || isNaN(marks)) return;
  students.push({name, age, marks});
  form.reset();
  updateUI();
});

// Initial render
updateUI();
