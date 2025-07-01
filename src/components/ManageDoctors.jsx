import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/api/axiosInstance';
import { FaUserInjured, FaBed, FaAmbulance, FaTools, FaClinicMedical, FaFileAlt, FaMoneyBillWave, FaTasks, FaLock, FaCalendarCheck } from 'react-icons/fa';

const ManageDoctors = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Debug: Log user object
  useEffect(() => {
    console.log('User object:', user);
  }, [user]);

  // State management
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({ name: '', specialty: '', email: '', phone: '' });
  const [editId, setEditId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [dischargeRequests, setDischargeRequests] = useState([]);
  const [resources, setResources] = useState([]);
  const [outpatientData, setOutpatientData] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [billingData, setBillingData] = useState([]);
  const [staffSchedules, setStaffSchedules] = useState([]);
  const [emergencyStatus, setEmergencyStatus] = useState(null);
  const [restrictedAccess, setRestrictedAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get('/doctors');
        setDoctors(response.data);
      } catch (err) {
        setError('Failed to fetch doctors. Please try again or contact support.');
      }
    };
    if (!authLoading && user && ['Admin', 'Doctor'].some(r => r.toLowerCase() === user.role?.toLowerCase())) fetchDoctors();
  }, [user, authLoading]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          patientsResp,
          dischargeResp,
          resourcesResp,
          outpatientResp,
          policiesResp,
          billingResp,
          schedulesResp,
          emergencyResp,
        ] = await Promise.all([
          axiosInstance.get('/patients'),
          axiosInstance.get('/discharge-requests'),
          axiosInstance.get('/hospital-resources'),
          axiosInstance.get('/outpatient-clinics'),
          axiosInstance.get('/policies'),
          axiosInstance.get('/billing'),
          axiosInstance.get('/staff-schedules'),
          axiosInstance.get('/emergency-status'),
        ]);
        setPatients(patientsResp.data);
        setDischargeRequests(dischargeResp.data);
        setResources(resourcesResp.data);
        setOutpatientData(outpatientResp.data);
        setPolicies(policiesResp.data);
        setBillingData(billingResp.data);
        setStaffSchedules(schedulesResp.data);
        setEmergencyStatus(emergencyResp.data.status);
        setRestrictedAccess(!!emergencyResp.data.restrictedAccess);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again or contact support.');
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading && user && ['Admin', 'Doctor'].some(r => r.toLowerCase() === user.role?.toLowerCase())) fetchData();
  }, [user, authLoading]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or update doctor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editId ? `/doctors/${editId}` : '/doctors';
      const method = editId ? 'put' : 'post';
      const response = await axiosInstance[method](url, formData);
      setDoctors(editId ? doctors.map((doc) => (doc.id === editId ? response.data : doc)) : [...doctors, response.data]);
      resetForm();
    } catch (err) {
      setError(`Failed to ${editId ? 'update' : 'add'} doctor. Check data or contact support.`);
    }
  };

  // Delete doctor
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor? This action is irreversible.')) {
      try {
        await axiosInstance.delete(`/doctors/${id}`);
        setDoctors(doctors.filter((doc) => doc.id !== id));
      } catch (err) {
        setError('Failed to delete doctor. Please try again.');
      }
    }
  };

  // Edit doctor
  const handleEdit = (doctor) => {
    setEditId(doctor.id);
    setFormData({ name: doctor.name, specialty: doctor.specialty, email: doctor.email, phone: doctor.phone });
  };

  // Reset form
  const resetForm = () => {
    setEditId(null);
    setFormData({ name: '', specialty: '', email: '', phone: '' });
    setError(null);
  };

  // Handle dashboard actions
  const handleEHRUpdate = (patientId, updates) => {
    console.log(`Updating EHR for patient ${patientId}:`, updates);
    setPatients(patients.map(p => p.id === patientId ? { ...p, ...updates } : p));
  };

  const handleDischargeDecision = (requestId, approve) => {
    console.log(`Discharge ${approve ? 'approved' : 'denied'} for request ${requestId}`);
    setDischargeRequests(dischargeRequests.map(r => r.id === requestId ? { ...r, status: approve ? 'approved' : 'denied' } : r));
  };

  const handleResourceRequest = (resourceId) => {
    console.log(`Requesting resource ${resourceId}`);
    setResources([...resources, { id: resourceId, status: 'requested' }]);
  };

  const handleOutpatientManagement = () => console.log('Managing outpatient clinic operations');
  const handlePolicyUpdate = (policyId) => console.log(`Updating policy ${policyId}`);
  const handleBillingUpdate = (billingId) => console.log(`Updating billing ${billingId}`);
  const handleTaskDelegation = (task) => console.log(`Delegating task: ${task}`);
  const handleScheduleApproval = (scheduleId) => console.log(`Approving schedule ${scheduleId}`);

  if (authLoading) {
    return <div className="container p-4 text-center text-gray-600">Loading authentication...</div>;
  }
  if (!user || !user.role || !['Admin', 'Doctor'].some(r => r.toLowerCase() === user.role?.toLowerCase())) {
    return (
      <div className="container p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p>You do not have permission to manage doctors. Please contact an administrator.</p>
      </div>
    );
  }

  return (
    <div className="container p-4 min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-teal-700 dark:text-teal-300 tracking-wide">Doctor Dashboard</h1>
        <button
          className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          onClick={() => navigate('/system-settings')}
        >
          Admin Settings
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-7h2v5h-2V6z" clipRule="evenodd" />
          </svg>
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Add/Edit Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-teal-600 dark:text-teal-400">
          {editId ? 'Edit Doctor Details' : 'Add New Doctor'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter doctor’s full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Specialty</label>
            <input
              type="text"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g., Cardiology, Pediatrics"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter email address"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter phone number"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition duration-300"
            >
              {editId ? 'Update Doctor' : 'Add Doctor'}
            </button>
            {(editId || formData.name) && (
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Doctors List */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-teal-600 dark:text-teal-400">Doctor Directory</h2>
        {loading ? (
          <div className="text-center text-gray-600 dark:text-gray-400 animate-pulse">Loading doctor data...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : doctors.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">No doctors registered yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Name</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Specialty</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Email</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Phone</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
                  >
                    <td className="p-3 text-gray-800 dark:text-gray-200">{doctor.name}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{doctor.specialty}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{doctor.email}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{doctor.phone}</td>
                    <td className="p-3">
                      <button
                        className="bg-teal-600 text-white px-2 py-1 mr-2 rounded-lg hover:bg-teal-700 transition duration-200"
                        onClick={() => handleEdit(doctor)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition duration-200"
                        onClick={() => handleDelete(doctor.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dashboard Privileges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Patient EHRs */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FaUserInjured className="text-teal-500 mr-3 text-2xl" />
            <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400">Patient EHRs</h2>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div>
              <p className="text-lg">Patients: <span className="font-bold text-teal-700 dark:text-teal-300">{patients.length}</span></p>
              <button
                className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition duration-300"
                onClick={() => handleEHRUpdate(patients[0]?.id, { notes: 'Updated' })}
                disabled={!patients.length}
              >
                Update EHR
              </button>
            </div>
          )}
        </div>

        {/* Discharge Plans */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FaBed className="text-teal-500 mr-3 text-2xl" />
            <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400">Discharge Plans</h2>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div>
              <p className="text-lg">Requests: <span className="font-bold text-teal-700 dark:text-teal-300">{dischargeRequests.length}</span></p>
              <div className="mt-4 flex space-x-2">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                  onClick={() => handleDischargeDecision(dischargeRequests[0]?.id, true)}
                  disabled={!dischargeRequests.length}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                  onClick={() => handleDischargeDecision(dischargeRequests[0]?.id, false)}
                  disabled={!dischargeRequests.length}
                >
                  Deny
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Response */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FaAmbulance className="text-teal-500 mr-3 text-2xl" />
            <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400">Emergency Response</h2>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <p className="text-lg">Status: <span className="font-bold text-teal-700 dark:text-teal-300">{emergencyStatus || 'Normal'}</span></p>
          )}
        </div>

        {/* Hospital Resources */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FaTools className="text-teal-500 mr-3 text-2xl" />
            <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400">Hospital Resources</h2>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div>
              <p className="text-lg">Available: <span className="font-bold text-teal-700 dark:text-teal-300">{resources.length}</span></p>
              <button
                className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition duration-300"
                onClick={() => handleResourceRequest('OR-1')}
              >
                Request Resource
              </button>
            </div>
          )}
        </div>

        {/* Outpatient Clinics */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FaClinicMedical className="text-teal-500 mr-3 text-2xl" />
            <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400">Outpatient Clinics</h2>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <button
              className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition duration-300"
              onClick={handleOutpatientManagement}
            >
              Manage Clinics
            </button>
          )}
        </div>

        {/* Policy Development */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FaFileAlt className="text-teal-500 mr-3 text-2xl" />
            <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400">Policy Development</h2>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <button
              className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition duration-300"
              onClick={() => handlePolicyUpdate('POL-1')}
            >
              Update Policy
            </button>
          )}
        </div>

        {/* Billing & Insurance */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FaMoneyBillWave className="text-teal-500 mr-3 text-2xl" />
            <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400">Billing & Insurance</h2>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <button
              className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition duration-300"
              onClick={() => handleBillingUpdate('BILL-1')}
            >
              Update Billing
            </button>
          )}
        </div>

        {/* Task Delegation */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FaTasks className="text-teal-500 mr-3 text-2xl" />
            <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400">Task Delegation</h2>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <button
              className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition duration-300"
              onClick={() => handleTaskDelegation('Check Vitals')}
            >
              Delegate Task
            </button>
          )}
        </div>

        {/* Restricted Access */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FaLock className="text-teal-500 mr-3 text-2xl" />
            <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400">Restricted Access</h2>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <p className="text-lg">Access: <span className="font-bold text-teal-700 dark:text-teal-300">{restrictedAccess ? 'Granted' : 'Denied'}</span></p>
          )}
        </div>

        {/* Staff Schedules */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FaCalendarCheck className="text-teal-500 mr-3 text-2xl" />
            <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400">Staff Schedules</h2>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <button
              className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition duration-300"
              onClick={() => handleScheduleApproval('SCH-1')}
            >
              Approve Schedule
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageDoctors;