// Sistema de Autenticación
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Escuchar cambios de autenticación
        auth.onAuthStateChanged((user) => {
            this.currentUser = user;
            if (user) {
                this.redirectToDashboard();
            }
        });
    }

    async register(businessName, email, password) {
        try {
            console.log('Registrando usuario...');
            
            // 1. Crear usuario en Authentication
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            console.log('Usuario creado:', user.uid);

            // 2. Crear documento del negocio en Firestore
            const businessData = {
                name: businessName,
                owner: user.uid,
                email: email,
                plan: 'free',
                slug: this.generateSlug(businessName),
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                appearance: {
                    primaryColor: '#3B82F6',
                    secondaryColor: '#1E40AF',
                    logo: '',
                    coverImage: ''
                },
                settings: {
                    collectBirthdays: false,
                    sendEmailReminders: true
                },
                subscription: {
                    plan: 'free',
                    appointmentLimit: 30,
                    employeeLimit: 1,
                    appointmentsThisMonth: 0
                }
            };

            await db.collection('businesses').doc(user.uid).set(businessData);
            console.log('Negocio creado en Firestore');

            // 3. Crear perfil de usuario
            await db.collection('users').doc(user.uid).set({
                email: email,
                businessId: user.uid,
                plan: 'free',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('Registro completado exitosamente');
            return { success: true, user: user };

        } catch (error) {
            console.error('Error en registro:', error);
            let errorMessage = 'Error al crear la cuenta';
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Este email ya está registrado';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'La contraseña debe tener al menos 6 caracteres';
            }
            
            return { success: false, error: errorMessage };
        }
    }

    async login(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            let errorMessage = 'Error al iniciar sesión';
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'Usuario no encontrado';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Contraseña incorrecta';
            }
            
            return { success: false, error: errorMessage };
        }
    }

    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            + '-' + Math.random().toString(36).substr(2, 5);
    }

    redirectToDashboard() {
        window.location.href = 'dashboard.html';
    }

    logout() {
        return auth.signOut();
    }
}

// Instanciar el sistema de autenticación
const authSystem = new AuthSystem();
