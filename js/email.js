document.getElementById('emailForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const statusMessage = document.getElementById('status-message');
    statusMessage.textContent = 'Enviando...';
    statusMessage.style.display = 'block';

    const formData = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch('https://hazeaoafnztxidkgdwsn.supabase.co/functions/v1/bright-endpoint', {
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhemVhb2Fmbnp0eGlka2dkd3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjEyOTEsImV4cCI6MjA5MjAzNzI5MX0.baG-JMojvCC7xEqRdUFcNSIt30lUOrNwvHqSYZM5nhk',
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhemVhb2Fmbnp0eGlka2dkd3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjEyOTEsImV4cCI6MjA5MjAzNzI5MX0.baG-JMojvCC7xEqRdUFcNSIt30lUOrNwvHqSYZM5nhk' // <--- Agregá esto
                },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            statusMessage.textContent = '¡Email enviado con éxito!';
            statusMessage.style.color = '#28a745';
            document.getElementById('emailForm').reset();
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        statusMessage.textContent = 'Error al enviar. Intenta de nuevo.';
        statusMessage.style.color = '#dc3545';
    }
});