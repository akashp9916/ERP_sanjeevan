import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardCard } from './DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Badge } from './ui/badge';
import { useLeaveContext } from './LeaveContext';
import { 
  Home, 
  Calendar as CalendarIcon, 
  FileText, 
  Bell, 
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  BookOpen
} from 'lucide-react';

interface StaffDashboardProps {
  onBack: () => void;
}

export function StaffDashboard({ onBack }: StaffDashboardProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { 
    leaveRequests,
    getStudentLeaveRequestsForStaff, 
    updateLeaveRequest, 
    addNotification, 
    getEventsForRole, 
    getNotificationsByUser,
    addSyllabusDraft,
    submitSyllabusToHOD,
    updateSyllabus,
    getSyllabiForStaff,
    addLeaveRequest
  } = useLeaveContext();

  // Demo staff identity (since app uses demo logins)
  const staffId = 'staff001';
  const staffName = 'Demo Staff';

  // Syllabus form state (must be top-level hooks)
  const [branch, setBranch] = useState('Computer Science');
  const [year, setYear] = useState('FY');
  const [courseName, setCourseName] = useState('');
  const [subjectsText, setSubjectsText] = useState('');

  const menuItems = [
    { icon: <Home className="w-4 h-4" />, label: 'Dashboard', active: activeSection === 'dashboard', onClick: () => setActiveSection('dashboard') },
    { icon: <FileText className="w-4 h-4" />, label: 'Apply Leave', active: activeSection === 'leave', onClick: () => setActiveSection('leave') },
    { icon: <BookOpen className="w-4 h-4" />, label: 'Courses/Syllabus', active: activeSection === 'syllabus', onClick: () => setActiveSection('syllabus') },
    { icon: <CalendarIcon className="w-4 h-4" />, label: 'Calendar', active: activeSection === 'calendar', onClick: () => setActiveSection('calendar') },
    { icon: <Bell className="w-4 h-4" />, label: 'Notifications', active: activeSection === 'notifications', onClick: () => setActiveSection('notifications') },
    { icon: <FileText className="w-4 h-4" />, label: 'Student Leaves', active: activeSection === 'student_leaves', onClick: () => setActiveSection('student_leaves') },
  ];

  const roleNotifications = getNotificationsByUser('staff');

  const holidays = [
    { date: '2024-12-25', name: 'Christmas Day', type: 'National Holiday' },
    { date: '2024-12-31', name: 'New Year Eve', type: 'College Holiday' },
    { date: '2025-01-01', name: 'New Year Day', type: 'National Holiday' },
    { date: '2025-01-26', name: 'Republic Day', type: 'National Holiday' },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Leave Balance"
          value="18"
          subtitle="Days remaining"
          icon={<Clock className="w-4 h-4" />}
          trend={{ value: "2 used this month", positive: false }}
        />
        <DashboardCard
          title="Pending Requests"
          value="1"
          subtitle="Awaiting approval"
          icon={<AlertCircle className="w-4 h-4" />}
        />
        <DashboardCard
          title="Approved Leaves"
          value="5"
          subtitle="This year"
          icon={<CheckCircle className="w-4 h-4" />}
          trend={{ value: "2 recent approvals", positive: true }}
        />
        <DashboardCard
          title="Notifications"
          value="3"
          subtitle="Unread messages"
          icon={<Bell className="w-4 h-4" />}
          onClick={() => setActiveSection('notifications')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Leave History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border">
                <div>
                  <p className="font-medium">Dec 25-26, 2024</p>
                  <p className="text-sm text-gray-600">Christmas Holiday</p>
                </div>
                <Badge className="bg-green-100 text-green-700">Approved</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border">
                <div>
                  <p className="font-medium">Jan 15, 2025</p>
                  <p className="text-sm text-gray-600">Personal Leave</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div>
                  <p className="font-medium">Nov 10-12, 2024</p>
                  <p className="text-sm text-gray-600">Medical Leave</p>
                </div>
                <Badge className="bg-gray-100 text-gray-700">Completed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Holidays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {holidays.map((holiday, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border">
                  <div>
                    <p className="font-medium">{holiday.name}</p>
                    <p className="text-sm text-gray-600">{new Date(holiday.date).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {holiday.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSyllabus = () => {
    const mySyllabi = getSyllabiForStaff(staffId);

    const createDraft = () => {
      if (!courseName || !subjectsText) return;
      const subjects = subjectsText.split(',').map(s => s.trim()).filter(Boolean).map((name, idx) => ({ id: `${Date.now()}-${idx}`, name }));
      addSyllabusDraft({
        branch,
        year,
        courseName,
        subjects,
        designedByStaffId: staffId,
        designedByStaffName: staffName,
        hodComments: undefined
      });
      setCourseName('');
      setSubjectsText('');
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Design Syllabus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Branch</Label>
                <Select value={branch} onValueChange={setBranch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FY">First Year</SelectItem>
                    <SelectItem value="SY">Second Year</SelectItem>
                    <SelectItem value="TY">Third Year</SelectItem>
                    <SelectItem value="Final">Final Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Course</Label>
                <Input placeholder="e.g. Data Structures" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subjects (comma separated)</Label>
              <Textarea placeholder="e.g. Arrays, Linked Lists, Trees, Graphs" value={subjectsText} onChange={(e) => setSubjectsText(e.target.value)} />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={createDraft}>Save Draft</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Syllabi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mySyllabi.length === 0 && (
                <div className="text-gray-500 text-sm">No syllabus drafts yet.</div>
              )}
              {mySyllabi.map(s => (
                <div key={s.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{s.courseName} • {s.branch} • {s.year}</p>
                      <p className="text-sm text-gray-600">Subjects: {s.subjects.map(sub => sub.name).join(', ')}</p>
                      {s.hodComments && <p className="text-sm text-red-600 mt-1">HOD Comments: {s.hodComments}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        s.status === 'approved' ? 'bg-green-100 text-green-700' :
                        s.status === 'revision_required' ? 'bg-red-100 text-red-700' :
                        s.status === 'submitted' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }>
                        {s.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {s.status === 'draft' && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700" 
                        onClick={() => {
                          submitSyllabusToHOD(s.id);
                          addNotification({
                            userId: 'hod',
                            title: 'New Syllabus Submitted',
                            message: `${s.courseName} (${s.branch} • ${s.year}) submitted by ${s.designedByStaffName}`,
                            type: 'info',
                            read: false
                          });
                        }}
                      >
                        Submit to HOD
                      </Button>
                    )}
                    {s.status === 'approved' && !s.published && (
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => updateSyllabus(s.id, { published: true })}>Publish to Students</Button>
                    )}
                    {s.published && <Badge className="bg-purple-100 text-purple-700">Published</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Controlled leave form for staff (same logic as student)
  const [staffLeaveForm, setStaffLeaveForm] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    days: 1,
    reason: '',
    priority: 'low' as 'low' | 'medium' | 'high',
    department: 'Computer Science'
  });

 const getStaffLeaveRequests = () => {
  // Helper to get staff's own leave requests from context
  return leaveRequests.filter(
    (req: any) =>
      req.applicantType === 'staff' &&
      req.applicantId === staffId
  );
};
  const submitStaffLeave = async () => {
    if (!staffLeaveForm.leaveType || !staffLeaveForm.startDate || !staffLeaveForm.endDate || !staffLeaveForm.reason) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantType: 'staff',
          applicantId: staffId,
          applicantName: staffName,
          department: staffLeaveForm.department,
          leaveType: staffLeaveForm.leaveType,
          startDate: staffLeaveForm.startDate,
          endDate: staffLeaveForm.endDate,
          days: staffLeaveForm.days,
          reason: staffLeaveForm.reason,
          priority: staffLeaveForm.priority
        })
      });

      if (!response.ok) {
        const error = await response.json();
        alert('Error: ' + error.message);
        return;
      }

      const data = await response.json();
      console.log('Leave request submitted:', data);
      const getStaffLeaveRequests = () => {
  return leaveRequests.filter(
    (req: any) =>
      req.applicantType === 'staff' &&
      req.applicantId === staffId
  );
};

      // Show success notification
      addNotification({
        userId: staffId,
        title: '✅ Leave Request Submitted',
        message: `Your ${staffLeaveForm.leaveType} (${staffLeaveForm.startDate} to ${staffLeaveForm.endDate}) has been submitted and is pending HOD approval.`,
        type: 'success',
        read: false
      });

      // Reset form
      setStaffLeaveForm({ leaveType: '', startDate: '', endDate: '', days: 1, reason: '', priority: 'low', department: staffLeaveForm.department });
    } catch (error: any) {
      console.error('Error submitting leave:', error);
      alert('Failed to submit leave request: ' + error.message);
    }
  };

  const renderLeaveForm = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Apply for Leave
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Leave Type</Label>
              <Select onValueChange={(v) => setStaffLeaveForm({ ...staffLeaveForm, leaveType: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                  <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select onValueChange={(v) => setStaffLeaveForm({ ...staffLeaveForm, priority: v as any })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={staffLeaveForm.startDate} onChange={(e) => setStaffLeaveForm({ ...staffLeaveForm, startDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={staffLeaveForm.endDate} onChange={(e) => setStaffLeaveForm({ ...staffLeaveForm, endDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Days</Label>
              <Input type="number" min={1} value={staffLeaveForm.days} onChange={(e) => setStaffLeaveForm({ ...staffLeaveForm, days: Number(e.target.value) })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Reason</Label>
            <Textarea placeholder="Provide a brief reason for your leave request..." className="min-h-[100px]" value={staffLeaveForm.reason} onChange={(e) => setStaffLeaveForm({ ...staffLeaveForm, reason: e.target.value })} />
          </div>
          <div className="flex gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={submitStaffLeave}>Submit Application</Button>
            <Button variant="outline">Save as Draft</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getStaffLeaveRequests().length === 0 ? (
              <p className="text-sm text-gray-600">No leave requests yet.</p>
            ) : (
              getStaffLeaveRequests().map((req: any) => (
                <div key={req.id} className="p-4 border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium">{req.leaveType} • {req.startDate} to {req.endDate} ({req.days} days)</p>
                    <p className="text-sm text-gray-600">{req.reason}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={req.hodStatus === 'approved' ? 'bg-green-100 text-green-700' : req.hodStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}>
                      HOD: {(req.hodStatus || 'pending').toUpperCase()}
                    </Badge>
                    {req.hodStatus === 'approved' && (
                      <Badge className={req.adminStatus === 'approved' ? 'bg-green-100 text-green-700' : req.adminStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                        Admin: {(req.adminStatus || 'pending').toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCalendar = () => (
    <Card>
      <CardHeader>
        <CardTitle>Holiday Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Events & Holidays</h3>
            <div className="space-y-3">
              {getEventsForRole('staff').map((ev) => (
                <div key={ev.id} className={`p-3 rounded-lg border ${ev.type === 'holiday' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                  <p className="font-medium">{ev.title}</p>
                  <p className="text-sm text-gray-600">{new Date(ev.date).toLocaleDateString()}</p>
                  <Badge className={ev.type === 'holiday' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                    {ev.type === 'holiday' ? 'Holiday' : 'Event'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderNotifications = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {roleNotifications.map((notification) => (
            <div key={notification.id} className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{notification.title}</h4>
                    <Badge 
                      variant="secondary" 
                      className={
                        notification.type === 'success' ? 'bg-green-100 text-green-700' :
                        notification.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }
                    >
                      {notification.type}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{notification.message}</p>
                  <p className="text-sm text-gray-400">{new Date(notification.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderStudentLeaves = () => {
    const requests = getStudentLeaveRequestsForStaff();
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No student leave requests</p>
              </div>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{req.studentName || 'Student'}</h4>
                        <Badge variant="secondary">{req.leaveType}</Badge>
                        <Badge className={
                          req.priority === 'high' ? 'bg-red-100 text-red-700' :
                          req.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }>
                          {req.priority} Priority
                        </Badge>
                        <Badge className={
                          req.staffStatus === 'approved' ? 'bg-green-100 text-green-700' :
                          req.staffStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }>
                          {req.staffStatus?.toUpperCase() || 'PENDING'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Dates:</span> {req.startDate} to {req.endDate}
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span> {req.days} days
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span> {req.submittedDate}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="font-medium text-sm">Reason:</span>
                        <p className="text-sm text-gray-600 mt-1">{req.reason}</p>
                      </div>
                    </div>
                    {req.staffStatus === 'pending' && (
                      <div className="flex gap-2 ml-4">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            updateLeaveRequest(req.id, { 
                              staffStatus: 'approved',
                              hodStatus: 'pending',
                              department: 'Computer Science',
                              staffName: req.studentName || 'Student',
                              staffId: req.studentId || 'student'
                            });
                            if (req.studentId) {
                              addNotification({
                                userId: req.studentId,
                                title: 'Leave Approved',
                                message: `Your ${req.leaveType} (${req.startDate} to ${req.endDate}) has been approved by Staff`,
                                type: 'success',
                                read: false
                              });
                            }
                          }}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => {
                            updateLeaveRequest(req.id, { staffStatus: 'rejected' });
                            if (req.studentId) {
                              addNotification({
                                userId: req.studentId,
                                title: 'Leave Rejected',
                                message: `Your ${req.leaveType} (${req.startDate} to ${req.endDate}) has been rejected by Staff`,
                                type: 'error',
                                read: false
                              });
                            }
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        title="Staff Portal"
        role="Teaching Staff"
        menuItems={menuItems}
        onBack={onBack}
      />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {activeSection === 'dashboard' ? 'Dashboard' :
               activeSection === 'leave' ? 'Apply for Leave' :
               activeSection === 'syllabus' ? 'Courses / Syllabus' :
               activeSection === 'calendar' ? 'Holiday Calendar' :
               activeSection === 'student_leaves' ? 'Student Leaves' :
               'Notifications'}
            </h1>
            <p className="text-gray-600">
              {activeSection === 'dashboard' ? 'Welcome back! Here\'s your overview.' :
               activeSection === 'leave' ? 'Submit your leave application here.' :
               activeSection === 'syllabus' ? 'Design syllabus and send to HOD for approval.' :
               activeSection === 'calendar' ? 'View upcoming holidays and important dates.' :
               activeSection === 'student_leaves' ? 'Review student leave requests.' :
               'Stay updated with the latest announcements.'}
            </p>
          </div>
          {activeSection === 'dashboard' && renderDashboard()}
          {activeSection === 'leave' && renderLeaveForm()}
          {activeSection === 'syllabus' && renderSyllabus()}
          {activeSection === 'calendar' && renderCalendar()}
          {activeSection === 'notifications' && renderNotifications()}
          {activeSection === 'student_leaves' && renderStudentLeaves()}
        </div>
      </div>
    </div>
  );
}