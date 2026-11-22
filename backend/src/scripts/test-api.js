process.env.NODE_ENV = 'test';
process.env.PORT = '5099';
process.env.JWT_SECRET = 'test_secret_key_thiranex_2026';

const { app, server } = require('../server');

async function runTests() {
  console.log('\n======================================================');
  console.log('       RUNNING BACKEND API INTEGRATION TESTS          ');
  console.log('======================================================\n');

  const BASE_URL = 'http://localhost:5099';
  let passedCount = 0;
  let failedCount = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`  [FAIL] ${testName}`);
      failedCount++;
    }
  };

  // Wait a moment for server and DB init
  await new Promise((r) => setTimeout(r, 600));

  try {
    // Test 1: Health check
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'online', '1. Health check endpoint responds with online status');

    // Test 2: Register user
    const uniqueEmail = `test_${Date.now()}@example.com`;
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Engineer',
        email: uniqueEmail,
        password: 'Password123!'
      })
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && regData.success && regData.data.token, '2. User registration returns 201 and JWT token');
    const token = regData.data.token;

    // Test 3: Duplicate email registration
    const dupRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate Engineer',
        email: uniqueEmail,
        password: 'Password123!'
      })
    });
    assert(dupRes.status === 409, '3. Duplicate email registration rejected with 409 Conflict');

    // Test 4: User login
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'Password123!'
      })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.data.user.email === uniqueEmail, '4. User login returns 200 and valid session data');

    // Test 5: Protected route with JWT token
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.data.user.name === 'Test Engineer', '5. GET /api/auth/me returns authenticated user profile');

    // Test 6: Protected route without token
    const unauthRes = await fetch(`${BASE_URL}/api/tasks`);
    assert(unauthRes.status === 401, '6. Unauthenticated request to /api/tasks is blocked with 401 Unauthorized');

    // Test 7: Create Task 1
    const createRes1 = await fetch(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Build Authentication Module',
        description: 'Complete JWT & bcrypt setup',
        status: 'pending',
        priority: 'high',
        category: 'Backend',
        dueDate: '2026-12-01'
      })
    });
    const createData1 = await createRes1.json();
    assert(createRes1.status === 201 && createData1.data.id, '7. Task creation returns 201 and created task with ID');
    const taskId1 = createData1.data.id;

    // Test 8: Create Task 2
    const createRes2 = await fetch(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Design Kanban Board View',
        description: 'Create column layout and cards',
        status: 'in-progress',
        priority: 'medium',
        category: 'Frontend',
        dueDate: '2026-12-05'
      })
    });
    const createData2 = await createRes2.json();
    assert(createRes2.status === 201 && createData2.data.id, '8. Second task creation succeeds');
    const taskId2 = createData2.data.id;

    // Test 9: Get all tasks
    const listRes = await fetch(`${BASE_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const listData = await listRes.json();
    assert(listRes.status === 200 && listData.count >= 2, '9. GET /api/tasks lists user tasks');

    // Test 10: Filter tasks by status
    const filterRes = await fetch(`${BASE_URL}/api/tasks?status=in-progress`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const filterData = await filterRes.json();
    assert(filterRes.status === 200 && filterData.data.every(t => t.status === 'in-progress'), '10. Filter by status returns strictly matching tasks');

    // Test 11: Update task
    const updateRes = await fetch(`${BASE_URL}/api/tasks/${taskId1}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        status: 'completed'
      })
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200 && updateData.data.status === 'completed', '11. Task status updated to "completed"');

    // Test 12: Get stats
    const statsRes = await fetch(`${BASE_URL}/api/tasks/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const statsData = await statsRes.json();
    assert(statsRes.status === 200 && statsData.data.completed >= 1, '12. Task statistics endpoint returns correct aggregated counts');

    // Test 13: Delete task
    const deleteRes = await fetch(`${BASE_URL}/api/tasks/${taskId2}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    assert(deleteRes.status === 200, '13. DELETE /api/tasks/:id deletes task successfully');

    // Test 14: Verify task deletion
    const verifyDelRes = await fetch(`${BASE_URL}/api/tasks/${taskId2}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    assert(verifyDelRes.status === 404, '14. Fetching deleted task returns 404 Not Found');

    // Test 15: Fetch activity logs
    const actRes = await fetch(`${BASE_URL}/api/tasks/activities`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const actData = await actRes.json();
    assert(actRes.status === 200 && actData.data.length > 0, '15. User activity logs recorded and retrieved');

  } catch (err) {
    console.error('Test execution error:', err);
    failedCount++;
  } finally {
    console.log('\n======================================================');
    console.log(`Test Results: ${passedCount} PASSED, ${failedCount} FAILED`);
    console.log('======================================================\n');
    server.close();
    process.exit(failedCount > 0 ? 1 : 0);
  }
}

runTests();
