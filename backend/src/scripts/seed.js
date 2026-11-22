require('dotenv').config();
const bcrypt = require('bcryptjs');
const { initDB, queryRun } = require('../config/db');
const User = require('../models/userModel');
const Task = require('../models/taskModel');

async function seed() {
  console.log('--- Starting Database Seeder ---');
  await initDB();

  const demoEmail = 'demo@thiranex.com';
  let demoUser = await User.findByEmail(demoEmail);

  if (!demoUser) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123!', salt);
    demoUser = await User.create({
      name: 'Alex Johnson',
      email: demoEmail,
      password: hashedPassword,
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AlexJohnson&backgroundColor=4f46e5'
    });
    console.log(`Created demo user: ${demoEmail} (Password: Password123!)`);
  } else {
    console.log(`Demo user already exists: ${demoEmail}`);
  }

  // Clear previous sample tasks for clean seeding
  await queryRun(`DELETE FROM tasks WHERE user_id = ?`, [demoUser.id]);
  await queryRun(`DELETE FROM activity_logs WHERE user_id = ?`, [demoUser.id]);

  const today = new Date();
  const formatOffsetDate = (days) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const sampleTasks = [
    {
      title: 'Design high-fidelity wireframes for Task Dashboard',
      description: 'Create mobile & desktop responsive Figma mockups including Kanban board and activity drawer.',
      status: 'completed',
      priority: 'high',
      category: 'Design',
      dueDate: formatOffsetDate(-2)
    },
    {
      title: 'Implement JWT User Authentication & Authorization',
      description: 'Setup bcrypt password hashing, token issuance, auth middleware, and protected API routes.',
      status: 'completed',
      priority: 'urgent',
      category: 'Backend',
      dueDate: formatOffsetDate(-1)
    },
    {
      title: 'Develop Real-Time WebSocket Synchronization',
      description: 'Connect Socket.io on frontend and backend to broadcast task creation, updates, and status changes across browser tabs.',
      status: 'in-progress',
      priority: 'high',
      category: 'Backend',
      dueDate: formatOffsetDate(2)
    },
    {
      title: 'Build Responsive Kanban Drag-and-Drop Board',
      description: 'Implement column-based workflow board with Pending, In Progress, and Completed states.',
      status: 'in-progress',
      priority: 'medium',
      category: 'Frontend',
      dueDate: formatOffsetDate(4)
    },
    {
      title: 'Add Advanced Filter & Search Functionality',
      description: 'Allow instant client-side and server-side filtering by status, priority, category tags, and search query.',
      status: 'pending',
      priority: 'medium',
      category: 'Frontend',
      dueDate: formatOffsetDate(6)
    },
    {
      title: 'Setup Automated API Smoke & Integration Tests',
      description: 'Write end-to-end API test script validating full CRUD lifecycle and authorization guards.',
      status: 'pending',
      priority: 'high',
      category: 'QA',
      dueDate: formatOffsetDate(8)
    },
    {
      title: 'Prepare Docker Container & Deployment Guide',
      description: 'Create Dockerfile, docker-compose configuration, and production environment documentation.',
      status: 'pending',
      priority: 'low',
      category: 'DevOps',
      dueDate: formatOffsetDate(10)
    }
  ];

  for (const t of sampleTasks) {
    const created = await Task.create({
      userId: demoUser.id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      category: t.category,
      dueDate: t.dueDate
    });

    await Task.logActivity({
      userId: demoUser.id,
      taskId: created.id,
      action: 'CREATED',
      details: `Created task "${t.title}" in category ${t.category}`
    });
  }

  console.log(`Successfully seeded ${sampleTasks.length} tasks for user: ${demoEmail}!`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
