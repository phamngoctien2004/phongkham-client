import { apiRequest } from './api';

const contactService = {
    // Gửi email liên hệ
    sendContactEmail: async (contactData) => {
        return apiRequest('/emails/contact', 'POST', {
            name: contactData.name,
            email: contactData.email,
            title: contactData.subject,
            message: contactData.message,
        }, false); // Không cần token cho API công khai
    },
};

export default contactService;
