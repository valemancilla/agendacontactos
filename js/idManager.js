// Gestor de IDs secuenciales
class IdManager {
    static async getNextId(endpoint) {
        try {
            const response = await fetch(`http://localhost:3000/${endpoint}`);
            if (response.ok) {
                const data = await response.json();
                // Encontrar el ID más alto y sumar 1
                // Convertir todos los IDs a números y encontrar el máximo
                const numericIds = data.map(item => {
                    const id = parseInt(item.id);
                    return isNaN(id) ? 0 : id;
                });
                const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
                return (maxId + 1).toString();
            }
            return "1";
        } catch (error) {
            console.error('Error obteniendo siguiente ID:', error);
            return "1";
        }
    }
    
    static async createWithSequentialId(endpoint, data) {
        try {
            const nextId = await this.getNextId(endpoint);
            console.log(`🔢 Generando ID secuencial para ${endpoint}: ${nextId}`);
            const dataWithId = { ...data, id: nextId };
            
            const response = await fetch(`http://localhost:3000/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataWithId)
            });
            
            return response;
        } catch (error) {
            console.error('Error creando con ID secuencial:', error);
            throw error;
        }
    }
}

// Exportar para uso en módulos
window.IdManager = IdManager;
