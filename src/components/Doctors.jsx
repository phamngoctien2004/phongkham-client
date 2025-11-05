import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SectionTitle, DoctorCard, PageBanner } from './ui';
import appointmentService from '../services/appointmentService';
import doctor1 from '../assets/images/doctors/doctors-1.jpg';
import doctor2 from '../assets/images/doctors/doctors-2.jpg';
import doctor3 from '../assets/images/doctors/doctors-3.jpg';
import doctor4 from '../assets/images/doctors/doctors-4.jpg';

const Doctors = ({ isHomePage = false }) => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const navigate = useNavigate();

  // Placeholder images
  const doctorImages = [doctor1, doctor2, doctor3, doctor4];

  // Fetch doctors and degrees from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch doctors
        const doctorsData = await appointmentService.getDoctors();
        let doctorsArray = Array.isArray(doctorsData) ? doctorsData : (doctorsData?.data || []);

        // Nếu là trang chủ, chỉ lấy 6 bác sĩ đầu tiên
        if (isHomePage) {
          doctorsArray = doctorsArray.slice(0, 6);
        }

        setDoctors(doctorsArray);
        setFilteredDoctors(doctorsArray);

        // Fetch degrees and departments (only on full page, not homepage)
        if (!isHomePage) {
          const degreesData = await appointmentService.getDegrees();
          const degreesArray = Array.isArray(degreesData) ? degreesData : (degreesData?.data || []);
          setDegrees(degreesArray);

          const departmentsData = await appointmentService.getDepartments();
          const departmentsArray = Array.isArray(departmentsData) ? departmentsData : (departmentsData?.data || []);
          setDepartments(departmentsArray);
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.');
        toast.error('Không thể tải danh sách bác sĩ');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isHomePage]);

  // Filter doctors based on search, degree, and department
  useEffect(() => {
    if (isHomePage) {
      // Homepage: no filtering
      return;
    }

    let filtered = doctors;

    // Filter by degree
    if (selectedDegree) {
      filtered = filtered.filter(
        (doctor) => doctor.degreeResponse?.degreeId === parseInt(selectedDegree)
      );
    }

    // Filter by department
    if (selectedDepartment) {
      filtered = filtered.filter(
        (doctor) => doctor.departmentResponse?.id === parseInt(selectedDepartment)
      );
    }

    // Filter by name
    if (searchKeyword.trim()) {
      filtered = filtered.filter((doctor) =>
        doctor.fullName.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  }, [searchKeyword, selectedDegree, selectedDepartment, doctors, isHomePage]);

  // Get doctor image - use placeholder if not available
  const getDoctorImage = (doctor, index) => {
    if (doctor.image) {
      return doctor.image;
    }
    return doctorImages[index % doctorImages.length];
  };

  const handleReset = () => {
    setSearchKeyword('');
    setSelectedDegree('');
    setSelectedDepartment('');
  };

  const handleDoctorDetail = (doctor) => {
    // Navigate to appointment page with selected doctor
    // Thông báo sẽ được hiển thị ở trang đặt lịch
    navigate('/dat-lich', {
      state: {
        selectedDoctor: doctor,
        doctorId: doctor.id,
        doctorName: doctor.fullName
      }
    });
  };

  return (
    <section id="doctors" className="doctors section">
      {!isHomePage ? (
        <PageBanner
          title="ĐỘI NGŨ BÁC SĨ"
          breadcrumbs={[
            { label: 'Trang chủ', link: '/' },
            { label: 'Đội ngũ bác sĩ' }
          ]}
        />
      ) : (
        <div className="container">
          <SectionTitle
            title="Đội ngũ bác sĩ"
            subtitle=""
            disableAnimation={!isHomePage}
          />
        </div>
      )}

      {/* Search and Filter Section - Only show on full Doctors page */}
      {!isHomePage && (
        <div className="container mb-4" style={{ maxWidth: '1500px' }}>
          <div className="row justify-content-center">
            <div className="">
              <div className="">
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label fw-bold">
                        <i className="fas fa-search me-2"></i>
                        Tìm kiếm bác sĩ
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tên bác sĩ..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-bold">
                        <i className="fas fa-hospital me-2"></i>
                        Chuyên khoa
                      </label>
                      <select
                        className="form-select"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                      >
                        <option value="">Tất cả chuyên khoa</option>
                        {departments.map((department) => (
                          <option key={department.id} value={department.id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-bold">
                        <i className="fas fa-graduation-cap me-2"></i>
                        Bằng cấp
                      </label>
                      <select
                        className="form-select"
                        value={selectedDegree}
                        onChange={(e) => setSelectedDegree(e.target.value)}
                      >
                        <option value="">Tất cả bằng cấp</option>
                        {degrees.map((degree) => (
                          <option key={degree.degreeId} value={degree.degreeId}>
                            {degree.degreeName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                      <button
                        className="btn btn-outline-secondary w-100"
                        onClick={handleReset}
                      >
                        <i className="fas fa-redo me-2"></i>
                        Đặt lại
                      </button>
                    </div>
                  </div>

                  {/* Filter results info */}
                  {(searchKeyword || selectedDegree || selectedDepartment) && (
                    <div className="mt-3">
                      <small className="text-muted">
                        <i className="fas fa-info-circle me-1"></i>
                        Tìm thấy <strong>{filteredDoctors.length}</strong> bác sĩ
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container" style={{ maxWidth: '1500px' }}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3 text-muted">Đang tải danh sách bác sĩ...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
            <button
              className="btn btn-primary btn-sm ms-3"
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-sync-alt me-1"></i>
              Tải lại
            </button>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="alert alert-info text-center" role="alert">
            <i className="fas fa-info-circle me-2"></i>
            {doctors.length === 0
              ? 'Hiện chưa có bác sĩ nào.'
              : 'Không tìm thấy bác sĩ phù hợp với tiêu chí tìm kiếm.'}
          </div>
        ) : (
          <div className="row gy-4">
            {filteredDoctors.map((doctor, index) => (
              <DoctorCard
                key={doctor.id}
                image={getDoctorImage(doctor, index)}
                name={doctor.fullName}
                position={doctor.position}
                examinationFee={doctor.examinationFee}
                aosDelay={(index + 1) * 30}
                disableAnimation={false}
                onDetail={() => handleDoctorDetail(doctor)}
              />
            ))}
          </div>
        )}

        {/* Show "View All" button on homepage */}
        {isHomePage && filteredDoctors.length > 0 && (
          <div className="row mt-5">
            <div className="col-12 text-center">
              <button
                className="btn-view-more"
                onClick={() => navigate('/doctors')}
              >
                Xem thêm
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Doctors;
