import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

class SocketService {
    private socket: Socket | null = null;

    connect() {
        if (!this.socket) {
            // strip '/api' if it's there to connect to the root
            const url = SOCKET_URL.replace(/\/api\/?$/, '');
            this.socket = io(url);

            this.socket.on('connect', () => {
                console.log('[Socket.IO] Connected to server.');
            });

            this.socket.on('disconnect', () => {
                console.log('[Socket.IO] Disconnected from server.');
            });
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    on(event: string, callback: (data: any) => void) {
        if (!this.socket) this.connect();
        this.socket?.on(event, callback);
    }

    off(event: string, callback?: (data: any) => void) {
        if (!this.socket) return;
        if (callback) {
            this.socket.off(event, callback);
        } else {
            this.socket.off(event);
        }
    }
}

export default new SocketService();
