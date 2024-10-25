import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';

const MySwal = withReactContent(Swal);

const InputModal = () => {
    const handleSubmit = async (data) => {
        const { name, password, recovery, mac, rid, proxy } = data;

        if (!name || !password) {
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Name and Password are required fields!'
            });
            return;
        }

        try {
            const response = await axios.post(
                "http://64.72.205.239:8000/bot/add",
                null,
                {
                    params: {
                        name: name,
                        password: password,
                        recovery: recovery || "",
                        mac: mac || "",
                        rid: rid || "",
                        proxy: proxy || ""
                    }
                }
            );

            // Show success or failure message
            if (response.status === 200) {
                MySwal.fire({
                    icon: 'success',
                    title: 'Bot Added!',
                    text: response.data
                });
            } else {
                MySwal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data
                });
            }
        } catch (error) {
            MySwal.fire({
                icon: 'error',
                title: 'API Error',
                text: 'Failed to connect to the server.'
            });
            console.error('Error adding bot:', error);
        }
    };

    // Function to show modal
    const showModal = () => {
        MySwal.fire({
            icon: 'info',
            title: 'Enter Information',
            html: `
                <input type="text" id="name" class="swal2-addbot-input" placeholder="Name" required />
                <input type="text" id="password" class="swal2-addbot-input" placeholder="Password" required />
                <input type="text" id="recovery" class="swal2-addbot-input" placeholder="Recovery (optional)" />
                <input type="text" id="mac" class="swal2-addbot-input" placeholder="MAC (optional)" />
                <input type="text" id="rid" class="swal2-addbot-input" placeholder="RID (optional)" />
                <input type="text" id="proxy" class="swal2-addbot-input" placeholder="Proxy (optional)" />
            `,
            showCancelButton: true,
            confirmButtonText: 'Add Bot',
            preConfirm: () => {
                const name = Swal.getPopup().querySelector('#name').value;
                const password = Swal.getPopup().querySelector('#password').value;
                const recovery = Swal.getPopup().querySelector('#recovery').value;
                const mac = Swal.getPopup().querySelector('#mac').value;
                const rid = Swal.getPopup().querySelector('#rid').value;
                const proxy = Swal.getPopup().querySelector('#proxy').value;

                // Validate inputs
                if (!name || !password) {
                    Swal.showValidationMessage('Name and Password are required!');
                    return false;
                }

                // Return the collected data instead of updating state
                return { name, password, recovery, mac, rid, proxy };
            },
            customClass: {
                popup: 'swal2-addbot' // Apply custom class to the modal
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Use the data directly from the result to handle submission
                handleSubmit(result.value);  // Pass the collected data to handleSubmit
            }
        });
    };

    return (
        <div className="App">
            <button
                onClick={showModal}
                className='mb-2 text-white bg-red-500 hover:bg-red-800 focus:ring-1 focus:outline-none font-medium rounded text-sm w-full px-2.5 py-2.5 text-center'
            >
                Add Bot
            </button>
        </div>
    );
};

export default InputModal;