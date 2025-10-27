import { useState, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import chatService from '../../services/chatService';
import { toast } from 'sonner';

const MessageInput = () => {
    const { sendMessage, activeConversation } = useChat();
    const [messageText, setMessageText] = useState('');
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Validate file types and sizes
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} không phải là file ảnh`);
                return false;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB
                toast.error(`${file.name} quá lớn (tối đa 5MB)`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        // Upload immediately
        try {
            setUploading(true);

            const urls = await chatService.uploadImages(validFiles);

            setUploadedImageUrls(prev => [...prev, ...urls]);

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Failed to upload images:', error);
            toast.error('Không thể upload ảnh');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setUploadedImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSend = async () => {
        if (!messageText.trim() && uploadedImageUrls.length === 0) return;
        if (!activeConversation) return;

        try {
            // Send message with uploaded URLs
            await sendMessage(messageText, uploadedImageUrls);

            // Clear input
            setMessageText('');
            setUploadedImageUrls([]);
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Không thể gửi tin nhắn');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!activeConversation) {
        return null;
    }

    return (
        <div className="message-input-container">
            {uploadedImageUrls.length > 0 && (
                <div className="uploaded-images-preview">
                    {uploadedImageUrls.map((url, index) => (
                        <div key={index} className="preview-image-wrapper">
                            <img
                                src={url}
                                alt={`uploaded-${index}`}
                                className="preview-image"
                            />
                            <button
                                className="remove-image-btn"
                                onClick={() => removeImage(index)}
                            >
                                <i className="bi bi-x"></i>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="message-input-wrapper">
                <button
                    className="input-action-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    title="Đính kèm ảnh"
                >
                    {uploading ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Uploading...</span>
                        </div>
                    ) : (
                        <i className="bi bi-image"></i>
                    )}
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                />

                <textarea
                    className="message-input"
                    placeholder="Aa"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={1}
                    disabled={uploading}
                />

                <button
                    className="send-btn"
                    onClick={handleSend}
                    disabled={uploading || (!messageText.trim() && uploadedImageUrls.length === 0)}
                >
                    <i className="bi bi-send-fill"></i>
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
