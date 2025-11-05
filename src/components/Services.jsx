import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SectionTitle, ServiceCard, PageBanner } from './ui';
import appointmentService from '../services/appointmentService';
import doctorImg1 from '../assets/images/doctors/doctors-1.jpg';
import doctorImg2 from '../assets/images/doctors/doctors-2.jpg';
import doctorImg3 from '../assets/images/doctors/doctors-3.jpg';
import doctorImg4 from '../assets/images/doctors/doctors-4.jpg';

const Services = ({ isHomePage = false }) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await appointmentService.getServices();

        // Handle response structure - could be array or object with data property
        let processedData = Array.isArray(data) ? data : (data?.data || []);

        // Lọc bỏ các dịch vụ có tên "Khám bệnh"
        processedData = processedData.filter(service =>
          service.name.toLowerCase() !== 'khám bệnh'
        );

        // Nếu là trang chủ, chỉ lấy 3 dịch vụ loại DICH_VU
        if (isHomePage) {
          processedData = processedData
            .filter(service => service.type === 'DICH_VU')
            .slice(0, 3);
        }

        setServices(processedData);
        setFilteredServices(processedData);
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.');
        toast.error('Không thể tải danh sách dịch vụ');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [isHomePage]);

  // Filter services based on search keyword, type, and price range (chỉ cho trang /services)
  useEffect(() => {
    if (isHomePage) {
      // Trang chủ không cần filter
      return;
    }

    let filtered = services;

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter(service => service.type === selectedType);
    }

    // Filter by price range
    if (selectedPriceRange) {
      filtered = filtered.filter(service => {
        const price = service.price || 0;
        switch (selectedPriceRange) {
          case 'under1m':
            return price < 1000000;
          case '1m-3m':
            return price >= 1000000 && price <= 3000000;
          case 'over3m':
            return price > 3000000;
          default:
            return true;
        }
      });
    }

    // Filter by keyword
    if (searchKeyword.trim()) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchKeyword.toLowerCase()))
      );
    }

    setFilteredServices(filtered);
  }, [searchKeyword, selectedType, selectedPriceRange, services, isHomePage]);

  // Icon mapping based on service type
  const getServiceIcon = (type) => {
    const iconMap = {
      'DICH_VU': 'fas fa-heartbeat',
      'XET_NGHIEM': 'fas fa-flask',
      'CHUYEN_KHOA': 'fas fa-hospital-user',
    };
    return iconMap[type] || 'fas fa-notes-medical';
  };

  // Get service image - use placeholder if not available
  const getServiceImage = (service, index) => {
    if (service.image) {
      return service.image;
    }
    // Use doctor images as placeholders
    const images = [doctorImg1, doctorImg2, doctorImg3, doctorImg4];
    return images[index % images.length];
  };

  const handleDetail = (service) => {
    navigate(`/services/${service.id}`);
  };

  const handleConsult = (service) => {
    toast.success(`Đăng ký tư vấn dịch vụ: ${service.name}`);
    navigate('/dat-lich', { state: { selectedService: service } });
  };

  const handleReset = () => {
    setSearchKeyword('');
    setSelectedType('');
    setSelectedPriceRange('');
  };

  return (
    <section id="services" className="services section justify-content-center">
      {/* Page Banner - Only show on full Services page */}
      {!isHomePage ? (
        <PageBanner
          breadcrumbs={[
            { label: 'Trang chủ', link: '/' },
            { label: 'Dịch vụ y tế', link: '/services' }
          ]}
          title="DỊCH VỤ KHÁM"
        />
      ) : (
        <div className="container">
          <div className="section-header">
            <h2>CÁC DỊCH VỤ Y TẾ <span style={{ color: '#1977cc' }}>MEDLATEC</span> CUNG CẤP</h2>
          </div>
        </div>
      )}

      {/* Search and Filter Section - Only show on full Services page */}
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
                        Tìm kiếm dịch vụ
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tên dịch vụ..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-bold">
                        <i className="fas fa-filter me-2"></i>
                        Loại dịch vụ
                      </label>
                      <select
                        className="form-select"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                      >
                        <option value="">Tất cả loại dịch vụ</option>
                        <option value="DICH_VU">Gói khám</option>
                        <option value="XET_NGHIEM">Xét nghiệm</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-bold">
                        <i className="fas fa-dollar-sign me-2"></i>
                        Khoảng giá
                      </label>
                      <select
                        className="form-select"
                        value={selectedPriceRange}
                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                      >
                        <option value="">Tất cả mức giá</option>
                        <option value="under1m">Dưới 1 triệu</option>
                        <option value="1m-3m">1 - 3 triệu</option>
                        <option value="over3m">Trên 3 triệu</option>
                      </select>
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                      <button
                        className="btn btn-outline-secondary w-100"
                        onClick={handleReset}
                      >
                        <i className="fas fa-redo me-1"></i>
                        Đặt lại
                      </button>
                    </div>
                  </div>
                  {(searchKeyword || selectedType || selectedPriceRange) && (
                    <div className="mt-3">
                      <small className="text-muted">
                        <i className="fas fa-info-circle me-1"></i>
                        Tìm thấy <strong>{filteredServices.length}</strong> dịch vụ
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
            <p className="mt-3 text-muted">Đang tải danh sách dịch vụ...</p>
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
        ) : filteredServices.length === 0 ? (
          <div className="alert alert-info text-center" role="alert">
            <i className="fas fa-info-circle me-2"></i>
            {services.length === 0
              ? 'Hiện chưa có dịch vụ khám nào.'
              : 'Không tìm thấy dịch vụ phù hợp với tiêu chí tìm kiếm.'}
          </div>
        ) : (
          <div className="row gy-4">
            {filteredServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                image={getServiceImage(service, index)}
                icon={getServiceIcon(service.type)}
                title={service.name}
                description={service.description}
                price={service.price}
                discount={service.discount ? `${service.discount}%` : null}
                gender={service.gender}
                roomName={service.roomName || 'Phòng khám'}
                aosDelay={(index + 1) * 30}
                disableAnimation={false}
                onDetail={() => handleDetail(service)}
              />
            ))}
          </div>
        )}

        {/* Show "View All" button on homepage */}
        {isHomePage && filteredServices.length > 0 && (
          <div className="row mt-5">
            <div className="col-12 text-center">
              <button
                className="btn-view-more"
                onClick={() => navigate('/services')}
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

export default Services;
