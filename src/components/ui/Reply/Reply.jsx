import React, { useState } from 'react';
import { MdClose } from 'react-icons/md'; 
import { FiUpload } from 'react-icons/fi'; 
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import api from '../../../utils/api';

/**
 * Reply component for sending messages to an intern.
 * @param {object} props - Component props.
 * @param {string} props.internName - The name of the intern to whom the reply is being sent.
 * @param {function} props.onClose - Function to call when the modal needs to be closed.
 * @param {string} props.diaryId - The ID of the diary entry being replied to.
 */
const Reply = ({ internName, onClose, diaryId }) => {
    // State for the message input
    const [message, setMessage] = useState('');
    // State to hold the selected file object
    const [selectedFile, setSelectedFile] = useState(null);
    // State to hold the name of the selected file for display
    const [fileName, setFileName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Handles the file selection event
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
        }
    };

    const handleSend = async () => {
        if (!message.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Message Required',
                text: 'Please enter a reply message.',
            });
            return;
        }

        setIsLoading(true);
        try {
            const token = Cookies.get('token');
            
            // Prepare form data if file is included
            const formData = new FormData();
            formData.append('replyMessage', message);
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            const response = await api.put(
                `/admin/diaries/update?id=${diaryId}&status=Replied`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Reply Sent!',
                    text: 'Your reply has been sent successfully.',
                });
                onClose();
                // Refresh the page to show updated status
                window.location.reload();
            }
        } catch (error) {
            console.error('Failed to send reply:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to send reply. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="reply-modal-overlay fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-1001">
            <div className="reply-modal-content bg-white rounded-[15px] md:p-[25px] p-[20px] md:w-[90%] w-[345px] md:max-w-[450px] max-w-none 
                shadow-[0_4px_20px_rgba(0,0,0,0.2)] relative flex flex-col gap-5 md:left-20 -left-1.9 md:top-16 -top-6.5 md:h-auto h-[472px]">
                <div className="reply-modal-header flex justify-between items-center mb-2.5">
                    <h3 className='md:text-[1.3rem] text-[1.1rem] font-bold text-[#333]'>Reply to {internName}</h3>
                    <button 
                        className="reply-modal-close-button bg-none border-none cursor-pointer text-[#555] p-1.25 rounded-[50%] hover:bg-[rgba(0,0,0,0.1)]" 
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        <MdClose size={24} />
                    </button>
                </div>
                <div className="reply-modal-body flex flex-col gap-5">
                    {/* This container wraps the textarea and the custom file upload button */}
                    <div className="textarea-container relative w-full border-[1px] border-solid border-[#ddd] box-border rounded-[10px]">
                        <textarea
                            className="reply-message-input w-full p-3.75 border-none rounded-[10px] md:text-[1rem] text-[.9rem] leading-6 resize-y md:min-h-[250px] h-[250px] box-border text-[#333] bg-transparent pb-12.5 focus:outline-none"
                            placeholder={`Message Intern : ${internName}\nHi ${internName}, Thank you for your creative input..`}
                            rows="8"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={isLoading}
                        />
                        
                        <label htmlFor="file-upload" className="file-upload-label absolute bottom-3.75 left-3.75 flex items-center gap-2.5 text-[#007bff] cursor-pointer font-medium hover:text-[#0056b3] md:text-[1rem] text-[.9rem]">
                            <FiUpload size={20} className="reply-upload-icon" />
                            {/* Display the file name if selected, otherwise show default text */}
                            <span>{fileName || 'Upload files'}</span>
                        </label>
                        {/* The actual file input is hidden */}
                        <input
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            className='hidden'
                            disabled={isLoading}
                        />
                    </div>

                    <button 
                        className="reply-send-button bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        onClick={handleSend}
                        disabled={isLoading || !message.trim()}
                    >
                        {isLoading ? 'Sending...' : 'Send Reply'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reply;