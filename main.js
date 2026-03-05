        // Inicializar iconos
        lucide.createIcons();

        // URL DE TU WEB APP DE GOOGLE SCRIPT (Paso 2)
        // Reemplaza esto con el Link que te dio Google al Implementar
        const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbymU7f8mPuoPEOAqrGKk3WZq1wX33tOvG4GUWBEcJa4DuPseIS23vz0zuJdFi5k3XTv-g/exec"; 

        // Menú Móvil
        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        }

        // WhatsApp Dinámico
        function contactWhatsApp(mensajeAdicional) {
            const whatsappNumber = "593991695566"; 
            const mensaje = '¡Hola LDC Chaguarpamba! 🏆. Quisiera recibir más información acerca de las inscripciones y los requisitos. Muchas gracias.';
            const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
            window.open(url, '_blank');
        }

        // Funciones del Modal de Registro
        function abrirModalRegistro(deporte) {
            document.getElementById('disciplinaSeleccionadaTxt').innerText = `Disciplina: ${deporte}`;
            document.getElementById('inputDisciplina').value = deporte;
            
            const modal = document.getElementById('registroModal');
            modal.classList.add('active');
            
            document.getElementById('formInscripcion').reset();
            document.getElementById('btnSubmit').classList.remove('hidden');
            document.getElementById('loadingState').classList.add('hidden');
            document.getElementById('successState').classList.add('hidden');
            document.getElementById('duplicateState').classList.add('hidden'); // Ocultar error de duplicado al abrir
            document.getElementById('formInscripcion').classList.remove('hidden');
        }

        function cerrarModalRegistro() {
            document.getElementById('registroModal').classList.remove('active');
        }

        // Lógica de envío de formulario a la Base de Datos
        document.getElementById('formInscripcion').addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            const formData = new FormData(this);
            const dataObj = Object.fromEntries(formData.entries());

            document.getElementById('btnSubmit').classList.add('hidden');
            document.getElementById('loadingState').classList.remove('hidden');
            document.getElementById('duplicateState').classList.add('hidden');

            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(dataObj)
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('loadingState').classList.add('hidden'); // Siempre ocultar el cargador al recibir respuesta
                
                if(data.status === "success") {
                    document.getElementById('successState').classList.remove('hidden');
                    setTimeout(() => { cerrarModalRegistro(); }, 3000);
                } else if (data.type === "duplicate") {
                    // Mostrar alerta de duplicado y volver a mostrar el botón
                    document.getElementById('duplicateState').classList.remove('hidden');
                    document.getElementById('btnSubmit').classList.remove('hidden');
                } else {
                    alert("Error en el servidor de Google: \n" + data.message);
                    document.getElementById('btnSubmit').classList.remove('hidden');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Error crítico de conexión: " + error.message);
                document.getElementById('btnSubmit').classList.remove('hidden');
                document.getElementById('loadingState').classList.add('hidden');
            });
        });

        // Lógica de Pestañas
        function showSection(sectionId) {
            const sections = ['inicio', 'nosotros', 'disciplinas', 'directiva', 'contacto'];
            
            sections.forEach(id => {
                const element = document.getElementById(id);
                if(element) {
                    element.classList.add('hidden');
                    element.classList.remove('block');
                }
            });

            const target = document.getElementById(sectionId);
            if(target) {
                target.classList.remove('hidden');
                target.classList.add('block');
                
                const staggers = target.querySelectorAll('[class*="stagger-"]');
                staggers.forEach(el => {
                    el.style.animation = 'none';
                    void el.offsetWidth; 
                    el.style.animation = '';
                });

                target.classList.remove('section-animate');
                void target.offsetWidth; 
                target.classList.add('section-animate');
            }

            const buttons = document.querySelectorAll('nav button');
            buttons.forEach(btn => {
                if (btn.id !== 'btn-contacto') {
                    btn.classList.remove('active-tab');
                }
            });

            const activeBtn = document.getElementById('btn-' + sectionId);
            if(activeBtn && activeBtn.id !== 'btn-contacto') {
                activeBtn.classList.add('active-tab');
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }