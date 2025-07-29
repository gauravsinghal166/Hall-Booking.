document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingForm');
    const bookingStatus = document.getElementById('bookingStatus');
    const hallSelect = document.getElementById('hallSelect');
    const bookNowButtons = document.querySelectorAll('.book-now-btn');

    // Populate hall selection if a "Book Now" button is clicked
    bookNowButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const hallName = event.target.dataset.hall;
            hallSelect.value = hallName;
            // Scroll to the booking form
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        });
    });

    bookingForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Basic form validation (browser's built-in validation handles 'required' attributes)
        if (!bookingForm.checkValidity()) {
            bookingForm.classList.add('was-validated');
            return;
        }

        const formData = {
            hall: hallSelect.value,
            date: document.getElementById('bookingDate').value,
            startTime: document.getElementById('startTime').value,
            endTime: document.getElementById('endTime').value,
            eventName: document.getElementById('eventName').value,
            userName: document.getElementById('userName').value,
            userEmail: document.getElementById('userEmail').value,
            userPhone: document.getElementById('userPhone').value,
            numGuests: document.getElementById('numGuests').value,
            specialRequests: document.getElementById('specialRequests').value
        };

        bookingStatus.classList.remove('d-none', 'alert-success', 'alert-danger');
        bookingStatus.textContent = 'Processing your request...';
        bookingStatus.classList.add('alert-info');

        try {
            // In a real application, you would send this data to a backend server.
            // Example using Fetch API (assuming a /api/book endpoint on your server)
            const response = await fetch('/api/book-hall', { // This URL is a placeholder
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                bookingStatus.textContent = result.message || 'Booking request submitted successfully! We will contact you soon.';
                bookingStatus.classList.remove('alert-info');
                bookingStatus.classList.add('alert-success');
                bookingForm.reset(); // Clear form on success
                bookingForm.classList.remove('was-validated');
            } else {
                bookingStatus.textContent = result.message || 'Error submitting booking request. Please try again.';
                bookingStatus.classList.remove('alert-info');
                bookingStatus.classList.add('alert-danger');
            }
        } catch (error) {
            console.error('Error:', error);
            bookingStatus.textContent = 'Network error. Please check your connection and try again.';
            bookingStatus.classList.remove('alert-info');
            bookingStatus.classList.add('alert-danger');
        }
    });

    // Client-side date validation (optional, backend validation is crucial)
    const bookingDateInput = document.getElementById('bookingDate');
    const today = new Date();
    const minDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    bookingDateInput.setAttribute('min', minDate);
});