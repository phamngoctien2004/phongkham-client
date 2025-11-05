import './Departments.css';

const Departments = () => {
    const departments = [
        {
            id: 1,
            name: 'Chuyên khoa Nội',
            icon: 'fas fa-lungs',
            link: '/chuyen-khoa/noi'
        },
        {
            id: 2,
            name: 'Ung bướu',
            icon: 'fas fa-virus',
            link: '/chuyen-khoa/ung-buou'
        },
        {
            id: 3,
            name: 'CHUYÊN KHOA SẢN PHỤ KHOA',
            icon: 'fas fa-baby',
            link: '/chuyen-khoa/san-phu-khoa'
        },
        {
            id: 4,
            name: 'Chẩn đoán hình ảnh',
            icon: 'fas fa-x-ray',
            link: '/chuyen-khoa/chan-doan-hinh-anh'
        },
        {
            id: 5,
            name: 'TRUNG TÂM XÉT NGHIỆM MEDLATEC',
            icon: 'fas fa-vial',
            link: 'https://medlatec.vn/chuyen-khoa/trung-tam-xet-nghiem',
            isExternal: true,
            isHighlight: true
        },
        {
            id: 6,
            name: 'Khoa ngoại',
            icon: 'fas fa-scalpel',
            link: '/chuyen-khoa/ngoai'
        },
        {
            id: 7,
            name: 'Tiêu hóa',
            icon: 'fas fa-stomach',
            link: '/chuyen-khoa/tieu-hoa'
        },
        {
            id: 8,
            name: 'Nội tiết',
            icon: 'fas fa-disease',
            link: '/chuyen-khoa/noi-tiet'
        },
        {
            id: 9,
            name: 'Tim mạch',
            icon: 'fas fa-heart-pulse',
            link: '/chuyen-khoa/tim-mach'
        },
        {
            id: 10,
            name: 'Nam khoa',
            icon: 'fas fa-male',
            link: 'https://medlatec.vn/chuyen-khoa/nam-khoa-3',
            isExternal: true,
            isHighlight: true
        },
        {
            id: 11,
            name: 'Chuyên khoa Cơ xương khớp',
            icon: 'fas fa-bone',
            link: '/chuyen-khoa/co-xuong-khop'
        },
        {
            id: 12,
            name: 'Truyền nhiễm',
            icon: 'fas fa-virus-covid',
            link: '/chuyen-khoa/truyen-nhiem'
        },
        {
            id: 13,
            name: 'Thần kinh',
            icon: 'fas fa-brain',
            link: '/chuyen-khoa/than-kinh'
        },
        {
            id: 14,
            name: 'Nhi khoa',
            icon: 'fas fa-child',
            link: '/chuyen-khoa/nhi-khoa'
        },
        {
            id: 15,
            name: 'Mắt',
            icon: 'fas fa-eye',
            link: '/chuyen-khoa/mat'
        },
        {
            id: 16,
            name: 'Tai mũi họng',
            icon: 'fas fa-ear-listen',
            link: '/chuyen-khoa/tai-mui-hong'
        },
        {
            id: 17,
            name: 'Da liễu',
            icon: 'fas fa-hand-dots',
            link: '/chuyen-khoa/da-lieu'
        },
        {
            id: 18,
            name: 'Răng hàm mặt',
            icon: 'fas fa-tooth',
            link: '/chuyen-khoa/rang-ham-mat'
        }
    ];

    const handleDepartmentClick = (department) => {
        if (department.isExternal) {
            window.open(department.link, '_blank');
        } else {
            // Handle internal navigation
            window.location.href = department.link;
        }
    };

    return (
        <section className="departments-section">
            <div className="container">
                <div className="section-header">
                    <h2>CÁC CHUYÊN KHOA Y TẾ TẠI <span style={{ color: '#1977cc' }}>MEDLATEC</span></h2>
                </div>

                <div className="departments-grid">
                    {departments.map((department) => (
                        <div
                            key={department.id}
                            className={`department-item ${department.isHighlight ? 'highlight' : ''}`}
                            onClick={() => handleDepartmentClick(department)}
                        >
                            <div className="department-icon">
                                <i className={department.icon}></i>
                            </div>
                            <h4 className="department-name">{department.name}</h4>
                            {department.isHighlight && (
                                <div className="department-arrow">
                                    <i className="fas fa-arrow-right"></i>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Departments;
