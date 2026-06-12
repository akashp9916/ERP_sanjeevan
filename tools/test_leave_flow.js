(async () => {
  try {
    const base = 'http://localhost:8080';
    const leavePayload = {
      applicantType: 'staff',
      applicantId: 'staff_test_1',
      applicantName: 'Test Staff',
      department: 'Computer Science',
      leaveType: 'Personal Leave',
      startDate: '2025-12-02',
      endDate: '2025-12-04',
      days: 3,
      reason: 'Test leave via API',
      priority: 'medium'
    };

    console.log('Creating leave...');
    let res = await fetch(`${base}/api/leaves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leavePayload),
    });
    const createJson = await res.json();
    console.log('Create response:', JSON.stringify(createJson, null, 2));

    const id = createJson.leaveRequest && (createJson.leaveRequest._id || createJson.leaveRequest.id);
    if (!id) {
      console.error('Could not get leave id from response');
      process.exit(1);
    }

    console.log('HOD approving leave...');
    const hodPayload = { status: 'approved', comments: 'OK via automated test', substituteTeacher: 'sub_test_1' };
    res = await fetch(`${base}/api/leaves/${id}/hod-status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hodPayload),
    });
    const hodJson = await res.json();
    console.log('HOD response:', JSON.stringify(hodJson, null, 2));

    console.log('Admin approving leave...');
    const adminPayload = { status: 'approved', comments: 'Final OK via automated test' };
    res = await fetch(`${base}/api/leaves/${id}/admin-status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminPayload),
    });
    const adminJson = await res.json();
    console.log('Admin response:', JSON.stringify(adminJson, null, 2));

    console.log('Fetching all leaves for applicant...');
    res = await fetch(`${base}/api/leaves/applicant/staff_test_1`);
    const listJson = await res.json();
    console.log('Leaves for applicant:', JSON.stringify(listJson, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Error during test:', err);
    process.exit(2);
  }
})();
