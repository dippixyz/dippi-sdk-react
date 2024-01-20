// utils/indexedDB.ts

import { DB_NAME, STORE_NAME } from '../constants/localStorage';

export const openDB = () => {
    if (!DB_NAME || !STORE_NAME) {
        throw new Error('DB_NAME or STORE_NAME is not defined');
    }

    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = () => {
            const db = request.result;
            
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                
                db.createObjectStore(STORE_NAME, {
                    keyPath: 'id',
                    autoIncrement: true,
                });
            }
        };

        request.onsuccess = () => {
            const db = request.result;
            resolve(db);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
};

export const addObjectToDB = async (data: { id: string, value: string}) => {
    if (!DB_NAME || !STORE_NAME) {
        throw new Error('DB_NAME or STORE_NAME is not defined');
    }

    const db = await openDB();

    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        // check if the object already exists
        const request = store.get(data.id);

        request.onsuccess = () => {
            
            if (request.result !== undefined) {
                const putRequest = store.put(data);
                putRequest.onsuccess = () => {
                    resolve();
                };
                putRequest.onerror = () => {
                    reject(putRequest.error);
                };
            } else {
                const addRequest = store.add(data);
                addRequest.onsuccess = () => {
                    resolve();
                };
                addRequest.onerror = () => {
                    reject(addRequest.error);
                };
            }
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
};

export const getAllObjectsFromDB = async () => {
    if (!DB_NAME || !STORE_NAME) {
        throw new Error('DB_NAME or STORE_NAME is not defined');
    }

    const db = await openDB();

    return new Promise<any[]>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
};

export const getCanRetrievePkById = async (id: string) => {
    if (!DB_NAME || !STORE_NAME) {
        throw new Error('DB_NAME or STORE_NAME is not defined');
    }

    const db = await openDB();

    return new Promise<any[]>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
};
